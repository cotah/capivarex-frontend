'use client';

import { motion } from 'framer-motion';
import { Clock } from 'lucide-react';
import ActivityFeedPage from '@/components/activity/ActivityFeedPage';

export default function ActivityPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="px-4 py-8"
    >
      <div className="mx-auto max-w-3xl">
        {/* Header */}
        <div className="flex items-center gap-2 mb-6">
          <Clock size={18} className="text-accent" />
          <h2 className="text-3xl font-semibold text-text">Activity</h2>
        </div>

        {/* Feed */}
        <ActivityFeedPage />
      </div>
    </motion.div>
  );
}
