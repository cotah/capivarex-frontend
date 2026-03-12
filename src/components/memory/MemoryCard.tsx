'use client';

import { useState } from 'react';
import { Trash2 } from 'lucide-react';
import { apiClient } from '@/lib/api';
import type { MemoryEntry } from '@/lib/types';

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString('en-IE', {
    day: 'numeric',
    month: 'short',
  });
}

interface MemoryCardProps {
  memory: MemoryEntry;
  onDelete: (id: string) => void;
}

export default function MemoryCard({ memory, onDelete }: MemoryCardProps) {
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await apiClient('/api/webapp/memory/' + memory.id, { method: 'DELETE' });
      onDelete(memory.id);
    } catch {
      // toast already shown by apiClient
      setDeleting(false);
    }
  };

  const displayDate = memory.updated_at || memory.created_at;

  return (
    <div className="group relative glass rounded-xl p-4">
      {/* Delete button — visible on hover */}
      <button
        onClick={handleDelete}
        disabled={deleting}
        className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-150 flex h-7 w-7 items-center justify-center rounded-lg text-red-400 hover:text-red-300 hover:bg-white/5 disabled:opacity-30"
        aria-label="Delete memory"
      >
        <Trash2 size={14} />
      </button>

      <p className="text-sm font-semibold text-text mb-1 pr-6">
        {memory.key.replace(/_/g, ' ')}
      </p>
      <p className="text-sm text-text-muted leading-relaxed">{memory.value}</p>
      <div className="flex items-center justify-between mt-2">
        {displayDate && (
          <p className="text-xs text-text-muted/40">{timeAgo(displayDate)}</p>
        )}
        <div className="flex items-center gap-1.5">
          {memory.source && memory.source !== 'webapp_manual' && (
            <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-white/5 text-text-muted/50 uppercase tracking-wide">
              {memory.source === 'rag_auto' ? 'auto' : memory.source}
            </span>
          )}
          {memory.confidence != null && memory.confidence < 0.7 && (
            <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-yellow-500/10 text-yellow-400/60">
              ~
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
