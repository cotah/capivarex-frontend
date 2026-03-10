'use client';

import { useChatStore } from '@/stores/chatStore';
import { useConversationStore } from '@/stores/conversationStore';
import InputBar from '@/components/layout/InputBar';
import MessageList from '@/components/chat/MessageList';
import ChatSidebar from '@/components/chat/ChatSidebar';
import { PanelLeft } from 'lucide-react';
import WeatherChip from '@/components/weather/WeatherChip';

export default function ChatPage() {
  const messages = useChatStore((s) => s.messages);
  const hasMessages = messages.length > 0;
  const sidebarOpen = useConversationStore((s) => s.sidebarOpen);
  const toggleSidebar = useConversationStore((s) => s.toggleSidebar);

  return (
    <>
      <ChatSidebar />

      {/* PanelLeft toggle — desktop only */}
      <button
        onClick={toggleSidebar}
        className="fixed top-[4.25rem] left-4 z-30 hidden md:flex h-8 w-8 items-center justify-center rounded-lg text-text-muted hover:text-text hover:bg-white/5 transition-colors"
        aria-label="Toggle sidebar"
      >
        <PanelLeft size={20} />
      </button>

      {/* Chat area — shifts right when sidebar is open on desktop */}
      <div
        className={`transition-all duration-300 ${
          sidebarOpen ? 'md:ml-[280px]' : 'md:ml-0'
        }`}
      >
        {/* ═══ Empty state — centered welcome + input ═══ */}
        {!hasMessages ? (
          <div className="mx-auto flex h-[calc(100vh-3.5rem-6rem)] md:h-[calc(100vh-3.5rem)] max-w-3xl flex-col items-center justify-center">
            <div className="mb-4 md:hidden">
              <WeatherChip />
            </div>
            <h1 className="mb-8 text-center text-3xl font-light tracking-wide text-text md:text-5xl">
              Anywhere. Anytime.
            </h1>
            <div className="w-full">
              <InputBar centered />
            </div>
          </div>
        ) : (
          /* ═══ Conversation active — messages + input fixed at bottom ═══ */
          <>
            <div className="mx-auto flex h-[calc(100vh-3.5rem)] max-w-3xl flex-col overflow-hidden">
              <MessageList />
            </div>
            <InputBar />
          </>
        )}
      </div>
    </>
  );
}
