'use client';

import ReminderItem from './ReminderItem';

const mockReminders = [
  { id: '1', text: 'Call dentist for checkup', dueAt: '2026-03-08T09:00:00Z', completed: false },
  { id: '2', text: 'Pay electricity bill', dueAt: '2026-03-10T12:00:00Z', completed: false },
  { id: '3', text: 'Submit tax documents', dueAt: '2026-03-15T17:00:00Z', completed: false },
  { id: '4', text: 'Buy groceries for the week', dueAt: '2026-03-06T11:00:00Z', completed: true },
  { id: '5', text: 'Send birthday gift to Maria', dueAt: '2026-03-05T10:00:00Z', completed: true },
  { id: '6', text: 'Renew gym membership', dueAt: '2026-03-20T08:00:00Z', completed: false },
];

export default function RemindersList() {
  const pending = mockReminders.filter((r) => !r.completed);
  const completed = mockReminders.filter((r) => r.completed);

  return (
    <div className="space-y-3">
      {pending.map((r) => (
        <ReminderItem key={r.id} text={r.text} dueAt={r.dueAt} completed={false} />
      ))}
      {completed.length > 0 && (
        <>
          <p className="text-[11px] font-semibold uppercase tracking-wider text-text-muted/50 pt-2">
            Completed
          </p>
          {completed.map((r) => (
            <ReminderItem key={r.id} text={r.text} dueAt={r.dueAt} completed={true} />
          ))}
        </>
      )}
    </div>
  );
}
