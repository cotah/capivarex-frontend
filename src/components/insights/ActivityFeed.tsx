'use client';

import { useState } from 'react';
import type { ActivityItem } from '@/lib/types';

interface ActivityFeedProps {
  activities: ActivityItem[];
}

export default function ActivityFeed({ activities }: ActivityFeedProps) {
  const [showAll, setShowAll] = useState(false);
  const visible = showAll ? activities : activities.slice(0, 5);

  return (
    <section className="glass rounded-2xl p-5">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-4">
        Recent Activity
      </h3>
      <div className="space-y-0 max-h-80 overflow-y-auto">
        {visible.map((item, i) => (
          <div key={i}>
            {i > 0 && <div className="my-2.5 border-t border-white/5" />}
            <div className="flex items-start gap-3">
              <span className="text-sm mt-0.5">{item.icon}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-text leading-snug">{item.text}</p>
                <p className="text-[11px] text-text-muted mt-0.5">
                  {item.time}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {activities.length > 5 && !showAll && (
        <button
          onClick={() => setShowAll(true)}
          className="mt-3 w-full rounded-lg glass py-2 text-xs text-text-muted hover:text-accent transition-colors"
        >
          Show more ({activities.length - 5} more)
        </button>
      )}
    </section>
  );
}
