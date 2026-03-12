'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, TrendingUp, BarChart3, Clock, Settings, X, Phone } from 'lucide-react';
import { apiClient } from '@/lib/api';

const moreItems = [
  { href: '/memory', label: 'Memory', icon: Brain },
  { href: '/finance', label: 'Finance', icon: TrendingUp },
  { href: '/insights', label: 'Insights', icon: BarChart3 },
  { href: '/activity', label: 'Activity', icon: Clock },
  { href: '/calls', label: 'Calls', icon: Phone },
  { href: '/settings', label: 'Settings', icon: Settings },
];

interface MoreMenuProps {
  open: boolean;
  onClose: () => void;
}

export default function MoreMenu({ open, onClose }: MoreMenuProps) {
  const pathname = usePathname();
  const menuRef = useRef<HTMLDivElement>(null);
  const [alertCount, setAlertCount] = useState(0);

  const isActive = (href: string) => pathname.startsWith(href);

  useEffect(() => {
    if (!open) return;
    apiClient<{ unread_count: number }>('/api/webapp/proactivity/feed?limit=1')
      .then((d) => setAlertCount(d.unread_count ?? 0))
      .catch(() => {});
  }, [open]);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    // Delay listener to avoid catching the opening click
    const timer = setTimeout(() => {
      document.addEventListener('mousedown', handleClick);
    }, 10);
    return () => {
      clearTimeout(timer);
      document.removeEventListener('mousedown', handleClick);
    };
  }, [open, onClose]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[60] bg-black/40"
            onClick={onClose}
          />

          {/* Sheet from bottom */}
          <motion.div
            ref={menuRef}
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 z-[70] rounded-t-2xl glass-strong border-t border-white/10"
          >
            {/* Handle bar */}
            <div className="flex justify-center pt-3 pb-1">
              <div className="h-1 w-10 rounded-full bg-white/20" />
            </div>

            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-3 right-4 p-1 text-text-muted hover:text-text transition-colors"
              aria-label="Close menu"
            >
              <X size={20} />
            </button>

            {/* Menu items */}
            <nav className="px-4 pb-8 pt-2 space-y-1">
              {moreItems.map(({ href, label, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  onClick={onClose}
                  className={`flex items-center gap-4 rounded-xl px-4 py-3.5 text-base font-medium transition-all duration-200 ${
                    isActive(href)
                      ? 'bg-accent-soft text-accent'
                      : 'text-text-muted hover:text-text hover:bg-white/5'
                  }`}
                >
                  <Icon size={22} />
                  {label}
                  {href === '/activity' && alertCount > 0 && (
                    <span className="ml-auto h-5 w-5 rounded-full bg-accent text-bg text-[10px] font-bold flex items-center justify-center">
                      {alertCount > 9 ? '9+' : alertCount}
                    </span>
                  )}
                </Link>
              ))}
            </nav>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
