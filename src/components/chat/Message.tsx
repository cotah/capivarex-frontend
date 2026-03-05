'use client';

import { motion } from 'framer-motion';
import { ChatMessage } from '@/lib/types';
import MusicCard from './MusicCard';
import CalendarCard from './CalendarCard';

interface MessageProps {
  message: ChatMessage;
}

export default function Message({ message }: MessageProps) {
  const isUser = message.role === 'user';

  return (
    <motion.div
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} px-4`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className={`max-w-[85%] sm:max-w-[70%] ${isUser ? 'items-end' : 'items-start'} flex flex-col`}>
        {/* Bubble */}
        <div
          className={`px-4 py-2.5 text-sm leading-relaxed ${
            isUser
              ? 'bg-accent/15 border border-accent/20 text-text rounded-2xl rounded-br'
              : 'glass text-text rounded-2xl rounded-bl'
          }`}
        >
          {message.text}
        </div>

        {/* Contextual cards */}
        {!isUser && message.type === 'music' && (
          <MusicCard data={message.data} />
        )}
        {!isUser && message.type === 'calendar' && (
          <CalendarCard data={message.data} />
        )}

        {/* Timestamp */}
        <span className="mt-1 text-[10px] text-text-muted px-1">
          {message.time}
        </span>
      </div>
    </motion.div>
  );
}
