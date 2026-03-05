'use client';

import { Circle } from 'lucide-react';
import { ServiceInfo } from '@/lib/types';

interface ServicePillProps {
  service: ServiceInfo;
}

export default function ServicePill({ service }: ServicePillProps) {
  return (
    <div className="glass rounded-xl p-4 flex items-center gap-3 hover:bg-accent-soft transition-colors duration-200 cursor-pointer group">
      <span className="text-xl">{service.icon}</span>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-text group-hover:text-accent transition-colors">
          {service.name}
        </p>
        <p className="text-[11px] text-text-muted">{service.status}</p>
      </div>
      <Circle
        size={8}
        className={`${
          service.connected
            ? 'fill-success text-success'
            : 'fill-text-muted text-text-muted'
        }`}
      />
    </div>
  );
}
