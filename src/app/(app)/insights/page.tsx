'use client';

import { motion } from 'framer-motion';
import { BarChart3 } from 'lucide-react';

export default function InsightsPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="px-4 py-8"
    >
      <div className="mx-auto max-w-3xl">
        <div className="flex items-center gap-2 mb-6">
          <BarChart3 size={18} className="text-accent" />
          <h2 className="text-lg font-semibold text-text">Insights</h2>
        </div>
        <div className="glass rounded-2xl p-8 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-accent/10 mx-auto mb-4">
            <BarChart3 size={28} className="text-accent/50" />
          </div>
          <p className="text-sm text-text-muted mb-1">
            Insights will appear here as you use Capivarex.
          </p>
          <p className="text-xs text-text-muted/60">
            Start chatting to generate personalized insights about your productivity.
          </p>
        </div>
      </div>
    </motion.div>
  );
}
