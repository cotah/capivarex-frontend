'use client';

import { motion } from 'framer-motion';
import { Zap } from 'lucide-react';
import ServiceGrid from '@/components/services/ServiceGrid';

export default function ServicesPage() {
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
            <h2 className="text-lg font-semibold text-text">Your Services</h2>
          </div>
          <p className="text-xs text-text-muted">
            Connect your accounts to unlock more features
          </p>
        </div>

        {/* Grid */}
        <ServiceGrid />
      </div>
    </motion.div>
  );
}
