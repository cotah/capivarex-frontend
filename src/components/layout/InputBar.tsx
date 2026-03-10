'use client';

import { useState, useRef, useCallback, KeyboardEvent } from 'react';
import { Send, Mic, MicOff, AudioLines, Loader2, Paperclip } from 'lucide-react';
import { useChat } from '@/hooks/useChat';
import { useChatStore } from '@/stores/chatStore';
import { useVoiceRecorder } from '@/hooks/useVoiceRecorder';
import VoiceOverlay from '@/components/chat/VoiceOverlay';
import FilePreview from '@/components/chat/FilePreview';
import { useFileUpload } from '@/hooks/useFileUpload';

interface InputBarProps {
  centered?: boolean;
}

export default function InputBar({ centered = false }: InputBarProps) {
  const [text, setText] = useState('');
  const [voiceOpen, setVoiceOpen] = useState(false);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { send, sendWithFile } = useChat();
  const isThinking = useChatStore((s) => s.isThinking);
  const { state: micState, supported: micSupported, startRecording, stopRecording } = useVoiceRecorder();
  const { uploadState, uploadResult, uploadError, upload, reset: resetUpload } = useFileUpload();

  const handleFileClick = useCallback(() => { fileInputRef.current?.click(); }, []);

  const handleFileChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = '';
    setPendingFile(file);
    await upload(file);
  }, [upload]);

  const handleRemoveFile = useCallback(() => {
    setPendingFile(null);
    resetUpload();
  }, [resetUpload]);

  const handleMic = async () => {
    if (micState === 'recording') {
      const transcribed = await stopRecording();
      if (transcribed) setText((prev) => (prev ? `${prev} ${transcribed}` : transcribed));
      inputRef.current?.focus();
    } else if (micState === 'idle') {
      startRecording();
    }
  };

  const handleSend = useCallback(() => {
    const trimmed = text.trim();
    const canSend = (trimmed || pendingFile) && !isThinking;
    if (!canSend) return;

    if (pendingFile && uploadResult) {
      const fileContext = uploadResult.extracted_text
        ? `[File: ${uploadResult.filename}]\n\n${uploadResult.extracted_text}`
        : `[File: ${uploadResult.filename}]`;
      const messageText = trimmed ? `${trimmed}\n\n${fileContext}` : fileContext;
      sendWithFile(messageText, {
        filename: uploadResult.filename,
        mediaType: uploadResult.media_type,
        preview: uploadResult.preview,
        fileId: uploadResult.file_id,
      });
    } else if (trimmed) {
      send(trimmed);
    }

    setText('');
    setPendingFile(null);
    resetUpload();
    inputRef.current?.focus();
  }, [text, pendingFile, uploadResult, isThinking, send, sendWithFile, resetUpload]);

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  const hasFile = pendingFile !== null;
  const canSend = (text.trim().length > 0 || (hasFile && uploadState === 'done')) && !isThinking;

  const inputRow = (
    <div className="flex flex-col gap-2">
      {pendingFile && (
        <div className="px-1">
          <FilePreview file={pendingFile} uploadState={uploadState} uploadResult={uploadResult} uploadError={uploadError} onRemove={handleRemoveFile} />
        </div>
      )}
      <div className="flex items-center gap-2 rounded-2xl glass px-4 py-3">
        <input ref={fileInputRef} type="file" className="hidden"
          accept="image/*,audio/*,video/*,.pdf,.docx,.doc,.txt,.md"
          onChange={handleFileChange} aria-label="Attach file" />
        <button onClick={handleFileClick} disabled={isThinking || hasFile}
          className={`flex h-8 w-8 items-center justify-center rounded-full transition-all duration-200 ${hasFile ? 'text-accent bg-accent/10' : 'text-text-muted hover:text-accent hover:bg-accent/5'} disabled:opacity-40`}
          aria-label="Attach file" title="Attach image, audio, PDF, document or video">
          <Paperclip size={15} />
        </button>
        <input ref={inputRef} type="text" value={text} onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={hasFile ? 'Add a message (optional)...' : 'Ask Capivarex anything...'}
          disabled={isThinking}
          className="flex-1 bg-transparent text-base text-text placeholder:text-text-muted outline-none disabled:opacity-50" />
        {micSupported && (
          <button onClick={handleMic} disabled={micState === 'transcribing' || isThinking}
            className={`flex h-8 w-8 items-center justify-center rounded-full transition-all duration-200 ${micState === 'recording' ? 'bg-red-500 text-white animate-pulse shadow-lg shadow-red-500/30' : micState === 'transcribing' ? 'bg-white/5 text-text-muted' : 'text-accent hover:text-accent/80 hover:bg-accent/5'}`}
            aria-label={micState === 'recording' ? 'Stop recording' : 'Voice input'}>
            {micState === 'transcribing' ? <Loader2 size={16} className="animate-spin" /> : micState === 'recording' ? <MicOff size={16} /> : <Mic size={16} />}
          </button>
        )}
        <button onClick={handleSend} disabled={!canSend}
          className={`flex h-8 w-8 items-center justify-center rounded-full transition-all duration-200 ${canSend ? 'bg-accent text-bg hover:bg-accent/90 shadow-lg shadow-accent/20' : 'bg-white/5 text-text-muted'}`}
          aria-label="Send message">
          {uploadState === 'uploading' ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
        </button>
        <button onClick={() => setVoiceOpen(true)}
          className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-500/15 text-amber-500 hover:bg-amber-500/25 transition-all duration-200"
          aria-label="Voice conversation">
          <AudioLines size={16} />
        </button>
      </div>
    </div>
  );

  return (
    <>
      {centered ? (
        <div className="w-full px-4">{inputRow}</div>
      ) : (
        <div className="fixed bottom-[4.5rem] md:bottom-0 left-0 right-0 z-50">
          <div className="h-8 bg-gradient-to-t from-bg to-transparent pointer-events-none" />
          <div className="bg-bg/80 backdrop-blur-xl pb-safe">
            <div className="mx-auto max-w-3xl px-4 pb-4">{inputRow}</div>
          </div>
        </div>
      )}
      {voiceOpen && <VoiceOverlay onClose={() => setVoiceOpen(false)} />}
    </>
  );
}
