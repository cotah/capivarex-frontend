'use client';
import { useT } from '@/i18n';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';

const PLAN_DISPLAY: Record<string, string> = {
  professional: 'Professional',
  executive: 'Executive',
  ara: 'ARA',
  ara_plus_1: 'ARA + 1',
  capivarex_pro: 'CAPIVAREX Pro',
  capivarex_ultimate: 'CAPIVAREX Ultimate',
};

// Plans that require module selection after purchase
const NEEDS_MODULE_SELECTION = new Set(['ara_plus_1', 'capivarex_pro']);

export default function BillingSuccessPage() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const fetchBillingStatus = useAuthStore((s) => s.fetchBillingStatus);
  const t = useT();
  const [isPolling, setIsPolling] = useState(true);

  // Poll billing status until plan changes (Stripe webhook is async)
  useEffect(() => {
    let attempts = 0;
    const maxAttempts = 5;
    const intervalMs = 2000;
    const initialPlan = user?.plan;

    const poll = async () => {
      attempts++;
      await fetchBillingStatus();
      const currentPlan = useAuthStore.getState().user?.plan;

      if (currentPlan && currentPlan !== initialPlan) {
        setIsPolling(false);
        // Redirect to module selection if needed
        if (NEEDS_MODULE_SELECTION.has(currentPlan)) {
          router.push('/billing/select-modules');
          return;
        }
      } else if (attempts >= maxAttempts) {
        setIsPolling(false);
      }
    };

    const timer = setInterval(poll, intervalMs);
    poll(); // First call immediately

    return () => clearInterval(timer);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const planName = PLAN_DISPLAY[user?.plan || ''] || user?.plan || 'Professional';

  return (
    <div className="flex min-h-screen items-center justify-center px-4 bg-bg">
      <div className="glass rounded-2xl p-8 max-w-md w-full text-center">
        <div className="text-5xl mb-4">🎉</div>

        <h1 className="text-2xl font-bold text-text mb-2">
          {isPolling ? t('billing.processing_payment') : t('billing.subscription_activated')}
        </h1>
        <p className="text-text-muted mb-8">
          {isPolling
            ? t('billing.please_wait')
            : t('billing.welcome_plan', { plan: planName })}
        </p>

        {isPolling ? (
          <div className="flex justify-center mb-4">
            <div className="h-6 w-6 rounded-full border-2 border-accent/30 border-t-accent animate-spin" />
          </div>
        ) : (
          <button
            onClick={() => router.push('/chat')}
            className="w-full rounded-xl bg-accent py-3 text-sm font-medium text-bg hover:bg-accent/90 transition-colors shadow-lg shadow-accent/20"
          >
            {t('billing.go_to_chat')}
          </button>
        )}
      </div>
    </div>
  );
}
