'use client';

import { useState, Suspense } from 'react';
import { useT } from '@/i18n';
import { useAuthStore } from '@/stores/authStore';
import dynamic from 'next/dynamic';
import SubTabs from '@/components/shared/SubTabs';
import CapivaraGrid from '@/components/capivaras/CapivaraGrid';

const AccessChannels = dynamic(() => import('@/components/services/AccessChannels'), {
  loading: () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="glass rounded-2xl p-5 animate-pulse h-32" />
      ))}
    </div>
  ),
});

const PLAN_DISPLAY: Record<string, string> = {
  ara: 'ARA Plan',
  ara_plus_1: 'ARA + 1 Plan',
  capivarex_pro: 'CAPIVAREX Pro',
  capivarex_ultimate: 'CAPIVAREX Ultimate',
  professional: 'Professional',
  executive: 'Executive',
};

export default function ServicesPage() {
  const t = useT();
  const user = useAuthStore((s) => s.user);
  const [activeTab, setActiveTab] = useState('capivaras');

  const planLabel = PLAN_DISPLAY[user?.plan || 'professional'] || user?.plan || '';

  const tabs = [
    { id: 'capivaras', label: t('capivaras.tab_capivaras') },
    { id: 'channels', label: t('capivaras.tab_channels') },
  ];

  return (
    <div className="px-4 py-8 pb-24 animate-in fade-in duration-300">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-text">
            {activeTab === 'capivaras' ? t('capivaras.page_title') : t('capivaras.channels_title')}
          </h2>
          <p className="text-sm text-text-muted mt-1">
            {activeTab === 'capivaras'
              ? t('capivaras.page_subtitle')
              : t('capivaras.channels_subtitle')}
          </p>
          {activeTab === 'capivaras' && planLabel && (
            <span className="inline-block mt-2 text-xs font-medium px-3 py-1 rounded-full bg-accent/10 text-accent border border-accent/20">
              {planLabel}
            </span>
          )}
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <SubTabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />
        </div>

        {/* Tab content */}
        {activeTab === 'capivaras' ? (
          <Suspense
            fallback={
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="glass rounded-2xl p-5 animate-pulse h-64" />
                ))}
              </div>
            }
          >
            <CapivaraGrid />
          </Suspense>
        ) : (
          <AccessChannels />
        )}
      </div>
    </div>
  );
}
