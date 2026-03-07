import { createClient } from '@/lib/supabase/client';
import { useAuthStore } from '@/stores/authStore';
import toast from 'react-hot-toast';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

async function getHeaders(): Promise<HeadersInit> {
  const supabase = createClient();
  const { data: { session } } = await supabase.auth.getSession();
  const token = session?.access_token || useAuthStore.getState().token;

  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

export async function apiClient<T>(
  path: string,
  options?: RequestInit,
): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      ...(await getHeaders()),
      ...options?.headers,
    },
  });

  if (response.status === 401) {
    console.warn('API returned 401 — token may be invalid');
    throw new ApiError(401, 'Authentication failed');
  }

  if (!response.ok) {
    const msg = await response.text().catch(() => 'Unknown error');
    toast.error(msg || `Error ${response.status}`);
    throw new ApiError(response.status, msg);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json();
}

export async function sendMessage(
  message: string,
  conversationId?: string,
): Promise<Record<string, unknown>> {
  return apiClient<Record<string, unknown>>('/api/webapp/chat', {
    method: 'POST',
    body: JSON.stringify({
      message,
      ...(conversationId ? { conversation_id: conversationId } : {}),
    }),
  });
}
