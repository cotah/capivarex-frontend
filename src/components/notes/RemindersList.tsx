'use client';

import { useState, useEffect } from 'react';
import { Bell } from 'lucide-react';
import { fetchReminders, toggleReminder } from '@/lib/notes';
import ReminderItem from './ReminderItem';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import EmptyState from '@/components/shared/EmptyState';
import type { Reminder } from '@/lib/types';

export default function RemindersList() {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await fetchReminders();
        setReminders(data);
      } catch {
        // error handled upstream
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleToggle = async (id: string, done: boolean) => {
    setReminders((prev) =>
      prev.map((r) => (r.id === id ? { ...r, done } : r)),
    );
    try {
      await toggleReminder(id, done);
    } catch {
      // revert on error
      setReminders((prev) =>
        prev.map((r) => (r.id === id ? { ...r, done: !done } : r)),
      );
    }
  };

  if (loading) return <LoadingSpinner />;

  if (reminders.length === 0) {
    return (
      <EmptyState
        icon={Bell}
        title="No reminders"
        description="Ask CAPIVAREX to set one for you."
      />
    );
  }

  const pending = reminders.filter((r) => !r.done);
  const done = reminders.filter((r) => r.done);

  return (
    <div className="space-y-3">
      {pending.map((r) => (
        <ReminderItem
          key={r.id}
          title={r.title}
          remindAt={r.remind_at}
          done={false}
          onToggle={() => handleToggle(r.id, true)}
        />
      ))}
      {done.length > 0 && (
        <>
          <p className="text-sm font-semibold uppercase tracking-wider text-text-muted/50 pt-2">
            Done
          </p>
          {done.map((r) => (
            <ReminderItem
              key={r.id}
              title={r.title}
              remindAt={r.remind_at}
              done={true}
              onToggle={() => handleToggle(r.id, false)}
            />
          ))}
        </>
      )}
    </div>
  );
}
