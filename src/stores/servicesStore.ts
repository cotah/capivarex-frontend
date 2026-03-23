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
      const data = await apiClient<{ services: Record<string, { connected: boolean; updated_at?: string }> }>('/api/webapp/services/status');
      const connections: ServiceConnection[] = Object.entries(data.services || {}).map(([provider, info]) => ({
        provider,
        connected: info.connected,
        lastChecked: info.updated_at,
      }));
      set({ connections, isLoading: false });
    } catch {
      set({ isLoading: false });
    }
  },
}));
