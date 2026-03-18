import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { PlanType, User } from '@/lib/types';
import { apiClient } from '@/lib/api';

interface AuthStore {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  setLoading: (v: boolean) => void;
  setPlan: (plan: PlanType) => void;
  fetchBillingStatus: () => Promise<void>;
  refreshUser: () => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isLoading: true,
      setUser: (user) => set({ user, isLoading: false }),
      setToken: (token) => set({ token }),
      setLoading: (v) => set({ isLoading: v }),
      setPlan: (plan) => {
        const user = get().user;
        if (user) set({ user: { ...user, plan } });
      },
      fetchBillingStatus: async () => {
        try {
          const { getBillingStatus } = await import('@/lib/stripe');
          const data = await getBillingStatus();
          const plan = (data.plan as PlanType) || 'professional';
          const user = get().user;
          if (user) set({ user: { ...user, plan } });
        } catch {
          // keep current plan on failure
        }
      },
      refreshUser: async () => {
        try {
          const data = await apiClient<{
            name?: string;
            email?: string;
            phone_number?: string;
            language?: string;
            plan?: string;
          }>('/api/webapp/user/me');
          const plan = (data.plan as PlanType) || 'professional';
          set((state) => ({
            user: state.user ? { ...state.user, ...data, plan } : null,
          }));
        } catch {
          // keep current user on failure
        }
      },
      logout: () => set({ user: null, token: null, isLoading: false }),
    }),
    {
      name: 'capivarex-auth',
      partialize: (state) => ({ user: state.user, token: state.token }),
      // SECURITY: Use sessionStorage instead of localStorage
      // - sessionStorage is cleared when tab closes (limits XSS token theft window)
      // - localStorage persists forever (attacker can steal token even after logout)
      storage: {
        getItem: (name) => {
          if (typeof window === 'undefined') return null;
          const value = sessionStorage.getItem(name);
          return value ? JSON.parse(value) : null;
        },
        setItem: (name, value) => {
          if (typeof window === 'undefined') return;
          sessionStorage.setItem(name, JSON.stringify(value));
        },
        removeItem: (name) => {
          if (typeof window === 'undefined') return;
          sessionStorage.removeItem(name);
          // Also clean any legacy localStorage data
          localStorage.removeItem(name);
        },
      },
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.setLoading(false);
        }
        // Migrate: if token exists in localStorage but not sessionStorage, move it
        if (typeof window !== 'undefined') {
          const legacy = localStorage.getItem('capivarex-auth');
          if (legacy && !sessionStorage.getItem('capivarex-auth')) {
            sessionStorage.setItem('capivarex-auth', legacy);
            localStorage.removeItem('capivarex-auth');
          }
        }
      },
    },
  ),
);
