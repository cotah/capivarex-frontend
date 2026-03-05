import { create } from 'zustand';
import type { ChatMessage } from '@/lib/types';

interface ChatStore {
  messages: ChatMessage[];
  isThinking: boolean;
  addMessage: (msg: ChatMessage) => void;
  setThinking: (v: boolean) => void;
}

export const useChatStore = create<ChatStore>((set) => ({
  messages: [],
  isThinking: false,
  addMessage: (msg) => set((s) => ({ messages: [...s.messages, msg] })),
  setThinking: (v) => set({ isThinking: v }),
}));
