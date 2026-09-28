// src/lib/store/auth-store.ts
// Zustand store for authentication state in NyayVakil.
//
// The real session lives in an httpOnly cookie that JavaScript can't read. This store
// only caches the signed-in user's profile for display and client-side role checks;
// the server enforces access on every request.

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { User } from '@/types';
import { startNavigationProgress } from '@/components/shared/navigation-progress';

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────

export type AuthStatus = 'idle' | 'loading' | 'authenticated' | 'unauthenticated';

export interface AuthState {
  // State
  user: User | null;
  status: AuthStatus;
  error: string | null;

  // Actions
  login: (identifier: string, password: string) => Promise<void>;
  signup: (data: {
    name: string;
    email: string;
    phone: string;
    password: string;
    barCouncilNumber?: string;
    chamberName: string;
  }) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  clearError: () => void;
  setUser: (user: User) => void;
}

async function postJson(url: string, body: unknown) {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const json = await res.json().catch(() => ({}));
  return { ok: res.ok, json };
}

// ─────────────────────────────────────────────────────────────────────────────
// STORE
// ─────────────────────────────────────────────────────────────────────────────

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      // ── Initial State ──────────────────────────────────────────────────────
      user: null,
      status: 'idle',
      error: null,

      // ── Actions ───────────────────────────────────────────────────────────

      /**
       * Authenticate with email or 10-digit phone + password.
       * On success the server sets the session cookie.
       */
      login: async (identifier: string, password: string): Promise<void> => {
        set({ status: 'loading', error: null });
        const { ok, json } = await postJson('/api/auth/login', { identifier, password });
        if (!ok) {
          const message = json.error ?? json.message ?? 'Invalid credentials.';
          set({ status: 'unauthenticated', error: message, user: null });
          throw new Error(message);
        }
        set({ user: json.user, status: 'authenticated', error: null });
      },

      /** Register a new firm + owner account and sign in. */
      signup: async (data): Promise<void> => {
        set({ status: 'loading', error: null });
        const { ok, json } = await postJson('/api/auth/signup', data);
        if (!ok) {
          const message = json.error ?? json.message ?? 'Registration failed.';
          set({ status: 'unauthenticated', error: message, user: null });
          throw new Error(message);
        }
        set({ user: json.user, status: 'authenticated', error: null });
      },

      /** Revoke the server session, clear local state and go to /login. */
      logout: async (): Promise<void> => {
        startNavigationProgress();
        try {
          await postJson('/api/auth/logout', {});
        } finally {
          set({ user: null, status: 'unauthenticated', error: null });
          // Full page load so no cached data from the previous user survives
          window.location.assign('/login');
        }
      },

      /** Re-fetch the signed-in user; clears local state if the session is gone. */
      refreshUser: async (): Promise<void> => {
        const res = await fetch('/api/auth/me');
        if (res.status === 401) {
          set({ user: null, status: 'unauthenticated' });
          return;
        }
        const json = await res.json().catch(() => null);
        if (json?.success) set({ user: json.data, status: 'authenticated' });
      },

      /** Clear any auth error (e.g., after displaying the error to the user) */
      clearError: () => { set({ error: null }); },

      /** Directly set the user object (useful for profile updates) */
      setUser: (user: User) => { set({ user }); },
    }),
    {
      name: 'nyayvakil-auth', // localStorage key
      storage: createJSONStorage(() => localStorage),
      // Only the display profile is persisted — never any credential
      partialize: (state) => ({
        user: state.user,
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
// ROLE-BASED ACCESS HELPERS (UI only — the server enforces the same rules)
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
  return role === 'advocate' || role === 'admin' || role === 'junior';
};

export const useCanManageFinance = (): boolean => {
  const role = useAuthStore(selectUserRole);
  return role === 'advocate' || role === 'admin';
};
