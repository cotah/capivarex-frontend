import { useChatStore } from '@/stores/chatStore';
import { useConversationStore } from '@/stores/conversationStore';
import { sendMessage, ApiError } from '@/lib/api';
import { nanoid } from 'nanoid';
import type { MessageType } from '@/lib/types';
import type { UploadMediaType } from '@/hooks/useFileUpload';

interface FileAttachmentMeta {
  filename: string;
  mediaType: UploadMediaType;
  preview: string;
  fileId: string;
  localPreviewUrl?: string;
}

export function useChat() {
  const { addMessage, setThinking } = useChatStore();

  const _doSend = async (text: string, attachmentMeta?: FileAttachmentMeta) => {
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    addMessage({
      id: nanoid(),
      role: 'user',
      text: attachmentMeta
        ? (text.includes('\n\n') ? text.split('\n\n')[0] || text : text)
        : text,
      time: now,
      data: attachmentMeta ? {
        attachment: {
          filename: attachmentMeta.filename,
          mediaType: attachmentMeta.mediaType,
          preview: attachmentMeta.preview,
          fileId: attachmentMeta.fileId,
          localPreviewUrl: attachmentMeta.localPreviewUrl,
        },
      } : undefined,
    });

    setThinking(true);

    try {
      let conversationId = useConversationStore.getState().activeConversationId;
      if (!conversationId) {
        conversationId = await useConversationStore.getState().createConversation();
      }

      const response = await sendMessage(text, conversationId);

      const reply =
        (response.text as string) ||
        (response.response as string) ||
        (response.message as string) ||
        (response.content as string) ||
        (response.answer as string) ||
        (response.reply as string) ||
        '';

      console.debug('[Chat] sendMessage response keys:', Object.keys(response), 'reply:', reply);

      addMessage({
        id: nanoid(),
        role: 'assistant',
        text: reply || 'No response',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        type: response.type as MessageType | undefined,
        data: response.data as Record<string, unknown> | undefined,
      });

      if (conversationId) {
        useConversationStore.getState().addMessageToConversation(conversationId, {
          id: nanoid(),
          role: 'assistant',
          text: reply,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        });
      }

      if (response.conversation_title) {
        useConversationStore.getState().renameConversation(conversationId, response.conversation_title as string);
      } else {
        // Auto-rename with first 3 words of user text
        const words = text.trim().split(/\s+/);
        const autoTitle = words.slice(0, 3).join(' ')
          || attachmentMeta?.filename?.split('.')[0]
          || 'New conversation';
        const suffix = words.length > 3 ? '...' : '';
        useConversationStore.getState().renameConversation(conversationId, autoTitle + suffix);
      }
    } catch (error) {
      const isQuotaExceeded = error instanceof ApiError && error.status === 429;
      addMessage({
        id: nanoid(),
        role: 'assistant',
        text: isQuotaExceeded
          ? 'Daily limit reached. Upgrade your plan to continue. [Upgrade \u2192](/pricing)'
          : 'Sorry, something went wrong. Please try again.',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      });
    } finally {
      setThinking(false);
    }
  };

  const send = (text: string) => _doSend(text);
  const sendWithFile = (text: string, attachmentMeta: FileAttachmentMeta) => _doSend(text, attachmentMeta);

  return { send, sendWithFile };
}
