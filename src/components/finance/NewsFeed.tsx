'use client';

import { useState, useEffect } from 'react';
import { Newspaper } from 'lucide-react';
import { apiClient } from '@/lib/api';
import NewsItem from './NewsItem';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import EmptyState from '@/components/shared/EmptyState';
import type { NewsArticle } from '@/lib/types';

export default function NewsFeed() {
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const raw = await apiClient<Record<string, unknown>[]>('/api/webapp/finance/news');
        setNews(
          raw.map((item) => ({
            id: item.id as string,
            title: item.title as string,
            source: item.source as string,
            timeAgo: (item.time_ago as string) || (item.timeAgo as string) || '',
          })),
        );
      } catch {
        // toast already shown
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) return <LoadingSpinner />;

  if (news.length === 0) {
    return (
      <EmptyState
        icon={Newspaper}
        title="No news available"
        description="Financial news will appear here when available."
      />
    );
  }

  return (
    <div className="space-y-2">
      {news.map((item) => (
        <NewsItem key={item.id} title={item.title} source={item.source} timeAgo={item.timeAgo} />
      ))}
    </div>
  );
}
