'use client';

import { useEffect } from 'react';
import { X } from 'lucide-react';
import { useConversationStore } from '@/stores/conversationStore';
import NewChatButton from './NewChatButton';
import ConversationList from './ConversationList';

export default function ChatSidebar() {
  const sidebarOpen = useConversationStore((s) => s.sidebarOpen);
  const setSidebarOpen = useConversationStore((s) => s.setSidebarOpen);

  /* Close on Escape */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSidebarOpen(false);
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [setSidebarOpen]);

  return (
    <>
      {/* ══ Mobile overlay backdrop ══ */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ══ Sidebar panel ══ */}
      <aside
        className={`fixed top-14 bottom-0 left-0 z-50 flex w-[85vw] md:w-[280px] flex-col border-r border-glass-border bg-bg transition-transform duration-300 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Header — close button + title */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-glass-border">
          <span className="text-sm font-semibold text-text-muted">History</span>
          <button
            onClick={() => setSidebarOpen(false)}
            className="flex h-7 w-7 items-center justify-center rounded-lg text-text-muted hover:text-text hover:bg-white/5 transition-colors"
            aria-label="Close sidebar"
          >
            <X size={16} />
          </button>
        </div>

        {/* New Chat button */}
        <div className="px-3 py-3">
          <NewChatButton />
        </div>

        {/* Conversation list */}
        <ConversationList />
      </aside>
    </>
  );
}
