import { useAuthStore } from '@/stores/authStore';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

function getHeaders(): HeadersInit {
  const token = useAuthStore.getState().token;
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export async function sendMessage(
  message: string,
): Promise<Record<string, unknown>> {
  const user = useAuthStore.getState().user;

  const response = await fetch(`${API_URL}/api/chat`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({
      message,
      user_id: user?.id || 'demo-user',
      chat_id: user?.telegramChatId || user?.id || 'demo-chat',
    }),
  });

  if (response.status === 401) {
    useAuthStore.getState().logout();
    window.location.href = '/login';
    throw new Error('Session expired');
  }

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }

  return response.json();
}

export async function getServiceStatus(
  userId: string,
): Promise<Record<string, unknown>> {
  const response = await fetch(
    `${API_URL}/api/auth/google/status?user_id=${userId}`,
    { headers: getHeaders() },
  );
  return response.json();
}
