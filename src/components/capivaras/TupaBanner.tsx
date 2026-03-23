'use client';

import { useT } from '@/i18n';

export default function TupaBanner() {
  const t = useT();

  return (
    <div className="relative overflow-hidden rounded-2xl border border-red-900/30 bg-black/70 p-6">
      {/* Subtle red glow */}
      <div className="absolute -top-20 -right-20 h-40 w-40 rounded-full bg-red-900/10 blur-3xl" />
      <div className="absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-red-900/5 blur-2xl" />

      <div className="relative flex items-start gap-4">
        {/* Pulsing red dot */}
        <div className="mt-1 flex-shrink-0">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-50" />
            <span className="relative inline-flex h-3 w-3 rounded-full bg-red-600" />
          </span>
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="text-base font-bold text-white mb-1">
            {t('capivaras.tupa_title')}
          </h3>
          <p className="text-sm text-white/50 mb-3 italic">
            {t('capivaras.tupa_description')}
          </p>
          <span className="inline-flex items-center gap-1.5 text-[11px] font-medium px-3 py-1 rounded-full bg-red-900/20 text-red-400/80 border border-red-900/30">
            {t('capivaras.tupa_badge')}
          </span>
        </div>
      </div>
    </div>
  );
}
