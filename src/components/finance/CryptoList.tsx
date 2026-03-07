'use client';

import CryptoRow from './CryptoRow';

const mockCrypto = [
  { symbol: 'BTC', name: 'Bitcoin', price: 67450, change: 3.2, positive: true },
  { symbol: 'ETH', name: 'Ethereum', price: 3280, change: 1.5, positive: true },
  { symbol: 'SOL', name: 'Solana', price: 142.50, change: -2.1, positive: false },
  { symbol: 'ADA', name: 'Cardano', price: 0.62, change: 4.1, positive: true },
  { symbol: 'DOGE', name: 'Dogecoin', price: 0.158, change: -0.3, positive: false },
  { symbol: 'DOT', name: 'Polkadot', price: 7.85, change: 2.8, positive: true },
];

export default function CryptoList() {
  return (
    <div>
      <div className="glass rounded-2xl overflow-hidden">
        {mockCrypto.map((coin) => (
          <CryptoRow key={coin.symbol} {...coin} />
        ))}
      </div>
      <p className="text-[11px] text-text-muted/40 text-center mt-3 italic">
        Ask: &quot;What&apos;s the price of SOL?&quot;
      </p>
    </div>
  );
}
