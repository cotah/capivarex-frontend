'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';
import { redirectToCheckout } from '@/lib/stripe';
import type { PlanInfo, PlanType } from '@/lib/types';
import { Check, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';
import { useT } from '@/i18n';

function usePlans(): PlanInfo[] {
  const t = useT();
  return [
    {
      id: 'free',
      name: t('billing.free'),
      price: '0',
      priceValue: 0,
      features: [
        t('billing_features.free_1'),
        t('billing_features.free_2'),
        t('billing_features.free_3'),
        t('billing_features.free_4'),
      ],
    },
    {
      id: 'me',
      name: t('billing.me'),
      price: '15.99',
      priceValue: 15.99,
      highlighted: true,
      features: [
        t('billing_features.me_1'),
        t('billing_features.me_2'),
        t('billing_features.me_3'),
        t('billing_features.me_4'),
        t('billing_features.me_5'),
        t('billing_features.me_6'),
      ],
    },
    {
      id: 'everywhere',
      name: t('billing.everywhere'),
      price: '49.99',
      priceValue: 49.99,
      features: [
        t('billing_features.everywhere_1'),
        t('billing_features.everywhere_2'),
        t('billing_features.everywhere_3'),
        t('billing_features.everywhere_4'),
        t('billing_features.everywhere_5'),
        t('billing_features.everywhere_6'),
        t('billing_features.everywhere_7'),
        t('billing_features.everywhere_8'),
        t('billing_features.everywhere_9'),
      ],
    },
  ];
}

export default function PricingCards() {
  const user = useAuthStore((s) => s.user);
  const router = useRouter();
  const currentPlan = user?.plan || 'free';
  const [loadingPlan, setLoadingPlan] = useState<PlanType | null>(null);
  const t = useT();
  const plans = usePlans();

  const handleUpgrade = async (planId: PlanType) => {
    if (planId === 'free' || planId === currentPlan) return;

    if (!user) {
      router.push('/login');
      return;
    }

    setLoadingPlan(planId);
    try {
      await redirectToCheckout(planId as 'me' | 'everywhere');
    } catch {
      toast.error(t('billing.checkout_error'));
      setLoadingPlan(null);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
      {plans.map((plan) => {
        const isCurrent = currentPlan === plan.id;
        const isHighlighted = plan.highlighted;

        return (
          <div
            key={plan.id}
            className={`relative glass rounded-2xl p-6 flex flex-col transition-all duration-300 ${
              isHighlighted
                ? 'border-accent/30 md:scale-105 md:-my-2 shadow-lg shadow-accent/5'
                : ''
            } ${isCurrent ? 'border-accent/40' : ''}`}
          >
            {/* Highlight badge */}
            {isHighlighted && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="inline-flex items-center gap-1 rounded-full bg-accent px-3 py-1 text-xs font-semibold text-bg uppercase tracking-wider">
                  <Sparkles size={10} />
                  Popular
                </span>
              </div>
            )}

            {/* Plan name */}
            <h3 className="text-lg font-semibold text-text">{plan.name}</h3>

            {/* Price */}
            <div className="mt-2 mb-4">
              <span className="text-3xl font-bold text-text">
                &euro;{plan.price}
              </span>
              <span className="text-sm text-text-muted">/mo</span>
            </div>

            {/* Features */}
            <ul className="flex-1 space-y-2 mb-6">
              {plan.features.map((feature) => (
                <li
                  key={feature}
                  className="flex items-start gap-2 text-sm text-text-muted"
                >
                  <Check
                    size={14}
                    className="mt-0.5 shrink-0 text-accent/70"
                  />
                  {feature}
                </li>
              ))}
            </ul>

            {/* CTA */}
            {isCurrent ? (
              <button
                disabled
                className="w-full rounded-xl border border-accent/30 py-2.5 text-sm font-medium text-accent cursor-default"
              >
                Current Plan
              </button>
            ) : plan.id === 'free' ? (
              <button
                onClick={() => router.push(user ? '/chat' : '/register')}
                className="w-full rounded-xl glass py-2.5 text-sm text-text-muted hover:text-text transition-colors"
              >
                {user ? 'Current Plan' : 'Get Started'}
              </button>
            ) : (
              <button
                onClick={() => handleUpgrade(plan.id)}
                disabled={loadingPlan !== null}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-accent py-2.5 text-sm font-medium text-bg hover:bg-accent/90 disabled:opacity-50 transition-colors shadow-lg shadow-accent/20"
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
