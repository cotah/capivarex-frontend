'use client';

import StockRow from './StockRow';

const mockStocks = [
  { symbol: 'AAPL', name: 'Apple Inc.', price: 178.50, change: 2.3, positive: true },
  { symbol: 'MSFT', name: 'Microsoft Corp.', price: 412.30, change: 1.1, positive: true },
  { symbol: 'TSLA', name: 'Tesla Inc.', price: 248.70, change: -0.8, positive: false },
  { symbol: 'GOOGL', name: 'Alphabet Inc.', price: 154.20, change: 0.5, positive: true },
  { symbol: 'AMZN', name: 'Amazon.com', price: 185.60, change: -1.2, positive: false },
  { symbol: 'NVDA', name: 'NVIDIA Corp.', price: 892.40, change: 3.7, positive: true },
  { symbol: 'META', name: 'Meta Platforms', price: 498.30, change: 1.8, positive: true },
];

export default function StockList() {
  return (
    <div>
      <div className="glass rounded-2xl overflow-hidden">
        {mockStocks.map((stock) => (
          <StockRow key={stock.symbol} {...stock} />
        ))}
      </div>
      <p className="text-[11px] text-text-muted/40 text-center mt-3 italic">
        Ask: &quot;Add NVDA to my watchlist&quot;
      </p>
    </div>
  );
}
