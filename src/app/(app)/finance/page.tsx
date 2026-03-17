'use client';
import { useT } from '@/i18n';

import { useState, useEffect } from 'react';

import { TrendingUp } from 'lucide-react';
import { apiClient } from '@/lib/api';
import SubTabs from '@/components/shared/SubTabs';
import StockList from '@/components/finance/StockList';
import CryptoList from '@/components/finance/CryptoList';
import NewsFeed from '@/components/finance/NewsFeed';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import type { PortfolioResponse, StockItem, CryptoItem } from '@/lib/types';

const tabs = [
  { id: 'stocks', label: 'Stocks' },
  { id: 'crypto', label: 'Crypto (Em Breve)', disabled: true },  // Grupo 2 - Coming Soon Q3 2026
  { id: 'news', label: 'News' },
];

export default function FinancePage() {
  const t = useT();
  const [activeTab, setActiveTab] = useState('stocks');
  const [stocks, setStocks] = useState<StockItem[]>([]);
  const [crypto, setCrypto] = useState<CryptoItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await apiClient<PortfolioResponse>('/api/webapp/finance/portfolio');
        setStocks((data.stocks || []).map(s => ({ ...s, positive: s.change >= 0 })));
        setCrypto((data.crypto || []).map(c => ({ ...c, positive: c.change >= 0 })));
      } catch {
        // toast already shown
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <div
      className="px-4 py-8 animate-in fade-in"
    >
      <div className="mx-auto max-w-3xl">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
          <div className="flex items-center gap-2">
            <TrendingUp size={18} className="text-accent" />
            <h2 className="text-3xl font-semibold text-text">{t('nav.finance')}</h2>
          </div>
          <SubTabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />
        </div>

        {/* Content */}
        {activeTab === 'stocks' && <StockList stocks={stocks} />}
        {activeTab === 'crypto' && <CryptoList crypto={crypto} />}
        {activeTab === 'news' && <NewsFeed />}
      </div>
    </div>
  );
}
