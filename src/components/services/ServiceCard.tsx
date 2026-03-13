'use client';
import { useT } from '@/i18n';

import { Circle, Lock } from 'lucide-react';
import * as Icons from 'lucide-react';
import Link from 'next/link';
import ConnectButton from './ConnectButton';
import type { ServiceDefinition, PlanType } from '@/lib/types';

const PLAN_RANK: Record<PlanType, number> = { free: 0, me: 1, everywhere: 2 };
const PLAN_LABEL: Record<PlanType, string> = {
  free: 'Free',
  me: 'Me',
  everywhere: 'Everywhere',
};

interface ServiceCardProps {
  service: ServiceDefinition;
  connected: boolean;
  status?: string;
  userPlan: PlanType;
  onConnect: () => void;
  onDisconnect: () => void;
}

function getMinPlan(service: ServiceDefinition): PlanType {
  if (service.plans.includes('free')) return 'free';
  if (service.plans.includes('me')) return 'me';
  return 'everywhere';
}

function ServiceIcon({ name }: { name: string }) {
  const iconMap = Icons as unknown as Record<string, React.ComponentType<{ size?: number; className?: string }>>;
  const LucideIcon = iconMap[name];
  if (LucideIcon) {
    return <LucideIcon size={20} className="text-accent" />;
  }
  return <span className="text-lg">{name}</span>;
}

export default function ServiceCard({
  const t = useT();
  service,
  connected,
  status,
  userPlan,
  onConnect,
  onDisconnect,
}: ServiceCardProps) {
  const minPlan = getMinPlan(service);
  const needsUpgrade = PLAN_RANK[userPlan] < PLAN_RANK[minPlan];

  // Coming Soon
  if (service.comingSoon) {
    return (
      <div className="glass rounded-2xl p-5 opacity-40 select-none">
        <div className="flex items-start justify-between mb-3">
          <ServiceIcon name={service.icon} />
          <span className="rounded-full bg-white/5 px-2 py-0.5 text-sm text-text-muted uppercase tracking-wider">
            Coming Soon
          </span>
        </div>
        <p className="text-base font-medium text-text mb-1">{service.name}</p>
        <p className="text-sm text-text-muted leading-relaxed">{service.description}</p>
      </div>
    );
  }

  // Requires upgrade
  if (needsUpgrade) {
    return (
      <div className="glass rounded-2xl p-5 opacity-60">
        <div className="flex items-start justify-between mb-3">
          <ServiceIcon name={service.icon} />
          <div className="flex items-center gap-1.5">
            <Lock size={10} className="text-text-muted" />
            <span className="text-sm text-text-muted">
              {PLAN_LABEL[minPlan]} plan
            </span>
          </div>
        </div>
        <p className="text-base font-medium text-text mb-1">{service.name}</p>
        <p className="text-sm text-text-muted leading-relaxed mb-3">{service.description}</p>
        <Link
          href="/pricing"
          className="w-full flex items-center justify-center gap-1.5 rounded-lg bg-accent/10 px-3 py-2 text-sm font-medium text-accent hover:bg-accent/20 transition-colors"
        >
          <Lock size={10} />
          Upgrade to {PLAN_LABEL[minPlan]}
        </Link>
      </div>
    );
  }

  // Available (no OAuth) — works directly in chat
  if (!service.oauth && !connected) {
    return (
      <div className="glass rounded-2xl p-5 hover:border-accent/20 hover:shadow-lg hover:shadow-accent/5 transition-all duration-200">
        <div className="flex items-start justify-between mb-3">
          <ServiceIcon name={service.icon} />
          <div className="flex items-center gap-1.5">
            <Circle size={6} className="fill-blue-400 text-blue-400" />
            <span className="text-sm text-blue-400/80">{t('services.available')}</span>
          </div>
        </div>
        <p className="text-base font-medium text-text mb-1">{service.name}</p>
        <p className="text-sm text-text-muted leading-relaxed">{service.description}</p>
      </div>
    );
  }

  // OAuth service (connected or not)
  return (
    <div
      className={`glass rounded-2xl p-5 transition-all duration-200 ${
        connected
          ? 'border-success/20'
          : 'hover:border-accent/20 hover:shadow-lg hover:shadow-accent/5'
      }`}
    >
      <div className="flex items-start justify-between mb-3">
        <ServiceIcon name={service.icon} />
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
            className={`text-sm ${
              connected ? 'text-success/80' : 'text-text-muted'
            }`}
          >
            {connected ? 'Connected' : 'Not connected'}
          </span>
        </div>
      </div>

      <p className="text-base font-medium text-text mb-1">{service.name}</p>
      <p className="text-sm text-text-muted leading-relaxed mb-1">
        {service.description}
      </p>

      {connected && status && (
        <p className="text-sm text-accent/70 mb-3">{status}</p>
      )}
      {(!status || (!connected && !status)) && <div className="mb-3" />}

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
