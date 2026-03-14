import { useChatStore } from '@/stores/chatStore';
import { useConversationStore } from '@/stores/conversationStore';
import { sendMessage, sendMessageStream, ApiError } from '@/lib/api';
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
  const { addMessage, appendToMessage, updateMessage, setThinking } = useChatStore();

  const _doSend = async (text: string, attachmentMeta?: FileAttachmentMeta) => {
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // Add user message
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

      // Create placeholder assistant message for streaming
      const assistantMsgId = nanoid();
      let streamedText = '';
      let streamFailed = false;

      try {
        await sendMessageStream(text, conversationId, {
          onThinking: (data) => {
            // Show empty assistant message IMMEDIATELY — user sees activity
            setThinking(false);
            addMessage({
              id: assistantMsgId,
              role: 'assistant',
              text: '',
              time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            });
            if (data.conversation_id && !useConversationStore.getState().activeConversationId) {
              useConversationStore.getState().setActiveConversation(data.conversation_id);
            }
          },
          onStart: () => {
            // Agent selected — if thinking didn't fire, create message now
            if (!streamedText && !useChatStore.getState().messages.find(m => m.id === assistantMsgId)) {
              setThinking(false);
              addMessage({
                id: assistantMsgId,
                role: 'assistant',
                text: '',
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              });
            }
          },
          onToken: (token) => {
            streamedText += token;
            appendToMessage(assistantMsgId, token);
          },
          onData: (data) => {
            // Update message with extra data (images, etc)
            updateMessage(assistantMsgId, { data: data as Record<string, unknown> });
          },
          onDone: (data) => {
            // Update message with final metadata
            updateMessage(assistantMsgId, {
              type: (data.type as MessageType) || 'text',
              data: data.data as Record<string, unknown> | undefined,
            });

            // Update conversation title
            if (data.conversation_title) {
              useConversationStore.getState().renameConversation(
                conversationId!, data.conversation_title as string
              );
            } else {
              const words = text.trim().split(/\s+/);
              const autoTitle = words.slice(0, 3).join(' ') || 'New conversation';
              const suffix = words.length > 3 ? '...' : '';
              useConversationStore.getState().renameConversation(
                conversationId!, autoTitle + suffix
              );
            }

            if (conversationId) {
              useConversationStore.getState().addMessageToConversation(conversationId, {
                id: assistantMsgId,
                role: 'assistant',
                text: streamedText,
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              });
            }
          },
          onError: (error) => {
            updateMessage(assistantMsgId, { text: 'Sorry, something went wrong. Please try again.' });
            console.error('[Chat] Stream error:', error);
          },
        });
      } catch (streamError) {
        streamFailed = true;
        console.warn('[Chat] Stream failed, falling back to regular:', streamError);

        // If streaming failed before onStart, we still have thinking indicator
        // Remove the empty assistant message if it was created
        if (streamedText === '') {
          // Remove placeholder — fall through to regular send below
        }

        // Check if it's a quota error
        if (streamError instanceof ApiError && streamError.status === 429) {
          throw streamError; // Re-throw to be caught by outer catch
        }
      }

      // Fallback to non-streaming if stream failed
      if (streamFailed && streamedText === '') {
        const response = await sendMessage(text, conversationId);

        const reply =
          (response.text as string) ||
          (response.response as string) ||
          (response.message as string) ||
          (response.content as string) ||
          (response.answer as string) ||
          (response.reply as string) ||
          '';

        // If we already created a placeholder, update it; otherwise add new
        addMessage({
          id: nanoid(),
          role: 'assistant',
          text: reply || 'No response',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          type: response.type as MessageType | undefined,
          data: response.data as Record<string, unknown> | undefined,
        });

        if (response.conversation_title) {
          useConversationStore.getState().renameConversation(conversationId, response.conversation_title as string);
        } else {
          const words = text.trim().split(/\s+/);
          const autoTitle = words.slice(0, 3).join(' ') || 'New conversation';
          const suffix = words.length > 3 ? '...' : '';
          useConversationStore.getState().renameConversation(conversationId, autoTitle + suffix);
        }

        if (conversationId) {
          useConversationStore.getState().addMessageToConversation(conversationId, {
            id: nanoid(),
            role: 'assistant',
            text: reply,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          });
        }
      }
    } catch (error) {
      const isQuotaExceeded = error instanceof ApiError && error.status === 429;
      addMessage({
        id: nanoid(),
        role: 'assistant',
        text: isQuotaExceeded
          ? 'Daily limit reached. Upgrade your plan to continue. [Upgrade →](/pricing)'
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
