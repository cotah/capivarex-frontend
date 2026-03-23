'use client';
import { useT } from '@/i18n';

import { useState, useEffect, useCallback } from 'react';

import { Brain } from 'lucide-react';
import { apiClient } from '@/lib/api';
import MemoryCard from '@/components/memory/MemoryCard';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import EmptyState from '@/components/shared/EmptyState';
import type { MemoryEntry } from '@/lib/types';

export default function MemoryPage() {
  const t = useT();
  const [memories, setMemories] = useState<MemoryEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await apiClient<{ memories: MemoryEntry[] }>(
          '/api/webapp/memory',
        );
        const entries = data.memories ?? [];
        setMemories(entries);
      } catch {
        // toast already shown
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleDelete = useCallback(
    (id: string) => setMemories((prev) => prev.filter((m) => m.id !== id)),
    [],
  );

  if (loading) return <LoadingSpinner />;

  if (memories.length === 0) {
    return (
      <EmptyState
        icon={Brain}
        title="No memories yet"
        description="Start chatting to build your memory."
      />
    );
  }

  // Group by category if present
  const categoriesObj: Record<string, MemoryEntry[]> = {};
  for (const m of memories) {
    const cat = m.category || 'general';
    if (!categoriesObj[cat]) categoriesObj[cat] = [];
    categoriesObj[cat].push(m);
  }

  const sortedCategories = Object.entries(categoriesObj).sort(([a], [b]) =>
    a.localeCompare(b),
  );

  return (
    <div
      className="px-4 py-8 animate-in fade-in"
    >
      <div className="mx-auto max-w-3xl space-y-6">
        {/* Header */}
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Brain size={18} className="text-accent" />
            <h2 className="text-3xl font-semibold text-text">{t('memory.title')}</h2>
          </div>
          <p className="text-sm text-text-muted">
            What CAPIVAREX remembers about you
          </p>
        </div>

        {/* Memory cards grouped by category */}
        {sortedCategories.map(([category, entries]: [string, MemoryEntry[]]) => (
          <section key={category}>
            {sortedCategories.length > 1 && (
              <h3 className="text-sm font-semibold uppercase tracking-wider text-accent/70 mb-3">
                {category.replace(/_/g, ' ')}
              </h3>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {entries.map((entry: MemoryEntry) => (
                <MemoryCard
                  key={entry.id}
                  memory={entry}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
