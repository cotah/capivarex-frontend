'use client';

import { useChatStore } from '@/stores/chatStore';
import InputBar from '@/components/layout/InputBar';
import Orb from '@/components/orb/Orb';
import MessageList from '@/components/chat/MessageList';

export default function ChatPage() {
  const messages = useChatStore((s) => s.messages);
  const hasMessages = messages.length > 0;

  return (
    <>
      <div className="mx-auto max-w-3xl h-[calc(100vh-3.5rem)] flex flex-col pb-24">
        {!hasMessages && <Orb />}
        <MessageList />
      </div>
      <InputBar />
    </>
  );
}
