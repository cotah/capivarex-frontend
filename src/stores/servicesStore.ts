import { create } from 'zustand';
import type { ServiceConnection } from '@/lib/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface ServicesStore {
  connections: ServiceConnection[];
  isLoading: boolean;
  setConnections: (c: ServiceConnection[]) => void;
  updateConnection: (provider: string, data: Partial<ServiceConnection>) => void;
  fetchAll: (userId: string) => Promise<void>;
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
  fetchAll: async (userId) => {
    set({ isLoading: true });
    try {
      const providers = [
        'google',
        'spotify',
        'smartthings',
        'smartcar',
        'github',
      ];
      const results = await Promise.allSettled(
        providers.map((p) =>
          fetch(
            `${API_URL}/api/auth/${p}/status?user_id=${userId}`,
          )
            .then((r) => r.json())
            .then((data) => ({
              provider: p,
              connected: data.connected as boolean,
              email: data.email as string | undefined,
              status: data.status as string | undefined,
            })),
        ),
      );
      const connections: ServiceConnection[] = results.map((r, i) =>
        r.status === 'fulfilled'
          ? r.value
          : { provider: providers[i], connected: false },
      );
      set({ connections, isLoading: false });
    } catch {
      set({ isLoading: false });
    }
  },
}));
