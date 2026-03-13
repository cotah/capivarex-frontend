'use client';
import { useT } from '@/i18n';

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

export default function BillingCancelPage() {
  const router = useRouter();
  const t = useT();

  return (
    <div className="flex min-h-screen items-center justify-center px-4 bg-bg">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="glass rounded-2xl p-8 max-w-md w-full text-center"
      >
        <div className="text-5xl mb-4">👋</div>

        <h1 className="text-2xl font-bold text-text mb-2">
          No worries
        </h1>
        <p className="text-text-muted mb-8">
          You can upgrade anytime from the pricing page.
        </p>

        <div className="flex flex-col gap-3">
          <button
            onClick={() => router.push('/pricing')}
            className="w-full rounded-xl bg-accent py-3 text-sm font-medium text-bg hover:bg-accent/90 transition-colors shadow-lg shadow-accent/20"
          >
            Back to Pricing
          </button>
          <button
            onClick={() => router.push('/chat')}
            className="w-full rounded-xl glass py-3 text-sm font-medium text-text-muted hover:text-text transition-colors"
          >
            Go to Chat
          </button>
        </div>
      </motion.div>
    </div>
  );
}
