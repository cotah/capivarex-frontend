'use client';
import { useT } from '@/i18n';
import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, PhoneOff, X, Clock, ChevronDown, ChevronUp } from 'lucide-react';
import { apiClient } from '@/lib/api';
import { useAuthStore } from '@/stores/authStore';

interface CallStatus {
  id: string;
  phone_number: string;
  status: 'initiated' | 'ringing' | 'in-progress' | 'completed' | 'failed';
  duration_seconds?: number;
  twilio_call_sid?: string;
  created_at: string;
}

type CallHistoryItem = CallStatus;

interface CallModalProps {
  onClose: () => void;
}

const STATUS_CONFIG: Record<string, { label: string; color: string; pulse: boolean }> = {
  initiated:    { label: 'Iniciando...', color: 'text-yellow-400',  pulse: true  },
  ringing:      { label: 'Chamando...',  color: 'text-blue-400',    pulse: true  },
  'in-progress':{ label: 'Em chamada',   color: 'text-green-400',   pulse: true  },
  completed:    { label: 'Encerrada',    color: 'text-text-muted',  pulse: false },
  failed:       { label: 'Falhou',       color: 'text-red-400',     pulse: false },
};

function formatDuration(seconds?: number): string {
  if (!seconds) return '';
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return 'agora';
  if (m < 60) return `${m}m atrás`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h atrás`;
  return new Date(iso).toLocaleDateString('pt-BR');
}

export default function CallModal({ onClose }: CallModalProps) {
  const t = useT();
  const user = useAuthStore((s) => s.user);
  const canCall = user?.plan === 'everywhere';

  const [phone, setPhone] = useState('');
  const [activeCall, setActiveCall] = useState<CallStatus | null>(null);
  const [history, setHistory] = useState<CallHistoryItem[]>([]);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Load history on mount
  useEffect(() => {
    apiClient<{ calls: CallHistoryItem[] }>('/api/webapp/calls/history')
      .then((d) => setHistory(d.calls ?? []))
      .catch(() => {});
    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current);
    };
  }, []);

  const stopPolling = useCallback(() => {
    if (pollingRef.current) {
      clearInterval(pollingRef.current);
      pollingRef.current = null;
    }
  }, []);

  const initiateCall = async () => {
    setError('');
    if (!phone.match(/^\+[1-9]\d{7,14}$/)) {
      setError('Use international format: +353 89 123 4567');
      return;
    }
    setLoading(true);
    try {
      const result = await apiClient<CallStatus>('/api/webapp/calls/initiate', {
        method: 'POST',
        body: JSON.stringify({ phone_number: phone }),
      });
      setActiveCall(result);
      // Poll status every 3s
      pollingRef.current = setInterval(async () => {
        try {
          const status = await apiClient<CallStatus>(
            `/api/webapp/calls/${result.id}/status`
          );
          setActiveCall(status);
          if (status.status === 'completed' || status.status === 'failed') {
            stopPolling();
            setActiveCall(null);
            // Refresh history
            const h = await apiClient<{ calls: CallHistoryItem[] }>(
              '/api/webapp/calls/history'
            );
            setHistory(h.calls ?? []);
          }
        } catch {
          stopPolling();
        }
      }, 3000);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Erro ao iniciar chamada';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const cfg = activeCall ? STATUS_CONFIG[activeCall.status] ?? STATUS_CONFIG.initiated : null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[80] flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm px-4 pb-4 sm:pb-0"
        onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      >
        <motion.div
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 40, opacity: 0 }}
          transition={{ type: 'spring', damping: 28, stiffness: 320 }}
          className="w-full max-w-sm rounded-2xl glass-strong border border-glass-border p-5 space-y-4"
        >
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Phone size={16} className="text-accent" />
              <span className="font-semibold text-text">{t('calls.voice_call')}</span>
            </div>
            <button onClick={onClose} className="p-1 text-text-muted hover:text-text transition-colors">
              <X size={18} />
            </button>
          </div>

          {/* Plan gate */}
          {!canCall ? (
            <div className="rounded-xl bg-accent/5 border border-accent/20 p-4 text-center space-y-2">
              <p className="text-sm text-text-muted">
                Chamadas de voz requerem o plano <span className="text-accent font-semibold">{t('billing.everywhere')}</span>.
              </p>
              <a
                href="/pricing"
                className="inline-block text-sm font-medium text-accent hover:underline"
              >
                Ver planos →
              </a>
            </div>
          ) : activeCall ? (
            /* Active call status */
            <div className="rounded-xl bg-white/5 border border-glass-border p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-text-muted">{activeCall.phone_number}</span>
                {activeCall.duration_seconds != null && (
                  <span className="text-xs text-text-muted flex items-center gap-1">
                    <Clock size={11} />
                    {formatDuration(activeCall.duration_seconds)}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                {cfg?.pulse && (
                  <span className="h-2 w-2 rounded-full bg-current animate-pulse" style={{ color: 'inherit' }} />
                )}
                <span className={`text-sm font-medium ${cfg?.color}`}>{cfg?.label}</span>
              </div>
              <button
                onClick={() => { stopPolling(); setActiveCall(null); }}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-red-500/15 border border-red-500/30 text-red-400 py-2.5 text-sm font-medium hover:bg-red-500/25 transition-colors"
              >
                <PhoneOff size={14} />
                Encerrar
              </button>
            </div>
          ) : (
            /* Dialer */
            <div className="space-y-3">
              <input
                type="tel"
                value={phone}
                onChange={(e) => { setPhone(e.target.value); setError(''); }}
                placeholder="+353 89 123 4567"
                className="w-full rounded-xl bg-white/5 border border-glass-border px-4 py-3 text-text placeholder:text-text-muted/50 text-sm outline-none focus:border-accent/40 transition-colors"
              />
              {error && <p className="text-xs text-red-400">{error}</p>}
              <button
                onClick={initiateCall}
                disabled={loading || !phone}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-accent/15 border border-accent/30 text-accent py-3 text-sm font-semibold hover:bg-accent/25 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Phone size={15} />
                {loading ? 'Iniciando...' : 'Ligar'}
              </button>
            </div>
          )}

          {/* Call history toggle */}
          {history.length > 0 && (
            <div>
              <button
                onClick={() => setHistoryOpen((p) => !p)}
                className="flex items-center gap-1.5 text-xs text-text-muted hover:text-text transition-colors w-full"
              >
                <Clock size={12} />
                Histórico ({history.length})
                {historyOpen ? <ChevronUp size={12} className="ml-auto" /> : <ChevronDown size={12} className="ml-auto" />}
              </button>
              <AnimatePresence>
                {historyOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden mt-2 space-y-1.5"
                  >
                    {history.slice(0, 8).map((call) => {
                      const c = STATUS_CONFIG[call.status] ?? STATUS_CONFIG.failed;
                      return (
                        <div
                          key={call.id}
                          className="flex items-center justify-between rounded-lg bg-white/[0.03] px-3 py-2"
                        >
                          <div>
                            <p className="text-xs text-text font-medium">{call.phone_number}</p>
                            <p className={`text-[11px] ${c.color}`}>{c.label}</p>
                          </div>
                          <div className="text-right">
                            {call.duration_seconds != null && (
                              <p className="text-[11px] text-text-muted">{formatDuration(call.duration_seconds)}</p>
                            )}
                            <p className="text-[11px] text-text-muted/50">{timeAgo(call.created_at)}</p>
                          </div>
                        </div>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
