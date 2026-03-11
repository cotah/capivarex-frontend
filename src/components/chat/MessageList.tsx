'use client';

import { useEffect, useRef } from 'react';
import { useChatStore } from '@/stores/chatStore';
import { useTTS } from '@/hooks/useTTS';
import Message from './Message';
import ThinkingCapivara from './ThinkingCapivara';

export default function MessageList() {
  const messages = useChatStore((s) => s.messages);
  const isThinking = useChatStore((s) => s.isThinking);
  const bottomRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const tts = useTTS();

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const timer = setTimeout(() => {
      container.scrollTop = container.scrollHeight;
    }, 50);
    return () => clearTimeout(timer);
  }, [messages]);

  return (
    <div ref={containerRef} className="flex-1 min-h-0 overflow-y-auto space-y-3 pt-6 pb-36 md:pb-24">
      {messages.map((msg) => (
        <Message
          key={msg.id}
          message={msg}
          ttsState={tts.playingId === msg.id ? tts.state : 'idle'}
          onTTSToggle={() => tts.play(msg.id, msg.text)}
        />
      ))}
      {isThinking && <ThinkingCapivara />}
      <div ref={bottomRef} />
    </div>
  );
}
