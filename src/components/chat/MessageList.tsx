'use client';

import { useEffect, useRef } from 'react';
import { useChatStore } from '@/stores/chatStore';
import Message from './Message';
import ThinkingDots from './ThinkingDots';

export default function MessageList() {
  const messages = useChatStore((s) => s.messages);
  const isThinking = useChatStore((s) => s.isThinking);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isThinking]);

  return (
    <div className="flex-1 overflow-y-auto space-y-3 pt-6 pb-4">
      {messages.map((msg) => (
        <Message key={msg.id} message={msg} />
      ))}
      {isThinking && <ThinkingDots />}
      <div ref={bottomRef} />
    </div>
  );
}
