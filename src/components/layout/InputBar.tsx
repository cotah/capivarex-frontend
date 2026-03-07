'use client';

import { useState, useRef, KeyboardEvent } from 'react';
import { Send, Mic } from 'lucide-react';
import { useChat } from '@/hooks/useChat';
import { useChatStore } from '@/stores/chatStore';

export default function InputBar() {
  const [text, setText] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const { send } = useChat();
  const isThinking = useChatStore((s) => s.isThinking);

  const handleSend = () => {
    const trimmed = text.trim();
    if (!trimmed || isThinking) return;
    send(trimmed);
    setText('');
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const hasText = text.trim().length > 0;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50">
      {/* Gradient fade */}
      <div className="h-8 bg-gradient-to-t from-bg to-transparent pointer-events-none" />

      <div className="bg-bg/80 backdrop-blur-xl pb-safe">
        <div className="mx-auto max-w-3xl px-4 pb-4">
          <div className="flex items-center gap-2 rounded-2xl glass px-4 py-3">
            <input
              ref={inputRef}
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask Capivarex anything..."
              disabled={isThinking}
              className="flex-1 bg-transparent text-base text-text placeholder:text-text-muted outline-none disabled:opacity-50"
            />

            {/* Mic button */}
            <button
              className="flex h-8 w-8 items-center justify-center rounded-full text-text-muted hover:text-text transition-colors"
              aria-label="Voice input"
            >
              <Mic size={16} />
            </button>

            {/* Send button */}
            <button
              onClick={handleSend}
              disabled={!hasText || isThinking}
              className={`flex h-8 w-8 items-center justify-center rounded-full transition-all duration-200 ${
                hasText && !isThinking
                  ? 'bg-accent text-bg hover:bg-accent/90 shadow-lg shadow-accent/20'
                  : 'bg-white/5 text-text-muted'
              }`}
              aria-label="Send message"
            >
              <Send size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
