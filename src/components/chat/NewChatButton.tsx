'use client';
import { useT } from '@/i18n';

import { Plus } from 'lucide-react';
import { useConversationStore } from '@/stores/conversationStore';

export default function NewChatButton() {
  const t = useT();
  const createConversation = useConversationStore((s) => s.createConversation);

  const handleNewChat = async () => {
    await createConversation();
  };

  return (
    <button
      onClick={handleNewChat}
      className="flex w-full items-center gap-2 rounded-xl glass px-4 py-3 text-accent hover:bg-white/5 transition-colors duration-200"
    >
      <Plus size={18} />
      <span className="text-sm font-medium">{t('chat.new_chat')}</span>
    </button>
  );
}
