'use client';

import { useAuthStore } from '@/stores/authStore';
import PlanBadge from '@/components/billing/PlanBadge';
import UsageBar from '@/components/billing/UsageBar';
import { CreditCard } from 'lucide-react';
import Link from 'next/link';

export default function BillingSection() {
  const user = useAuthStore((s) => s.user);
  const plan = user?.plan || 'free';

  const limits: Record<string, number> = {
    free: 30,
    me: 300,
    everywhere: 9999,
  };

  const mockUsed = 12;
  const total = limits[plan] || 30;

  return (
    <section className="glass rounded-2xl p-5 space-y-4">
      <h3 className="flex items-center gap-2 text-base font-semibold text-text">
        <CreditCard size={16} className="text-accent" />
        Plan & Billing
      </h3>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-base text-text">Current plan:</span>
            <PlanBadge plan={plan} />
          </div>
        </div>

        <UsageBar
          used={mockUsed}
          total={total}
          label="Messages today"
        />

        <div className="flex flex-col sm:flex-row gap-2 pt-2">
          {plan !== 'everywhere' && (
            <Link
              href="/pricing"
              className="flex-1 flex items-center justify-center rounded-xl bg-accent py-2 text-base font-medium text-bg hover:bg-accent/90 transition-colors"
            >
              {plan === 'free' ? 'Upgrade Plan' : 'Upgrade to Everywhere'}
            </Link>
          )}
          {plan !== 'free' && (
            <button className="flex-1 flex items-center justify-center rounded-xl glass py-2 text-base text-text-muted hover:text-text transition-colors">
              Manage Subscription
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
