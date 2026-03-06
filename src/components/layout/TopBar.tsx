'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useAuthStore } from '@/stores/authStore';
import PlanBadge from '@/components/billing/PlanBadge';
import CastButton from '@/components/cast/CastButton';
import { MessageSquare, Zap, BarChart3, Settings, Circle } from 'lucide-react';

const navItems = [
  { href: '/', label: 'Chat', icon: MessageSquare },
  { href: '/services', label: 'Services', icon: Zap },
  { href: '/insights', label: 'Insights', icon: BarChart3 },
  { href: '/settings', label: 'Settings', icon: Settings },
];

export default function TopBar() {
  const pathname = usePathname();
  const user = useAuthStore((s) => s.user);

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass-strong">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center">
            <Image
              src="/logo-horizontal.png"
              alt="Capivarex"
              width={120}
              height={28}
              priority
              className="object-contain"
            />
          </Link>
          {user && <PlanBadge plan={user.plan} />}
        </div>

        {/* Desktop nav */}
        <nav className="hidden sm:flex items-center gap-1">
          {navItems.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all duration-200 ${
                isActive(href)
                  ? 'bg-accent-soft text-accent'
                  : 'text-text-muted hover:text-text hover:bg-white/5'
              }`}
            >
              <Icon size={14} />
              {label}
            </Link>
          ))}
        </nav>

        {/* Status + Cast */}
        <div className="flex items-center gap-2">
          <CastButton size={14} />
          <Circle size={6} className="fill-success text-success" />
          <span className="text-[11px] text-text-muted hidden sm:inline">
            Online
          </span>
        </div>
      </div>

      {/* Mobile nav */}
      <nav className="flex sm:hidden items-center justify-center gap-1 pb-2 px-4">
        {navItems.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[11px] font-medium transition-all duration-200 ${
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
