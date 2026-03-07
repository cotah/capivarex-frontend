'use client';

import { Plus } from 'lucide-react';
import { useConversationStore } from '@/stores/conversationStore';
import { useChatStore } from '@/stores/chatStore';

export default function NewChatButton() {
  const createConversation = useConversationStore((s) => s.createConversation);
  const setThinking = useChatStore((s) => s.setThinking);

  const handleNewChat = () => {
    createConversation();
    // Clear current chat messages
    useChatStore.setState({ messages: [], isThinking: false });
    setThinking(false);
  };

  return (
    <button
      onClick={handleNewChat}
      className="flex w-full items-center gap-2 rounded-xl glass px-4 py-3 text-accent hover:bg-white/5 transition-colors duration-200"
    >
      <Plus size={18} />
      <span className="text-sm font-medium">New Chat</span>
    </button>
  );
}
