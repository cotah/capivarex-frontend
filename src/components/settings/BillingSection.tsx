'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/stores/authStore';
import PlanBadge from '@/components/billing/PlanBadge';
import UsageBar from '@/components/billing/UsageBar';
import { CreditCard, RefreshCw, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { fetchQuota, type QuotaInfo } from '@/lib/api';
import { openBillingPortal } from '@/lib/stripe';
import toast from 'react-hot-toast';
import { useT } from '@/i18n';

export default function BillingSection() {
  const user = useAuthStore((s) => s.user);
  const plan = user?.plan || 'free';

  const [quota, setQuota] = useState<QuotaInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [portalLoading, setPortalLoading] = useState(false);
  const t = useT();

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetchQuota()
      .then((data) => {
        if (!cancelled) setQuota(data);
      })
      .catch(() => {
        // Fallback to user store values if API fails
        if (!cancelled && user) {
          setQuota({
            plan: user.plan,
            messages_used: user.messages_used ?? 0,
            messages_limit: user.messages_limit ?? 30,
            quota_pct: 0,
            is_unlimited: false,
            messages_remaining: (user.messages_limit ?? 30) - (user.messages_used ?? 0),
          });
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const used = quota?.messages_used ?? 0;
  const total = quota?.messages_limit ?? 30;
  const isUnlimited = quota?.is_unlimited ?? false;

  return (
    <section className="glass rounded-2xl p-5 space-y-4">
      <h3 className="flex items-center gap-2 text-base font-semibold text-text">
        <CreditCard size={16} className="text-accent" />
        {t('billing.plan_billing')}
      </h3>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-base text-text">{t('billing.current_plan')}:</span>
            <PlanBadge plan={plan} />
          </div>
          {loading && (
            <RefreshCw size={14} className="text-text-muted animate-spin" />
          )}
        </div>

        {isUnlimited ? (
          <p className="text-sm text-text-muted">
            {t('billing.unlimited')}
          </p>
        ) : (
          <UsageBar
            used={used}
            total={total}
            label={`Messages today (${quota?.messages_remaining ?? total - used} remaining)`}
          />
        )}

        <div className="flex flex-col sm:flex-row gap-2 pt-2">
          {plan !== 'everywhere' && (
            <Link
              href="/pricing"
              className="flex-1 flex items-center justify-center rounded-xl bg-accent py-2 text-base font-medium text-bg hover:bg-accent/90 transition-colors"
            >
              {plan === 'free' ? t('billing.upgrade_plan') : t('billing.upgrade_everywhere')}
            </Link>
          )}
          {plan !== 'free' && (
            <button
              onClick={async () => {
                setPortalLoading(true);
                try {
                  await openBillingPortal();
                } catch {
                  toast.error(t('billing.portal_error'));
                  setPortalLoading(false);
                }
              }}
              disabled={portalLoading}
              className="flex-1 flex items-center justify-center gap-1.5 rounded-xl glass py-2 text-base text-text-muted hover:text-text transition-colors disabled:opacity-50"
            >
              {portalLoading ? (
                <RefreshCw size={14} className="animate-spin" />
              ) : (
                <ExternalLink size={14} />
              )}
              {t('billing.manage_subscription')}
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
