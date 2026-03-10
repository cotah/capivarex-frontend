'use client';

import { motion } from 'framer-motion';
import { Tv } from 'lucide-react';
import Image from 'next/image';
import ReactMarkdown from 'react-markdown';
import { ChatMessage } from '@/lib/types';
import MusicCard from './MusicCard';
import CalendarCard from './CalendarCard';
import { castYouTube } from '@/lib/cast';

const API_URL = process.env.NEXT_PUBLIC_API_URL || '';

function resolveUrl(path: string): string {
  if (path.startsWith('http')) return path;
  return `${API_URL}${path}`;
}

interface MessageProps {
  message: ChatMessage;
}

export default function Message({ message }: MessageProps) {
  const isUser = message.role === 'user';
  const isVoice = message.source === 'voice';
  const videoId = typeof message.data?.video_id === 'string' ? message.data.video_id : undefined;
  const videoUrl = typeof message.data?.video_url === 'string' ? message.data.video_url : undefined;

  // Image handling: prefer image_urls over image_url to avoid duplicates
  const rawImageUrls = Array.isArray(message.data?.image_urls) ? (message.data.image_urls as string[]) : undefined;
  const hasMultipleImages = rawImageUrls !== undefined && rawImageUrls.length > 0;
  const singleImageUrl = !hasMultipleImages && typeof message.data?.image_url === 'string'
    ? message.data.image_url
    : undefined;

  /* Voice messages get a golden border */
  const voiceBorderUser = isVoice ? 'border-2 border-amber-500' : 'border border-accent/20';
  const voiceBorderBot = isVoice ? 'border border-amber-500/30' : '';

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
          <ReactMarkdown
            components={{
              a: ({ href, children }) => (
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent underline hover:text-accent/80 transition-colors"
                >
                  {children}
                </a>
              ),
              p: ({ children }) => <span>{children}</span>,
              strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
              em: ({ children }) => <em>{children}</em>,
              code: ({ children }) => (
                <code className="bg-white/10 px-1.5 py-0.5 rounded text-sm font-mono">{children}</code>
              ),
            }}
          >
            {message.text}
          </ReactMarkdown>
        </div>

        {/* Contextual cards */}
        {!isUser && message.type === 'music' && (
          <MusicCard data={message.data} />
        )}
        {!isUser && message.type === 'calendar' && (
          <CalendarCard data={message.data} />
        )}

        {/* Single generated image */}
        {!isUser && singleImageUrl !== undefined && (
          <div className="relative mt-3 rounded-xl overflow-hidden border border-glass-border max-w-md w-full">
            <Image
              src={resolveUrl(singleImageUrl)}
              alt={typeof message.data?.prompt === 'string' ? message.data.prompt : 'Generated image'}
              width={448}
              height={448}
              className="w-full rounded-xl cursor-pointer"
              unoptimized
              onClick={() => window.open(resolveUrl(singleImageUrl), '_blank')}
            />
          </div>
        )}

        {/* Multiple generated images */}
        {!isUser && hasMultipleImages && rawImageUrls.map((url, i) => (
          <div key={i} className="relative mt-3 rounded-xl overflow-hidden border border-glass-border max-w-md w-full">
            <Image
              src={resolveUrl(url)}
              alt={`Generated image ${i + 1}`}
              width={448}
              height={448}
              className="w-full rounded-xl cursor-pointer"
              unoptimized
              onClick={() => window.open(resolveUrl(url), '_blank')}
            />
          </div>
        ))}

        {/* YouTube video embed */}
        {!isUser && videoId !== undefined && (
          <div className="mt-3 rounded-xl overflow-hidden border border-glass-border aspect-video max-w-md w-full">
            <iframe
              src={`https://www.youtube.com/embed/${videoId}`}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        )}

        {/* Generated video */}
        {!isUser && videoUrl !== undefined && (
          <div className="mt-3 rounded-xl overflow-hidden border border-glass-border max-w-md w-full">
            <video
              src={resolveUrl(videoUrl)}
              controls
              className="w-full rounded-xl"
              preload="metadata"
            />
          </div>
        )}

        {/* Cast to TV button for video messages */}
        {!isUser && videoId !== undefined && (
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
