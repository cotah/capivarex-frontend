'use client';
import { useT } from '@/i18n';

import { useEffect, useState } from 'react';
import { Shield, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { apiClient } from '@/lib/api';

interface SecurityEvent {
  id: string;
  event_type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  ip_address?: string;
  endpoint?: string;
  created_at: string;
  details?: Record<string, string>;
}

interface SecuritySummary {
  total_events: number;
  auth_failures_24h: number;
  last_login?: string;
  last_login_ip?: string;
}

const SEVERITY_COLORS: Record<string, string> = {
  low: 'text-green-400',
  medium: 'text-yellow-400',
  high: 'text-orange-400',
  critical: 'text-red-400',
};

const EVENT_LABELS: Record<string, string> = {
  auth_success: 'Successful login',
  auth_failure: 'Failed login attempt',
  rate_limit_exceeded: 'Rate limit hit',
  invalid_token: 'Invalid token used',
  suspicious_request: 'Suspicious request',
  code_execution: 'Code executed',
  admin_action: 'Admin action',
  quota_exceeded: 'Quota exceeded',
  unauthorized_access: 'Unauthorized access',
  data_export: 'Data exported',
};

function formatTime(iso: string): string {
  try {
    const d = new Date(iso);
    return d.toLocaleString(undefined, {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return iso;
  }
}

export default function SecuritySection() {
  const t = useT();
  const [events, setEvents] = useState<SecurityEvent[]>([]);
  const [summary, setSummary] = useState<SecuritySummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    apiClient<{ events: SecurityEvent[]; summary: SecuritySummary }>(
      '/api/webapp/security/events?limit=10',
    )
      .then((data) => {
        if (!cancelled) {
          setEvents(data.events ?? []);
          setSummary(data.summary ?? null);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          // 404 means endpoint not yet deployed — silently hide section
          if (err?.status !== 404) {
            setError('Could not load security events.');
          }
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, []);

  // Hide section if endpoint not available yet
  if (!loading && error === null && events.length === 0 && summary === null) {
    return null;
  }

  return (
    <section className="glass rounded-2xl p-5 space-y-4">
      <h3 className="flex items-center gap-2 text-base font-semibold text-text">
        <Shield size={16} className="text-accent" />
        Security Activity
      </h3>

      {loading && (
        <div className="flex items-center gap-2 text-sm text-text-muted">
          <Clock size={14} className="animate-spin" />
          Loading security events…
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 text-sm text-error/70">
          <AlertTriangle size={14} />
          {error}
        </div>
      )}

      {!loading && !error && summary && (
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="glass rounded-xl p-3 space-y-1">
            <p className="text-text-muted text-xs">{t('settings.failed_logins')}</p>
            <p className={`font-semibold ${summary.auth_failures_24h > 0 ? 'text-yellow-400' : 'text-green-400'}`}>
              {summary.auth_failures_24h}
            </p>
          </div>
          <div className="glass rounded-xl p-3 space-y-1">
            <p className="text-text-muted text-xs">{t('settings.last_login')}</p>
            <p className="font-semibold text-text text-xs">
              {summary.last_login ? formatTime(summary.last_login) : '—'}
            </p>
          </div>
        </div>
      )}

      {!loading && !error && events.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs text-text-muted font-medium uppercase tracking-wide">
            Recent events
          </p>
          <ul className="space-y-1.5">
            {events.map((ev) => (
              <li key={ev.id} className="flex items-start gap-2 text-sm">
                {ev.severity === 'low' ? (
                  <CheckCircle size={14} className="mt-0.5 shrink-0 text-green-400" />
                ) : (
                  <AlertTriangle
                    size={14}
                    className={`mt-0.5 shrink-0 ${SEVERITY_COLORS[ev.severity] ?? 'text-text-muted'}`}
                  />
                )}
                <div className="flex-1 min-w-0">
                  <span className="text-text">
                    {EVENT_LABELS[ev.event_type] ?? ev.event_type}
                  </span>
                  {ev.ip_address && (
                    <span className="text-text-muted ml-1">
                      from {ev.ip_address}
                    </span>
                  )}
                </div>
                <span className="text-text-muted text-xs shrink-0">
                  {formatTime(ev.created_at)}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {!loading && !error && events.length === 0 && (
        <div className="flex items-center gap-2 text-sm text-green-400">
          <CheckCircle size={14} />
          No security events recorded.
        </div>
      )}
    </section>
  );
}
