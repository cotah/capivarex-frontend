'use client';

import { useState, useRef, useCallback } from 'react';
import { apiClient } from '@/lib/api';

type RecorderState = 'idle' | 'recording' | 'transcribing' | 'error';

const MAX_RECORDING_MS = 30_000; // 30s auto-stop

interface TranscribeResponse {
  text: string;
  language?: string;
  model?: string;
}

interface UseVoiceRecorderReturn {
  state: RecorderState;
  supported: boolean;
  startRecording: () => void;
  stopRecording: () => Promise<string | null>;
}

export function useVoiceRecorder(): UseVoiceRecorderReturn {
  const [state, setState] = useState<RecorderState>('idle');
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const resolveRef = useRef<((text: string | null) => void) | null>(null);

  const supported = typeof window !== 'undefined' && typeof MediaRecorder !== 'undefined';

  const startRecording = useCallback(() => {
    if (!supported) {
      setState('error');
      return;
    }

    setState('recording');
    chunksRef.current = [];

    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        const mimeType = MediaRecorder.isTypeSupported('audio/webm')
          ? 'audio/webm'
          : 'audio/mp4';
        const mr = new MediaRecorder(stream, { mimeType });
        mediaRecorderRef.current = mr;

        mr.ondataavailable = (e) => {
          if (e.data.size > 0) chunksRef.current.push(e.data);
        };

        mr.onstop = async () => {
          stream.getTracks().forEach((t) => t.stop());

          if (chunksRef.current.length === 0) {
            setState('idle');
            resolveRef.current?.(null);
            resolveRef.current = null;
            return;
          }

          setState('transcribing');
          const blob = new Blob(chunksRef.current, { type: mr.mimeType });
          chunksRef.current = [];

          try {
            const formData = new FormData();
            const ext = mr.mimeType.includes('webm') ? 'webm' : 'mp4';
            formData.append('audio', blob, `recording.${ext}`);

            const result = await apiClient<TranscribeResponse>(
              '/api/webapp/voice/transcribe',
              {
                method: 'POST',
                body: formData,
              },
            );

            setState('idle');
            resolveRef.current?.(result.text || null);
          } catch {
            setState('error');
            resolveRef.current?.(null);
            // Reset to idle after brief delay
            setTimeout(() => setState('idle'), 2000);
          } finally {
            resolveRef.current = null;
          }
        };

        mr.start();

        // Auto-stop after 30s
        timeoutRef.current = setTimeout(() => {
          if (mr.state === 'recording') {
            mr.stop();
          }
        }, MAX_RECORDING_MS);
      })
      .catch(() => {
        setState('error');
        setTimeout(() => setState('idle'), 2000);
      });
  }, [supported]);

  const stopRecording = useCallback((): Promise<string | null> => {
    return new Promise((resolve) => {
      const mr = mediaRecorderRef.current;
      if (!mr || mr.state !== 'recording') {
        resolve(null);
        return;
      }

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }

      resolveRef.current = resolve;
      mr.stop();
    });
  }, []);

  return { state, supported, startRecording, stopRecording };
}
