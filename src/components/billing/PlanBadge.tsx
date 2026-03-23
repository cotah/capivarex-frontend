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
  ara: {
    label: 'ARA',
    className: 'bg-[#D4A017]/10 text-[#D4A017] border-[#D4A017]/20',
  },
  ara_plus_1: {
    label: 'ARA + 1',
    className: 'bg-[#D4A017]/15 text-[#D4A017] border-[#D4A017]/25',
  },
  capivarex_pro: {
    label: 'CAPIVAREX Pro',
    className: 'bg-accent/15 text-accent border-accent/25',
  },
  capivarex_ultimate: {
    label: 'CAPIVAREX Ultimate',
    className: 'bg-gradient-to-r from-accent/20 to-[#D4A017]/20 text-accent border-accent/30',
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
