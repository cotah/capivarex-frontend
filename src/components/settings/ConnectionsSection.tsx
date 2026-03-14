'use client';
import { useState, useEffect, useCallback } from 'react';
import { Plug, Circle, ExternalLink, Loader2 } from 'lucide-react';
import { apiClient } from '@/lib/api';
import { useAuthStore } from '@/stores/authStore';

interface Integration {
  id: string;
  name: string;
  icon: string;
  connected: boolean;
  account?: string;
  last_sync?: string;
  oauth_path: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? '';

const STATIC_INTEGRATIONS: Omit<Integration, 'connected'>[] = [
  { id: 'google',       name: 'Google',         icon: '📅', oauth_path: '/api/auth/google/connect' },
  { id: 'spotify',      name: 'Spotify',        icon: '🎵', oauth_path: '/api/auth/spotify/connect' },
  { id: 'tuya',         name: 'Smart Home',     icon: '🏠', oauth_path: '/api/auth/tuya/connect' },
  { id: 'smartcar',     name: 'Connected Car',  icon: '🚗', oauth_path: '/api/v1/car/connect' },
];

function timeAgo(iso?: string): string {
  if (!iso) return '';
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return 'just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return new Date(iso).toLocaleDateString();
}

export default function ConnectionsSection() {
  const user = useAuthStore((s) => s.user);
  const [integrations, setIntegrations] = useState<Integration[]>(
    STATIC_INTEGRATIONS.map((i) => ({ ...i, connected: false }))
  );
  const [loading, setLoading] = useState(true);
  const [disconnecting, setDisconnecting] = useState<string | null>(null);

  const fetchStatus = useCallback(() => {
    apiClient<{ integrations: { id: string; connected: boolean; account?: string; last_sync?: string }[] }>(
      '/api/webapp/market/integrations'
    )
      .then((data) => {
        const map = Object.fromEntries((data.integrations ?? []).map((i) => [i.id, i]));
        setIntegrations((prev) =>
          prev.map((i) => ({
            ...i,
            connected: map[i.id]?.connected ?? false,
            account: map[i.id]?.account,
            last_sync: map[i.id]?.last_sync,
          }))
        );
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchStatus();
  }, [fetchStatus]);

  const handleConnect = useCallback(
    (conn: Integration) => {
      if (!user?.id) return;

      const url = `${API_URL}${conn.oauth_path}?user_id=${user.id}`;
      const popup = window.open(url, 'oauth', 'width=600,height=700');

      // Poll for popup close → refresh status
      const check = setInterval(() => {
        if (!popup || popup.closed) {
          clearInterval(check);
          fetchStatus();
        }
      }, 1000);
    },
    [user?.id, fetchStatus],
  );

  const handleDisconnect = async (id: string) => {
    setDisconnecting(id);
    try {
      await apiClient(`/api/webapp/market/integrations/${id}/disconnect`, { method: 'DELETE' });
      setIntegrations((prev) =>
        prev.map((i) => (i.id === id ? { ...i, connected: false, account: undefined, last_sync: undefined } : i))
      );
    } catch {
      // silent
    } finally {
      setDisconnecting(null);
    }
  };

  return (
    <section className="glass rounded-2xl p-5 space-y-4">
      <h3 className="flex items-center gap-2 text-base font-semibold text-text">
        <Plug size={16} className="text-accent" />
        Connections
      </h3>
      <div className="space-y-0">
        {integrations.map((conn, i) => (
          <div key={conn.id}>
            {i > 0 && <div className="my-3 border-t border-white/5" />}
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="text-lg">{conn.icon}</span>
                <div>
                  <p className="text-base text-text">{conn.name}</p>
                  {conn.id === 'google' && (
                    <p className="text-xs text-text-muted/60">Calendar + Gmail</p>
                  )}
                  {conn.id === 'tuya' && (
                    <p className="text-xs text-text-muted/60">Tuya Smart / Smart Life</p>
                  )}
                  <div className="flex items-center gap-1.5">
                    {loading ? (
                      <Loader2 size={10} className="animate-spin text-text-muted" />
                    ) : (
                      <Circle
                        size={6}
                        className={conn.connected ? 'fill-success text-success' : 'fill-text-muted text-text-muted'}
                      />
                    )}
                    <span className="text-sm text-text-muted">
                      {loading
                        ? 'Checking...'
                        : conn.connected
                        ? conn.account
                          ? `${conn.account}${conn.last_sync ? ` · ${timeAgo(conn.last_sync)}` : ''}`
                          : 'Connected'
                        : 'Not connected'}
                    </span>
                  </div>
                </div>
              </div>
              {conn.connected ? (
                <button
                  onClick={() => handleDisconnect(conn.id)}
                  disabled={disconnecting === conn.id}
                  className="rounded-lg border border-white/10 px-3 py-1.5 text-sm text-text-muted hover:text-error hover:border-error/30 transition-colors disabled:opacity-40"
                >
                  {disconnecting === conn.id ? <Loader2 size={12} className="animate-spin" /> : 'Disconnect'}
                </button>
              ) : (
                <button
                  onClick={() => handleConnect(conn)}
                  className="flex items-center gap-1.5 rounded-lg bg-accent/10 px-3 py-1.5 text-sm font-medium text-accent hover:bg-accent/20 transition-colors"
                >
                  Connect
                  <ExternalLink size={12} />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
