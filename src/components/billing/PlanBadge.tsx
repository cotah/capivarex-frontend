'use client';

import type { PlanType } from '@/lib/types';

const planStyles: Record<PlanType, { label: string; className: string }> = {
  free: {
    label: 'Free',
    className: 'bg-white/5 text-text-muted border-white/10',
  },
  me: {
    label: 'Me',
    className: 'bg-accent/10 text-accent border-accent/20',
  },
  everywhere: {
    label: 'Everywhere',
    className: 'bg-accent/20 text-accent border-accent/30',
  },
};

interface PlanBadgeProps {
  plan: PlanType;
}

export default function PlanBadge({ plan }: PlanBadgeProps) {
  const style = planStyles[plan];

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider ${style.className}`}
    >
      {style.label}
    </span>
  );
}
