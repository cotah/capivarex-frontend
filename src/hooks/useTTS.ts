'use client';

import { useState, useRef, useCallback } from 'react';
import { apiClient } from '@/lib/api';

type TTSState = 'idle' | 'loading' | 'playing';

interface SynthesizeResponse {
  audio_base64: string;
  content_type: string;
}

interface UseTTSReturn {
  state: TTSState;
  playingId: string | null;
  play: (messageId: string, text: string) => void;
  stop: () => void;
}

export function useTTS(): UseTTSReturn {
  const [state, setState] = useState<TTSState>('idle');
  const [playingId, setPlayingId] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = '';
      audioRef.current = null;
    }
    setState('idle');
    setPlayingId(null);
  }, []);

  const play = useCallback(
    (messageId: string, text: string) => {
      // If same message is playing, stop it
      if (playingId === messageId && state === 'playing') {
        stop();
        return;
      }

      // Stop any current playback
      stop();

      setState('loading');
      setPlayingId(messageId);

      apiClient<SynthesizeResponse>('/api/webapp/voice/synthesize', {
        method: 'POST',
        body: JSON.stringify({ text }),
      })
        .then((result) => {
          const audio = new Audio(
            `data:${result.content_type};base64,${result.audio_base64}`,
          );
          audioRef.current = audio;

          audio.onplay = () => setState('playing');
          audio.onended = () => {
            setState('idle');
            setPlayingId(null);
            audioRef.current = null;
          };
          audio.onerror = () => {
            setState('idle');
            setPlayingId(null);
            audioRef.current = null;
          };

          audio.play().catch(() => {
            setState('idle');
            setPlayingId(null);
            audioRef.current = null;
          });
        })
        .catch(() => {
          setState('idle');
          setPlayingId(null);
        });
    },
    [playingId, state, stop],
  );

  return { state, playingId, play, stop };
}
