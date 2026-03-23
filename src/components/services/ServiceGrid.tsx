'use client';

import { useEffect, useCallback } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { useServicesStore } from '@/stores/servicesStore';
import { createClient } from '@/lib/supabase/client';
import ServiceCard from './ServiceCard';
import type { ServiceDefinition, PlanType } from '@/lib/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const ALL_SERVICES: ServiceDefinition[] = [
  // ── Grupo 1 — Core Business (ativos) ──
  { id: 'chat', name: 'AI Chat', icon: 'MessageSquare', description: 'Intelligent conversation with context', category: 'Communication', plans: ['professional', 'executive'] },
  { id: 'voice', name: 'Voice Assistant', icon: 'Mic', description: 'Voice input and text-to-speech', category: 'Communication', plans: ['professional', 'executive'] },
  { id: 'email', name: 'Gmail', icon: 'Mail', description: 'Read, compose, and manage emails', category: 'Communication', plans: ['executive'], oauth: 'google' },
  { id: 'calendar', name: 'Google Calendar', icon: 'Calendar', description: 'Manage events and schedule', category: 'Productivity', plans: ['executive'], oauth: 'google' },
  { id: 'notes', name: 'Notes', icon: 'StickyNote', description: 'Create and manage personal notes', category: 'Productivity', plans: ['professional', 'executive'] },
  { id: 'reminder', name: 'Reminders', icon: 'Bell', description: 'Set reminders and alarms', category: 'Productivity', plans: ['professional', 'executive'] },
  { id: 'timer', name: 'Timers', icon: 'Timer', description: 'Countdown and stopwatch timers', category: 'Productivity', plans: ['professional', 'executive'] },
  { id: 'translate', name: 'Translate', icon: 'Languages', description: 'Translate text between languages', category: 'Productivity', plans: ['professional', 'executive'] },
  { id: 'maps', name: 'Maps', icon: 'Map', description: 'Directions, places, navigation', category: 'Transport', plans: ['professional', 'executive'] },
  { id: 'finance', name: 'Finance', icon: 'TrendingUp', description: 'Stocks and exchange rates', category: 'Finance', plans: ['professional', 'executive'] },
  { id: 'weather', name: 'Weather', icon: 'Cloud', description: 'Forecasts and weather alerts', category: 'Information', plans: ['professional', 'executive'] },
  { id: 'search', name: 'Web Search', icon: 'Search', description: 'Search the web for answers', category: 'Information', plans: ['professional', 'executive'] },
  { id: 'research', name: 'Deep Research', icon: 'BookOpen', description: 'In-depth research and analysis', category: 'Information', plans: ['executive'] },
  { id: 'tracking', name: 'Package Tracking', icon: 'Package', description: 'Track deliveries and shipments', category: 'Tracking', plans: ['professional', 'executive'] },
  { id: 'whatsapp', name: 'WhatsApp', icon: 'MessageCircle', description: 'Use CAPIVAREX via WhatsApp', category: 'Communication', plans: ['executive'] },
  { id: 'outlook', name: 'Outlook', icon: 'Mail', description: 'Microsoft email and calendar', category: 'Communication', plans: ['executive'], oauth: 'microsoft' },
  { id: 'ms_calendar', name: 'Microsoft Calendar', icon: 'Calendar', description: 'Events, meetings, and Teams links', category: 'Productivity', plans: ['executive'], oauth: 'microsoft' },
  { id: 'notion', name: 'Notion', icon: 'FileText', description: 'Sync notes to Notion', category: 'Productivity', plans: ['executive'], oauth: 'notion' },

  // ── Grupo 2 — Coming Soon Q3 2026 ──
  { id: 'twilio', name: 'Phone Calls', icon: 'Phone', description: 'Make and receive phone calls', category: 'Communication', plans: ['executive'], comingSoon: true },
  { id: 'music', name: 'Spotify', icon: 'Music', description: 'Control playback, playlists, discover music', category: 'Entertainment', plans: ['professional', 'executive'], oauth: 'spotify', comingSoon: true },
  { id: 'smarthome', name: 'Smart Home', icon: 'Home', description: 'Control lights, plugs, sensors, thermostat and more', category: 'Smart Home', plans: ['professional', 'executive'], comingSoon: true },
  { id: 'traffic', name: 'Traffic', icon: 'Navigation', description: 'Real-time traffic and route info', category: 'Transport', plans: ['professional', 'executive'], comingSoon: true },
  { id: 'transport', name: 'Public Transport', icon: 'Bus', description: 'Bus, train, metro schedules and routes', category: 'Transport', plans: ['professional', 'executive'], comingSoon: true },
  { id: 'car', name: 'Connected Car', icon: 'Car', description: 'Battery, location, charging status', category: 'Transport', plans: ['professional', 'executive'], oauth: 'smartcar', comingSoon: true },
  { id: 'leaving_now', name: 'Smart Departure', icon: 'Navigation', description: 'Traffic + weather + calendar combined', category: 'Transport', plans: ['professional', 'executive'], comingSoon: true },
  { id: 'flights', name: 'Smart Flights', icon: 'Plane', description: 'Search flights, compare prices, and book tickets', category: 'Travel', plans: ['professional', 'executive'], comingSoon: true },
  { id: 'stay', name: 'Smart Stay', icon: 'Hotel', description: 'Find hotels, Airbnb, and accommodation deals', category: 'Travel', plans: ['professional', 'executive'], comingSoon: true },
  { id: 'mercado', name: 'Smart Shopping', icon: 'ShoppingCart', description: 'OCR receipts, price tracking, shopping lists', category: 'Shopping', plans: ['professional', 'executive'], comingSoon: true },
  { id: 'crypto', name: 'Crypto', icon: 'Coins', description: 'Cryptocurrency prices and portfolio', category: 'Finance', plans: ['professional', 'executive'], comingSoon: true },
  { id: 'restaurant', name: 'Restaurants', icon: 'UtensilsCrossed', description: 'Find, review, and book restaurants', category: 'Food', plans: ['professional', 'executive'], comingSoon: true },
  { id: 'dev', name: 'Dev Assistant', icon: 'Code', description: 'Code generation, debugging, explanations', category: 'Development', plans: ['professional', 'executive'], comingSoon: true },
  { id: 'github', name: 'GitHub', icon: 'Github', description: 'Manage repos, commits, issues', category: 'Development', plans: ['professional', 'executive'], oauth: 'github', comingSoon: true },
  { id: 'canva', name: 'Canva', icon: 'Palette', description: 'Create designs, posts, social media art', category: 'Media', plans: ['professional', 'executive'], comingSoon: true },
  // outlook moved to Grupo 1 (active)
  { id: 'uber', name: 'Uber', icon: 'Car', description: 'Request rides', category: 'Transport', plans: ['executive'], comingSoon: true },
  { id: 'ev_charging', name: 'EV Charging', icon: 'Zap', description: 'Find charging stations nearby', category: 'Transport', plans: ['professional', 'executive'], comingSoon: true },

  // ── Grupo 3 — Desativado: oculto da interface ──
  { id: 'image', name: 'Image Generation', icon: 'ImageIcon', description: 'Generate images with AI', category: 'Media', plans: ['professional', 'executive'], hidden: true },    // Grupo 3 - Desativado
  { id: 'youtube', name: 'YouTube', icon: 'Youtube', description: 'Search and play videos', category: 'Entertainment', plans: ['professional', 'executive'], hidden: true }, // Grupo 3 - Desativado
  { id: 'media_cast', name: 'Cast to TV', icon: 'Tv', description: 'Send content to your TV via Chromecast', category: 'Entertainment', plans: ['executive'], hidden: true }, // Grupo 3 - Desativado
  { id: 'time', name: 'Time & Date', icon: 'Clock', description: 'World clocks, timezones, conversions', category: 'Productivity', plans: ['professional', 'executive'], hidden: true }, // Grupo 3 - Desativado
];

const PLAN_RANK: Record<PlanType, number> = { professional: 0, executive: 1, ara: 0, ara_plus_1: 1, capivarex_pro: 2, capivarex_ultimate: 3 };

const OAUTH_MAP: Record<string, string> = {
  google: '/api/auth/google/connect',
  microsoft: '/api/v1/auth/microsoft/connect',
  notion: '/api/auth/notion/login',
  spotify: '/api/auth/spotify/connect',
  smartcar: '/api/v1/car/connect',
  github: '/api/v1/auth/github/connect',
};

const COMING_SOON_OAUTH = new Set<string>([]);

export default function ServiceGrid() {
  const user = useAuthStore((s) => s.user);
  const { connections, fetchAll, updateConnection } = useServicesStore();
  const userPlan: PlanType = user?.plan || 'professional';

  useEffect(() => {
    if (user?.id) {
      // Só chama se a sessão Supabase estiver ativa
      const supabase = createClient();
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session?.access_token) {
          fetchAll();
        }
      });
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
      if (COMING_SOON_OAUTH.has(service.oauth)) return;
      const authPath = OAUTH_MAP[service.oauth];
      if (!authPath) return;

      const oauthWindow = window.open(
        `${API_URL}${authPath}?user_id=${user.id}`,
        'oauth',
        'width=600,height=700',
      );

      const checkClosed = setInterval(() => {
        if (oauthWindow?.closed) {
          clearInterval(checkClosed);
          fetchAll();
        }
      }, 500);
    },
    [user?.id, fetchAll],
  );

  const handleDisconnect = useCallback(
    (service: ServiceDefinition) => {
      if (!service.oauth) return;
      updateConnection(service.oauth, { connected: false, status: undefined });
    },
    [updateConnection],
  );

  const getMinPlan = (service: ServiceDefinition): PlanType => {
    if (service.plans.includes('professional')) return 'professional';
    return 'executive';
  };

  const serviceNeedsUpgrade = (service: ServiceDefinition) => {
    const minPlan = getMinPlan(service);
    return PLAN_RANK[userPlan] < PLAN_RANK[minPlan];
  };

  // Filter out hidden services (Grupo 3 — Desativado) before splitting
  const VISIBLE_SERVICES = ALL_SERVICES.filter((s) => !s.hidden);

  // Split into 4 sections
  const connected = VISIBLE_SERVICES.filter(
    (s) => !s.comingSoon && isConnected(s),
  );
  const available = VISIBLE_SERVICES.filter(
    (s) => !s.comingSoon && !isConnected(s) && !serviceNeedsUpgrade(s),
  );
  const requiresUpgrade = VISIBLE_SERVICES.filter(
    (s) => !s.comingSoon && !isConnected(s) && serviceNeedsUpgrade(s),
  );
  const comingSoon = VISIBLE_SERVICES.filter((s) => s.comingSoon);

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
