'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp } from 'lucide-react';
import SubTabs from '@/components/shared/SubTabs';
import StockList from '@/components/finance/StockList';
import CryptoList from '@/components/finance/CryptoList';
import NewsFeed from '@/components/finance/NewsFeed';

const tabs = [
  { id: 'stocks', label: 'Stocks' },
  { id: 'crypto', label: 'Crypto' },
  { id: 'news', label: 'News' },
];

export default function FinancePage() {
  const [activeTab, setActiveTab] = useState('stocks');

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="px-4 py-8"
    >
      <div className="mx-auto max-w-3xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <TrendingUp size={18} className="text-accent" />
            <h2 className="text-3xl font-semibold text-text">Finance</h2>
          </div>
          <SubTabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />
        </div>

        {/* Content */}
        {activeTab === 'stocks' && <StockList />}
        {activeTab === 'crypto' && <CryptoList />}
        {activeTab === 'news' && <NewsFeed />}
      </div>
    </motion.div>
  );
}
