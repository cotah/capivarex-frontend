'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';
import { redirectToCheckout } from '@/lib/stripe';
import type { PlanInfo, PlanType } from '@/lib/types';
import { Check, Sparkles, Crown } from 'lucide-react';
import toast from 'react-hot-toast';
import { useT } from '@/i18n';

function usePlans(): PlanInfo[] {
  const t = useT();
  return [
    {
      id: 'ara',
      name: 'ARA',
      price: '19.99',
      priceValue: 19.99,
      features: [
        t('billing_features.ara_1'),
        t('billing_features.ara_2'),
        t('billing_features.ara_3'),
        t('billing_features.ara_4'),
      ],
    },
    {
      id: 'ara_plus_1',
      name: 'ARA + 1',
      price: '27.99',
      priceValue: 27.99,
      highlighted: true,
      features: [
        t('billing_features.ara_plus_1_1'),
        t('billing_features.ara_plus_1_2'),
        t('billing_features.ara_plus_1_3'),
        t('billing_features.ara_plus_1_4'),
      ],
    },
    {
      id: 'capivarex_pro',
      name: 'CAPIVAREX Pro',
      price: '44.99',
      priceValue: 44.99,
      features: [
        t('billing_features.pro_1'),
        t('billing_features.pro_2'),
        t('billing_features.pro_3'),
        t('billing_features.pro_4'),
        t('billing_features.pro_5'),
      ],
    },
    {
      id: 'capivarex_ultimate',
      name: 'CAPIVAREX Ultimate',
      price: '89.99',
      priceValue: 89.99,
      features: [
        t('billing_features.ultimate_1'),
        t('billing_features.ultimate_2'),
        t('billing_features.ultimate_3'),
        t('billing_features.ultimate_4'),
        t('billing_features.ultimate_5'),
        t('billing_features.ultimate_6'),
      ],
    },
  ];
}

export default function PricingCards() {
  const user = useAuthStore((s) => s.user);
  const router = useRouter();
  const currentPlan = user?.plan || 'ara';
  const [loadingPlan, setLoadingPlan] = useState<PlanType | null>(null);
  const t = useT();
  const plans = usePlans();

  const handleUpgrade = async (planId: PlanType) => {
    if (planId === currentPlan) return;

    if (!user) {
      router.push('/login');
      return;
    }

    setLoadingPlan(planId);
    try {
      await redirectToCheckout(planId);
    } catch {
      toast.error(t('billing.checkout_error'));
      setLoadingPlan(null);
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {plans.map((plan) => {
        const isCurrent = currentPlan === plan.id;
        const isHighlighted = plan.highlighted;
        const isUltimate = plan.id === 'capivarex_ultimate';

        return (
          <div
            key={plan.id}
            className={`relative glass rounded-2xl p-5 flex flex-col transition-all duration-300 ${
              isHighlighted
                ? 'border-accent/30 shadow-lg shadow-accent/5'
                : isUltimate
                  ? 'border-[#D4A017]/30 shadow-lg shadow-[#D4A017]/5'
                  : ''
            } ${isCurrent ? 'border-accent/40' : ''}`}
          >
            {isHighlighted && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="inline-flex items-center gap-1 rounded-full bg-accent px-3 py-1 text-xs font-semibold text-bg uppercase tracking-wider">
                  <Sparkles size={10} />
                  Popular
                </span>
              </div>
            )}
            {isUltimate && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="inline-flex items-center gap-1 rounded-full bg-[#D4A017] px-3 py-1 text-xs font-semibold text-bg uppercase tracking-wider whitespace-nowrap">
                  <Crown size={10} />
                  Full Access
                </span>
              </div>
            )}

            <h3 className="text-base font-semibold text-text">{plan.name}</h3>
            <div className="mt-2 mb-4">
              <span className="text-2xl font-bold text-text">&euro;{plan.price}</span>
              <span className="text-sm text-text-muted">/mo</span>
            </div>

            <ul className="flex-1 space-y-2 mb-5">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-start gap-2 text-sm text-text-muted">
                  <Check size={14} className="mt-0.5 shrink-0 text-accent/70" />
                  {feature}
                </li>
              ))}
            </ul>

            {isCurrent ? (
              <button disabled className="w-full rounded-xl border border-accent/30 py-2.5 text-sm font-medium text-accent cursor-default">
                {t('billing.current_plan')}
              </button>
            ) : (
              <button
                onClick={() => handleUpgrade(plan.id)}
                disabled={loadingPlan !== null}
                className={`w-full flex items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-medium text-bg hover:opacity-90 disabled:opacity-50 transition-colors shadow-lg ${
                  isUltimate ? 'bg-[#D4A017] shadow-[#D4A017]/20' : 'bg-accent shadow-accent/20'
                }`}
              >
                {loadingPlan === plan.id ? (
                  <div className="h-4 w-4 rounded-full border-2 border-bg/30 border-t-bg animate-spin" />
                ) : (
                  t('common.upgrade')
                )}
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
}
