'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Brain, Globe, Phone, ArrowRight, Check } from 'lucide-react';
import { apiClient } from '@/lib/api';

const LANGUAGES = [
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'pt', label: 'Português', flag: '🇧🇷' },
  { code: 'es', label: 'Español', flag: '🇪🇸' },
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
  { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
];

const STEPS = ['welcome', 'language', 'phone', 'done'] as const;
type Step = (typeof STEPS)[number];

export default function OnboardingModal({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState<Step>('welcome');
  const [language, setLanguage] = useState('en');
  const [phone, setPhone] = useState('');
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  const next = () => {
    const idx = STEPS.indexOf(step);
    if (idx < STEPS.length - 1) setStep(STEPS[idx + 1]);
  };

  const finish = async () => {
    setSaving(true);
    try {
      await apiClient('/api/webapp/user/profile', {
        method: 'PATCH',
        body: JSON.stringify({
          preferred_language: language,
          ...(phone.trim() ? { phone_number: phone.trim() } : {}),
        }),
      });
    } catch {
      // silently continue — not critical
    } finally {
      localStorage.setItem('capivarex_onboarding_done', '1');
      setSaving(false);
      onClose();
      router.push('/chat');
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
      <div className="w-full max-w-md rounded-2xl border border-glass-border bg-bg/95 backdrop-blur-xl p-8 shadow-2xl">

        {/* STEP: welcome */}
        {step === 'welcome' && (
          <div className="flex flex-col items-center gap-6 text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-accent/10">
              <Brain size={36} className="text-accent" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-text">Welcome to CAPIVAREX</h2>
              <p className="text-sm text-text-muted leading-relaxed">
                Your AI-powered life assistant. Let&apos;s set up your experience in 2 quick steps.
              </p>
            </div>
            <button
              onClick={next}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-accent px-6 py-3 text-sm font-semibold text-bg hover:bg-accent/90 transition-colors"
            >
              Get started <ArrowRight size={16} />
            </button>
          </div>
        )}

        {/* STEP: language */}
        {step === 'language' && (
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-3">
              <Globe size={20} className="text-accent" />
              <h2 className="text-lg font-semibold text-text">Preferred language</h2>
            </div>
            <p className="text-sm text-text-muted -mt-2">
              CAPIVAREX will respond in this language by default.
            </p>
            <div className="grid grid-cols-1 gap-2">
              {LANGUAGES.map((l) => (
                <button
                  key={l.code}
                  onClick={() => setLanguage(l.code)}
                  className={`flex items-center gap-3 rounded-xl border px-4 py-3 text-sm transition-colors ${
                    language === l.code
                      ? 'border-accent bg-accent/10 text-accent'
                      : 'border-glass-border bg-white/5 text-text hover:bg-white/10'
                  }`}
                >
                  <span className="text-lg">{l.flag}</span>
                  {l.label}
                  {language === l.code && <Check size={14} className="ml-auto" />}
                </button>
              ))}
            </div>
            <button
              onClick={next}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-accent px-6 py-3 text-sm font-semibold text-bg hover:bg-accent/90 transition-colors"
            >
              Continue <ArrowRight size={16} />
            </button>
          </div>
        )}

        {/* STEP: phone */}
        {step === 'phone' && (
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-3">
              <Phone size={20} className="text-accent" />
              <h2 className="text-lg font-semibold text-text">Phone number</h2>
            </div>
            <p className="text-sm text-text-muted -mt-2">
              Optional. Needed for CAPIVAREX to make calls on your behalf.
            </p>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+351 912 345 678"
              className="w-full rounded-xl border border-glass-border bg-white/5 px-4 py-3 text-sm text-text placeholder:text-text-muted/40 focus:border-accent focus:outline-none"
            />
            <div className="flex gap-3">
              <button
                onClick={finish}
                className="flex-1 rounded-xl border border-glass-border bg-white/5 px-4 py-3 text-sm text-text-muted hover:bg-white/10 transition-colors"
              >
                Skip
              </button>
              <button
                onClick={finish}
                disabled={saving}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-accent px-4 py-3 text-sm font-semibold text-bg hover:bg-accent/90 transition-colors disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Finish'}
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
