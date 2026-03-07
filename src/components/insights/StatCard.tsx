'use client';

import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface StatCardProps {
  icon: string;
  value: string | number;
  label: string;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
}

export default function StatCard({
  icon,
  value,
  label,
  trend,
  trendValue,
}: StatCardProps) {
  return (
    <div className="glass rounded-2xl p-3 md:p-4 min-w-0 overflow-hidden">
      <span className="text-lg">{icon}</span>
      <p className="mt-2 text-xl md:text-3xl font-bold text-text truncate">{value}</p>
      <p className="text-xs md:text-sm text-text-muted truncate">{label}</p>
      {trend && trendValue && (
        <div className="mt-2 flex items-center gap-1">
          {trend === 'up' && (
            <TrendingUp size={12} className="text-success shrink-0" />
          )}
          {trend === 'down' && (
            <TrendingDown size={12} className="text-error shrink-0" />
          )}
          {trend === 'neutral' && (
            <Minus size={12} className="text-text-muted shrink-0" />
          )}
          <span
            className={`text-xs md:text-sm truncate ${
              trend === 'up'
                ? 'text-success'
                : trend === 'down'
                  ? 'text-error'
                  : 'text-text-muted'
            }`}
          >
            {trendValue}
          </span>
        </div>
      )}
    </div>
  );
}
