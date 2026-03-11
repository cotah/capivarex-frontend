'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { X } from 'lucide-react';
import Image from 'next/image';
import { useChatStore } from '@/stores/chatStore';
import { useConversationStore } from '@/stores/conversationStore';
import { sendMessage, apiClient } from '@/lib/api';
import { nanoid } from 'nanoid';
import type { MessageType } from '@/lib/types';

type VoiceState = 'init' | 'listening' | 'processing' | 'speaking';

interface VoiceOverlayProps {
  onClose: () => void;
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
  const [voiceState, setVoiceState] = useState<VoiceState>('init');
  const [displayText, setDisplayText] = useState('');
  const [progressLabel, setProgressLabel] = useState('');

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const audioElRef = useRef<HTMLAudioElement | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const silenceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const typewriterRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isClosingRef = useRef(false);

  // Refs to break circular dependency between startListening <-> stopAndProcess
  const startListeningRef = useRef<() => Promise<void>>();
  const stopAndProcessRef = useRef<() => Promise<void>>();

  const addMessage = useChatStore((s) => s.addMessage);

  const now = () =>
    new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  /* ── Typewriter effect ── */
  const startTypewriter = useCallback((text: string) => {
    setDisplayText('');
    let i = 0;
    if (typewriterRef.current) clearInterval(typewriterRef.current);
    typewriterRef.current = setInterval(() => {
      i++;
      setDisplayText(text.slice(0, i));
      if (i >= text.length) {
        clearInterval(typewriterRef.current!);
        typewriterRef.current = null;
      }
    }, 18);
  }, []);

  /* ── Cleanup — stop everything ── */
  const cleanup = useCallback(() => {
    if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
    if (typewriterRef.current) clearInterval(typewriterRef.current);
    if (mediaRecorderRef.current?.state === 'recording') {
      try { mediaRecorderRef.current.stop(); } catch { /* ignore */ }
    }
    streamRef.current?.getTracks().forEach(t => t.stop());
    if (audioElRef.current) {
      audioElRef.current.pause();
      audioElRef.current.src = '';
      audioElRef.current = null;
    }
    if (audioCtxRef.current) {
      audioCtxRef.current.close().catch(() => {});
      audioCtxRef.current = null;
    }
  }, []);

  /* ── Start listening (auto-record + VAD) ── */
  const startListening = useCallback(async () => {
    if (isClosingRef.current) return;
    setDisplayText('');
    setProgressLabel('');
    chunksRef.current = [];

    try {
      // Create / reuse AudioContext
      const AudioCtxClass = window.AudioContext ||
        (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (AudioCtxClass && (!audioCtxRef.current || audioCtxRef.current.state === 'closed')) {
        audioCtxRef.current = new AudioCtxClass();
      }
      if (audioCtxRef.current?.state === 'suspended') {
        await audioCtxRef.current.resume();
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      // VAD — detect silence with AnalyserNode
      if (audioCtxRef.current) {
        const analyser = audioCtxRef.current.createAnalyser();
        analyser.fftSize = 512;
        const src = audioCtxRef.current.createMediaStreamSource(stream);
        src.connect(analyser);
        analyserRef.current = analyser;

        const dataArray = new Uint8Array(analyser.frequencyBinCount);
        let silenceStart: number | null = null;

        const checkSilence = () => {
          if (isClosingRef.current || mediaRecorderRef.current?.state !== 'recording') return;
          analyser.getByteFrequencyData(dataArray);
          const avg = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;
          if (avg < 8) {
            if (!silenceStart) silenceStart = Date.now();
            else if (Date.now() - silenceStart > 1500) {
              stopAndProcessRef.current?.();
              return;
            }
          } else {
            silenceStart = null;
          }
          requestAnimationFrame(checkSilence);
        };
        requestAnimationFrame(checkSilence);
      }

      const mimeType = pickMimeType();
      const mr = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);
      mediaRecorderRef.current = mr;
      mr.ondataavailable = (e) => { if (e.data.size > 0) chunksRef.current.push(e.data); };
      mr.start();
      setVoiceState('listening');
    } catch {
      if (!isClosingRef.current) setVoiceState('init');
    }
  }, []);

  /* ── Stop recording → transcribe → chat → TTS → loop ── */
  const stopAndProcess = useCallback(async () => {
    const mr = mediaRecorderRef.current;
    if (!mr || mr.state !== 'recording' || isClosingRef.current) return;

    setVoiceState('processing');
    streamRef.current?.getTracks().forEach(t => t.stop());

    const blob = await new Promise<Blob>((resolve) => {
      mr.onstop = () => {
        resolve(new Blob(chunksRef.current, { type: mr.mimeType }));
        chunksRef.current = [];
      };
      mr.stop();
    });

    // Blob too small = no voice detected
    if (blob.size < 1000 || isClosingRef.current) {
      if (!isClosingRef.current) startListeningRef.current?.();
      return;
    }

    try {
      /* ── Step 1: Whisper STT ── */
      setProgressLabel('Transcrevendo...');
      const formData = new FormData();
      const ext = (mr.mimeType || '').includes('webm') ? 'webm' : 'mp4';
      formData.append('audio', blob, `recording.${ext}`);

      const transcription = await apiClient<{ text: string }>(
        '/api/webapp/voice/transcribe',
        { method: 'POST', body: formData },
      );

      const userText = (transcription.text || '').trim();
      if (!userText || isClosingRef.current) {
        if (!isClosingRef.current) startListeningRef.current?.();
        return;
      }

      // Add user message to chat
      addMessage({ id: nanoid(), role: 'user', text: userText, time: now(), source: 'voice' });

      /* ── Step 2: Chat agent ── */
      setProgressLabel('Respondendo...');
      const store = useConversationStore.getState();
      let conversationId = store.activeConversationId;
      if (!conversationId) {
        conversationId = await store.createConversation();
      }

      console.error('[Voice] conversationId:', conversationId);
      const response = await sendMessage(userText, conversationId);
      if (isClosingRef.current) return;

      const reply =
        (response.text as string) ||
        (response.response as string) ||
        (response.message as string) ||
        (response.content as string) ||
        (response.answer as string) ||
        (response.reply as string) ||
        '';

      console.error('[Voice] reply value:', JSON.stringify(reply), 'type:', typeof reply, 'all keys:', JSON.stringify(Object.keys(response)));

      if (!reply) {
        startListeningRef.current?.();
        return;
      }

      // Add bot message to chat
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

      /* ── Step 3: TTS + typewriter in parallel ── */
      setVoiceState('speaking');
      setProgressLabel('Sintetizando...');
      startTypewriter(reply);

      const synth = await apiClient<{ audio_base64: string; content_type?: string }>(
        '/api/webapp/voice/synthesize',
        { method: 'POST', body: JSON.stringify({ text: reply }) },
      );

      if (isClosingRef.current) return;

      if (synth.audio_base64) {
        if (audioElRef.current) {
          audioElRef.current.pause();
          audioElRef.current.src = '';
        }

        const bytes = Uint8Array.from(atob(synth.audio_base64), c => c.charCodeAt(0));
        const audioBlob = new Blob([bytes], { type: synth.content_type || 'audio/mpeg' });
        const url = URL.createObjectURL(audioBlob);
        const audio = new Audio(url);
        audioElRef.current = audio;

        audio.onended = () => {
          URL.revokeObjectURL(url);
          audioElRef.current = null;
          if (!isClosingRef.current) startListeningRef.current?.();
        };
        audio.onerror = () => {
          URL.revokeObjectURL(url);
          audioElRef.current = null;
          if (!isClosingRef.current) startListeningRef.current?.();
        };
        audio.play().catch(() => {
          URL.revokeObjectURL(url);
          audioElRef.current = null;
          if (!isClosingRef.current) startListeningRef.current?.();
        });
      } else {
        if (!isClosingRef.current) startListeningRef.current?.();
      }
    } catch (err) {
      console.error('[Voice] stopAndProcess error:', err);
      if (!isClosingRef.current) startListeningRef.current?.();
    }
  }, [addMessage, startTypewriter]);

  // Keep refs in sync (breaks circular dependency)
  startListeningRef.current = startListening;
  stopAndProcessRef.current = stopAndProcess;

  /* ── Close handler ── */
  const handleClose = useCallback(() => {
    isClosingRef.current = true;
    cleanup();
    onClose();
  }, [cleanup, onClose]);

  /* ── Auto-start on mount ── */
  useEffect(() => {
    isClosingRef.current = false;
    const timer = setTimeout(() => {
      if (!isClosingRef.current) startListeningRef.current?.();
    }, 1500);
    return () => {
      clearTimeout(timer);
      isClosingRef.current = true;
      cleanup();
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="fixed inset-0 z-[60] flex flex-col bg-bg">
      {/* ── Header ── */}
      <div className="flex h-14 items-center justify-between px-6 border-b border-glass-border shrink-0">
        <span className="text-base font-semibold text-text">Capivarex Voice</span>
        <button
          onClick={handleClose}
          disabled={voiceState === 'processing'}
          className={`flex h-8 w-8 items-center justify-center rounded-lg text-text-muted hover:text-text hover:bg-white/5 transition-colors ${voiceState === 'processing' ? 'opacity-30 cursor-not-allowed' : ''}`}
          aria-label="Close voice"
        >
          <X size={20} />
        </button>
      </div>

      {/* ── Center content ── */}
      <div className="flex flex-1 flex-col items-center px-6 pt-8 min-h-0">
        {/* Avatar with pulse when listening */}
        <div className={`w-[150px] h-[150px] shrink-0 ${voiceState === 'listening' ? 'animate-pulse' : ''}`}>
          <Image
            src="/capivara-smart.png"
            alt="Capivarex Voice"
            width={150}
            height={150}
            className="w-full h-full object-contain"
          />
        </div>

        {/* State label */}
        <p className="text-sm text-text-muted mt-4 shrink-0">
          {voiceState === 'init'
            ? 'Preparando...'
            : voiceState === 'listening'
              ? 'Ouvindo... pode falar'
              : voiceState === 'processing'
                ? 'Processando...'
                : 'Falando...'}
        </p>
        {voiceState === 'processing' && progressLabel && (
          <p className="text-xs text-text-muted/60 mt-1 shrink-0">{progressLabel}</p>
        )}

        {/* Bot response text with scroll */}
        <div className="flex-1 min-h-0 overflow-y-auto w-full max-w-md text-center py-4">
          {(voiceState === 'speaking' || (voiceState === 'listening' && displayText)) && (
            <p className="text-base text-accent leading-relaxed">{displayText}</p>
          )}
        </div>
      </div>

      {/* ── End button ── */}
      <div className="flex justify-center pb-12 pt-4 shrink-0">
        <button
          onClick={handleClose}
          disabled={voiceState === 'processing'}
          className={`flex h-16 w-16 items-center justify-center rounded-full bg-error/20 text-error hover:bg-error/30 transition-all border border-error/30 ${voiceState === 'processing' ? 'opacity-30 cursor-not-allowed' : ''}`}
          aria-label="End conversation"
        >
          <X size={28} />
        </button>
      </div>
    </div>
  );
}
