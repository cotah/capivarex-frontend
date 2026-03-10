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
  const tts = useTTS();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isThinking]);

  return (
    <div className="flex-1 overflow-y-auto space-y-3 pt-6 pb-4">
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
