'use client';

import { Bell, BellOff } from 'lucide-react';
import { usePushNotifications } from '@/hooks/usePushNotifications';

const notifTypes = [
  { key: 'reminders', label: 'Calendar reminders' },
  { key: 'grocery', label: 'Grocery deals & price alerts' },
  { key: 'music', label: 'Music recommendations' },
  { key: 'insights', label: 'Weekly insights summary' },
] as const;

export default function NotificationSettings() {
  const { supported, permission, subscribed, loading, subscribe, unsubscribe } =
    usePushNotifications();

  if (!supported) {
    return (
      <section className="glass rounded-2xl p-5 space-y-4">
        <h3 className="flex items-center gap-2 text-sm font-semibold text-text">
          <BellOff size={16} className="text-text-muted" />
          Push Notifications
        </h3>
        <p className="text-xs text-text-muted">
          Push notifications are not supported in this browser.
        </p>
      </section>
    );
  }

  return (
    <section className="glass rounded-2xl p-5 space-y-4">
      <h3 className="flex items-center gap-2 text-sm font-semibold text-text">
        <Bell size={16} className="text-accent" />
        Push Notifications
      </h3>

      {/* Master toggle */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-text">
            {subscribed ? 'Notifications enabled' : 'Enable notifications'}
          </p>
          <p className="text-[11px] text-text-muted">
            {permission === 'denied'
              ? 'Blocked in browser settings'
              : 'Receive updates even when the app is closed'}
          </p>
        </div>
        <button
          disabled={loading || permission === 'denied'}
          onClick={subscribed ? unsubscribe : subscribe}
          className={`relative h-7 w-12 rounded-full transition-colors ${
            subscribed ? 'bg-accent/30' : 'bg-white/10'
          } ${loading || permission === 'denied' ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <span
            className={`absolute top-0.5 h-6 w-6 rounded-full transition-all ${
              subscribed
                ? 'left-[22px] bg-accent'
                : 'left-0.5 bg-text-muted'
            }`}
          />
        </button>
      </div>

      {/* Per-type toggles (visual only - backend controlled) */}
      {subscribed && (
        <div className="space-y-0 pt-2 border-t border-white/5">
          {notifTypes.map(({ key, label }, i) => (
            <div key={key}>
              {i > 0 && <div className="my-2.5 border-t border-white/5" />}
              <div className="flex items-center justify-between">
                <span className="text-xs text-text-muted">{label}</span>
                <div className="h-5 w-9 rounded-full bg-accent/25 relative">
                  <span className="absolute top-0.5 left-[15px] h-4 w-4 rounded-full bg-accent transition-all" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
