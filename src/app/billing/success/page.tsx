'use client';
import { useT } from '@/i18n';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuthStore } from '@/stores/authStore';

export default function BillingSuccessPage() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const fetchBillingStatus = useAuthStore((s) => s.fetchBillingStatus);
  const t = useT();

  useEffect(() => {
    fetchBillingStatus();
  }, [fetchBillingStatus]);

  const planName = user?.plan === 'everywhere' ? 'Everywhere' : user?.plan === 'me' ? 'Me' : 'Free';

  return (
    <div className="flex min-h-screen items-center justify-center px-4 bg-bg">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="glass rounded-2xl p-8 max-w-md w-full text-center"
      >
        <div className="text-5xl mb-4">🎉</div>

        <h1 className="text-2xl font-bold text-text mb-2">
          Subscription activated!
        </h1>
        <p className="text-text-muted mb-8">
          Welcome to CAPIVAREX <span className="text-accent font-semibold">{planName}</span>.
        </p>

        <button
          onClick={() => router.push('/chat')}
          className="w-full rounded-xl bg-accent py-3 text-sm font-medium text-bg hover:bg-accent/90 transition-colors shadow-lg shadow-accent/20"
        >
          Go to Chat
        </button>
      </motion.div>
    </div>
  );
}
