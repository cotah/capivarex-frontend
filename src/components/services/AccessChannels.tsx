'use client';

import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';
import { Lock, ExternalLink, Sparkles, Watch, Glasses } from 'lucide-react';

interface Channel {
  id: string;
  name: string;
  description: string;
  plans: string[];
  comingSoon: boolean;
  alwaysActive?: boolean;
  actionLabel?: string | null;
  actionHref?: string;
  actionExternal?: boolean;
  upgradeLabel?: string;
  badge?: string;
}

const CHANNELS: Channel[] = [
  {
    id: 'webapp',
    name: 'Web App',
    description: 'Your full CAPIVAREX dashboard. Chat, voice, briefings, and settings — all in one place.',
    plans: [],
    comingSoon: false,
    alwaysActive: true,
    actionLabel: 'Open Dashboard',
    actionHref: '/',
  },
  {
    id: 'telegram',
    name: 'Telegram',
    description: 'Talk to ARA directly on Telegram. Send messages, voice notes, or photos — she handles the rest.',
    plans: [],
    comingSoon: false,
    alwaysActive: true,
    actionLabel: 'Open on Telegram',
    actionHref: 'https://t.me/capivarex_bot',
    actionExternal: true,
  },
  {
    id: 'whatsapp',
    name: 'WhatsApp',
    description: "ARA on WhatsApp. Message her like you'd text a friend — she reads, replies, and acts.",
    plans: ['capivarex_pro', 'capivarex_ultimate'],
    comingSoon: false,
    actionLabel: null,
    upgradeLabel: 'Available from Capivarex Pro',
  },
  {
    id: 'holographic',
    name: 'Holographic Device',
    description: 'A 3D holographic cylinder that brings your Capivara to life at home. Talk to her, see her react — like having a real assistant in the room.',
    plans: [],
    comingSoon: true,
    badge: 'Hardware — Coming Soon',
  },
  {
    id: 'smartwatch',
    name: 'Smart Watch',
    description: 'ARA on your wrist. Morning briefings, reminders, and quick commands — hands-free.',
    plans: [],
    comingSoon: true,
  },
  {
    id: 'smartglasses',
    name: 'Smart Glasses',
    description: 'ARA in your field of view. Fully hands-free, always present.',
    plans: [],
    comingSoon: true,
  },
];

/* eslint-disable @next/next/no-img-element */
function ChannelIcon({ id, dimmed }: { id: string; dimmed: boolean }) {
  const cls = dimmed ? 'opacity-40 grayscale' : '';

  switch (id) {
    case 'webapp':
      return (
        <img src="/icons/pwa.png" alt="PWA" className={`w-7 h-7 object-contain ${cls}`} />
      );
    case 'telegram':
      return (
        <img src="/icons/telegram.svg" alt="Telegram" className={`w-7 h-7 ${cls}`} />
      );
    case 'whatsapp':
      return (
        <img src="/icons/whatsapp.png" alt="WhatsApp" className={`w-7 h-7 object-contain ${cls}`} />
      );
    case 'holographic':
      return <Sparkles size={22} className={`text-purple-400 ${cls}`} />;
    case 'smartwatch':
      return <Watch size={22} className={`text-text-muted ${cls}`} />;
    case 'smartglasses':
      return <Glasses size={22} className={`text-text-muted ${cls}`} />;
    default:
      return <span className={`text-xl ${cls}`}>📡</span>;
  }
}

function getStatus(channel: Channel, userPlan: string): 'active' | 'locked' | 'coming_soon' {
  if (channel.alwaysActive) return 'active';
  if (channel.comingSoon) return 'coming_soon';
  if (channel.plans.includes(userPlan)) return 'active';
  return 'locked';
}

export default function AccessChannels() {
  const user = useAuthStore((s) => s.user);
  const router = useRouter();
  const userPlan = user?.plan || 'ara';

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {CHANNELS.map((ch) => {
        const status = getStatus(ch, userPlan);

        return (
          <div
            key={ch.id}
            className={`glass rounded-2xl p-5 flex flex-col transition-all duration-200 ${
              status === 'active'
                ? 'border border-accent/25 hover:scale-[1.02] hover:shadow-lg'
                : status === 'locked'
                  ? 'border border-white/10 opacity-70'
                  : 'border border-white/5 opacity-[0.4]'
            }`}
          >
            {/* Header: icon + name + badges */}
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2.5">
                <ChannelIcon id={ch.id} dimmed={status !== 'active'} />
                <h4 className="text-sm font-semibold text-text">{ch.name}</h4>
              </div>
              {status === 'locked' && (
                <Lock size={14} className="text-text-muted/50 mt-0.5" />
              )}
              {status === 'coming_soon' && (
                <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-white/5 text-text-muted">
                  {ch.badge || 'Coming Soon'}
                </span>
              )}
            </div>

            {/* Description */}
            <p className="text-xs text-text-muted leading-relaxed mb-3 flex-1">
              {ch.description}
            </p>

            {/* Action button — active channels */}
            {status === 'active' && ch.actionLabel && (
              <a
                href={ch.actionHref}
                {...(ch.actionExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                className="flex items-center justify-center gap-1.5 w-full py-2 rounded-xl text-xs font-medium bg-accent/10 text-accent hover:bg-accent/15 transition-colors"
              >
                {ch.actionLabel}
                {ch.actionExternal && <ExternalLink size={11} />}
              </a>
            )}

            {/* WhatsApp locked — upgrade FOMO */}
            {status === 'locked' && ch.upgradeLabel && (
              <div className="mt-auto">
                <p className="text-[11px] text-text-muted/60 text-center mb-2">
                  {ch.upgradeLabel}
                </p>
                <button
                  onClick={() => router.push('/pricing')}
                  className="w-full rounded-xl border border-accent/30 py-2 px-4 text-xs font-medium text-accent hover:bg-accent/10 transition-colors"
                >
                  🚀 Upgrade to use on WhatsApp
                </button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
