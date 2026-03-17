
import { motion } from 'framer-motion';
import { Volume2, VolumeX, Loader2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeSanitize, { defaultSchema } from 'rehype-sanitize';
import { ChatMessage } from '@/lib/types';

// Sanitization schema: allow safe markdown features, block XSS
const sanitizeSchema = {
  ...defaultSchema,
  attributes: {
    ...defaultSchema.attributes,
    a: [...(defaultSchema.attributes?.a || []), ['target', '_blank'], ['rel', 'noopener noreferrer']],
    code: [...(defaultSchema.attributes?.code || []), 'className'],
  },
  // Block dangerous elements
  tagNames: (defaultSchema.tagNames || []).filter(
    (tag: string) => !['script', 'style', 'iframe', 'object', 'embed', 'form', 'input', 'textarea'].includes(tag)
  ),
};
import CalendarCard from './CalendarCard';
import { mediaTypeIcon, UploadMediaType } from '@/hooks/useFileUpload';

type TTSState = 'idle' | 'loading' | 'playing';

interface MessageProps {
  message: ChatMessage;
  ttsState?: TTSState;
  onTTSToggle?: () => void;
}

function FileChip({ attachment }: { attachment: Record<string, unknown> }) {
  const filename = (attachment.filename as string) || 'File';
  const mediaType = (attachment.mediaType as UploadMediaType) || 'unknown';
  const preview = (attachment.preview as string) || '';
  const localPreviewUrl = attachment.localPreviewUrl as string | undefined;

  if (mediaType === 'image' && localPreviewUrl) {
    return (
      <div className="mt-2 rounded-xl overflow-hidden border border-white/15 max-w-xs">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={localPreviewUrl}
          alt={filename}
          className="w-full max-h-48 object-cover rounded-xl"
        />
        <div className="px-3 py-1.5 bg-white/5">
          <p className="text-text text-xs font-medium truncate">{filename}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-2 flex items-center gap-2 rounded-xl bg-white/10 border border-white/15 px-3 py-2 text-sm max-w-xs">
      <span className="text-base flex-shrink-0">{mediaTypeIcon(mediaType)}</span>
      <div className="min-w-0">
        <p className="text-text font-medium truncate">{filename}</p>
        {preview && <p className="text-text-muted text-xs truncate max-w-[180px]">{preview}</p>}
      </div>
    </div>
  );
}

export default function Message({ message, ttsState = 'idle', onTTSToggle }: MessageProps) {
  const isUser = message.role === 'user';
  const isVoice = message.source === 'voice';
  const attachment = isUser && message.data?.attachment ? (message.data.attachment as Record<string, unknown>) : null;
  const voiceBorderUser = isVoice ? 'border-2 border-amber-500' : 'border border-accent/20';
  const voiceBorderBot = isVoice ? 'border border-amber-500/30' : '';

  return (
    <motion.div className={`flex ${isUser ? 'justify-end' : 'justify-start'} px-4`}
      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      <div className={`max-w-[85%] sm:max-w-[70%] ${isUser ? 'items-end' : 'items-start'} flex flex-col`}>
        <div className={`px-4 py-2.5 text-base leading-relaxed break-words overflow-hidden ${isUser ? `bg-accent/15 ${voiceBorderUser} text-text rounded-2xl rounded-br` : `glass ${voiceBorderBot} text-text rounded-2xl rounded-bl`}`}>
          {!isUser && !message.text ? (
            <span className="inline-block w-2 h-5 bg-accent/60 animate-pulse rounded-sm" />
          ) : (
          <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[[rehypeSanitize, sanitizeSchema]]} components={{
            a: ({ href, children }) => <a href={href} target="_blank" rel="noopener noreferrer" className="text-accent underline break-all hover:text-accent/80 transition-colors">{children}</a>,
            p: ({ children }) => <span>{children}</span>,
            strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
            em: ({ children }) => <em>{children}</em>,
            code: ({ children }) => <code className="bg-white/10 px-1.5 py-0.5 rounded text-sm font-mono">{children}</code>,
          }}>
            {message.text}
          </ReactMarkdown>
          )}
        </div>
        {attachment && <FileChip attachment={attachment} />}
        {/* Grupo 2 - Coming Soon: music card disabled temporarily — reactivate with device launch */}
        {/* {!isUser && message.type === 'music' && <MusicCard data={message.data} />} */}
        {!isUser && message.type === 'calendar' && <CalendarCard data={message.data} />}
        {/* Grupo 3 - Disabled: image generation, YouTube embed, video, cast to TV */}
        {/* Preserved for future Enterprise plan reactivation */}
        <div className="mt-1 flex items-center gap-2 px-1">
          <span className="text-sm text-text-muted">{message.time}</span>
          {!isUser && onTTSToggle && (
            <button onClick={onTTSToggle}
              className={`flex items-center justify-center transition-colors ${ttsState === 'playing' ? 'text-accent' : 'text-text-muted/50 hover:text-text-muted'}`}
              aria-label={ttsState === 'playing' ? 'Stop speaking' : 'Read aloud'}>
              {ttsState === 'loading' ? <Loader2 size={12} className="animate-spin" /> : ttsState === 'playing' ? <VolumeX size={12} /> : <Volume2 size={12} />}
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
