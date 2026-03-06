'use client';

import { useEffect } from 'react';
import Image from 'next/image';

export default function CastReceiverPage() {
  useEffect(() => {
    /* Load CAF Receiver SDK */
    const script = document.createElement('script');
    script.src =
      'https://www.gstatic.com/cast/sdk/libs/caf_receiver/v3/cast_receiver_framework.js';
    script.async = true;
    script.onload = () => {
      const ctx = (
        window as unknown as {
          cast: {
            framework: {
              CastReceiverContext: { getInstance: () => { start: () => void } };
            };
          };
        }
      ).cast.framework.CastReceiverContext.getInstance();
      ctx.start();
    };
    document.head.appendChild(script);
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center bg-bg">
      <div className="flex flex-col items-center gap-4">
        <Image
          src="/logo-horizontal.png"
          alt="Capivarex"
          width={280}
          height={80}
          priority
          className="h-20 w-auto object-contain"
        />
        <p className="text-sm text-text-muted">Ready to cast...</p>
      </div>
    </div>
  );
}
