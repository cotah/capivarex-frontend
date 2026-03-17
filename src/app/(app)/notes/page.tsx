'use client';
import { useT } from '@/i18n';

import { useState } from 'react';

import { StickyNote } from 'lucide-react';
import SubTabs from '@/components/shared/SubTabs';
import NotesList from '@/components/notes/NotesList';
import RemindersList from '@/components/notes/RemindersList';

const tabs = [
  { id: 'notes', label: 'Notes' },
  { id: 'reminders', label: 'Reminders' },
];

export default function NotesPage() {
  const t = useT();
  const [activeTab, setActiveTab] = useState('notes');

  return (
    <div
      className="px-4 py-8 animate-in fade-in"
    >
      <div className="mx-auto max-w-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <StickyNote size={18} className="text-accent" />
            <h2 className="text-3xl font-semibold text-text">{t('notes.title')}</h2>
          </div>
          <SubTabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />
        </div>

        {/* Content */}
        {activeTab === 'notes' ? <NotesList /> : <RemindersList />}
      </div>
    </div>
  );
}
