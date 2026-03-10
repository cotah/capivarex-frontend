import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { PlanType, User } from '@/lib/types';

interface AuthStore {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  setLoading: (v: boolean) => void;
  setPlan: (plan: PlanType) => void;
  fetchBillingStatus: () => Promise<void>;
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
          const plan = (data.plan as PlanType) || 'free';
          const user = get().user;
          if (user) set({ user: { ...user, plan } });
        } catch {
          // keep current plan on failure
        }
      },
      logout: () => set({ user: null, token: null, isLoading: false }),
    }),
    {
      name: 'capivarex-auth',
      partialize: (state) => ({ user: state.user, token: state.token }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.setLoading(false);
        }
      },
    },
  ),
);
