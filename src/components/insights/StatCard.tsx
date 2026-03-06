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
    <div className="glass rounded-2xl p-4">
      <span className="text-lg">{icon}</span>
      <p className="mt-2 text-2xl font-bold text-text">{value}</p>
      <p className="text-xs text-text-muted">{label}</p>
      {trend && trendValue && (
        <div className="mt-2 flex items-center gap-1">
          {trend === 'up' && (
            <TrendingUp size={12} className="text-success" />
          )}
          {trend === 'down' && (
            <TrendingDown size={12} className="text-error" />
          )}
          {trend === 'neutral' && (
            <Minus size={12} className="text-text-muted" />
          )}
          <span
            className={`text-[11px] ${
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
