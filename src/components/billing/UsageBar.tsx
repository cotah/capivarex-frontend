'use client';

interface UsageBarProps {
  used: number;
  total: number;
  label?: string;
}

export default function UsageBar({ used, total, label }: UsageBarProps) {
  const percentage = total > 0 ? Math.min((used / total) * 100, 100) : 0;
  const isHigh = percentage > 80;

  return (
    <div className="space-y-1.5">
      {label && (
        <div className="flex items-center justify-between">
          <span className="text-sm text-text-muted">{label}</span>
          <span className="text-sm text-text-muted">
            {used}/{total}
          </span>
        </div>
      )}
      <div className="h-1.5 rounded-full bg-white/5">
        <div
          className={`h-full rounded-full transition-all duration-500 ${
            isHigh ? 'bg-error/70' : 'bg-accent/50'
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      <p className="text-sm text-text-muted/60 text-right">
        {Math.round(percentage)}% used
      </p>
    </div>
  );
}
