'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { apiClient } from '@/lib/api';
import { createClient } from '@/lib/supabase/client';
import { useAuthStore } from '@/stores/authStore';

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
            // Validate JWT has 3 segments before calling transcribe
            const supabase = createClient();
            const { data: { session } } = await supabase.auth.getSession();
            const storeToken = useAuthStore.getState().token;
            const token = session?.access_token
              || (storeToken && storeToken !== 'undefined' && storeToken !== 'null' ? storeToken : null);

            if (!token || token.split('.').length !== 3) {
              setState('error');
              resolveRef.current?.(null);
              resolveRef.current = null;
              window.location.href = '/login';
              return;
            }

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

  // SAFETY: Stop microphone tracks if component unmounts while recording
  useEffect(() => {
    return () => {
      const mr = mediaRecorderRef.current;
      if (mr && mr.state === 'recording') {
        mr.stop();
      }
      // Stop all audio tracks to release microphone
      mr?.stream?.getTracks().forEach((t) => t.stop());
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return { state, supported, startRecording, stopRecording };
}
