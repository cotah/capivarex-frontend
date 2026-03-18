'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import { Bell, BellOff, CheckCheck, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { apiClient } from '@/lib/api';
import { useT } from '@/i18n';
import type { ProactivityItem } from '@/lib/types';

const PROACTIVITY_ICONS: Record<string, string> = {
  calendar:    '📅',
  traffic:     '🚗',
  weather:     '🌤',
  email:       '📧',
  reminder:    '⏰',
  price_alert: '💰',
  news:        '📰',
  health:      '💊',
};

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return 'now';
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return new Date(iso).toLocaleDateString('en-US');
}

export default function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<ProactivityItem[]>([]);
  const [unread, setUnread] = useState(0);
  const [loading, setLoading] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const t = useT();
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Fetch unread count on mount (lightweight)
  useEffect(() => {
    apiClient<{ unread_count: number }>(
      '/api/webapp/proactivity/feed?limit=1'
    )
      .then((d) => setUnread(d.unread_count ?? 0))
      .catch(() => {});
  }, []);

  // Load full list when panel opens
  useEffect(() => {
    if (!open) return;
    setLoading(true);
    apiClient<{ items: ProactivityItem[]; unread_count: number }>(
      '/api/webapp/proactivity/feed?limit=30'
    )
      .then((d) => {
        setItems(d.items ?? []);
        setUnread(d.unread_count ?? 0);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [open]);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (
        panelRef.current &&
        !panelRef.current.contains(e.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    const timer = setTimeout(() => document.addEventListener('mousedown', handler), 10);
    return () => { clearTimeout(timer); document.removeEventListener('mousedown', handler); };
  }, [open]);

  const markRead = useCallback(async (id: string) => {
    try {
      await apiClient(`/api/webapp/proactivity/feed/${id}/read`, { method: 'PATCH' });
      setItems((prev) => prev.map((a) => (a.id === id ? { ...a, is_read: true } : a)));
      setUnread((n) => Math.max(0, n - 1));
    } catch { /* silent */ }
  }, []);

  const markAllRead = useCallback(async () => {
    try {
      await apiClient('/api/webapp/proactivity/feed/read-all', { method: 'PATCH' });
      setItems((prev) => prev.map((a) => ({ ...a, is_read: true })));
      setUnread(0);
    } catch { /* silent */ }
  }, []);

  return (
    <div className="relative">
      {/* Bell button */}
      <button
        ref={buttonRef}
        onClick={() => setOpen((p) => !p)}
        className={`relative flex h-8 w-8 items-center justify-center rounded-lg transition-colors duration-200 ${
          open
            ? 'text-accent bg-accent-soft'
            : 'text-text-muted hover:text-text hover:bg-white/5'
        }`}
        aria-label={t('notifications.notifications')}
      >
        <Bell size={16} />
        {unread > 0 && (
          <span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-accent text-bg text-[9px] font-bold flex items-center justify-center leading-none">
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </button>

      {/* Dropdown panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            ref={panelRef}
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="absolute right-0 top-full mt-2 w-80 rounded-2xl border border-white/10 shadow-2xl z-[100] overflow-hidden bg-[#141420]"
          >
            {/* Panel header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.06]">
              <div className="flex items-center gap-2">
                <Bell size={14} className="text-accent" />
                <span className="text-sm font-semibold text-text">{t('notifications.title')}</span>
                {unread > 0 && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-accent/15 text-accent font-medium">
                    {unread} new
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1">
                {unread > 0 && (
                  <button
                    onClick={markAllRead}
                    className="flex items-center gap-1 text-[11px] text-text-muted hover:text-accent transition-colors px-2 py-1 rounded-lg hover:bg-white/5"
                  >
                    <CheckCheck size={12} />
                    All read
                  </button>
                )}
                <button
                  onClick={() => setOpen(false)}
                  className="p-1 text-text-muted hover:text-text transition-colors rounded-lg hover:bg-white/5"
                >
                  <X size={14} />
                </button>
              </div>
            </div>

            {/* Items */}
            <div className="max-h-[420px] overflow-y-auto">
              {loading ? (
                <div className="flex items-center justify-center py-10">
                  <div className="h-5 w-5 rounded-full border-2 border-accent/30 border-t-accent animate-spin" />
                </div>
              ) : items.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 gap-2 text-text-muted">
                  <BellOff size={24} className="opacity-30" />
                  <p className="text-xs">{t('notifications.no_alerts')}</p>
                </div>
              ) : (
                <div className="py-1">
                  {items.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => !item.is_read && markRead(item.id)}
                      className={`w-full text-left px-4 py-3 transition-colors duration-150 border-b border-white/[0.04] last:border-0 ${
                        item.is_read
                          ? 'opacity-50 cursor-default'
                          : 'hover:bg-white/[0.04] cursor-pointer'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <span className="text-base shrink-0 mt-0.5">
                          {PROACTIVITY_ICONS[item.type] ?? '🔔'}
                        </span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <p className={`text-xs font-medium leading-snug ${item.is_read ? 'text-text-muted' : 'text-text'}`}>
                              {item.title}
                            </p>
                            <span className="text-[10px] text-text-muted/50 shrink-0">
                              {timeAgo(item.created_at)}
                            </span>
                          </div>
                          <p className="text-xs text-text-muted mt-0.5 leading-relaxed line-clamp-2">
                            {item.message}
                          </p>
                        </div>
                        {!item.is_read && (
                          <span className="h-1.5 w-1.5 rounded-full bg-accent shrink-0 mt-1.5" />
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
