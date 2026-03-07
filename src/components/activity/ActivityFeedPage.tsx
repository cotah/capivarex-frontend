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
        const items = resp.activities || [];
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
      const items = resp.activities || [];
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
        description="Your activity history will appear here as you use Capivarex."
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
