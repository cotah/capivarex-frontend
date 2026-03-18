'use client';

import type { PlanType } from '@/lib/types';

const planStyles: Record<PlanType, { label: string; className: string }> = {
  professional: {
    label: 'Professional',
    className: 'bg-accent/10 text-accent border-accent/20',
  },
  executive: {
    label: 'Executive',
    className: 'bg-accent/20 text-accent border-accent/30',
  },
};

interface PlanBadgeProps {
  plan: PlanType;
}

export default function PlanBadge({ plan }: PlanBadgeProps) {
  const style = planStyles[plan] || planStyles.professional;

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium uppercase tracking-wider ${style.className}`}
    >
      {style.label}
    </span>
  );
}
