// src/lib/store/auth-store.ts
// Zustand store for authentication state in NyayVakil.
// Uses mock login backed by the mock API layer; swap api.auth.login for real
// implementation when the backend is ready.

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { User } from '@/types';

// Hardcoded admin user for development
const ADMIN_USER: User = {
  id: "default-user",
  firmId: "default-firm",
  name: "Adv. Priya Sharma",
  email: "admin@nyayvakil.in",
  role: "advocate",
  phone: "+91 98203 41567",
  isActive: true,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};
const ADMIN_PASSWORD = "admin123";

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────

export type AuthStatus = 'idle' | 'loading' | 'authenticated' | 'unauthenticated';

export interface AuthState {
  // State
  user: User | null;
  token: string | null;
  status: AuthStatus;
  error: string | null;

  // Actions
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  clearError: () => void;
  setUser: (user: User) => void;
}

// ─────────────────────────────────────────────────────────────────────────────
// STORE
// ─────────────────────────────────────────────────────────────────────────────

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // ── Initial State ──────────────────────────────────────────────────────
      user: null,
      token: null,
      status: 'idle',
      error: null,

      // ── Actions ───────────────────────────────────────────────────────────

      /**
       * Authenticate a user with email and password.
       * On success, persists user and token to localStorage.
       *
       * TODO: The api.auth.login call below maps to POST /api/auth/login
       */
      login: async (email: string, password: string): Promise<void> => {
        set({ status: 'loading', error: null });
        await new Promise((r) => setTimeout(r, 400)); // simulate network
        if (email === ADMIN_USER.email && password === ADMIN_PASSWORD) {
          set({ user: ADMIN_USER, token: "local-token", status: 'authenticated', error: null });
        } else {
          const message = 'Invalid email or password.';
          set({ status: 'unauthenticated', error: message, user: null, token: null });
          throw new Error(message);
        }
      },

      /**
       * Log the current user out and clear persisted state.
       *
       * TODO: The api.auth.logout call maps to POST /api/auth/logout
       */
      logout: async (): Promise<void> => {
        set({ user: null, token: null, status: 'unauthenticated', error: null });
      },

      /**
       * Re-fetch the current user's profile (e.g., after token refresh).
       *
       * TODO: Maps to GET /api/auth/me
       */
      refreshUser: async (): Promise<void> => {
        const { user } = get();
        if (!user) set({ status: 'unauthenticated' });
      },

      /** Clear any auth error (e.g., after displaying the error to the user) */
      clearError: () => { set({ error: null }); },

      /** Directly set the user object (useful for profile updates) */
      setUser: (user: User) => { set({ user }); },
    }),
    {
      name: 'nyayvakil-auth', // localStorage key
      storage: createJSONStorage(() => localStorage),
      // Only persist essential auth data, not transient status fields
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        // Restore as 'authenticated' on page reload if we have persisted data
        status: state.user ? 'authenticated' : 'unauthenticated',
      }),
    }
  )
);

// ─────────────────────────────────────────────────────────────────────────────
// SELECTORS (derived values – use these instead of accessing store directly)
// ─────────────────────────────────────────────────────────────────────────────

export const selectUser = (state: AuthState): User | null => state.user;
export const selectIsAuthenticated = (state: AuthState): boolean =>
  state.status === 'authenticated' && state.user !== null;
export const selectIsLoading = (state: AuthState): boolean => state.status === 'loading';
export const selectUserRole = (state: AuthState) => state.user?.role ?? null;
export const selectAuthError = (state: AuthState): string | null => state.error;

// ─────────────────────────────────────────────────────────────────────────────
// ROLE-BASED ACCESS HELPERS
// ─────────────────────────────────────────────────────────────────────────────

export const useIsAdvocate = (): boolean => {
  const role = useAuthStore(selectUserRole);
  return role === 'advocate';
};

export const useIsAdmin = (): boolean => {
  const role = useAuthStore(selectUserRole);
  return role === 'admin' || role === 'advocate';
};

export const useCanEditMatters = (): boolean => {
  const role = useAuthStore(selectUserRole);
  return role === 'advocate' || role === 'junior';
};

export const useCanManageFinance = (): boolean => {
  const role = useAuthStore(selectUserRole);
  return role === 'advocate' || role === 'admin';
};
