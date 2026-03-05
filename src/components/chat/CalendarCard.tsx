'use client';

import { Calendar } from 'lucide-react';

interface CalendarEvent {
  time: string;
  title: string;
  location?: string;
}

interface CalendarCardProps {
  data?: Record<string, unknown>;
}

export default function CalendarCard({ data }: CalendarCardProps) {
  const events = (data?.events as CalendarEvent[]) || [];

  if (events.length === 0) {
    return (
      <div className="mt-2 glass rounded-2xl p-4 max-w-xs">
        <div className="flex items-center gap-2 text-text-muted">
          <Calendar size={16} />
          <span className="text-xs">No upcoming events</span>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-2 glass rounded-2xl p-4 max-w-sm">
      <div className="flex items-center gap-2 mb-3">
        <Calendar size={16} className="text-accent" />
        <span className="text-xs font-medium text-text-muted uppercase tracking-wider">
          Upcoming Events
        </span>
      </div>

      <div className="space-y-0">
        {events.map((event, i) => (
          <div key={i}>
            {i > 0 && <div className="my-2 border-t border-white/5" />}
            <div className="flex items-start gap-3">
              <span className="font-mono text-xs text-accent whitespace-nowrap pt-0.5">
                {event.time}
              </span>
              <div className="min-w-0">
                <p className="text-sm text-text">{event.title}</p>
                {event.location && (
                  <p className="text-xs text-text-muted">{event.location}</p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
