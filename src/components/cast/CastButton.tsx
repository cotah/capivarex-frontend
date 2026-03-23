'use client';

import { useState, useEffect, useCallback } from 'react';
import { Cast } from 'lucide-react';
import { initCast, requestSession } from '@/lib/cast';

interface CastButtonProps {
  className?: string;
  size?: number;
}

export default function CastButton({ className = '', size = 16 }: CastButtonProps) {
  const [available, setAvailable] = useState(false);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    /* Load Cast SDK script */
    if (typeof window === 'undefined') return;

    const existing = document.querySelector(
      'script[src*="cast_sender"]',
    );
    if (!existing) {
      const script = document.createElement('script');
      script.src =
        'https://www.gstatic.com/cv/js/sender/v1/cast_sender.js?loadCastFramework=1';
      script.async = true;
      document.head.appendChild(script);
    }

    /* Wait for Cast API to be ready */
    const onApiAvailable = (isAvailable: boolean) => {
      if (isAvailable) {
        initCast().then((receiverReady) => {
          setAvailable(receiverReady);
        });
      }
    };

    const win = window as unknown as Record<string, unknown>;
    (win['__onGCastApiAvailable'] as unknown) = onApiAvailable;

    /* If already loaded */
    if ((win['chrome'] as Record<string, unknown>)?.['cast']) {
      initCast().then((receiverReady) => setAvailable(receiverReady));
    }
  }, []);

  const handleClick = useCallback(async () => {
    const session = await requestSession();
    setConnected(!!session);
  }, []);

  if (!available) return null;

  return (
    <button
      onClick={handleClick}
      title={connected ? 'Casting...' : 'Cast to device'}
      className={`rounded-lg p-1.5 transition-colors ${
        connected
          ? 'text-accent bg-accent/10'
          : 'text-text-muted hover:text-text hover:bg-white/5'
      } ${className}`}
    >
      <Cast size={size} />
    </button>
  );
}
