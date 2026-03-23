'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import AuthGuard from '@/components/auth/AuthGuard';
import TopBar from '@/components/layout/TopBar';
import BottomBar from '@/components/layout/BottomBar';
import MemoryFab from '@/components/layout/MemoryFab';

// Lazy load — not needed on first render
const OnboardingModal = dynamic(() => import('@/components/onboarding/OnboardingModal'), {
  ssr: false,
});

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    const done = localStorage.getItem('capivarex_onboarding_done');
    if (!done) setShowOnboarding(true);
  }, []);

  return (
    <AuthGuard>
      {showOnboarding && (
        <OnboardingModal onClose={() => setShowOnboarding(false)} />
      )}
      <div className="relative z-10 flex flex-col min-h-screen">
        <TopBar />
        {/* pt-14: offset for fixed h-14 header. pb-24: offset for bottom bar on mobile */}
        <div className="flex-1 pt-14 pb-24 md:pb-0">{children}</div>
        <BottomBar />
        <MemoryFab />
      </div>
    </AuthGuard>
  );
}
