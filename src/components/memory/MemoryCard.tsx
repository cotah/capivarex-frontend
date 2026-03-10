'use client';

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
  memoryKey: string;
  value: string;
  createdAt: string;
}

export default function MemoryCard({ memoryKey, value, createdAt }: MemoryCardProps) {
  return (
    <div className="glass rounded-xl p-4">
      <p className="text-sm font-semibold text-text mb-1">
        {memoryKey.replace(/_/g, ' ')}
      </p>
      <p className="text-sm text-text-muted leading-relaxed">{value}</p>
      <p className="text-xs text-text-muted/40 mt-2">{timeAgo(createdAt)}</p>
    </div>
  );
}
