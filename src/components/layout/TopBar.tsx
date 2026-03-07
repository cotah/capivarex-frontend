'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useAuthStore } from '@/stores/authStore';
import PlanBadge from '@/components/billing/PlanBadge';
import CastButton from '@/components/cast/CastButton';
import {
  MessageSquare,
  Zap,
  StickyNote,
  Home,
  TrendingUp,
  BarChart3,
  Clock,
  Settings,
  Circle,
} from 'lucide-react';

const navItems = [
  { href: '/chat', label: 'Chat', icon: MessageSquare },
  { href: '/services', label: 'Services', icon: Zap },
  { href: '/notes', label: 'Notes', icon: StickyNote },
  { href: '/smarts', label: 'Smarts', icon: Home },
  { href: '/finance', label: 'Finance', icon: TrendingUp },
  { href: '/insights', label: 'Insights', icon: BarChart3 },
  { href: '/activity', label: 'Activity', icon: Clock },
  { href: '/settings', label: 'Settings', icon: Settings },
];

export default function TopBar() {
  const pathname = usePathname();
  const user = useAuthStore((s) => s.user);

  const isActive = (href: string) => {
    if (href === '/chat') return pathname === '/chat';
    return pathname.startsWith(href);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass-strong">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <Link href="/chat" className="flex items-center">
            <Image
              src="/logo-horizontal.png"
              alt="Capivarex"
              width={200}
              height={48}
              priority
              className="h-10 sm:h-12 w-auto object-contain"
            />
          </Link>
          {user && <PlanBadge plan={user.plan} />}
        </div>

        {/* Desktop nav */}
        <nav className="hidden sm:flex items-center gap-0.5">
          {navItems.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-base font-medium transition-all duration-200 ${
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

        {/* Status + Cast */}
        <div className="flex items-center gap-2">
          <CastButton size={14} />
          <Circle size={6} className="fill-success text-success" />
          <span className="text-sm text-text-muted hidden sm:inline">
            Online
          </span>
        </div>
      </div>

      {/* Mobile nav — horizontal scroll, hidden scrollbar */}
      <nav className="nav-scroll flex sm:hidden items-center gap-1 pb-2 px-4 overflow-x-auto flex-nowrap">
        {navItems.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={`flex items-center gap-1.5 whitespace-nowrap rounded-lg px-2.5 py-1.5 text-sm font-medium transition-all duration-200 ${
              isActive(href)
                ? 'bg-accent-soft text-accent'
                : 'text-text-muted hover:text-text hover:bg-white/5'
            }`}
          >
            <Icon size={13} />
            {label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
