'use client';

import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';
import type { PlanType } from '@/lib/types';

const PLAN_RANK: Record<PlanType, number> = { professional: 0, executive: 1 };
const PLAN_LABEL: Record<PlanType, string> = {
  professional: 'Professional',
  executive: 'Executive',
};

interface ConnectButtonProps {
  connected: boolean;
  minPlan: PlanType;
  userPlan: PlanType;
  onConnect: () => void;
  onDisconnect: () => void;
}

export default function ConnectButton({
  connected,
  minPlan,
  userPlan,
  onConnect,
  onDisconnect,
}: ConnectButtonProps) {
  const [loading, setLoading] = useState(false);
  const needsUpgrade = PLAN_RANK[userPlan] < PLAN_RANK[minPlan];

  if (needsUpgrade) {
    return (
      <Link
        href="/pricing"
        className="w-full flex items-center justify-center gap-1.5 rounded-lg bg-accent/10 px-3 py-2 text-sm font-medium text-accent hover:bg-accent/20 transition-colors"
      >
        Upgrade to {PLAN_LABEL[minPlan]}
      </Link>
    );
  }

  if (connected) {
    return (
      <button
        onClick={async () => {
          setLoading(true);
          onDisconnect();
          setLoading(false);
        }}
        disabled={loading}
        className="w-full flex items-center justify-center gap-1.5 rounded-lg glass py-2 text-sm text-text-muted hover:text-error hover:border-error/20 transition-colors disabled:opacity-50"
      >
        {loading ? <Loader2 size={12} className="animate-spin" /> : 'Disconnect'}
      </button>
    );
  }

  return (
    <button
      onClick={async () => {
        setLoading(true);
        onConnect();
        setTimeout(() => setLoading(false), 5000);
      }}
      disabled={loading}
      className="w-full flex items-center justify-center gap-1.5 rounded-lg bg-accent py-2 text-sm font-medium text-bg hover:bg-accent/90 transition-colors shadow-sm shadow-accent/10 disabled:opacity-50"
    >
      {loading ? (
        <Loader2 size={12} className="animate-spin" />
      ) : (
        'Connect'
      )}
    </button>
  );
}
