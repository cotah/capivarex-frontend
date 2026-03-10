'use client';

import { useEffect, useState } from 'react';
import { X, Search } from 'lucide-react';
import { useConversationStore } from '@/stores/conversationStore';
import NewChatButton from './NewChatButton';
import ConversationList from './ConversationList';
import QuotaIndicator from './QuotaIndicator';
import LoadingSpinner from '@/components/shared/LoadingSpinner';

export default function ChatSidebar() {
  const sidebarOpen = useConversationStore((s) => s.sidebarOpen);
  const setSidebarOpen = useConversationStore((s) => s.setSidebarOpen);
  const isLoading = useConversationStore((s) => s.isLoading);
  const fetchConversations = useConversationStore((s) => s.fetchConversations);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

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

        {/* Search */}
        <div className="px-3 pb-2">
          <div className="relative">
            <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-text-muted/50" />
            <input
              type="text"
              placeholder="Search conversations…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg bg-white/5 border border-glass-border pl-8 pr-3 py-1.5 text-xs text-text placeholder:text-text-muted/40 focus:outline-none focus:border-accent/30 transition-colors"
            />
          </div>
        </div>

        {/* Conversation list */}
        {isLoading ? <LoadingSpinner /> : <ConversationList searchQuery={searchQuery} />}

        {/* Quota indicator */}
        <div className="border-t border-glass-border">
          <QuotaIndicator />
        </div>
      </aside>
    </>
  );
}
