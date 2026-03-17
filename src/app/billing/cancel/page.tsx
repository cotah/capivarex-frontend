'use client';
import { useT } from '@/i18n';

import { useRouter } from 'next/navigation';


export default function BillingCancelPage() {
  const router = useRouter();
  const t = useT();

  return (
    <div className="flex min-h-screen items-center justify-center px-4 bg-bg">
      <div
        className="glass rounded-2xl p-8 max-w-md w-full text-center"
      >
        <div className="text-5xl mb-4">👋</div>

        <h1 className="text-2xl font-bold text-text mb-2">
          {t('billing.no_worries')}
        </h1>
        <p className="text-text-muted mb-8">
          {t('billing.upgrade_anytime')}
        </p>

        <div className="flex flex-col gap-3">
          <button
            onClick={() => router.push('/pricing')}
            className="w-full rounded-xl bg-accent py-3 text-sm font-medium text-bg hover:bg-accent/90 transition-colors shadow-lg shadow-accent/20"
          >
            {t('billing.back_to_pricing')}
          </button>
          <button
            onClick={() => router.push('/chat')}
            className="w-full rounded-xl glass py-3 text-sm font-medium text-text-muted hover:text-text transition-colors"
          >
            {t('billing.go_to_chat')}
          </button>
        </div>
      </div>
    </div>
  );
}
