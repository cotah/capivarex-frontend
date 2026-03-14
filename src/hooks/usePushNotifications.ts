'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { createClient } from '@/lib/supabase/client';

const VAPID_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY ?? '';
const API_URL = process.env.NEXT_PUBLIC_API_URL ?? '';

function urlBase64ToUint8Array(base64String: string): ArrayBuffer {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; i++) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray.buffer as ArrayBuffer;
}

async function getAuthHeaders(): Promise<HeadersInit> {
  const supabase = createClient();
  const { data: { session } } = await supabase.auth.getSession();
  const token = session?.access_token || useAuthStore.getState().token;
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export interface PushState {
  supported: boolean;
  permission: NotificationPermission | 'default';
  subscribed: boolean;
  loading: boolean;
}

export function usePushNotifications() {
  const [state, setState] = useState<PushState>({
    supported: false,
    permission: 'default',
    subscribed: false,
    loading: false,
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const supported =
      'serviceWorker' in navigator &&
      'PushManager' in window &&
      'Notification' in window;

    setState((s) => ({
      ...s,
      supported,
      permission: supported ? Notification.permission : 'default',
    }));

    if (supported) {
      navigator.serviceWorker.ready.then(async (reg) => {
        const sub = await reg.pushManager.getSubscription();
        setState((s) => ({ ...s, subscribed: !!sub }));
      });
    }
  }, []);

  const subscribe = useCallback(async () => {
    if (!state.supported || !VAPID_KEY) return null;

    setState((s) => ({ ...s, loading: true }));
    try {
      const permission = await Notification.requestPermission();
      setState((s) => ({ ...s, permission }));

      if (permission !== 'granted') {
        setState((s) => ({ ...s, loading: false }));
        return null;
      }

      const reg = await navigator.serviceWorker.ready;
      const subscription = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(VAPID_KEY),
      });

      // Send subscription to backend with auth
      if (API_URL) {
        const headers = await getAuthHeaders();
        await fetch(`${API_URL}/api/webapp/notifications/subscribe`, {
          method: 'POST',
          headers,
          body: JSON.stringify(subscription.toJSON()),
        });
      }

      setState((s) => ({ ...s, subscribed: true, loading: false }));
      return subscription;
    } catch {
      setState((s) => ({ ...s, loading: false }));
      return null;
    }
  }, [state.supported]);

  const unsubscribe = useCallback(async () => {
    setState((s) => ({ ...s, loading: true }));
    try {
      const reg = await navigator.serviceWorker.ready;
      const sub = await reg.pushManager.getSubscription();
      if (sub) {
        // Tell backend to remove subscription
        if (API_URL) {
          const headers = await getAuthHeaders();
          await fetch(`${API_URL}/api/webapp/notifications/unsubscribe`, {
            method: 'POST',
            headers,
            body: JSON.stringify(sub.toJSON()),
          }).catch(() => {});
        }
        await sub.unsubscribe();
      }
      setState((s) => ({ ...s, subscribed: false, loading: false }));
    } catch {
      setState((s) => ({ ...s, loading: false }));
    }
  }, []);

  return { ...state, subscribe, unsubscribe };
}
