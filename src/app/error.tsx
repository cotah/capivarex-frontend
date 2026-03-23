'use client';
import { useT } from '@/i18n';
import { useEffect } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useT();
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 px-4 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-500/10">
        <AlertTriangle size={28} className="text-red-400/70" />
      </div>
      <div className="space-y-2">
        <h2 className="text-xl font-semibold text-text">{t('common.something_wrong')}</h2>
        <p className="text-sm text-text-muted max-w-xs">
          An unexpected error occurred. Please try again.
        </p>
      </div>
      <button
        onClick={reset}
        className="flex items-center gap-2 rounded-xl bg-accent/10 px-5 py-2.5 text-sm font-medium text-accent hover:bg-accent/20 transition-colors"
      >
        <RefreshCw size={14} />
        {t('common.try_again')}
      </button>
    </div>
  );
}
