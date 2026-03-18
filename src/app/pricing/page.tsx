'use client';
import { useT } from '@/i18n';


import PricingCards from '@/components/billing/PricingCards';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function PricingPage() {
  const t = useT();
  return (
    <div className="relative z-10 min-h-screen px-4 py-12">
      <div className="mx-auto max-w-4xl">
        {/* Back link */}
        <div
          className="mb-8"
        >
          <Link
            href="/chat"
            className="inline-flex items-center gap-1.5 text-sm text-text-muted hover:text-accent transition-colors"
          >
            <ArrowLeft size={14} />
            {t('common.back')}
          </Link>
        </div>

        {/* Header */}
        <div
          className="text-center mb-10"
        >
          <h1 className="text-2xl sm:text-3xl font-bold text-text mb-2">
            Choose Your Plan
          </h1>
          <p className="text-sm text-text-muted">
            Choose the plan that fits your needs
          </p>
        </div>

        {/* Cards */}
        <div
        >
          <PricingCards />
        </div>

        {/* Footer note */}
        <p
          className="text-center text-sm text-text-muted/50 mt-8"
        >
          {t('billing.all_plans_note')}
          Cancel anytime.
        </p>
      </div>
    </div>
  );
}
