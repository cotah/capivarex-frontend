'use client';

interface NewsItemProps {
  title: string;
  source: string;
  timeAgo: string;
}

export default function NewsItem({ title, source, timeAgo }: NewsItemProps) {
  return (
    <div className="glass rounded-xl px-4 py-3 hover:border-accent/20 hover:shadow-lg hover:shadow-accent/5 transition-all duration-200 cursor-pointer">
      <div className="flex items-start gap-3">
        <span className="text-base flex-shrink-0 mt-0.5">📰</span>
        <div className="min-w-0">
          <p className="text-base font-medium text-text truncate">{title}</p>
          <p className="text-sm text-text-muted mt-0.5">
            {source} · {timeAgo}
          </p>
        </div>
      </div>
    </div>
  );
}
