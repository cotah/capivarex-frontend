'use client';

import AuthGuard from '@/components/auth/AuthGuard';
import TopBar from '@/components/layout/TopBar';
import BottomBar from '@/components/layout/BottomBar';

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <div className="relative z-10 flex flex-col min-h-screen">
        <TopBar />
        {/* pt: offset for fixed header (mobile thin, desktop tall with large logo) */}
        {/* pb-24: offset for bottom bar on mobile, pb-0 on desktop */}
        <div className="flex-1 pt-16 md:pt-48 pb-24 md:pb-0">{children}</div>
        <BottomBar />
      </div>
    </AuthGuard>
  );
}
