import { useChatStore } from '@/stores/chatStore';
import { sendMessage } from '@/lib/api';
import { nanoid } from 'nanoid';

export function useChat() {
  const { addMessage, setThinking } = useChatStore();

  const send = async (text: string) => {
    const now = new Date().toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });

    addMessage({
      id: nanoid(),
      role: 'user',
      text,
      time: now,
    });

    setThinking(true);

    try {
      const response = await sendMessage(text, 'demo-user', 'demo-chat');

      addMessage({
        id: nanoid(),
        role: 'assistant',
        text:
          (response.response as string) ||
          (response.message as string) ||
          'No response',
        time: new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        }),
        type: response.type as 'text' | 'music' | 'calendar' | undefined,
        data: response.data as Record<string, unknown> | undefined,
      });
    } catch {
      addMessage({
        id: nanoid(),
        role: 'assistant',
        text: 'Sorry, something went wrong. Please try again.',
        time: new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        }),
      });
    } finally {
      setThinking(false);
    }
  };

  return { send };
}
