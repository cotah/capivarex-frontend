'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { X, Mic, MicOff } from 'lucide-react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { useChatStore } from '@/stores/chatStore';
import { sendMessage } from '@/lib/api';
import { nanoid } from 'nanoid';

type VoiceState = 'idle' | 'listening' | 'speaking';

interface VoiceOverlayProps {
  onClose: () => void;
}

/* ── SpeechRecognition type shim ── */
type SpeechRecognitionInstance = {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onresult: ((e: { results: SpeechRecognitionResultList }) => void) | null;
  onend: (() => void) | null;
  onerror: ((e: { error: string }) => void) | null;
};

function getSpeechRecognition(): SpeechRecognitionInstance | null {
  const SR =
    (window as unknown as { SpeechRecognition?: new () => SpeechRecognitionInstance }).SpeechRecognition ||
    (window as unknown as { webkitSpeechRecognition?: new () => SpeechRecognitionInstance }).webkitSpeechRecognition;
  if (!SR) return null;
  return new SR();
}

export default function VoiceOverlay({ onClose }: VoiceOverlayProps) {
  const [voiceState, setVoiceState] = useState<VoiceState>('idle');
  const [transcript, setTranscript] = useState('');
  const [botText, setBotText] = useState('');
  const [supported, setSupported] = useState(true);
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);
  const synthRef = useRef<SpeechSynthesisUtterance | null>(null);
  const addMessage = useChatStore((s) => s.addMessage);

  const now = () =>
    new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  /* Check browser support */
  useEffect(() => {
    const sr = getSpeechRecognition();
    if (!sr) {
      setSupported(false);
      return;
    }
    sr.lang = navigator.language || 'pt-BR';
    sr.continuous = false;
    sr.interimResults = true;
    recognitionRef.current = sr;

    return () => {
      sr.abort();
      window.speechSynthesis.cancel();
    };
  }, []);

  /* Start listening */
  const startListening = useCallback(() => {
    const sr = recognitionRef.current;
    if (!sr) return;

    window.speechSynthesis.cancel();
    setTranscript('');
    setBotText('');
    setVoiceState('listening');

    sr.onresult = (e) => {
      let interim = '';
      for (let i = 0; i < e.results.length; i++) {
        interim += e.results[i][0].transcript;
      }
      setTranscript(interim);
    };

    sr.onend = () => {
      setVoiceState((prev) => (prev === 'listening' ? 'idle' : prev));
    };

    sr.onerror = (e) => {
      if (e.error !== 'aborted') {
        setVoiceState('idle');
      }
    };

    try {
      sr.start();
    } catch {
      /* already started */
    }
  }, []);

  /* Stop listening and send */
  const stopListening = useCallback(async () => {
    const sr = recognitionRef.current;
    if (sr) sr.stop();

    const finalText = transcript.trim();
    if (!finalText) {
      setVoiceState('idle');
      return;
    }

    /* Add user message to chat */
    addMessage({
      id: nanoid(),
      role: 'user',
      text: finalText,
      time: now(),
      source: 'voice',
    });

    setVoiceState('speaking');
    setBotText('Thinking...');

    try {
      const response = await sendMessage(finalText);
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
        type: response.type as 'text' | 'music' | 'calendar' | undefined,
        data: response.data as Record<string, unknown> | undefined,
        source: 'voice',
      });

      setBotText(reply);

      /* Speak the reply */
      const utterance = new SpeechSynthesisUtterance(reply);
      utterance.lang = navigator.language || 'pt-BR';
      utterance.onend = () => setVoiceState('idle');
      utterance.onerror = () => setVoiceState('idle');
      synthRef.current = utterance;
      window.speechSynthesis.speak(utterance);
    } catch {
      const errMsg = 'Sorry, something went wrong.';
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
  }, [transcript, addMessage]);

  /* Toggle mic */
  const toggleMic = () => {
    if (voiceState === 'listening') {
      stopListening();
    } else if (voiceState === 'idle') {
      startListening();
    }
    /* If speaking, do nothing — wait for bot to finish */
  };

  /* Close handler */
  const handleClose = () => {
    recognitionRef.current?.abort();
    window.speechSynthesis.cancel();
    onClose();
  };

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
                {voiceState === 'listening'
                  ? 'Listening...'
                  : voiceState === 'speaking'
                    ? 'Speaking...'
                    : 'Tap the microphone to speak'}
              </p>

              {/* Transcript / Bot response */}
              <div className="min-h-[60px] max-w-md text-center">
                {voiceState === 'listening' && transcript && (
                  <p className="text-base text-text animate-pulse">{transcript}</p>
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
              disabled={voiceState === 'speaking'}
              className={`flex h-16 w-16 items-center justify-center rounded-full transition-all duration-200 ${
                voiceState === 'listening'
                  ? 'bg-error text-white shadow-lg shadow-error/30 scale-110'
                  : voiceState === 'speaking'
                    ? 'bg-white/5 text-text-muted cursor-not-allowed'
                    : 'bg-amber-500 text-bg hover:bg-amber-400 shadow-lg shadow-amber-500/30'
              }`}
              aria-label={voiceState === 'listening' ? 'Stop listening' : 'Start listening'}
            >
              {voiceState === 'listening' ? <MicOff size={28} /> : <Mic size={28} />}
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
