'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { apiClient } from '@/lib/api';

interface QuotaData {
  used: number;
  limit: number;
}

export default function QuotaIndicator() {
  const user = useAuthStore((s) => s.user);
  const [quota, setQuota] = useState<QuotaData | null>(null);

  useEffect(() => {
    if (!user?.id) return;

    apiClient<QuotaData>('/api/webapp/quota')
      .then(setQuota)
      .catch(() => {});
  }, [user?.id]);

  if (!quota || !user) return null;

  // Unlimited for 'everywhere' plan
  if (user.plan === 'everywhere') {
    return (
      <div className="px-4 py-2 text-xs text-text-muted text-center">
        Unlimited messages
      </div>
    );
  }

  const pct = quota.limit > 0 ? Math.min((quota.used / quota.limit) * 100, 100) : 0;
  const isLow = pct >= 80;

  return (
    <div className="px-4 py-2 space-y-1">
      <div className="flex items-center justify-between text-xs text-text-muted">
        <span>{quota.used}/{quota.limit} messages</span>
        {isLow && <span className="text-amber-500">Low</span>}
      </div>
      <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${
            isLow ? 'bg-amber-500' : 'bg-accent/60'
          }`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
