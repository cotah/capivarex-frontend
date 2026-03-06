'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, ChevronDown } from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';
import StatsGrid from '@/components/insights/StatsGrid';
import SpendingChart from '@/components/insights/SpendingChart';
import StoreRanking from '@/components/insights/StoreRanking';
import ActivityFeed from '@/components/insights/ActivityFeed';
import {
  fetchInsightStats,
  fetchGrocerySpending,
  fetchStoreRanking,
  fetchActivityFeed,
} from '@/lib/insights';
import type {
  InsightStats,
  MonthlySpending,
  StoreSpending,
  ActivityItem,
} from '@/lib/types';

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

function getCurrentMonth(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  return `${y}-${m}`;
}

function getMonthLabel(month: string): string {
  const [, m] = month.split('-');
  return MONTHS[parseInt(m, 10) - 1] || month;
}

export default function InsightsPage() {
  const user = useAuthStore((s) => s.user);
  const [month, setMonth] = useState(getCurrentMonth());
  const [showPicker, setShowPicker] = useState(false);

  const [stats, setStats] = useState<InsightStats | null>(null);
  const [spending, setSpending] = useState<MonthlySpending[]>([]);
  const [stores, setStores] = useState<StoreSpending[]>([]);
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const userId = user?.id || 'demo-user';
      setLoading(true);
      const [s, sp, st, a] = await Promise.all([
        fetchInsightStats(userId, month),
        fetchGrocerySpending(userId),
        fetchStoreRanking(userId, month),
        fetchActivityFeed(userId),
      ]);
      setStats(s);
      setSpending(sp);
      setStores(st);
      setActivities(a);
      setLoading(false);
    }
    load();
  }, [user?.id, month]);

  const availableMonths: string[] = [];
  const now = new Date();
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    availableMonths.push(`${y}-${m}`);
  }

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 rounded-full border-2 border-accent/30 border-t-accent animate-spin" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="px-4 py-8"
    >
      <div className="mx-auto max-w-4xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BarChart3 size={18} className="text-accent" />
            <h2 className="text-lg font-semibold text-text">Your Insights</h2>
          </div>

          {/* Month picker */}
          <div className="relative">
            <button
              onClick={() => setShowPicker(!showPicker)}
              className="flex items-center gap-1.5 rounded-lg glass px-3 py-1.5 text-xs text-text-muted hover:text-text transition-colors"
            >
              {getMonthLabel(month)}
              <ChevronDown size={14} />
            </button>
            {showPicker && (
              <div className="absolute right-0 top-full mt-1 z-50 glass-strong rounded-xl py-1 min-w-[140px] shadow-xl">
                {availableMonths.map((m) => (
                  <button
                    key={m}
                    onClick={() => {
                      setMonth(m);
                      setShowPicker(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 text-xs transition-colors ${
                      m === month
                        ? 'text-accent bg-accent-soft'
                        : 'text-text-muted hover:text-text hover:bg-white/5'
                    }`}
                  >
                    {getMonthLabel(m)}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Stats */}
        {stats && <StatsGrid stats={stats} />}

        {/* Charts row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <SpendingChart data={spending} />
          <StoreRanking stores={stores} />
        </div>

        {/* Activity */}
        <ActivityFeed activities={activities} />
      </div>
    </motion.div>
  );
}
