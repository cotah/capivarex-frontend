'use client';

import { Circle } from 'lucide-react';
import ConnectButton from './ConnectButton';
import type { PlanType } from '@/lib/types';

interface ServiceCardProps {
  name: string;
  icon: string;
  description: string;
  connected: boolean;
  status?: string;
  comingSoon?: boolean;
  minPlan: PlanType;
  userPlan: PlanType;
  onConnect: () => void;
  onDisconnect: () => void;
}

export default function ServiceCard({
  name,
  icon,
  description,
  connected,
  status,
  comingSoon,
  minPlan,
  userPlan,
  onConnect,
  onDisconnect,
}: ServiceCardProps) {
  if (comingSoon) {
    return (
      <div className="glass rounded-2xl p-5 opacity-40 select-none">
        <div className="flex items-start justify-between mb-3">
          <span className="text-2xl">{icon}</span>
          <span className="rounded-full bg-white/5 px-2 py-0.5 text-[10px] text-text-muted uppercase tracking-wider">
            Coming Soon
          </span>
        </div>
        <p className="text-sm font-medium text-text mb-1">{name}</p>
        <p className="text-xs text-text-muted leading-relaxed">{description}</p>
      </div>
    );
  }

  return (
    <div
      className={`glass rounded-2xl p-5 transition-all duration-200 ${
        connected
          ? 'border-success/20'
          : 'hover:border-accent/20 hover:shadow-lg hover:shadow-accent/5'
      }`}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <span className="text-2xl">{icon}</span>
        <div className="flex items-center gap-1.5">
          <Circle
            size={6}
            className={
              connected
                ? 'fill-success text-success'
                : 'fill-text-muted text-text-muted'
            }
          />
          <span
            className={`text-[11px] ${
              connected ? 'text-success/80' : 'text-text-muted'
            }`}
          >
            {connected ? 'Connected' : 'Not connected'}
          </span>
        </div>
      </div>

      {/* Info */}
      <p className="text-sm font-medium text-text mb-1">{name}</p>
      <p className="text-xs text-text-muted leading-relaxed mb-1">
        {description}
      </p>

      {/* Status line */}
      {connected && status && (
        <p className="text-[11px] text-accent/70 mb-3">{status}</p>
      )}
      {!connected && !status && <div className="mb-3" />}
      {connected && !status && <div className="mb-3" />}

      {/* Action */}
      <ConnectButton
        connected={connected}
        minPlan={minPlan}
        userPlan={userPlan}
        onConnect={onConnect}
        onDisconnect={onDisconnect}
      />
    </div>
  );
}
