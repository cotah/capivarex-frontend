'use client';

import { useState, useRef, useCallback } from 'react';
import { X, Mic, MicOff, Loader2, Volume2 } from 'lucide-react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { useChatStore } from '@/stores/chatStore';
import { useConversationStore } from '@/stores/conversationStore';
import { sendMessage, apiClient } from '@/lib/api';
import { nanoid } from 'nanoid';
import type { MessageType } from '@/lib/types';

type VoiceState = 'idle' | 'recording' | 'processing' | 'speaking';

interface VoiceOverlayProps {
  onClose: () => void;
}

interface TranscribeResponse {
  text: string;
  language?: string;
}

interface SynthesizeResponse {
  audio_base64: string;
  content_type?: string;
}

/** Pick the first supported mime type for MediaRecorder */
function pickMimeType(): string {
  const candidates = [
    'audio/webm;codecs=opus',
    'audio/webm',
    'audio/mp4',
    'audio/ogg',
  ];
  for (const mt of candidates) {
    if (MediaRecorder.isTypeSupported(mt)) return mt;
  }
  return '';
}

export default function VoiceOverlay({ onClose }: VoiceOverlayProps) {
  const [voiceState, setVoiceState] = useState<VoiceState>('idle');
  const [statusText, setStatusText] = useState('');
  const [botText, setBotText] = useState('');
  const [supported] = useState(
    () => typeof window !== 'undefined' && typeof MediaRecorder !== 'undefined',
  );

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const addMessage = useChatStore((s) => s.addMessage);

  const now = () =>
    new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  /* ── Start recording ── */
  const startRecording = useCallback(async () => {
    // If speaking, interrupt and restart
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }

    setStatusText('');
    setBotText('');
    chunksRef.current = [];

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const mimeType = pickMimeType();
      const mr = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);
      mediaRecorderRef.current = mr;

      mr.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      mr.start();
      setVoiceState('recording');
      setStatusText('Gravando...');
    } catch {
      setVoiceState('idle');
      setStatusText('Microfone não disponível');
    }
  }, []);

  /* ── Stop recording → transcribe → chat → TTS ── */
  const stopAndProcess = useCallback(async () => {
    const mr = mediaRecorderRef.current;
    if (!mr || mr.state !== 'recording') return;

    // Stop recording and collect blob
    const blob = await new Promise<Blob>((resolve) => {
      mr.onstop = () => {
        const recorded = new Blob(chunksRef.current, { type: mr.mimeType });
        chunksRef.current = [];
        resolve(recorded);
      };
      mr.stop();
    });

    // Release mic
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;

    if (blob.size === 0) {
      setVoiceState('idle');
      setStatusText('');
      return;
    }

    setVoiceState('processing');
    setStatusText('Processando...');

    try {
      /* ── Step 1: Whisper STT ── */
      const formData = new FormData();
      const ext = (mr.mimeType || '').includes('webm') ? 'webm' : 'mp4';
      formData.append('audio', blob, `recording.${ext}`);

      const transcription = await apiClient<TranscribeResponse>(
        '/api/webapp/voice/transcribe',
        { method: 'POST', body: formData },
      );

      const userText = (transcription.text || '').trim();
      if (!userText) {
        setVoiceState('idle');
        setStatusText('Não consegui ouvir. Tente novamente.');
        return;
      }

      setStatusText(userText);

      /* Add user message to chat */
      addMessage({
        id: nanoid(),
        role: 'user',
        text: userText,
        time: now(),
        source: 'voice',
      });

      /* ── Step 2: Chat agent ── */
      let conversationId = useConversationStore.getState().activeConversationId;
      if (!conversationId) {
        conversationId = await useConversationStore.getState().createConversation();
      }

      const response = await sendMessage(userText, conversationId);
      const reply =
        (response.response as string) ||
        (response.message as string) ||
        'No response';

      /* Add bot message to chat */
      addMessage({
        id: nanoid(),
        role: 'assistant',
        text: reply,
        time: now(),
        type: response.type as MessageType | undefined,
        data: response.data as Record<string, unknown> | undefined,
        source: 'voice',
      });

      // Update sidebar
      if (conversationId) {
        useConversationStore.getState().addMessageToConversation(conversationId, {
          id: nanoid(),
          role: 'assistant',
          text: reply,
          time: now(),
        });
      }

      if (response.conversation_title) {
        useConversationStore.getState().renameConversation(
          conversationId,
          response.conversation_title as string,
        );
      }

      setBotText(reply);

      /* ── Step 3: ElevenLabs TTS ── */
      setVoiceState('speaking');
      setStatusText('');

      try {
        const synth = await apiClient<SynthesizeResponse>(
          '/api/webapp/voice/synthesize',
          {
            method: 'POST',
            body: JSON.stringify({ text: reply }),
          },
        );

        if (synth.audio_base64) {
          const contentType = synth.content_type || 'audio/mpeg';
          const binaryStr = atob(synth.audio_base64);
          const bytes = new Uint8Array(binaryStr.length);
          for (let i = 0; i < binaryStr.length; i++) {
            bytes[i] = binaryStr.charCodeAt(i);
          }
          const audioBlob = new Blob([bytes], { type: contentType });
          const audioUrl = URL.createObjectURL(audioBlob);
          const audio = new Audio(audioUrl);
          audioRef.current = audio;

          audio.onended = () => {
            URL.revokeObjectURL(audioUrl);
            audioRef.current = null;
            setVoiceState('idle');
          };
          audio.onerror = () => {
            URL.revokeObjectURL(audioUrl);
            audioRef.current = null;
            setVoiceState('idle');
          };

          await audio.play();
        } else {
          // No audio returned, go idle
          setVoiceState('idle');
        }
      } catch {
        // TTS failed but chat response was shown — go idle
        setVoiceState('idle');
      }
    } catch {
      const errMsg = 'Desculpe, algo deu errado. Tente novamente.';
      addMessage({
        id: nanoid(),
        role: 'assistant',
        text: errMsg,
        time: now(),
        source: 'voice',
      });
      setBotText(errMsg);
      setVoiceState('idle');
    }
  }, [addMessage]);

  /* ── Toggle mic ── */
  const toggleMic = useCallback(() => {
    if (voiceState === 'recording') {
      stopAndProcess();
    } else if (voiceState === 'idle' || voiceState === 'speaking') {
      // If speaking, interrupt and start new recording
      startRecording();
    }
  }, [voiceState, startRecording, stopAndProcess]);

  /* ── Close handler ── */
  const handleClose = useCallback(() => {
    // Stop recording
    if (mediaRecorderRef.current?.state === 'recording') {
      mediaRecorderRef.current.stop();
    }
    streamRef.current?.getTracks().forEach((t) => t.stop());
    // Stop audio playback
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    onClose();
  }, [onClose]);

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[60] flex flex-col bg-bg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
      >
        {/* ── Header ── */}
        <div className="flex h-14 items-center justify-between px-6 border-b border-glass-border shrink-0">
          <span className="text-base font-semibold text-text">Capivarex Voice</span>
          <button
            onClick={handleClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-text-muted hover:text-text hover:bg-white/5 transition-colors"
            aria-label="Close voice"
          >
            <X size={20} />
          </button>
        </div>

        {/* ── Center content ── */}
        <div className="flex flex-1 flex-col items-center justify-center gap-6 px-6">
          {!supported ? (
            <p className="text-center text-text-muted text-base">
              Voice not supported in this browser.
              <br />
              Try Chrome or Edge.
            </p>
          ) : (
            <>
              {/* Capivara avatar */}
              <div className="w-[150px] h-[150px]">
                <Image
                  src="/capivara-smart.png"
                  alt="Capivarex Voice"
                  width={150}
                  height={150}
                  className="w-full h-full object-contain"
                />
              </div>

              {/* State label */}
              <p className="text-sm text-text-muted">
                {voiceState === 'recording'
                  ? 'Ouvindo...'
                  : voiceState === 'processing'
                    ? 'Processando...'
                    : voiceState === 'speaking'
                      ? 'Falando...'
                      : 'Toca para falar'}
              </p>

              {/* Transcript / Bot response */}
              <div className="min-h-[60px] max-w-md text-center">
                {voiceState === 'recording' && (
                  <p className="text-base text-text animate-pulse">
                    {statusText || 'Gravando...'}
                  </p>
                )}
                {voiceState === 'processing' && (
                  <p className="text-base text-text-muted flex items-center justify-center gap-2">
                    <Loader2 size={16} className="animate-spin" />
                    {statusText || 'Processando...'}
                  </p>
                )}
                {voiceState === 'speaking' && botText && (
                  <p className="text-base text-accent">{botText}</p>
                )}
                {voiceState === 'idle' && botText && (
                  <p className="text-base text-text-muted">{botText}</p>
                )}
              </div>
            </>
          )}
        </div>

        {/* ── Bottom mic button ── */}
        {supported && (
          <div className="flex justify-center pb-12 pt-4 shrink-0">
            <button
              onClick={toggleMic}
              disabled={voiceState === 'processing'}
              className={`flex h-16 w-16 items-center justify-center rounded-full transition-all duration-200 ${
                voiceState === 'recording'
                  ? 'bg-error text-white shadow-lg shadow-error/30 scale-110'
                  : voiceState === 'processing'
                    ? 'bg-white/5 text-text-muted cursor-not-allowed'
                    : voiceState === 'speaking'
                      ? 'bg-amber-500/80 text-bg hover:bg-amber-400 shadow-lg shadow-amber-500/30'
                      : 'bg-amber-500 text-bg hover:bg-amber-400 shadow-lg shadow-amber-500/30'
              }`}
              aria-label={
                voiceState === 'recording'
                  ? 'Stop recording'
                  : voiceState === 'speaking'
                    ? 'Interrupt and record'
                    : 'Start recording'
              }
            >
              {voiceState === 'processing' ? (
                <Loader2 size={28} className="animate-spin" />
              ) : voiceState === 'recording' ? (
                <MicOff size={28} />
              ) : voiceState === 'speaking' ? (
                <Volume2 size={28} />
              ) : (
                <Mic size={28} />
              )}
            </button>
          </div>
        )}

        {/* End button */}
        <div className="flex justify-center pb-8 shrink-0">
          <button
            onClick={handleClose}
            className="text-sm text-text-muted hover:text-text transition-colors"
          >
            End conversation
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
