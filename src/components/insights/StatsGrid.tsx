'use client';

import StatCard from './StatCard';
import type { InsightStats } from '@/lib/types';

interface StatsGridProps {
  stats: InsightStats;
}

export default function StatsGrid({ stats }: StatsGridProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      <StatCard
        icon="📊"
        value={stats.messages}
        label="Messages this mo"
        trend="up"
        trendValue="+12% vs last month"
      />
      <StatCard
        icon="🛒"
        value={`€${stats.groceryTotal.toFixed(2)}`}
        label="Grocery this mo"
        trend="down"
        trendValue="-8% vs last month"
      />
      <StatCard
        icon="🎵"
        value={stats.songsPlayed}
        label="Songs played"
        trend="up"
        trendValue="+5% vs last month"
      />
      <StatCard
        icon="📅"
        value={stats.events}
        label="Events this mo"
        trend="neutral"
        trendValue="Same as last month"
      />
    </div>
  );
}
