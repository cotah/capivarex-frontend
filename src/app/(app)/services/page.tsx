'use client';
import { useT } from '@/i18n';
import dynamic from 'next/dynamic';

import { Zap } from 'lucide-react';

// Dynamic import — ServiceGrid is heavy (API calls + OAuth logic)
const ServiceGrid = dynamic(() => import('@/components/services/ServiceGrid'), {
  loading: () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="glass rounded-2xl p-5 animate-pulse h-24" />
      ))}
    </div>
  ),
});

export default function ServicesPage() {
  const t = useT();
  return (
    <div className="px-4 py-8 animate-in fade-in duration-300">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-1">
            <Zap size={18} className="text-accent" />
            <h2 className="text-3xl font-semibold text-text">{t('services.title')}</h2>
          </div>
          <p className="text-sm text-text-muted">
            Connect your accounts to unlock more features
          </p>
        </div>

        {/* Grid */}
        <ServiceGrid />
      </div>
    </div>
  );
}
