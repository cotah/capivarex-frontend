import { createClient } from '@/lib/supabase/client';
import { useAuthStore } from '@/stores/authStore';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

async function getAuthHeaders(): Promise<HeadersInit> {
  const supabase = createClient();
  const { data: { session } } = await supabase.auth.getSession();
  const token = session?.access_token || useAuthStore.getState().token;

  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export async function redirectToCheckout(plan: string) {
  const user = useAuthStore.getState().user;

  const res = await fetch(`${API_URL}/api/billing/create-checkout`, {
    method: 'POST',
    headers: await getAuthHeaders(),
    body: JSON.stringify({ plan, user_id: user?.id }),
  });

  if (!res.ok) {
    throw new Error('Failed to create checkout session');
  }

  const data = await res.json();
  const checkoutUrl = (data as Record<string, string>).checkout_url;
  window.location.href = checkoutUrl;
}

export async function openBillingPortal() {
  const user = useAuthStore.getState().user;

  const res = await fetch(`${API_URL}/api/billing/portal`, {
    method: 'POST',
    headers: await getAuthHeaders(),
    body: JSON.stringify({ user_id: user?.id }),
  });

  if (!res.ok) {
    throw new Error('Failed to open billing portal');
  }

  const data = await res.json();
  const portalUrl = (data as Record<string, string>).portal_url;
  window.location.href = portalUrl;
}

export async function getBillingStatus(): Promise<Record<string, unknown>> {
  const res = await fetch(`${API_URL}/api/billing/status`, {
    headers: await getAuthHeaders(),
  });

  if (!res.ok) {
    throw new Error('Failed to fetch billing status');
  }

  return res.json();
}
