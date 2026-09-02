// apps/web/store/auth.store.ts
'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { api, setAccessToken } from '@/lib/api';

export type Role = 'DEVELOPER' | 'ADMIN' | 'LEADER' | 'STUDENT';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: Role;
  isActive: boolean;
  mustChangePassword: boolean;
}

interface AuthState {
  user: AuthUser | null;
  accessToken: string | null;
  setSession: (user: AuthUser, accessToken: string) => void;
  clearSession: () => void;
  login: (email: string, password: string) => Promise<AuthUser>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      setSession: (user, accessToken) => {
        setAccessToken(accessToken);
        set({ user, accessToken });
      },
      clearSession: () => {
        setAccessToken(null);
        set({ user: null, accessToken: null });
      },
      login: async (email, password) => {
        const response = await api.post<{ data: { user: AuthUser; accessToken: string } }>(
          '/api/auth/login',
          { email, password },
        );
        const { user, accessToken } = response.data.data;
        setAccessToken(accessToken);
        set({ user, accessToken });
        return user;
      },
      logout: async () => {
        await api.post('/api/auth/logout').catch(() => undefined);
        setAccessToken(null);
        set({ user: null, accessToken: null });
      },
    }),
    {
      name: 'shalom-auth',
      partialize: (state) => ({ user: state.user, accessToken: state.accessToken }),
      onRehydrateStorage: () => (state) => {
        if (state?.accessToken) {
          setAccessToken(state.accessToken);
        }
      },
    },
  ),
);
