'use client';
import { useT } from '@/i18n';

import { motion } from 'framer-motion';
import PricingCards from '@/components/billing/PricingCards';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function PricingPage() {
  const t = useT();
  return (
    <div className="relative z-10 min-h-screen px-4 py-12">
      <div className="mx-auto max-w-4xl">
        {/* Back link */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-8"
        >
          <Link
            href="/chat"
            className="inline-flex items-center gap-1.5 text-sm text-text-muted hover:text-accent transition-colors"
          >
            <ArrowLeft size={14} />
            {t('common.back')}
          </Link>
        </motion.div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <h1 className="text-2xl sm:text-3xl font-bold text-text mb-2">
            Choose Your Plan
          </h1>
          <p className="text-sm text-text-muted">
            Start free, upgrade when you&apos;re ready
          </p>
        </motion.div>

        {/* Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <PricingCards />
        </motion.div>

        {/* Footer note */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-center text-sm text-text-muted/50 mt-8"
        >
          {t('billing.all_plans_note')}
          Cancel anytime.
        </motion.p>
      </div>
    </div>
  );
}
