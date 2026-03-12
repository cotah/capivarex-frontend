'use client';

import { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';
import { apiClient } from '@/lib/api';
import ActivityGroup from './ActivityGroup';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import EmptyState from '@/components/shared/EmptyState';
import type { ActivityEntry } from '@/lib/types';

const GROUP_LABELS: Record<string, string> = {
  today: 'Today',
  yesterday: 'Yesterday',
  this_week: 'This Week',
};

/** Derive date group key and display time from ISO 8601 timestamp */
function normalizeEntry(entry: ActivityEntry): ActivityEntry {
  // Backward compatible: if time and date already exist, keep them
  if (entry.time && entry.date) return entry;
  if (!entry.timestamp) return entry;

  const parsed = new Date(entry.timestamp);
  if (isNaN(parsed.getTime())) return entry;

  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterdayStart = new Date(todayStart);
  yesterdayStart.setDate(yesterdayStart.getDate() - 1);
  const weekStart = new Date(todayStart);
  weekStart.setDate(weekStart.getDate() - 7);

  let dateGroup: string;
  if (parsed >= todayStart) {
    dateGroup = 'today';
  } else if (parsed >= yesterdayStart) {
    dateGroup = 'yesterday';
  } else if (parsed >= weekStart) {
    dateGroup = 'this_week';
  } else {
    dateGroup = 'this_week'; // fallback — still show older items
  }

  const displayTime = parsed.toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return { ...entry, date: dateGroup, time: displayTime };
}

export default function ActivityFeedPage() {
  const [activities, setActivities] = useState<ActivityEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const limit = 30;

  useEffect(() => {
    async function load() {
      try {
        const resp = await apiClient<{ activities: ActivityEntry[]; has_more?: boolean }>(
          `/api/webapp/activity?limit=${limit}`,
        );
        const items = (resp.activities || []).map(normalizeEntry);
        setActivities(items);
        setHasMore(resp.has_more ?? items.length >= limit);
      } catch {
        // toast already shown
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const loadMore = async () => {
    const newOffset = offset + limit;
    try {
      const resp = await apiClient<{ activities: ActivityEntry[]; has_more?: boolean }>(
        `/api/webapp/activity?limit=${limit}&offset=${newOffset}`,
      );
      const items = (resp.activities || []).map(normalizeEntry);
      setActivities((prev) => [...prev, ...items]);
      setOffset(newOffset);
      setHasMore(resp.has_more ?? items.length >= limit);
    } catch {
      // toast already shown
    }
  };

  if (loading) return <LoadingSpinner />;

  if (activities.length === 0) {
    return (
      <EmptyState
        icon={Clock}
        title="No activity yet"
        description="Your activity history will appear here as you use CAPIVAREX."
      />
    );
  }

  const groups = ['today', 'yesterday', 'this_week']
    .map((key) => ({
      label: GROUP_LABELS[key],
      items: activities.filter((a) => a.date === key),
    }))
    .filter((g) => g.items.length > 0);

  return (
    <div className="space-y-6">
      {groups.map((group) => (
        <ActivityGroup key={group.label} label={group.label} items={group.items} />
      ))}

      {hasMore && (
        <button
          onClick={loadMore}
          className="w-full rounded-xl glass px-4 py-3 text-sm font-medium text-text-muted hover:text-text hover:bg-white/5 transition-colors"
        >
          Load more
        </button>
      )}
    </div>
  );
}
