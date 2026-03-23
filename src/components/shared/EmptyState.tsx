'use client';

import type { LucideIcon } from 'lucide-react';
import Link from 'next/link';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
}

export default function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  actionHref,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <Icon size={48} className="text-text-muted/30 mb-4" />
      <p className="text-base font-medium text-text mb-1">{title}</p>
      <p className="text-sm text-text-muted mb-4">{description}</p>
      {actionLabel && actionHref && (
        <Link
          href={actionHref}
          className="rounded-xl bg-accent px-5 py-2.5 text-base font-semibold text-bg hover:bg-accent/90 transition-colors shadow-lg shadow-accent/20"
        >
          {actionLabel}
        </Link>
      )}
    </div>
  );
}
