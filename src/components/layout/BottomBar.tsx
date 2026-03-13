'use client';

import { useState, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  MessageSquare,
  Zap,
  StickyNote,
  Home,
  MoreHorizontal,
} from 'lucide-react';
import MoreMenu from './MoreMenu';
import { useT } from '@/i18n';

// Routes covered by the "More" menu
const moreRoutes = ['/memory', '/finance', '/insights', '/settings', '/calls'];

export default function BottomBar() {
  const pathname = usePathname();
  const [moreOpen, setMoreOpen] = useState(false);
  const t = useT();

  const bottomTabs = [
    { href: '/chat', label: t('nav.chat'), icon: MessageSquare },
    { href: '/services', label: t('nav.services'), icon: Zap },
    { href: '/notes', label: t('nav.notes'), icon: StickyNote },
    { href: '/smarts', label: t('nav.smarts'), icon: Home },
  ];

export default function BottomBar() {
  const pathname = usePathname();
  const [moreOpen, setMoreOpen] = useState(false);

  const isActive = (href: string) => {
    if (href === '/chat') return pathname === '/chat';
    return pathname.startsWith(href);
  };

  const isMoreActive = moreRoutes.some((r) => pathname.startsWith(r));

  const handleCloseMore = useCallback(() => setMoreOpen(false), []);

  return (
    <>
      <nav className="fixed bottom-0 left-0 right-0 z-50 flex md:hidden items-end justify-around glass-strong border-t border-white/10 pb-safe">
        <div className="flex w-full items-end justify-around px-2 py-1.5">
          {bottomTabs.map(({ href, label, icon: Icon }) => {
            const active = isActive(href);
            return (
              <Link
                key={href}
                href={href}
                className={`flex flex-col items-center justify-center gap-0.5 min-w-[56px] py-1.5 transition-colors duration-200 ${
                  active ? 'text-accent' : 'text-text-muted'
                }`}
              >
                <Icon size={22} />
                <span className="text-[11px] font-medium leading-tight">
                  {label}
                </span>
              </Link>
            );
          })}

          {/* More button */}
          <button
            onClick={() => setMoreOpen(true)}
            className={`flex flex-col items-center justify-center gap-0.5 min-w-[56px] py-1.5 transition-colors duration-200 ${
              isMoreActive ? 'text-accent' : 'text-text-muted'
            }`}
          >
            <MoreHorizontal size={22} />
            <span className="text-[11px] font-medium leading-tight">{t('nav.more')}</span>
          </button>
        </div>
      </nav>

      {/* More menu overlay */}
      <MoreMenu open={moreOpen} onClose={handleCloseMore} />
    </>
  );
}
