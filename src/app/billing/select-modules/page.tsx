'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';
import { apiClient } from '@/lib/api';
import { Check, Lock } from 'lucide-react';
import toast from 'react-hot-toast';

interface ModuleConfig {
  module_name: string;
  name: string;
  full_name: string;
  description: string;
  color: string;
  emoji: string;
  price_eur: number | null;
  status: string;
}

const MAX_SELECTIONS: Record<string, number> = {
  ara_plus_1: 1,
  capivarex_pro: 3,
};

export default function SelectModulesPage() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const [modules, setModules] = useState<ModuleConfig[]>([]);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const plan = user?.plan || '';
  const maxSelections = MAX_SELECTIONS[plan] || 1;

  useEffect(() => {
    apiClient<{ modules: ModuleConfig[] }>('/api/modules/config')
      .then((data) => {
        // Filter out ARA (always included) and disabled/coming_soon modules
        const selectable = data.modules.filter(
          (m) => m.module_name !== 'ara' && m.status !== 'disabled',
        );
        setModules(selectable);
      })
      .catch(() => toast.error('Failed to load modules'))
      .finally(() => setLoading(false));
  }, []);

  const toggleModule = useCallback(
    (moduleName: string) => {
      setSelected((prev) => {
        const next = new Set(prev);
        if (next.has(moduleName)) {
          next.delete(moduleName);
        } else if (next.size < maxSelections) {
          next.add(moduleName);
        } else {
          toast.error(
            maxSelections === 1
              ? 'You can select 1 module with this plan'
              : `You can select up to ${maxSelections} modules with this plan`,
          );
        }
        return next;
      });
    },
    [maxSelections],
  );

  const handleSubmit = async () => {
    if (selected.size === 0) {
      toast.error('Please select at least one module');
      return;
    }

    setSubmitting(true);
    try {
      await apiClient('/api/billing/activate-bundle-modules', {
        method: 'POST',
        body: JSON.stringify({ modules: Array.from(selected) }),
      });
      toast.success('Modules activated!');
      router.push('/chat');
    } catch {
      toast.error('Failed to activate modules. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-bg">
        <div className="h-8 w-8 rounded-full border-2 border-accent/30 border-t-accent animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 py-12 bg-bg">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <div className="text-4xl mb-3">🎉</div>
          <h1 className="text-2xl font-bold text-text mb-2">
            Choose your Capivara{maxSelections > 1 ? 's' : ''}
          </h1>
          <p className="text-text-muted">
            Select {maxSelections} module{maxSelections > 1 ? 's' : ''} to unlock
            with your {plan === 'ara_plus_1' ? 'ARA + 1' : 'CAPIVAREX Pro'} plan.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
          {modules.map((mod) => {
            const isSelected = selected.has(mod.module_name);
            const isComingSoon = mod.status === 'coming_soon';

            return (
              <button
                key={mod.module_name}
                onClick={() => !isComingSoon && toggleModule(mod.module_name)}
                disabled={isComingSoon}
                className={`glass rounded-xl p-4 text-left transition-all ${
                  isSelected
                    ? 'border-accent/50 shadow-lg shadow-accent/10'
                    : isComingSoon
                      ? 'opacity-50 cursor-not-allowed'
                      : 'hover:border-white/10'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-lg mr-2">{mod.emoji}</span>
                    <span className="font-semibold text-text">{mod.name}</span>
                    {isComingSoon && (
                      <span className="ml-2 text-xs text-text-muted/60 uppercase">
                        <Lock size={10} className="inline mr-0.5" />
                        Coming soon
                      </span>
                    )}
                  </div>
                  {isSelected && (
                    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-accent">
                      <Check size={12} className="text-bg" />
                    </div>
                  )}
                </div>
                <p className="text-xs text-text-muted mt-1">{mod.description}</p>
              </button>
            );
          })}
        </div>

        <div className="flex flex-col items-center gap-3">
          <button
            onClick={handleSubmit}
            disabled={selected.size === 0 || submitting}
            className="w-full max-w-xs rounded-xl bg-accent py-3 text-sm font-medium text-bg hover:bg-accent/90 disabled:opacity-50 transition-colors shadow-lg shadow-accent/20"
          >
            {submitting ? (
              <div className="h-4 w-4 mx-auto rounded-full border-2 border-bg/30 border-t-bg animate-spin" />
            ) : (
              `Activate ${selected.size} module${selected.size !== 1 ? 's' : ''}`
            )}
          </button>
          <button
            onClick={() => router.push('/chat')}
            className="text-sm text-text-muted hover:text-text transition-colors"
          >
            Skip for now
          </button>
        </div>
      </div>
    </div>
  );
}
