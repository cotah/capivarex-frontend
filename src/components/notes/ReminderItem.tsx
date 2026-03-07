'use client';

interface ReminderItemProps {
  text: string;
  dueAt: string;
  completed: boolean;
}

export default function ReminderItem({ text, dueAt, completed }: ReminderItemProps) {
  const date = new Date(dueAt);
  const formatted = date.toLocaleDateString('en-IE', {
    day: 'numeric',
    month: 'short',
  });
  const time = date.toLocaleTimeString('en-IE', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="glass rounded-xl px-4 py-3 flex items-center justify-between gap-3">
      <div className="flex items-center gap-3 min-w-0">
        <span className="text-base flex-shrink-0">{completed ? '✅' : '🔔'}</span>
        <p
          className={`text-sm truncate ${
            completed
              ? 'text-text-muted/50 line-through'
              : 'text-text font-medium'
          }`}
        >
          {text}
        </p>
      </div>
      <div className="flex-shrink-0 text-right">
        <p className="text-[11px] font-mono text-text-muted">{formatted}</p>
        <p className="text-[10px] font-mono text-text-muted/60">{time}</p>
      </div>
    </div>
  );
}
