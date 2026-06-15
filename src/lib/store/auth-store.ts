// src/lib/store/auth-store.ts
// Zustand store for authentication state in NyayVakil.

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { User } from '@/types';

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
  login: (identifier: string, password: string) => Promise<void>;
  signup: (data: {
    name: string;
    email: string;
    phone: string;
    password: string;
    role: string;
    barCouncilNumber?: string;
    chamberName: string;
  }) => Promise<void>;
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
       * Authenticate a user with email/phone and password.
       * Accepts either an email address or a 10-digit phone number as identifier.
       */
      login: async (identifier: string, password: string): Promise<void> => {
        set({ status: 'loading', error: null });
        const res = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ identifier, password }),
        });
        const data = await res.json();
        if (!res.ok) {
          const message = data.error ?? 'Invalid credentials.';
          set({ status: 'unauthenticated', error: message, user: null, token: null });
          throw new Error(message);
        }
        set({ user: data.user, token: data.token, status: 'authenticated', error: null });
      },

      /**
       * Register a new user, create their firm, and log them in immediately.
       */
      signup: async (data): Promise<void> => {
        set({ status: 'loading', error: null });
        const res = await fetch('/api/auth/signup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });
        const json = await res.json();
        if (!res.ok) {
          const message = json.error ?? 'Registration failed.';
          set({ status: 'unauthenticated', error: message, user: null, token: null });
          throw new Error(message);
        }
        set({ user: json.user, token: json.token, status: 'authenticated', error: null });
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
