// v3 — 4 bugs corrigidos: VAD race condition, iOS audio unlock, Whisper hallucination, interrupt typewriter
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

// Whisper known hallucination phrases (PT-BR + EN)
const WHISPER_HALLUCINATIONS = new Set([
  'tchau', 'tchau.', 'tchau tchau', 'tchau tchau.', 'tchau!',
  'obrigado', 'obrigado.', 'obrigada', 'obrigada.',
  'até logo', 'até logo.', 'até mais', 'até mais.',
  'bye', 'bye.', 'goodbye', 'goodbye.',
  'thank you', 'thank you.', 'thanks', 'thanks.',
  'ok', 'ok.', '...', '. . .', 'sim.', 'não.',
]);

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
  const isBotSpeakingRef = useRef(false); // FIX Bug 3: track bot speaking state
  const vadStartTimeRef = useRef<number>(0);

  const startListeningRef = useRef<() => Promise<void>>();
  const stopAndProcessRef = useRef<() => Promise<void>>();

  const addMessage = useChatStore((s) => s.addMessage);
  const now = () =>
    new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  /* ── Typewriter effect ── */
  const startTypewriter = useCallback((text: string, durationMs?: number) => {
    setDisplayText('');
    let i = 0;
    if (typewriterRef.current) clearInterval(typewriterRef.current);
    const interval = durationMs
      ? Math.min(80, Math.max(18, Math.floor(durationMs / text.length)))
      : 45;
    typewriterRef.current = setInterval(() => {
      i++;
      setDisplayText(text.slice(0, i));
      if (i >= text.length) {
        clearInterval(typewriterRef.current!);
        typewriterRef.current = null;
      }
    }, interval);
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
      // FIX Bug 2: não setar null no cleanup — preserva elemento desbloqueado
    }
    if (audioCtxRef.current) {
      audioCtxRef.current.close().catch(() => {});
      audioCtxRef.current = null;
    }
    isBotSpeakingRef.current = false;
  }, []);

  /* ── Start listening (auto-record + VAD) ── */
  const startListening = useCallback(async () => {
    if (isClosingRef.current) return;
    // FIX Bug 3: não iniciar escuta se bot ainda está falando
    if (isBotSpeakingRef.current) return;

    setDisplayText('');
    setProgressLabel('');
    chunksRef.current = [];
    try {
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

      // Setup analyser for VAD (will be started after mr.start())
      if (audioCtxRef.current) {
        const analyser = audioCtxRef.current.createAnalyser();
        analyser.fftSize = 512;
        const src = audioCtxRef.current.createMediaStreamSource(stream);
        src.connect(analyser);
        analyserRef.current = analyser;
      }

      const mimeType = pickMimeType();
      const mr = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);
      mediaRecorderRef.current = mr;
      mr.ondataavailable = (e) => { if (e.data.size > 0) chunksRef.current.push(e.data); };
      mr.start();
      setVoiceState('listening');
      vadStartTimeRef.current = Date.now();

      // FIX Bug 1: iniciar VAD DEPOIS de mr.start() para evitar race condition
      if (audioCtxRef.current && analyserRef.current) {
        const analyser = analyserRef.current;
        const dataArray = new Uint8Array(analyser.frequencyBinCount);
        let silenceStart: number | null = null;
        let hasSpeech = false;
        let speechStartTime: number | null = null; // FIX Bug 3: min speech duration

        const checkSilence = () => {
          // Grace period: skip first 100ms to let MediaRecorder fully enter 'recording' state
          // Without this, the VAD exits silently on the very first frame on iOS/Chrome mobile
          const elapsed = Date.now() - vadStartTimeRef.current;
          if (elapsed < 100) {
            requestAnimationFrame(checkSilence);
            return;
          }
          if (isClosingRef.current || mediaRecorderRef.current?.state !== 'recording') return;
          if (isBotSpeakingRef.current) return;

          analyser.getByteFrequencyData(dataArray);
          const avg = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;

          if (avg >= 18) {
            if (!speechStartTime) speechStartTime = Date.now();
            // Reduced from 500ms to 150ms — short Portuguese phrases trigger hasSpeech correctly
            if (Date.now() - speechStartTime > 150) {
              hasSpeech = true;
            }
            silenceStart = null;
          } else {
            speechStartTime = null; // reset se som parar antes de 500ms
            if (hasSpeech) {
              if (!silenceStart) silenceStart = Date.now();
              else if (Date.now() - silenceStart > 1500) {
                stopAndProcessRef.current?.();
                return;
              }
            }
          }
          requestAnimationFrame(checkSilence);
        };
        requestAnimationFrame(checkSilence);
      }
    } catch {
      if (!isClosingRef.current) setVoiceState('init');
    }
  }, []);

  /* ── Stop recording → transcribe → chat → TTS → loop ── */
  const stopAndProcess = useCallback(async () => {
    const mr = mediaRecorderRef.current;
    if (!mr || mr.state !== 'recording' || isClosingRef.current) return;

    // Para o áudio do bot se estava falando
    if (audioElRef.current && !audioElRef.current.paused) {
      audioElRef.current.pause();
      audioElRef.current.src = '';
      // FIX Bug 2: NÃO setar null — preserva elemento desbloqueado iOS
    }
    isBotSpeakingRef.current = false;

    // FIX Bug 4: parar typewriter imediatamente na interrupção
    if (typewriterRef.current) {
      clearInterval(typewriterRef.current);
      typewriterRef.current = null;
    }
    setDisplayText('');

    setVoiceState('processing');
    streamRef.current?.getTracks().forEach(t => t.stop());

    const blob = await new Promise<Blob>((resolve) => {
      mr.onstop = () => {
        resolve(new Blob(chunksRef.current, { type: mr.mimeType }));
        chunksRef.current = [];
      };
      mr.stop();
    });

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
      const userTextNorm = userText.toLowerCase().replace(/[!?,]/g, '').trim();

      // FIX Bug 3: filtrar alucinações conhecidas do Whisper
      if (!userText || isClosingRef.current || WHISPER_HALLUCINATIONS.has(userTextNorm)) {
        if (!isClosingRef.current) startListeningRef.current?.();
        return;
      }

      addMessage({ id: nanoid(), role: 'user', text: userText, time: now(), source: 'voice' });

      /* ── Step 2: Chat agent ── */
      setProgressLabel('Respondendo...');
      const store = useConversationStore.getState();
      let conversationId = store.activeConversationId;
      if (!conversationId) {
        conversationId = await store.createConversation();
      }

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

      if (!reply) {
        startListeningRef.current?.();
        return;
      }

      addMessage({
        id: nanoid(),
        role: 'assistant',
        text: reply,
        time: now(),
        type: response.type as MessageType | undefined,
        data: response.data as Record<string, unknown> | undefined,
        source: 'voice',
      });

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

      /* ── Step 3: TTS + typewriter synced with audio ── */
      setVoiceState('speaking');
      setProgressLabel('Sintetizando...');

      const synth = await apiClient<{ audio_base64: string; content_type?: string }>(
        '/api/webapp/voice/synthesize',
        { method: 'POST', body: JSON.stringify({ text: reply }) },
      );

      if (isClosingRef.current) return;

      if (synth.audio_base64) {
        // FIX Bug 2: reutilizar elemento existente (desbloqueado no mount iOS)
        const audio = audioElRef.current ?? new Audio();
        audioElRef.current = audio;

        isBotSpeakingRef.current = true; // FIX Bug 3: marcar bot como falando

        const dataUrl = `data:${synth.content_type || 'audio/mpeg'};base64,${synth.audio_base64}`;
        audio.src = dataUrl;

        // FIX Bug 3: só iniciar escuta APÓS o áudio terminar (+ delay de eco)
        audio.onended = () => {
          isBotSpeakingRef.current = false;
          if (!isClosingRef.current) {
            // Delay de 400ms para eco do alto-falante decair
            setTimeout(() => {
              if (!isClosingRef.current) startListeningRef.current?.();
            }, 400);
          }
        };
        audio.onerror = () => {
          isBotSpeakingRef.current = false;
          if (!isClosingRef.current) startListeningRef.current?.();
        };
        audio.play().catch(() => {
          isBotSpeakingRef.current = false;
          if (!isClosingRef.current) startListeningRef.current?.();
        });

        audio.addEventListener('loadedmetadata', () => {
          const durationMs = (audio.duration || 3) * 1000;
          startTypewriter(reply, durationMs);
        }, { once: true });

        setTimeout(() => {
          if (!typewriterRef.current) startTypewriter(reply);
        }, 500);

        // FIX Bug 3: REMOVIDO — não iniciar escuta paralela durante TTS
      } else {
        startTypewriter(reply);
        if (!isClosingRef.current) startListeningRef.current?.();
      }
    } catch (err) {
      console.error('[Voice] stopAndProcess error:', err);
      if (!isClosingRef.current) startListeningRef.current?.();
    }
  }, [addMessage, startTypewriter]);

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
    isBotSpeakingRef.current = false;

    // iOS: criar e carregar elemento de áudio dentro do gesto do usuário (mount = clique)
    const el = new Audio();
    el.load();
    audioElRef.current = el;

    // FIX Bug 1: reduzir delay de 1500ms para 300ms
    const timer = setTimeout(() => {
      if (!isClosingRef.current) startListeningRef.current?.();
    }, 300);

    return () => {
      clearTimeout(timer);
      isClosingRef.current = true;
      cleanup();
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="fixed inset-0 z-[60] flex flex-col bg-bg">
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
      <div className="flex flex-1 flex-col items-center px-6 pt-8 min-h-0">
        <div className={`w-[150px] h-[150px] shrink-0 ${voiceState === 'listening' ? 'animate-pulse' : ''}`}>
          <Image
            src="/capivara-smart.png"
            alt="Capivarex Voice"
            width={150}
            height={150}
            className="w-full h-full object-contain"
          />
        </div>
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
        <div className="flex-1 min-h-0 overflow-y-auto w-full max-w-md text-center py-4">
          {(voiceState === 'speaking' || (voiceState === 'listening' && displayText)) && (
            <p className="text-base text-accent leading-relaxed">{displayText}</p>
          )}
        </div>
      </div>
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
