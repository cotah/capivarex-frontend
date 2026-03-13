'use client';
import { useT } from '@/i18n';

import { motion } from 'framer-motion';
import { Zap } from 'lucide-react';
import ServiceGrid from '@/components/services/ServiceGrid';

export default function ServicesPage() {
  const t = useT();
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="px-4 py-8"
    >
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-1">
            <Zap size={18} className="text-accent" />
            <h2 className="text-3xl font-semibold text-text">{t('services.title')}</h2>
          </div>
          <p className="text-sm text-text-muted">
            Connect your accounts to unlock more features
          </p>
        </div>

        {/* Grid */}
        <ServiceGrid />
      </div>
    </motion.div>
  );
}
