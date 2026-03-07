'use client';

import StatCard from './StatCard';
import type { InsightStats } from '@/lib/types';

interface StatsGridProps {
  stats: InsightStats;
}

export default function StatsGrid({ stats }: StatsGridProps) {
  return (
    <div className="grid grid-cols-3 gap-3">
      <StatCard
        icon="💰"
        value={`€${stats.groceryTotal.toFixed(2)}`}
        label="Total Spent"
        trend="down"
        trendValue="-8% vs last month"
      />
      <StatCard
        icon="🛒"
        value={stats.shoppingTrips}
        label="Shopping Trips"
        trend="up"
        trendValue="+1 vs last month"
      />
      <StatCard
        icon="📊"
        value={`€${stats.avgPerTrip.toFixed(2)}`}
        label="Avg per Trip"
        trend="down"
        trendValue="-€5.30 vs last month"
      />
    </div>
  );
}
