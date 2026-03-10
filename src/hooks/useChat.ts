import { useChatStore } from '@/stores/chatStore';
import { useConversationStore } from '@/stores/conversationStore';
import { sendMessage, ApiError } from '@/lib/api';
import { nanoid } from 'nanoid';
import type { MessageType } from '@/lib/types';

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
      let conversationId = useConversationStore.getState().activeConversationId;
      if (!conversationId) {
        conversationId = await useConversationStore.getState().createConversation();
      }

      const response = await sendMessage(text, conversationId);

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
        type: response.type as MessageType | undefined,
        data: response.data as Record<string, unknown> | undefined,
      });

      // Update sidebar with latest message preview and timestamp
      if (conversationId) {
        useConversationStore.getState().addMessageToConversation(conversationId, {
          id: nanoid(),
          role: 'assistant',
          text: (response.response as string) || (response.message as string) || '',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        });
      }

      if (response.conversation_title) {
        useConversationStore.getState().renameConversation(
          conversationId,
          response.conversation_title as string,
        );
      }
    } catch (error) {
      const isQuotaExceeded = error instanceof ApiError && error.status === 429;
      addMessage({
        id: nanoid(),
        role: 'assistant',
        text: isQuotaExceeded
          ? 'Daily limit reached. Upgrade your plan to continue. [Upgrade →](/pricing)'
          : 'Sorry, something went wrong. Please try again.',
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
