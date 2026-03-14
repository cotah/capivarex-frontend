'use client';
import { useState, useEffect, useCallback } from 'react';
import { Plug, Circle, ExternalLink, Loader2, X } from 'lucide-react';
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
  loginFlow?: boolean;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? '';

const STATIC_INTEGRATIONS: Omit<Integration, 'connected'>[] = [
  { id: 'google',   name: 'Google',        icon: '📅', oauth_path: '/api/auth/google/connect' },
  { id: 'spotify',  name: 'Spotify',       icon: '🎵', oauth_path: '/api/auth/spotify/connect' },
  { id: 'tuya',     name: 'Smart Home',    icon: '🏠', oauth_path: '', loginFlow: true },
  { id: 'smartcar', name: 'Connected Car', icon: '🚗', oauth_path: '/api/v1/car/connect' },
];

const COUNTRY_CODES = [
  { code: '353', label: 'Ireland (+353)' },
  { code: '55',  label: 'Brazil (+55)' },
  { code: '1',   label: 'USA (+1)' },
  { code: '44',  label: 'UK (+44)' },
  { code: '49',  label: 'Germany (+49)' },
  { code: '33',  label: 'France (+33)' },
  { code: '34',  label: 'Spain (+34)' },
  { code: '351', label: 'Portugal (+351)' },
  { code: '39',  label: 'Italy (+39)' },
  { code: '86',  label: 'China (+86)' },
  { code: '91',  label: 'India (+91)' },
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

  // Tuya login modal state
  const [tuyaModal, setTuyaModal] = useState(false);
  const [tuyaEmail, setTuyaEmail] = useState('');
  const [tuyaPassword, setTuyaPassword] = useState('');
  const [tuyaCountry, setTuyaCountry] = useState('353');
  const [tuyaLoading, setTuyaLoading] = useState(false);
  const [tuyaError, setTuyaError] = useState('');

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

      // Tuya uses login form instead of popup
      if (conn.loginFlow) {
        setTuyaError('');
        setTuyaModal(true);
        return;
      }

      const url = `${API_URL}${conn.oauth_path}?user_id=${user.id}`;
      const popup = window.open(url, 'oauth', 'width=600,height=700');

      const check = setInterval(() => {
        if (!popup || popup.closed) {
          clearInterval(check);
          fetchStatus();
        }
      }, 1000);
    },
    [user?.id, fetchStatus],
  );

  const handleTuyaLogin = async () => {
    if (!tuyaEmail || !tuyaPassword) {
      setTuyaError('Please enter your email and password');
      return;
    }
    setTuyaLoading(true);
    setTuyaError('');
    try {
      await apiClient('/api/auth/tuya/login', {
        method: 'POST',
        body: JSON.stringify({
          username: tuyaEmail,
          password: tuyaPassword,
          country_code: tuyaCountry,
          schema: 'smartlife',
        }),
      });
      setTuyaModal(false);
      setTuyaEmail('');
      setTuyaPassword('');
      fetchStatus();
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Login failed';
      setTuyaError(msg.includes('1106') ? 'Invalid email or password' : msg);
    } finally {
      setTuyaLoading(false);
    }
  };

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
    <>
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

      {/* Tuya Login Modal */}
      {tuyaModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="glass rounded-2xl p-6 w-full max-w-sm space-y-4 relative">
            <button
              onClick={() => setTuyaModal(false)}
              className="absolute top-4 right-4 text-text-muted hover:text-text transition-colors"
            >
              <X size={18} />
            </button>

            <div className="text-center">
              <span className="text-3xl">🏠</span>
              <h3 className="text-lg font-semibold text-text mt-2">Connect Smart Home</h3>
              <p className="text-sm text-text-muted mt-1">
                Sign in with your Tuya Smart or Smart Life account
              </p>
            </div>

            <div className="space-y-3">
              <select
                value={tuyaCountry}
                onChange={(e) => setTuyaCountry(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-text outline-none focus:border-accent/40"
              >
                {COUNTRY_CODES.map((c) => (
                  <option key={c.code} value={c.code} className="bg-[#0a0a0f]">
                    {c.label}
                  </option>
                ))}
              </select>

              <input
                type="email"
                placeholder="Email or phone number"
                value={tuyaEmail}
                onChange={(e) => setTuyaEmail(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-text placeholder:text-text-muted/40 outline-none focus:border-accent/40"
              />

              <input
                type="password"
                placeholder="Password"
                value={tuyaPassword}
                onChange={(e) => setTuyaPassword(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') handleTuyaLogin(); }}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-text placeholder:text-text-muted/40 outline-none focus:border-accent/40"
              />

              {tuyaError && (
                <p className="text-sm text-red-400 text-center">{tuyaError}</p>
              )}

              <button
                onClick={handleTuyaLogin}
                disabled={tuyaLoading}
                className="w-full rounded-xl bg-accent py-2.5 text-sm font-medium text-bg hover:bg-accent/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {tuyaLoading ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    Connecting...
                  </>
                ) : (
                  'Connect'
                )}
              </button>
            </div>

            <p className="text-xs text-text-muted/50 text-center">
              Your credentials are sent securely and not stored.
            </p>
          </div>
        </div>
      )}
    </>
  );
}
