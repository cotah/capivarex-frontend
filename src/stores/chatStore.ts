import { create } from 'zustand';
import type { ChatMessage } from '@/lib/types';

// PERFORMANCE: Limit in-memory messages to prevent slow re-renders in long conversations.
// Older messages are trimmed; the full history is preserved server-side.
const MAX_MESSAGES = 300;

interface ChatStore {
  messages: ChatMessage[];
  isThinking: boolean;
  voiceOpen: boolean;
  addMessage: (msg: ChatMessage) => void;
  updateMessage: (id: string, update: Partial<ChatMessage>) => void;
  appendToMessage: (id: string, text: string) => void;
  setThinking: (v: boolean) => void;
  setVoiceOpen: (v: boolean) => void;
}

export const useChatStore = create<ChatStore>((set) => ({
  messages: [],
  isThinking: false,
  voiceOpen: false,
  addMessage: (msg) => set((s) => {
    const updated = [...s.messages, msg];
    return { messages: updated.length > MAX_MESSAGES ? updated.slice(-MAX_MESSAGES) : updated };
  }),
  updateMessage: (id, update) =>
    set((s) => ({
      messages: s.messages.map((m) => (m.id === id ? { ...m, ...update } : m)),
    })),
  appendToMessage: (id, text) =>
    set((s) => ({
      messages: s.messages.map((m) =>
        m.id === id ? { ...m, text: (m.text || '') + text } : m
      ),
    })),
  setThinking: (v) => set({ isThinking: v }),
  setVoiceOpen: (v) => set({ voiceOpen: v }),
}));
