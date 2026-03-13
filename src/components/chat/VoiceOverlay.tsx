// v4 — WebSocket voice pipeline (latência ~500ms vs ~3s HTTP)
'use client';
import { useState, useRef, useCallback, useEffect } from 'react';
import { X } from 'lucide-react';
import Image from 'next/image';
import { useChatStore } from '@/stores/chatStore';
import { useConversationStore } from '@/stores/conversationStore';
import { nanoid } from 'nanoid';
import type { MessageType } from '@/lib/types';
import { useVoiceWebSocket } from '@/hooks/useVoiceWebSocket';
import { useT } from '@/i18n';

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
  const t = useT();
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

  /* ── WebSocket voice pipeline ── */
  const lastReplyRef = useRef('');
  const skipWsRef = useRef(false);

  const { connect, disconnect, sendAudioBlob, isConnected } = useVoiceWebSocket({
    onTranscription: (text) => {
      if (isClosingRef.current) return;
      const norm = text.toLowerCase().replace(/[!?,]/g, '').trim();
      if (!text || WHISPER_HALLUCINATIONS.has(norm)) {
        skipWsRef.current = true;
        startListeningRef.current?.();
        return;
      }
      skipWsRef.current = false;
      addMessage({ id: nanoid(), role: 'user', text, time: now(), source: 'voice' });
      setProgressLabel('Respondendo...');
    },
    onResponseText: (text, meta) => {
      if (isClosingRef.current || skipWsRef.current) return;
      if (!text) {
        startListeningRef.current?.();
        return;
      }
      lastReplyRef.current = text;
      addMessage({
        id: nanoid(),
        role: 'assistant',
        text,
        time: now(),
        type: meta.type as MessageType | undefined,
        data: meta.data,
        source: 'voice',
      });
      const convId = useConversationStore.getState().activeConversationId;
      if (convId) {
        useConversationStore.getState().addMessageToConversation(convId, {
          id: nanoid(), role: 'assistant', text, time: now(),
        });
      }
      if (meta.conversation_title && convId) {
        useConversationStore.getState().renameConversation(convId, meta.conversation_title);
      }
      setVoiceState('speaking');
      setProgressLabel('');
    },
    onResponseAudio: (audioBase64, contentType) => {
      if (isClosingRef.current || skipWsRef.current) {
        skipWsRef.current = false;
        return;
      }
      const reply = lastReplyRef.current;
      if (audioBase64) {
        const audio = audioElRef.current ?? new Audio();
        audioElRef.current = audio;
        isBotSpeakingRef.current = true;
        audio.src = `data:${contentType};base64,${audioBase64}`;
        audio.onended = () => {
          isBotSpeakingRef.current = false;
          if (!isClosingRef.current) {
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
      } else {
        startTypewriter(reply);
        if (!isClosingRef.current) startListeningRef.current?.();
      }
    },
    onError: (error) => {
      console.error('[Voice] WS error:', error);
      if (!isClosingRef.current) startListeningRef.current?.();
    },
  });

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

  /* ── Stop recording → send blob via WS ── */
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

    setProgressLabel('Transcrevendo...');
    if (!sendAudioBlob(blob)) {
      if (!isClosingRef.current) startListeningRef.current?.();
    }
  }, [sendAudioBlob]);

  startListeningRef.current = startListening;
  stopAndProcessRef.current = stopAndProcess;

  /* ── Close handler ── */
  const handleClose = useCallback(() => {
    isClosingRef.current = true;
    disconnect();
    cleanup();
    onClose();
  }, [disconnect, cleanup, onClose]);

  /* ── Start listening only when WS is connected ── */
  useEffect(() => {
    if (isConnected && !isClosingRef.current && !isBotSpeakingRef.current) {
      const timer = setTimeout(() => {
        if (!isClosingRef.current) startListeningRef.current?.();
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [isConnected]);

  /* ── Single mount effect: create conversation → connect WS ── */
  useEffect(() => {
    isClosingRef.current = false;
    isBotSpeakingRef.current = false;

    // iOS: unlock audio element inside user gesture (mount = click)
    const el = new Audio();
    el.load();
    audioElRef.current = el;

    // Sequential init: get/create conversation, then connect WS
    (async () => {
      try {
        const store = useConversationStore.getState();
        let convId = store.activeConversationId;
        if (!convId) {
          convId = await store.createConversation();
        }
        if (convId && !isClosingRef.current) {
          connect(convId);
        }
      } catch {
        // conversation creation failed — WS won't connect
      }
    })();

    return () => {
      isClosingRef.current = true;
      disconnect();
      cleanup();
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="fixed inset-0 z-[60] flex flex-col bg-bg">
      <div className="flex h-14 items-center justify-between px-6 border-b border-glass-border shrink-0">
        <span className="text-base font-semibold text-text">{t('voice.title')}</span>
        <button
          onClick={handleClose}
          disabled={voiceState === 'processing'}
          className={`flex h-8 w-8 items-center justify-center rounded-lg text-text-muted hover:text-text hover:bg-white/5 transition-colors ${voiceState === 'processing' ? 'opacity-30 cursor-not-allowed' : ''}`}
          aria-label={t('voice.close')}
        >
          <X size={20} />
        </button>
      </div>
      <div className="flex flex-1 flex-col items-center px-6 pt-8 min-h-0">
        <div className={`w-[150px] h-[150px] shrink-0 ${voiceState === 'listening' ? 'animate-pulse' : ''}`}>
          <Image
            src="/capivara-smart.png"
            alt="CAPIVAREX Voice"
            width={150}
            height={150}
            className="w-full h-full object-contain"
          />
        </div>
        <p className="text-sm text-text-muted mt-4 shrink-0">
          {voiceState === 'init'
            ? t('voice.preparing')
            : voiceState === 'listening'
              ? t('voice.listening')
              : voiceState === 'processing'
                ? t('voice.processing')
                : t('voice.speaking')}
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
          aria-label={t('voice.end_conversation')}
        >
          <X size={28} />
        </button>
      </div>
    </div>
  );
}
