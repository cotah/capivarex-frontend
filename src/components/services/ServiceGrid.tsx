'use client';

import { useEffect, useCallback } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { useServicesStore } from '@/stores/servicesStore';
import ServiceCard from './ServiceCard';
import type { ServiceDefinition, PlanType } from '@/lib/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const SERVICES: ServiceDefinition[] = [
  {
    id: 'google',
    name: 'Google Calendar',
    icon: '📅',
    description: 'Manage your calendar, create events, check schedule',
    authPath: '/api/auth/google/connect',
    statusPath: '/api/auth/google/status',
    minPlan: 'me',
  },
  {
    id: 'gmail',
    name: 'Gmail',
    icon: '📧',
    description: 'Read, compose, and manage emails with AI',
    authPath: '/api/auth/google/connect',
    statusPath: '/api/auth/google/status',
    minPlan: 'me',
  },
  {
    id: 'spotify',
    name: 'Spotify',
    icon: '🎵',
    description: 'Control playback, manage playlists, discover music',
    authPath: '/api/auth/spotify/connect',
    statusPath: '/api/auth/spotify/status',
    minPlan: 'me',
  },
  {
    id: 'smartthings',
    name: 'SmartThings',
    icon: '🏠',
    description: 'Control smart home devices, lights, locks, thermostat',
    authPath: '/api/auth/smartthings/connect',
    statusPath: '/api/auth/smartthings/status',
    minPlan: 'everywhere',
  },
  {
    id: 'smartcar',
    name: 'Smartcar',
    icon: '🚗',
    description: 'Monitor your electric car: battery, location, charging',
    authPath: '/api/auth/smartcar/connect',
    statusPath: '/api/auth/smartcar/status',
    minPlan: 'everywhere',
  },
  {
    id: 'github',
    name: 'GitHub',
    icon: '🐙',
    description: 'Manage repos, create commits, push code',
    authPath: '/api/auth/github/connect',
    statusPath: '/api/auth/github/status',
    minPlan: 'me',
  },
  {
    id: 'canva',
    name: 'Canva',
    icon: '🎨',
    description: 'Create designs, posts, and social media art',
    comingSoon: true,
    minPlan: 'me',
  },
  {
    id: 'whatsapp',
    name: 'WhatsApp',
    icon: '💬',
    description: 'Use Capivarex via WhatsApp',
    comingSoon: true,
    minPlan: 'everywhere',
  },
  {
    id: 'outlook',
    name: 'Outlook',
    icon: '📧',
    description: 'Microsoft email integration',
    comingSoon: true,
    minPlan: 'me',
  },
];

async function checkServiceStatus(
  provider: string,
  userId: string,
): Promise<{ connected: boolean }> {
  try {
    const res = await fetch(
      `${API_URL}/api/auth/${provider}/status?user_id=${userId}`,
    );
    if (!res.ok) return { connected: false };
    return (await res.json()) as { connected: boolean };
  } catch {
    return { connected: false };
  }
}

export default function ServiceGrid() {
  const user = useAuthStore((s) => s.user);
  const { connections, fetchAll, updateConnection } = useServicesStore();
  const userPlan: PlanType = user?.plan || 'free';

  useEffect(() => {
    if (user?.id) {
      fetchAll(user.id);
    }
  }, [user?.id, fetchAll]);

  const getConnectionStatus = useCallback(
    (providerId: string) => {
      const googleProviders = ['google', 'gmail'];
      const lookupId = googleProviders.includes(providerId) ? 'google' : providerId;
      return connections.find((c) => c.provider === lookupId);
    },
    [connections],
  );

  const handleConnect = useCallback(
    (service: ServiceDefinition) => {
      if (!user?.id || !service.authPath) return;

      window.open(
        `${API_URL}${service.authPath}?user_id=${user.id}`,
        'oauth',
        'width=500,height=700',
      );

      const googleProviders = ['google', 'gmail'];
      const lookupId = googleProviders.includes(service.id)
        ? 'google'
        : service.id;

      const interval = setInterval(async () => {
        const status = await checkServiceStatus(lookupId, user.id);
        if (status.connected) {
          clearInterval(interval);
          updateConnection(lookupId, { connected: true });
        }
      }, 3000);

      setTimeout(() => clearInterval(interval), 120000);
    },
    [user?.id, updateConnection],
  );

  const handleDisconnect = useCallback(
    (service: ServiceDefinition) => {
      const googleProviders = ['google', 'gmail'];
      const lookupId = googleProviders.includes(service.id)
        ? 'google'
        : service.id;
      updateConnection(lookupId, { connected: false, status: undefined });
    },
    [updateConnection],
  );

  const connected = SERVICES.filter(
    (s) => !s.comingSoon && getConnectionStatus(s.id)?.connected,
  );
  const available = SERVICES.filter(
    (s) => !s.comingSoon && !getConnectionStatus(s.id)?.connected,
  );
  const comingSoon = SERVICES.filter((s) => s.comingSoon);

  return (
    <div className="space-y-8">
      {/* Connected */}
      {connected.length > 0 && (
        <section>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-success/70 mb-4">
            Connected
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {connected.map((s) => (
              <ServiceCard
                key={s.id}
                name={s.name}
                icon={s.icon}
                description={s.description}
                connected={true}
                status={getConnectionStatus(s.id)?.status}
                minPlan={s.minPlan}
                userPlan={userPlan}
                onConnect={() => handleConnect(s)}
                onDisconnect={() => handleDisconnect(s)}
              />
            ))}
          </div>
        </section>
      )}

      {/* Available */}
      {available.length > 0 && (
        <section>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-4">
            Available
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {available.map((s) => (
              <ServiceCard
                key={s.id}
                name={s.name}
                icon={s.icon}
                description={s.description}
                connected={false}
                minPlan={s.minPlan}
                userPlan={userPlan}
                onConnect={() => handleConnect(s)}
                onDisconnect={() => handleDisconnect(s)}
              />
            ))}
          </div>
        </section>
      )}

      {/* Coming Soon */}
      {comingSoon.length > 0 && (
        <section>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-text-muted/50 mb-4">
            Coming Soon
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {comingSoon.map((s) => (
              <ServiceCard
                key={s.id}
                name={s.name}
                icon={s.icon}
                description={s.description}
                connected={false}
                comingSoon={true}
                minPlan={s.minPlan}
                userPlan={userPlan}
                onConnect={() => {}}
                onDisconnect={() => {}}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
