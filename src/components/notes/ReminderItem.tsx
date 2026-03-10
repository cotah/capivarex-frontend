'use client';

interface ReminderItemProps {
  title: string;
  remindAt: string;
  done: boolean;
  onToggle?: () => void;
}

export default function ReminderItem({ title, remindAt, done, onToggle }: ReminderItemProps) {
  const date = new Date(remindAt);
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
        <button
          onClick={onToggle}
          className="text-base flex-shrink-0 hover:scale-110 transition-transform"
          aria-label={done ? 'Mark as pending' : 'Mark as done'}
        >
          {done ? '\u2705' : '\uD83D\uDD14'}
        </button>
        <p
          className={`text-base truncate ${
            done
              ? 'text-text-muted/50 line-through'
              : 'text-text font-medium'
          }`}
        >
          {title}
        </p>
      </div>
      <div className="flex-shrink-0 text-right">
        <p className="text-sm font-mono text-text-muted">{formatted}</p>
        <p className="text-sm font-mono text-text-muted/60">{time}</p>
      </div>
    </div>
  );
}
