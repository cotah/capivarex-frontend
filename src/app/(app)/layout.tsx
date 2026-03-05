'use client';

import AuthGuard from '@/components/auth/AuthGuard';
import TopBar from '@/components/layout/TopBar';

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <div className="relative z-10 flex flex-col min-h-screen">
        <TopBar />
        <div className="flex-1 pt-14 sm:pt-14">{children}</div>
      </div>
    </AuthGuard>
  );
}
