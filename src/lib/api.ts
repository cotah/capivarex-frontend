const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function sendMessage(
  message: string,
  userId: string,
  chatId: string,
): Promise<Record<string, unknown>> {
  const response = await fetch(`${API_URL}/api/chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      message,
      user_id: userId,
      chat_id: chatId,
    }),
  });

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
  );
  return response.json();
}
