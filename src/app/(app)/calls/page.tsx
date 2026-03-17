'use client';
import { useT } from '@/i18n';
import { useState, useEffect } from 'react';

import { Phone, Clock } from 'lucide-react';
import { apiClient } from '@/lib/api';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import EmptyState from '@/components/shared/EmptyState';

interface CallHistoryItem {
  id: string;
  phone_number: string;
  status: string;
  duration_seconds?: number;
  created_at: string;
}

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  initiated:     { label: 'Iniciada',    color: 'text-yellow-400' },
  ringing:       { label: 'Chamando',    color: 'text-blue-400'   },
  'in-progress': { label: 'Em chamada',  color: 'text-green-400'  },
  completed:     { label: 'Encerrada',   color: 'text-text-muted' },
  failed:        { label: 'Falhou',      color: 'text-red-400'    },
};

function formatDuration(s?: number) {
  if (!s) return '—';
  return `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;
}

export default function CallsPage() {
  const t = useT();
  const [calls, setCalls] = useState<CallHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient<{ calls: CallHistoryItem[] }>('/api/webapp/calls/history')
      .then((d) => setCalls(d.calls ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <div
      className="px-4 py-8 animate-in fade-in"
    >
      <div className="mx-auto max-w-2xl space-y-6">
        <div className="flex items-center gap-2">
          <Phone size={18} className="text-accent" />
          <h2 className="text-3xl font-semibold text-text">{t('calls.title')}</h2>
        </div>

        {calls.length === 0 ? (
          <EmptyState
            icon={Clock}
            title={t('calls.no_calls')}
            description="Use the + button in chat to make your first AI call."
          />
        ) : (
          <div className="space-y-2">
            {calls.map((call) => {
              const cfg = STATUS_CONFIG[call.status] ?? STATUS_CONFIG.failed;
              return (
                <div
                  key={call.id}
                  className="flex items-center justify-between rounded-xl glass px-4 py-3"
                >
                  <div>
                    <p className="text-sm font-medium text-text">{call.phone_number}</p>
                    <p className={`text-xs ${cfg.color}`}>{cfg.label}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-text-muted">{formatDuration(call.duration_seconds)}</p>
                    <p className="text-xs text-text-muted/50">
                      {new Date(call.created_at).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
