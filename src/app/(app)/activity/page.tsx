'use client';
import { useT } from '@/i18n';
import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Clock, BellOff, CheckCheck } from 'lucide-react';
import { apiClient } from '@/lib/api';
import ActivityFeedPage from '@/components/activity/ActivityFeedPage';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
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
  if (m < 1) return 'agora';
  if (m < 60) return `${m}m atrás`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h atrás`;
  return new Date(iso).toLocaleDateString('pt-BR');
}

export default function ActivityPage() {
  const t = useT();
  const [tab, setTab] = useState<'feed' | 'alerts'>('feed');
  const [alerts, setAlerts] = useState<ProactivityItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loadingAlerts, setLoadingAlerts] = useState(true);

  const loadAlerts = useCallback(async () => {
    try {
      const data = await apiClient<{
        items: ProactivityItem[];
        unread_count: number;
      }>('/api/webapp/proactivity/feed?limit=50');
      setAlerts(data.items ?? []);
      setUnreadCount(data.unread_count ?? 0);
    } catch {
      // toast already shown
    } finally {
      setLoadingAlerts(false);
    }
  }, []);

  useEffect(() => {
    loadAlerts();
  }, [loadAlerts]);

  const markRead = useCallback(async (id: string) => {
    try {
      await apiClient(`/api/webapp/proactivity/feed/${id}/read`, {
        method: 'PATCH',
      });
      setAlerts((prev) =>
        prev.map((a) => (a.id === id ? { ...a, is_read: true } : a))
      );
      setUnreadCount((n) => Math.max(0, n - 1));
    } catch {
      // silent
    }
  }, []);

  const markAllRead = useCallback(async () => {
    try {
      await apiClient('/api/webapp/proactivity/feed/read-all', {
        method: 'PATCH',
      });
      setAlerts((prev) => prev.map((a) => ({ ...a, is_read: true })));
      setUnreadCount(0);
    } catch {
      // silent
    }
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="px-4 py-8"
    >
      <div className="mx-auto max-w-3xl space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock size={18} className="text-accent" />
            <h2 className="text-3xl font-semibold text-text">{t('activity.title')}</h2>
          </div>
          {tab === 'alerts' && unreadCount > 0 && (
            <button
              onClick={markAllRead}
              className="flex items-center gap-1.5 text-xs text-text-muted hover:text-accent transition-colors"
            >
              <CheckCheck size={14} />
              Mark all read
            </button>
          )}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 p-1 rounded-xl bg-white/[0.04] w-fit">
          <button
            onClick={() => setTab('feed')}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
              tab === 'feed'
                ? 'bg-accent/15 text-accent'
                : 'text-text-muted hover:text-text'
            }`}
          >
            Chat History
          </button>
          <button
            onClick={() => setTab('alerts')}
            className={`relative px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
              tab === 'alerts'
                ? 'bg-accent/15 text-accent'
                : 'text-text-muted hover:text-text'
            }`}
          >
            Alerts
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-accent text-bg text-[10px] font-bold flex items-center justify-center">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>
        </div>

        {/* Content */}
        {tab === 'feed' ? (
          <ActivityFeedPage />
        ) : loadingAlerts ? (
          <LoadingSpinner />
        ) : alerts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3 text-text-muted">
            <BellOff size={32} className="opacity-30" />
            <p className="text-sm">{t('activity.no_alerts')}</p>
            <p className="text-xs opacity-60">
              CAPIVAREX will notify you about important events here.
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {alerts.map((item) => (
              <div
                key={item.id}
                onClick={() => !item.is_read && markRead(item.id)}
                className={`rounded-xl border px-4 py-3 transition-all duration-200 cursor-pointer ${
                  item.is_read
                    ? 'border-glass-border bg-white/[0.02] opacity-60'
                    : 'border-accent/20 bg-accent/[0.03] hover:bg-accent/[0.06]'
                }`}
              >
                <div className="flex items-start gap-3">
                  <span className="text-xl shrink-0 mt-0.5">
                    {PROACTIVITY_ICONS[item.type] ?? '🔔'}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className={`text-sm font-medium leading-snug ${item.is_read ? 'text-text-muted' : 'text-text'}`}>
                        {item.title}
                      </p>
                      <span className="text-[11px] text-text-muted/50 shrink-0 mt-0.5">
                        {timeAgo(item.created_at)}
                      </span>
                    </div>
                    <p className="text-sm text-text-muted mt-0.5 leading-relaxed">
                      {item.message}
                    </p>
                  </div>
                  {!item.is_read && (
                    <span className="h-2 w-2 rounded-full bg-accent shrink-0 mt-1.5" />
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}
