'use client';

import { motion } from 'framer-motion';
import { Tv } from 'lucide-react';
import { ChatMessage } from '@/lib/types';
import MusicCard from './MusicCard';
import CalendarCard from './CalendarCard';
import { castYouTube } from '@/lib/cast';

const API_URL = process.env.NEXT_PUBLIC_API_URL || '';

interface MessageProps {
  message: ChatMessage;
}

export default function Message({ message }: MessageProps) {
  const isUser = message.role === 'user';
  const isVoice = message.source === 'voice';
  const videoId = message.data?.video_id as string | undefined;
  const imageUrl = message.data?.image_url as string | undefined;
  const imageUrls = message.data?.image_urls as string[] | undefined;

  /* Voice messages get a golden border */
  const voiceBorderUser = isVoice ? 'border-2 border-amber-500' : 'border border-accent/20';
  const voiceBorderBot = isVoice ? 'border border-amber-500/30' : '';

  function resolveUrl(path: string): string {
    if (path.startsWith('http')) return path;
    return `${API_URL}${path}`;
  }

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
          className={`px-4 py-2.5 text-base leading-relaxed ${
            isUser
              ? `bg-accent/15 ${voiceBorderUser} text-text rounded-2xl rounded-br`
              : `glass ${voiceBorderBot} text-text rounded-2xl rounded-bl`
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

        {/* Single generated image */}
        {!isUser && imageUrl && (
          <div className="mt-3 rounded-xl overflow-hidden border border-glass-border">
            <img
              src={resolveUrl(imageUrl)}
              alt={(message.data?.prompt as string) || 'Generated image'}
              className="w-full max-w-md rounded-xl cursor-pointer"
              loading="lazy"
              onClick={() => window.open(resolveUrl(imageUrl), '_blank')}
            />
          </div>
        )}

        {/* Multiple generated images */}
        {!isUser && imageUrls && imageUrls.length > 0 && imageUrls.map((url, i) => (
          <div key={i} className="mt-3 rounded-xl overflow-hidden border border-glass-border">
            <img
              src={resolveUrl(url)}
              alt={`Generated image ${i + 1}`}
              className="w-full max-w-md rounded-xl cursor-pointer"
              loading="lazy"
              onClick={() => window.open(resolveUrl(url), '_blank')}
            />
          </div>
        ))}

        {/* YouTube video embed */}
        {!isUser && videoId && (
          <div className="mt-3 rounded-xl overflow-hidden border border-glass-border aspect-video max-w-md w-full">
            <iframe
              src={`https://www.youtube.com/embed/${videoId}`}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        )}

        {/* Cast to TV button for video messages */}
        {!isUser && videoId && (
          <button
            onClick={() => castYouTube(videoId)}
            className="mt-1.5 flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-sm text-text-muted hover:text-accent hover:bg-accent/5 transition-colors"
          >
            <Tv size={12} />
            Cast to TV
          </button>
        )}

        {/* Timestamp */}
        <span className="mt-1 text-sm text-text-muted px-1">
          {message.time}
        </span>
      </div>
    </motion.div>
  );
}
