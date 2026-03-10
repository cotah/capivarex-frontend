import { create } from 'zustand';
import { apiClient } from '@/lib/api';
import { useChatStore } from '@/stores/chatStore';
import type { ConversationSummary, ConversationDetail, ChatMessage } from '@/lib/types';

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
  isLoading: boolean;
  sidebarOpen: boolean;

  fetchConversations: () => Promise<void>;
  setActiveConversation: (id: string) => Promise<void>;
  createConversation: () => Promise<string>;
  deleteConversation: (id: string) => Promise<void>;
  renameConversation: (id: string, title: string) => Promise<void>;
  addMessageToConversation: (id: string, message: ChatMessage) => void;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
}

function toConversation(s: ConversationSummary): Conversation {
  return {
    id: s.id,
    title: s.title,
    messages: [],
    createdAt: s.created_at,
    updatedAt: s.updated_at,
  };
}

export const useConversationStore = create<ConversationStore>((set) => ({
  conversations: [],
  activeConversationId: null,
  isLoading: false,
  sidebarOpen: false,

  fetchConversations: async () => {
    set({ isLoading: true });
    try {
      const resp = await apiClient<{ conversations: ConversationSummary[] } | ConversationSummary[]>('/api/webapp/conversations');
      const list = Array.isArray(resp) ? resp : (resp.conversations || []);
      set({ conversations: list.map(toConversation), isLoading: false });
    } catch {
      set({ isLoading: false });
    }
  },

  setActiveConversation: async (id) => {
    set({ activeConversationId: id });
    try {
      const detail = await apiClient<ConversationDetail>(`/api/webapp/conversations/${id}`);
      const messages = (detail.messages || []).map((m: ChatMessage & { created_at?: string }) => ({
        ...m,
        time: m.time ?? (m.created_at
          ? new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          : ''),
      }));
      useChatStore.setState({ messages, isThinking: false });
      set((s) => ({
        conversations: s.conversations.map((c) =>
          c.id === id ? { ...c, messages } : c,
        ),
      }));
    } catch {
      useChatStore.setState({ messages: [], isThinking: false });
    }
  },

  createConversation: async () => {
    try {
      const data = await apiClient<ConversationSummary>('/api/webapp/conversations', {
        method: 'POST',
      });
      const conv = toConversation(data);
      set((s) => ({
        conversations: [conv, ...s.conversations],
        activeConversationId: conv.id,
      }));
      return conv.id;
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  deleteConversation: async (id) => {
    set((s) => ({
      conversations: s.conversations.filter((c) => c.id !== id),
      activeConversationId: s.activeConversationId === id ? null : s.activeConversationId,
    }));
    try {
      await apiClient<void>(`/api/webapp/conversations/${id}`, { method: 'DELETE' });
    } catch {
      // already removed from UI
    }
  },

  renameConversation: async (id, title) => {
    set((s) => ({
      conversations: s.conversations.map((c) =>
        c.id === id ? { ...c, title } : c,
      ),
    }));
    try {
      await apiClient<void>(`/api/webapp/conversations/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ title }),
      });
    } catch {
      // optimistic update stays
    }
  },

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
}));
