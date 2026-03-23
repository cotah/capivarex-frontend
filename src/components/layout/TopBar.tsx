'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useAuthStore } from '@/stores/authStore';
import PlanBadge from '@/components/billing/PlanBadge';
import CastButton from '@/components/cast/CastButton';
import WeatherChip from '@/components/weather/WeatherChip';
import { useConversationStore } from '@/stores/conversationStore';
import NotificationBell from '@/components/layout/NotificationBell';
import {
  MessageSquare,
  Zap,
  StickyNote,
  Home,
  TrendingUp,
  BarChart3,
  Settings,
  Circle,
  PanelLeft,
} from 'lucide-react';

const navItems = [
  { href: '/chat', label: 'Chat', icon: MessageSquare },
  { href: '/services', label: 'Services', icon: Zap },
  { href: '/notes', label: 'Notes', icon: StickyNote },
  { href: '/smarts', label: 'Smarts', icon: Home },
  { href: '/finance', label: 'Finance', icon: TrendingUp },
  { href: '/insights', label: 'Insights', icon: BarChart3 },
];

export default function TopBar() {
  const pathname = usePathname();
  const user = useAuthStore((s) => s.user);
  const toggleSidebar = useConversationStore((s) => s.toggleSidebar);
  const isChat = pathname === '/chat';

  const isActive = (href: string) => {
    if (href === '/chat') return pathname === '/chat';
    return pathname.startsWith(href);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass-strong pt-safe">
      <div className="flex h-14 w-full items-center justify-between px-3 md:px-6">
        {/* Left: Logo + Badge — extrema esquerda */}
        <div className="flex items-center gap-3 shrink-0">
          <Link href="/chat" className="flex items-center">
            <Image
              src="/logo-horizontal.png"
              alt="CAPIVAREX"
              width={160}
              height={40}
              priority
              className="h-7 md:h-10 w-auto object-contain"
            />
          </Link>
          {user && <PlanBadge plan={user.plan} />}
        </div>

        {/* Center: Nav */}
        <nav className="hidden md:flex items-center gap-5">
          {navItems.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-base font-medium transition-all duration-200 ${
                isActive(href)
                  ? 'bg-accent-soft text-accent'
                  : 'text-text-muted hover:text-text hover:bg-white/5'
              }`}
            >
              <Icon size={16} />
              {label}
            </Link>
          ))}
        </nav>

        {/* Right: Weather + Status */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="hidden md:block">
            <WeatherChip />
          </div>
          {isChat && (
            <button
              onClick={toggleSidebar}
              className="flex md:hidden h-8 w-8 items-center justify-center rounded-lg text-text-muted hover:text-text hover:bg-white/5 transition-colors"
              aria-label="Toggle sidebar"
            >
              <PanelLeft size={18} />
            </button>
          )}
          <CastButton size={14} />
          <NotificationBell />
          <Circle size={6} className="fill-success text-success" />
          <span className="text-sm text-text-muted hidden md:inline">
            Online
          </span>
          <Link
            href="/settings"
            aria-label="Settings"
            className={`hidden md:flex h-8 w-8 items-center justify-center rounded-lg transition-colors duration-200 ${
              pathname.startsWith('/settings')
                ? 'text-accent bg-accent-soft'
                : 'text-text-muted hover:text-text hover:bg-white/5'
            }`}
          >
            <Settings size={16} />
          </Link>
        </div>
      </div>
    </header>
  );
}
