'use client';
import { useRef, useCallback, useState, useEffect } from 'react';
import { useAuthStore } from '@/stores/authStore';

const API_URL = process.env.NEXT_PUBLIC_API_URL || '';

function buildWsUrl(conversationId: string, token: string): string {
  const base = API_URL.replace(/^http/, 'ws');
  return `${base}/api/webapp/voice/ws?token=${encodeURIComponent(token)}&conversation_id=${encodeURIComponent(conversationId)}`;
}

export interface VoiceWsCallbacks {
  onTranscription: (text: string) => void;
  onResponseText: (
    text: string,
    meta: {
      type?: string;
      data?: Record<string, unknown>;
      conversation_title?: string;
    },
  ) => void;
  onResponseAudio: (audioBase64: string, contentType: string) => void;
  onError: (error: string) => void;
}

export function useVoiceWebSocket(callbacks: VoiceWsCallbacks) {
  const wsRef = useRef<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  // Stable ref — avoids WS reconnection when inline callbacks change
  const cbRef = useRef(callbacks);
  useEffect(() => {
    cbRef.current = callbacks;
  });

  const disconnect = useCallback(() => {
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    setIsConnected(false);
  }, []);

  const connect = useCallback((conversationId: string) => {
    // Close existing connection silently
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }

    const token = useAuthStore.getState().token;
    if (!token) {
      cbRef.current.onError('No auth token');
      return;
    }

    const url = buildWsUrl(conversationId, token);
    const ws = new WebSocket(url);
    wsRef.current = ws;

    // Stale-connection guard: ignore events from replaced connections
    ws.onopen = () => {
      if (wsRef.current !== ws) return;
      setIsConnected(true);
    };

    ws.onclose = () => {
      if (wsRef.current !== ws) return;
      setIsConnected(false);
      wsRef.current = null;
      cbRef.current.onError('Connection closed unexpectedly');
    };

    ws.onerror = () => {
      if (wsRef.current !== ws) return;
      cbRef.current.onError('WebSocket connection failed');
    };

    ws.onmessage = (event) => {
      if (wsRef.current !== ws) return;
      try {
        const msg = JSON.parse(event.data);
        switch (msg.type) {
          case 'transcription':
            cbRef.current.onTranscription(msg.text ?? '');
            break;
          case 'response':
            cbRef.current.onResponseText(msg.text ?? '', {
              type: msg.response_type,
              data: msg.data,
              conversation_title: msg.conversation_title,
            });
            break;
          case 'audio':
            cbRef.current.onResponseAudio(
              msg.audio_base64 ?? '',
              msg.content_type ?? 'audio/mpeg',
            );
            break;
          case 'error':
            cbRef.current.onError(msg.message ?? 'Unknown WS error');
            break;
        }
      } catch {
        cbRef.current.onError('Failed to parse server message');
      }
    };
  }, []);

  const sendAudioBlob = useCallback((blob: Blob): boolean => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(blob);
      return true;
    }
    return false;
  }, []);

  // Cleanup on unmount
  useEffect(() => disconnect, [disconnect]);

  return { connect, disconnect, sendAudioBlob, isConnected };
}
