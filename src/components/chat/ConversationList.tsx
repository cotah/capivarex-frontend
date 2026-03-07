'use client';

import { useMemo } from 'react';
import { useConversationStore, type Conversation } from '@/stores/conversationStore';
import { useChatStore } from '@/stores/chatStore';
import ConversationItem from './ConversationItem';

interface GroupedConversations {
  label: string;
  items: Conversation[];
}

function groupByPeriod(conversations: Conversation[]): GroupedConversations[] {
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterdayStart = new Date(todayStart.getTime() - 86400000);
  const weekStart = new Date(todayStart.getTime() - 6 * 86400000);

  const today: Conversation[] = [];
  const yesterday: Conversation[] = [];
  const thisWeek: Conversation[] = [];
  const earlier: Conversation[] = [];

  for (const c of conversations) {
    const d = new Date(c.updatedAt);
    if (d >= todayStart) today.push(c);
    else if (d >= yesterdayStart) yesterday.push(c);
    else if (d >= weekStart) thisWeek.push(c);
    else earlier.push(c);
  }

  const groups: GroupedConversations[] = [];
  if (today.length > 0) groups.push({ label: 'Today', items: today });
  if (yesterday.length > 0) groups.push({ label: 'Yesterday', items: yesterday });
  if (thisWeek.length > 0) groups.push({ label: 'This Week', items: thisWeek });
  if (earlier.length > 0) groups.push({ label: 'Earlier', items: earlier });

  return groups;
}

export default function ConversationList() {
  const conversations = useConversationStore((s) => s.conversations);
  const activeId = useConversationStore((s) => s.activeConversationId);
  const setActive = useConversationStore((s) => s.setActiveConversation);
  const setSidebarOpen = useConversationStore((s) => s.setSidebarOpen);

  const groups = useMemo(() => groupByPeriod(conversations), [conversations]);

  const handleSelect = (id: string) => {
    setActive(id);
    // Load conversation messages (mock: clear for now)
    useChatStore.setState({ messages: [], isThinking: false });
    // Close sidebar on mobile
    if (window.innerWidth < 768) {
      setSidebarOpen(false);
    }
  };

  if (conversations.length === 0) {
    return (
      <p className="px-4 py-6 text-center text-sm text-text-muted">
        No conversations yet.
      </p>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto space-y-4 px-2">
      {groups.map((group) => (
        <div key={group.label}>
          <p className="px-3 pb-1 text-xs font-semibold uppercase tracking-wider text-text-muted/60">
            {group.label}
          </p>
          <div className="space-y-0.5">
            {group.items.map((c) => (
              <ConversationItem
                key={c.id}
                id={c.id}
                title={c.title}
                active={c.id === activeId}
                onSelect={() => handleSelect(c.id)}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
