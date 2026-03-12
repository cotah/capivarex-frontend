'use client';

import { TrendingUp } from 'lucide-react';
import StockRow from './StockRow';
import EmptyState from '@/components/shared/EmptyState';
import type { StockItem } from '@/lib/types';

interface StockListProps {
  stocks: StockItem[];
}

export default function StockList({ stocks }: StockListProps) {
  if (stocks.length === 0) {
    return (
      <EmptyState
        icon={TrendingUp}
        title="No stocks in your watchlist"
        description="Ask CAPIVAREX to add stocks to your watchlist."
      />
    );
  }

  return (
    <div>
      <div className="glass rounded-2xl overflow-hidden">
        {stocks.map((stock) => (
          <StockRow key={stock.symbol} {...stock} />
        ))}
      </div>
      <p className="text-sm text-text-muted/40 text-center mt-3 italic">
        Ask: &quot;Add NVDA to my watchlist&quot;
      </p>
    </div>
  );
}
