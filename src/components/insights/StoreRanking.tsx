'use client';

import type { StoreSpending } from '@/lib/types';

interface StoreRankingProps {
  stores: StoreSpending[];
}

export default function StoreRanking({ stores }: StoreRankingProps) {
  return (
    <section className="glass rounded-2xl p-5">
      <h3 className="text-sm font-semibold uppercase tracking-wider text-text-muted mb-4">
        Top Stores
      </h3>
      <div className="space-y-3">
        {stores.map((store, i) => (
          <div key={store.name} className="flex items-center gap-3">
            <span className="w-5 text-sm text-text-muted font-mono">
              {i + 1}.
            </span>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <span className="text-base text-text truncate">{store.name}</span>
                <span className="text-sm text-text-muted font-mono ml-2">
                  €{store.total.toFixed(2)}
                </span>
              </div>
              <div className="h-1.5 rounded-full bg-white/5">
                <div
                  className="h-full rounded-full bg-accent/50 transition-all duration-700"
                  style={{ width: `${store.percentage}%` }}
                />
              </div>
            </div>
            <span className="text-sm text-text-muted w-8 text-right font-mono">
              {store.percentage}%
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
