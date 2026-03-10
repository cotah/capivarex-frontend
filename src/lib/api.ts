import { createClient } from '@/lib/supabase/client';
import { useAuthStore } from '@/stores/authStore';
import toast from 'react-hot-toast';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

async function getHeaders(): Promise<HeadersInit> {
  const supabase = createClient();
  const { data: { session } } = await supabase.auth.getSession();

  // Prefer Supabase session token (always fresh)
  // Fallback to store token only if it's a valid non-empty string
  const storeToken = useAuthStore.getState().token;
  const token =
    session?.access_token ||
    (storeToken && storeToken !== 'undefined' && storeToken !== 'null'
      ? storeToken
      : null);

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
  const baseHeaders = await getHeaders();
  const isFormData = options?.body instanceof FormData;

  // When sending FormData, omit Content-Type so the browser sets the
  // multipart boundary automatically. Keep Authorization intact.
  let headers: HeadersInit;
  if (isFormData) {
    const { 'Content-Type': _ct, ...rest } = baseHeaders as Record<string, string>;
    headers = { ...rest, ...options?.headers };
  } else {
    headers = { ...baseHeaders, ...options?.headers };
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    console.warn('API returned 401 — token may be invalid');
    throw new ApiError(401, 'Authentication failed');
  }

  if (!response.ok) {
    const msg = await response.text().catch(() => 'Unknown error');
    if (response.status !== 429) {
      toast.error(msg || `Error ${response.status}`);
    }
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
