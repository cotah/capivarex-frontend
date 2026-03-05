import { create } from 'zustand';
import { ChatMessage, ViewType } from '@/lib/types';

interface ChatStore {
  messages: ChatMessage[];
  isThinking: boolean;
  currentView: ViewType;
  addMessage: (msg: ChatMessage) => void;
  setThinking: (v: boolean) => void;
  setView: (v: ViewType) => void;
}

export const useChatStore = create<ChatStore>((set) => ({
  messages: [],
  isThinking: false,
  currentView: 'chat',
  addMessage: (msg) => set((s) => ({ messages: [...s.messages, msg] })),
  setThinking: (v) => set({ isThinking: v }),
  setView: (v) => set({ currentView: v }),
}));
