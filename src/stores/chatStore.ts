import { create } from 'zustand';
import type { ChatMessage } from '@/lib/types';

interface ChatStore {
  messages: ChatMessage[];
  isThinking: boolean;
  voiceOpen: boolean;
  addMessage: (msg: ChatMessage) => void;
  setThinking: (v: boolean) => void;
  setVoiceOpen: (v: boolean) => void;
}

export const useChatStore = create<ChatStore>((set) => ({
  messages: [],
  isThinking: false,
  voiceOpen: false,
  addMessage: (msg) => set((s) => ({ messages: [...s.messages, msg] })),
  setThinking: (v) => set({ isThinking: v }),
  setVoiceOpen: (v) => set({ voiceOpen: v }),
}));
