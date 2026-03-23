'use client';

import * as Sentry from '@sentry/nextjs';
import { useEffect } from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html>
      <body>
        <div style={{ display: 'flex', minHeight: '100vh', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 32, textAlign: 'center', background: '#0a0a0f', color: '#e5e5e5' }}>
          <p style={{ fontSize: 48, fontWeight: 700, opacity: 0.2, marginBottom: 16 }}>!</p>
          <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 8 }}>Something went wrong</h2>
          <p style={{ fontSize: 14, opacity: 0.6, marginBottom: 24 }}>An unexpected error occurred. Please try again.</p>
          <button
            onClick={reset}
            style={{ padding: '10px 24px', borderRadius: 12, border: 'none', background: 'rgba(212,175,55,0.15)', color: '#d4af37', fontSize: 14, fontWeight: 500, cursor: 'pointer' }}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
