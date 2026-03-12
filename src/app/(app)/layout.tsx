'use client';

import AuthGuard from '@/components/auth/AuthGuard';
import TopBar from '@/components/layout/TopBar';
import BottomBar from '@/components/layout/BottomBar';
import MemoryFab from '@/components/layout/MemoryFab';

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
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
