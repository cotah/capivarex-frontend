'use client';

import { useChatStore } from '@/stores/chatStore';
import InputBar from '@/components/layout/InputBar';
import MessageList from '@/components/chat/MessageList';

export default function ChatPage() {
  const messages = useChatStore((s) => s.messages);
  const hasMessages = messages.length > 0;

  /* ═══ Empty state — centered welcome + input ═══ */
  if (!hasMessages) {
    return (
      <div className="mx-auto flex h-[calc(100vh-3.5rem-6rem)] md:h-[calc(100vh-3.5rem)] max-w-3xl flex-col items-center justify-center">
        <h1 className="mb-8 text-center text-3xl font-light tracking-wide text-text md:text-5xl">
          Anywhere. Anytime.
        </h1>
        <div className="w-full">
          <InputBar centered />
        </div>
      </div>
    );
  }

  /* ═══ Conversation active — messages + input fixed at bottom ═══ */
  return (
    <>
      <div className="mx-auto flex h-[calc(100vh-3.5rem)] max-w-3xl flex-col pb-24">
        <MessageList />
      </div>
      <InputBar />
    </>
  );
}
