'use client';

import { useAuthStore } from '@/stores/authStore';
import { fetchCurrentUser } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

function LoadingSkeleton() {
  return (
    <div className="flex h-screen items-center justify-center bg-bg">
      <div className="flex flex-col items-center gap-4">
        <div className="h-10 w-10 rounded-full border-2 border-accent/30 border-t-accent animate-spin" />
        <p className="text-sm text-text-muted">Loading...</p>
      </div>
    </div>
  );
}

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const user = useAuthStore((s) => s.user);
  const isLoading = useAuthStore((s) => s.isLoading);
  const router = useRouter();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    async function syncSession() {
      await fetchCurrentUser();
      setChecked(true);
    }
    syncSession();
  }, []);

  useEffect(() => {
    if (checked && !isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, checked, router]);

  if (!checked || isLoading) return <LoadingSkeleton />;
  if (!user) return null;

  return <>{children}</>;
}
