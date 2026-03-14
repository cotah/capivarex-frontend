import { create } from 'zustand';
import type { ChatMessage } from '@/lib/types';

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
  addMessage: (msg) => set((s) => ({ messages: [...s.messages, msg] })),
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
