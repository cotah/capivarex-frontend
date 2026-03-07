'use client';

interface ActivityItemProps {
  icon: string;
  time: string;
  description: string;
  service: string;
  agent: string;
}

export default function ActivityItem({ icon, time, description, service, agent }: ActivityItemProps) {
  return (
    <div className="glass rounded-xl px-4 py-3 hover:bg-white/[0.04] transition-colors duration-150">
      <div className="flex items-start gap-3">
        <span className="text-base flex-shrink-0 mt-0.5">{icon}</span>
        <div className="flex-1 min-w-0">
          <p className="text-sm text-text">{description}</p>
          <p className="text-[11px] text-text-muted mt-0.5">
            {service} · {agent}
          </p>
        </div>
        <span className="text-[11px] font-mono text-text-muted flex-shrink-0">
          {time}
        </span>
      </div>
    </div>
  );
}
