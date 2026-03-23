'use client';

import { TrendingUp } from 'lucide-react';
import CryptoRow from './CryptoRow';
import EmptyState from '@/components/shared/EmptyState';
import type { CryptoItem } from '@/lib/types';

interface CryptoListProps {
  crypto: CryptoItem[];
}

export default function CryptoList({ crypto }: CryptoListProps) {
  if (crypto.length === 0) {
    return (
      <EmptyState
        icon={TrendingUp}
        title="No crypto in your watchlist"
        description="Ask CAPIVAREX to track your favorite cryptocurrencies."
      />
    );
  }

  return (
    <div>
      <div className="glass rounded-2xl overflow-hidden">
        {crypto.map((coin) => (
          <CryptoRow key={coin.symbol} {...coin} />
        ))}
      </div>
      <p className="text-sm text-text-muted/40 text-center mt-3 italic">
        Ask: &quot;What&apos;s the price of SOL?&quot;
      </p>
    </div>
  );
}
