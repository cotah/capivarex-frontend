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
    const { 'Content-Type': _, ...rest } = baseHeaders as Record<string, string>;
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

/**
 * Stream chat response via SSE.
 * Calls onToken for each token, onDone when complete.
 */
export async function sendMessageStream(
  message: string,
  conversationId: string | undefined,
  callbacks: {
    onStart?: (data: { agent: string; conversation_id: string }) => void;
    onToken?: (token: string) => void;
    onData?: (data: Record<string, unknown>) => void;
    onDone?: (data: Record<string, unknown>) => void;
    onError?: (error: string) => void;
  },
): Promise<void> {
  const headers = await getHeaders();

  const response = await fetch(`${API_URL}/api/webapp/chat/stream`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      message,
      ...(conversationId ? { conversation_id: conversationId } : {}),
    }),
  });

  if (!response.ok) {
    const msg = await response.text().catch(() => 'Unknown error');
    if (response.status === 429) {
      throw new ApiError(429, msg);
    }
    throw new ApiError(response.status, msg);
  }

  const reader = response.body?.getReader();
  if (!reader) throw new Error('No response body');

  const decoder = new TextDecoder();
  let buffer = '';

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });

      // Process complete SSE events (separated by \n\n)
      const events = buffer.split('\n\n');
      buffer = events.pop() || ''; // Keep incomplete event in buffer

      for (const event of events) {
        const dataLine = event.trim();
        if (!dataLine.startsWith('data: ')) continue;

        try {
          const data = JSON.parse(dataLine.slice(6));

          switch (data.type) {
            case 'start':
              callbacks.onStart?.(data);
              break;
            case 'token':
              callbacks.onToken?.(data.content || '');
              break;
            case 'data':
              callbacks.onData?.(data.data || {});
              break;
            case 'done':
              callbacks.onDone?.(data);
              break;
            case 'error':
              callbacks.onError?.(data.detail || 'Stream error');
              break;
          }
        } catch {
          // Skip malformed JSON
        }
      }
    }
  } finally {
    reader.releaseLock();
  }
}

// ---------------------------------------------------------------------------
// Quota
// ---------------------------------------------------------------------------

export interface QuotaInfo {
  plan: string;
  messages_used: number;
  messages_limit: number;
  quota_pct: number;
  is_unlimited: boolean;
  messages_remaining: number;
}

/** Fetch the current user's daily message quota from the backend. */
export async function fetchQuota(): Promise<QuotaInfo> {
  return apiClient<QuotaInfo>('/api/webapp/quota');
}
