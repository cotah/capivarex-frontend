'use client';

import { TrendingUp, TrendingDown } from 'lucide-react';

interface CryptoRowProps {
  symbol: string;
  name: string;
  price: number;
  change: number;
  positive: boolean;
}

export default function CryptoRow({ symbol, name, price, change, positive }: CryptoRowProps) {
  return (
    <div className="flex items-center justify-between px-4 py-3 border-b border-white/5 last:border-none">
      <div className="flex items-center gap-3 min-w-0">
        <span className="text-base font-bold font-mono text-accent w-16 flex-shrink-0">
          {symbol}
        </span>
        <span className="text-sm text-text-muted truncate">{name}</span>
      </div>
      <div className="flex items-center gap-3 flex-shrink-0">
        <span className="text-base font-medium text-text font-mono">
          ${price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </span>
        <div className={`flex items-center gap-1 min-w-[70px] justify-end ${positive ? 'text-success' : 'text-error'}`}>
          {positive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
          <span className="text-sm font-medium">
            {positive ? '+' : ''}{change}%
          </span>
        </div>
      </div>
    </div>
  );
}
