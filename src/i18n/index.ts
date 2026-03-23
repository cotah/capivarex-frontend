/**
 * Capivarex i18n — Lightweight translation system.
 *
 * Usage:
 *   import { useT } from '@/i18n';
 *   const t = useT();
 *   t('chat.ask_placeholder')  // → "Ask CAPIVAREX anything..."
 *   t('billing.messages_today', { remaining: 25 })  // → "Messages today (25 remaining)"
 */

import en from './en.json';
import pt from './pt.json';
import es from './es.json';
import { useAuthStore } from '@/stores/authStore';

export type Locale = 'en' | 'pt' | 'es';

const messages: Record<Locale, Record<string, Record<string, string>>> = { en, pt, es };

/**
 * Get a translated string by dot-notation key.
 * Falls back to English if the key is missing in the target locale.
 */
export function translate(
  key: string,
  locale: Locale = 'en',
  params?: Record<string, string | number>,
): string {
  const [section, field] = key.split('.');
  if (!section || !field) return key;

  let text =
    messages[locale]?.[section]?.[field] ??
    messages.en?.[section]?.[field] ??
    key;

  // Replace {placeholder} with values
  if (params) {
    for (const [k, v] of Object.entries(params)) {
      text = text.replace(`{${k}}`, String(v));
    }
  }

  return text;
}

/**
 * React hook — returns a `t()` function bound to the user's locale.
 *
 * Reads locale from:
 * 1. User profile (user.preferred_language from authStore)
 * 2. Browser navigator.language
 * 3. Defaults to 'en'
 */
export function useT(): (key: string, params?: Record<string, string | number>) => string {
  const userLang = useAuthStore((s) => s.user?.language);
  const locale = resolveLocale(userLang);

  return (key: string, params?: Record<string, string | number>) =>
    translate(key, locale, params);
}

/**
 * Get the current locale (non-hook, for use outside React).
 */
export function getLocale(): Locale {
  const userLang = useAuthStore.getState().user?.language;
  return resolveLocale(userLang);
}

function resolveLocale(userLang?: string): Locale {
  if (userLang && isLocale(userLang)) return userLang;

  // Browser language detection
  if (typeof navigator !== 'undefined') {
    const browserLang = navigator.language?.slice(0, 2);
    if (browserLang && isLocale(browserLang)) return browserLang;
  }

  return 'en';
}

function isLocale(lang: string): lang is Locale {
  return lang === 'en' || lang === 'pt' || lang === 'es';
}

export { en, pt, es };
