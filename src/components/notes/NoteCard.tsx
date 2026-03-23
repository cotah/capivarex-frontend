'use client';

interface NoteCardProps {
  title: string;
  content: string;
  createdAt: string;
}

export default function NoteCard({ title, content, createdAt }: NoteCardProps) {
  const date = new Date(createdAt);
  const formatted = date.toLocaleDateString('en-IE', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  return (
    <div className="glass rounded-2xl p-5 hover:border-accent/20 hover:shadow-lg hover:shadow-accent/5 transition-all duration-200 cursor-pointer">
      <p className="text-base font-semibold text-text mb-1">{title}</p>
      <p className="text-sm font-mono text-text-muted mb-2">{formatted}</p>
      <p className="text-sm text-text-muted leading-relaxed line-clamp-2">
        {content}
      </p>
    </div>
  );
}
