'use client';

import { useEffect } from 'react';
import { AlertTriangle } from 'lucide-react';

export default function AppError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('[AppError]', error);
  }, [error]);

  return (
    <div className="flex flex-1 items-center justify-center p-8">
      <div className="glass rounded-2xl p-8 max-w-md w-full text-center space-y-4">
        <div className="flex justify-center">
          <AlertTriangle size={40} className="text-amber-500" />
        </div>
        <h2 className="text-lg font-semibold text-text">Something went wrong</h2>
        <p className="text-sm text-text-muted">
          An unexpected error occurred. Please try again.
        </p>
        <button
          onClick={reset}
          className="rounded-xl bg-accent px-6 py-2.5 text-sm font-medium text-bg hover:bg-accent/90 transition-colors"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}
