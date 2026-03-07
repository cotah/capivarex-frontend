import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ChatMessage } from '@/lib/types';

export interface Conversation {
  id: string;
  title: string;
  messages: ChatMessage[];
  createdAt: string;
  updatedAt: string;
}

interface ConversationStore {
  conversations: Conversation[];
  activeConversationId: string | null;
  sidebarOpen: boolean;

  createConversation: () => string;
  setActiveConversation: (id: string) => void;
  deleteConversation: (id: string) => void;
  renameConversation: (id: string, title: string) => void;
  addMessageToConversation: (id: string, message: ChatMessage) => void;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
}

const mockConversations: Conversation[] = [
  // Today
  { id: '1', title: 'Play Candy Shop by 50 Cent', messages: [], createdAt: '2026-03-07T14:41:00Z', updatedAt: '2026-03-07T14:42:00Z' },
  { id: '2', title: "What's on my calendar today?", messages: [], createdAt: '2026-03-07T10:30:00Z', updatedAt: '2026-03-07T10:31:00Z' },
  { id: '3', title: 'Turn on the living room light', messages: [], createdAt: '2026-03-07T08:15:00Z', updatedAt: '2026-03-07T08:15:00Z' },

  // Yesterday
  { id: '4', title: 'Check the weather for Dublin', messages: [], createdAt: '2026-03-06T18:00:00Z', updatedAt: '2026-03-06T18:01:00Z' },
  { id: '5', title: 'Add milk and eggs to shopping list', messages: [], createdAt: '2026-03-06T11:30:00Z', updatedAt: '2026-03-06T11:32:00Z' },
  { id: '6', title: 'Scan receipt from Lidl', messages: [], createdAt: '2026-03-06T10:00:00Z', updatedAt: '2026-03-06T10:05:00Z' },

  // This Week
  { id: '7', title: 'Find Italian restaurants near me', messages: [], createdAt: '2026-03-04T15:00:00Z', updatedAt: '2026-03-04T15:03:00Z' },
  { id: '8', title: 'How much did I spend this month?', messages: [], createdAt: '2026-03-03T09:00:00Z', updatedAt: '2026-03-03T09:02:00Z' },
  { id: '9', title: 'Create a workout playlist', messages: [], createdAt: '2026-03-02T20:00:00Z', updatedAt: '2026-03-02T20:05:00Z' },

  // Earlier
  { id: '10', title: 'Research best electric cars 2026', messages: [], createdAt: '2026-02-25T14:00:00Z', updatedAt: '2026-02-25T14:10:00Z' },
  { id: '11', title: 'Set reminder for dentist tomorrow', messages: [], createdAt: '2026-02-20T09:00:00Z', updatedAt: '2026-02-20T09:01:00Z' },
];

export const useConversationStore = create<ConversationStore>()(
  persist(
    (set) => ({
      conversations: mockConversations,
      activeConversationId: null,
      sidebarOpen: true,

      createConversation: () => {
        const id = crypto.randomUUID();
        const now = new Date().toISOString();
        set((s) => ({
          conversations: [
            { id, title: 'New Chat', messages: [], createdAt: now, updatedAt: now },
            ...s.conversations,
          ],
          activeConversationId: id,
        }));
        return id;
      },

      setActiveConversation: (id) => set({ activeConversationId: id }),

      deleteConversation: (id) =>
        set((s) => ({
          conversations: s.conversations.filter((c) => c.id !== id),
          activeConversationId: s.activeConversationId === id ? null : s.activeConversationId,
        })),

      renameConversation: (id, title) =>
        set((s) => ({
          conversations: s.conversations.map((c) =>
            c.id === id ? { ...c, title } : c,
          ),
        })),

      addMessageToConversation: (id, message) =>
        set((s) => ({
          conversations: s.conversations.map((c) =>
            c.id === id
              ? { ...c, messages: [...c.messages, message], updatedAt: new Date().toISOString() }
              : c,
          ),
        })),

      toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
    }),
    {
      name: 'capivarex-conversations',
      partialize: (state) => ({
        conversations: state.conversations,
        activeConversationId: state.activeConversationId,
        sidebarOpen: state.sidebarOpen,
      }),
    },
  ),
);
