'use client';

import { useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';
import { CAPIVARAS } from './capivarasData';
import CapivaraCard from './CapivaraCard';

function isCapivaraActive(capivaraId: string, modules: string[]): boolean {
  if (capivaraId === 'ara') return true;
  return modules.includes(capivaraId);
}

export default function CapivaraGrid() {
  const user = useAuthStore((s) => s.user);
  const refreshUser = useAuthStore((s) => s.refreshUser);
  const searchParams = useSearchParams();
  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const userModules = user?.modules ?? ['ara'];

  // Polling after purchase: refresh every 30s when ?activated=true
  useEffect(() => {
    if (searchParams.get('activated') !== 'true') return;

    refreshUser();

    pollingRef.current = setInterval(() => {
      refreshUser();
    }, 30_000);

    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current);
    };
  }, [searchParams, refreshUser]);

  // Separate TUPA (always last) from the rest
  const nonTupa = CAPIVARAS.filter((c) => c.id !== 'tupa');
  const tupa = CAPIVARAS.find((c) => c.id === 'tupa');

  // Sort non-TUPA: ACTIVE first, LOCKED second, COMING_SOON third, DISABLED last
  const sorted = [...nonTupa].sort((a, b) => {
    const aActive = isCapivaraActive(a.id, userModules);
    const bActive = isCapivaraActive(b.id, userModules);

    if (aActive && !bActive) return -1;
    if (!aActive && bActive) return 1;

    // Both inactive — locked > coming_soon > disabled
    if (!aActive && !bActive) {
      const stateRank = (s: string) =>
        s === 'coming_soon' ? 1 : s === 'disabled' ? 2 : 0;
      return stateRank(a.status) - stateRank(b.status);
    }

    return 0;
  });

  // Append TUPA at the end
  const allCards = tupa ? [...sorted, tupa] : sorted;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {allCards.map((capivara) => (
        <CapivaraCard
          key={capivara.id}
          capivara={capivara}
          isActive={isCapivaraActive(capivara.id, userModules)}
          userPlan={user?.plan}
        />
      ))}
    </div>
  );
}
