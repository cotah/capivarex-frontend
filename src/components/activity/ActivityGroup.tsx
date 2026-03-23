'use client';

import ActivityItem from './ActivityItem';

interface Activity {
  id: string;
  icon: string;
  time: string;
  description: string;
  service: string;
  agent: string;
}

interface ActivityGroupProps {
  label: string;
  items: Activity[];
}

export default function ActivityGroup({ label, items }: ActivityGroupProps) {
  if (items.length === 0) return null;

  return (
    <section>
      <h3 className="text-sm font-semibold uppercase tracking-wider text-text-muted/60 mb-3">
        {label}
      </h3>
      <div className="space-y-2">
        {items.map((item) => (
          <ActivityItem
            key={item.id}
            icon={item.icon}
            time={item.time}
            description={item.description}
            service={item.service}
            agent={item.agent}
          />
        ))}
      </div>
    </section>
  );
}
