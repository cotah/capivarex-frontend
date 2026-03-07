'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { StickyNote } from 'lucide-react';
import SubTabs from '@/components/shared/SubTabs';
import NotesList from '@/components/notes/NotesList';
import RemindersList from '@/components/notes/RemindersList';

const tabs = [
  { id: 'notes', label: 'Notes' },
  { id: 'reminders', label: 'Reminders' },
];

export default function NotesPage() {
  const [activeTab, setActiveTab] = useState('notes');

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="px-4 py-8"
    >
      <div className="mx-auto max-w-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <StickyNote size={18} className="text-accent" />
            <h2 className="text-lg font-semibold text-text">Notes</h2>
          </div>
          <SubTabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />
        </div>

        {/* Content */}
        {activeTab === 'notes' ? <NotesList /> : <RemindersList />}
      </div>
    </motion.div>
  );
}
