import { create } from 'zustand';
import { apiClient } from '@/lib/api';
import type { ServiceConnection } from '@/lib/types';

interface ServicesStore {
  connections: ServiceConnection[];
  isLoading: boolean;
  setConnections: (c: ServiceConnection[]) => void;
  updateConnection: (provider: string, data: Partial<ServiceConnection>) => void;
  fetchAll: () => Promise<void>;
}

export const useServicesStore = create<ServicesStore>((set) => ({
  connections: [],
  isLoading: false,
  setConnections: (connections) => set({ connections }),
  updateConnection: (provider, data) =>
    set((s) => ({
      connections: s.connections.map((c) =>
        c.provider === provider ? { ...c, ...data } : c,
      ),
    })),
  fetchAll: async () => {
    set({ isLoading: true });
    try {
      const data = await apiClient<ServiceConnection[]>('/api/webapp/services/status');
      set({ connections: data, isLoading: false });
    } catch {
      set({ isLoading: false });
    }
  },
}));
