'use client';

import { useEffect, useCallback } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { useServicesStore } from '@/stores/servicesStore';
import ServiceCard from './ServiceCard';
import type { ServiceDefinition, PlanType } from '@/lib/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const ALL_SERVICES: ServiceDefinition[] = [
  // ── Communication ──
  { id: 'chat', name: 'AI Chat', icon: 'MessageSquare', description: 'Intelligent conversation with context', category: 'Communication', plans: ['free', 'me', 'everywhere'] },
  { id: 'voice', name: 'Voice Assistant', icon: 'Mic', description: 'Voice input and text-to-speech', category: 'Communication', plans: ['me', 'everywhere'] },
  { id: 'twilio', name: 'Phone Calls', icon: 'Phone', description: 'Make and receive phone calls', category: 'Communication', plans: ['me', 'everywhere'] },
  { id: 'email', name: 'Gmail', icon: 'Mail', description: 'Read, compose, and manage emails', category: 'Communication', plans: ['me', 'everywhere'], oauth: 'google' },

  // ── Productivity ──
  { id: 'calendar', name: 'Google Calendar', icon: 'Calendar', description: 'Manage events and schedule', category: 'Productivity', plans: ['me', 'everywhere'], oauth: 'google' },
  { id: 'notes', name: 'Notes', icon: 'StickyNote', description: 'Create and manage personal notes', category: 'Productivity', plans: ['free', 'me', 'everywhere'] },
  { id: 'reminder', name: 'Reminders', icon: 'Bell', description: 'Set reminders and alarms', category: 'Productivity', plans: ['free', 'me', 'everywhere'] },
  { id: 'timer', name: 'Timers', icon: 'Timer', description: 'Countdown and stopwatch timers', category: 'Productivity', plans: ['free', 'me', 'everywhere'] },
  { id: 'translate', name: 'Translate', icon: 'Languages', description: 'Translate text between languages', category: 'Productivity', plans: ['free', 'me', 'everywhere'] },
  { id: 'time', name: 'Time & Date', icon: 'Clock', description: 'World clocks, timezones, conversions', category: 'Productivity', plans: ['free', 'me', 'everywhere'] },

  // ── Entertainment ──
  { id: 'music', name: 'Spotify', icon: 'Music', description: 'Control playback, playlists, discover music', category: 'Entertainment', plans: ['me', 'everywhere'], oauth: 'spotify' },
  { id: 'youtube', name: 'YouTube', icon: 'Youtube', description: 'Search and play videos', category: 'Entertainment', plans: ['free', 'me', 'everywhere'] },
  { id: 'media_cast', name: 'Cast to TV', icon: 'Tv', description: 'Send content to your TV via Chromecast', category: 'Entertainment', plans: ['everywhere'] },

  // ── Smart Home ──
  { id: 'smarthome', name: 'SmartThings', icon: 'Home', description: 'Control lights, locks, thermostat, sensors', category: 'Smart Home', plans: ['everywhere'], oauth: 'smartthings' },

  // ── Transport & Navigation ──
  { id: 'traffic', name: 'Traffic', icon: 'Navigation', description: 'Real-time traffic and route info', category: 'Transport', plans: ['free', 'me', 'everywhere'] },
  { id: 'transport', name: 'Public Transport', icon: 'Bus', description: 'Bus, train, metro schedules and routes', category: 'Transport', plans: ['free', 'me', 'everywhere'] },
  { id: 'maps', name: 'Maps', icon: 'Map', description: 'Directions, places, navigation', category: 'Transport', plans: ['free', 'me', 'everywhere'] },
  { id: 'car', name: 'Connected Car', icon: 'Car', description: 'Battery, location, charging status', category: 'Transport', plans: ['everywhere'], oauth: 'smartcar' },
  { id: 'leaving_now', name: 'Smart Departure', icon: 'Navigation', description: 'Traffic + weather + calendar combined', category: 'Transport', plans: ['me', 'everywhere'] },

  // ── Shopping & Finance ──
  { id: 'mercado', name: 'Smart Shopping', icon: 'ShoppingCart', description: 'OCR receipts, price tracking, shopping lists', category: 'Shopping', plans: ['me', 'everywhere'] },
  { id: 'finance', name: 'Finance', icon: 'TrendingUp', description: 'Stocks, crypto, exchange rates', category: 'Finance', plans: ['me', 'everywhere'] },
  { id: 'crypto', name: 'Crypto', icon: 'Coins', description: 'Cryptocurrency prices and portfolio', category: 'Finance', plans: ['me', 'everywhere'] },

  // ── Information ──
  { id: 'weather', name: 'Weather', icon: 'Cloud', description: 'Forecasts and weather alerts', category: 'Information', plans: ['free', 'me', 'everywhere'] },
  { id: 'search', name: 'Web Search', icon: 'Search', description: 'Search the web for answers', category: 'Information', plans: ['free', 'me', 'everywhere'] },
  { id: 'research', name: 'Deep Research', icon: 'BookOpen', description: 'In-depth research and analysis', category: 'Information', plans: ['me', 'everywhere'] },

  // ── Food & Places ──
  { id: 'restaurant', name: 'Restaurants', icon: 'UtensilsCrossed', description: 'Find, review, and book restaurants', category: 'Food', plans: ['me', 'everywhere'] },

  // ── Development ──
  { id: 'dev', name: 'Dev Assistant', icon: 'Code', description: 'Code generation, debugging, explanations', category: 'Development', plans: ['me', 'everywhere'] },
  { id: 'github', name: 'GitHub', icon: 'Github', description: 'Manage repos, commits, issues', category: 'Development', plans: ['me', 'everywhere'], oauth: 'github' },

  // ── Image & Media ──
  { id: 'image', name: 'Image Generation', icon: 'ImageIcon', description: 'Generate images with AI', category: 'Media', plans: ['me', 'everywhere'] },

  // ── Tracking ──
  { id: 'tracking', name: 'Package Tracking', icon: 'Package', description: 'Track deliveries and shipments', category: 'Tracking', plans: ['me', 'everywhere'] },

  // ── Coming Soon ──
  { id: 'canva', name: 'Canva', icon: 'Palette', description: 'Create designs, posts, social media art', category: 'Media', plans: ['me', 'everywhere'], comingSoon: true },
  { id: 'whatsapp', name: 'WhatsApp', icon: 'MessageCircle', description: 'Use Capivarex via WhatsApp', category: 'Communication', plans: ['everywhere'], comingSoon: true },
  { id: 'outlook', name: 'Outlook', icon: 'Mail', description: 'Microsoft email integration', category: 'Communication', plans: ['me', 'everywhere'], comingSoon: true },
  { id: 'uber', name: 'Uber', icon: 'Car', description: 'Request rides', category: 'Transport', plans: ['everywhere'], comingSoon: true },
  { id: 'ev_charging', name: 'EV Charging', icon: 'Zap', description: 'Find charging stations nearby', category: 'Transport', plans: ['me', 'everywhere'], comingSoon: true },
];

const PLAN_RANK: Record<PlanType, number> = { free: 0, me: 1, everywhere: 2 };

const OAUTH_MAP: Record<string, string> = {
  google: '/api/auth/google/connect',
  spotify: '/api/auth/spotify/connect',
  smartthings: '/api/auth/smartthings/connect',
  smartcar: '/api/auth/smartcar/connect',
  github: '/api/auth/github/connect',
};

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

  const isConnected = useCallback(
    (service: ServiceDefinition) => {
      if (!service.oauth) return false;
      const lookupId = service.oauth;
      return connections.find((c) => c.provider === lookupId)?.connected ?? false;
    },
    [connections],
  );

  const getStatus = useCallback(
    (service: ServiceDefinition) => {
      if (!service.oauth) return undefined;
      const lookupId = service.oauth;
      return connections.find((c) => c.provider === lookupId)?.status;
    },
    [connections],
  );

  const handleConnect = useCallback(
    (service: ServiceDefinition) => {
      if (!user?.id || !service.oauth) return;
      const authPath = OAUTH_MAP[service.oauth];
      if (!authPath) return;

      window.open(
        `${API_URL}${authPath}?user_id=${user.id}`,
        'oauth',
        'width=500,height=700',
      );

      const lookupId = service.oauth;
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
      if (!service.oauth) return;
      updateConnection(service.oauth, { connected: false, status: undefined });
    },
    [updateConnection],
  );

  const getMinPlan = (service: ServiceDefinition): PlanType => {
    if (service.plans.includes('free')) return 'free';
    if (service.plans.includes('me')) return 'me';
    return 'everywhere';
  };

  const serviceNeedsUpgrade = (service: ServiceDefinition) => {
    const minPlan = getMinPlan(service);
    return PLAN_RANK[userPlan] < PLAN_RANK[minPlan];
  };

  // Split into 4 sections
  const connected = ALL_SERVICES.filter(
    (s) => !s.comingSoon && isConnected(s),
  );
  const available = ALL_SERVICES.filter(
    (s) => !s.comingSoon && !isConnected(s) && !serviceNeedsUpgrade(s),
  );
  const requiresUpgrade = ALL_SERVICES.filter(
    (s) => !s.comingSoon && !isConnected(s) && serviceNeedsUpgrade(s),
  );
  const comingSoon = ALL_SERVICES.filter((s) => s.comingSoon);

  const renderSection = (
    title: string,
    titleClass: string,
    services: ServiceDefinition[],
  ) => {
    if (services.length === 0) return null;
    return (
      <section>
        <h3 className={`text-sm font-semibold uppercase tracking-wider mb-4 ${titleClass}`}>
          {title}
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {services.map((s) => (
            <ServiceCard
              key={s.id}
              service={s}
              connected={isConnected(s)}
              status={getStatus(s)}
              userPlan={userPlan}
              onConnect={() => handleConnect(s)}
              onDisconnect={() => handleDisconnect(s)}
            />
          ))}
        </div>
      </section>
    );
  };

  return (
    <div className="space-y-8">
      {renderSection('Connected', 'text-success/70', connected)}
      {renderSection('Available', 'text-accent/70', available)}
      {renderSection('Requires Upgrade', 'text-text-muted/60', requiresUpgrade)}
      {renderSection('Coming Soon', 'text-text-muted/40', comingSoon)}
    </div>
  );
}
