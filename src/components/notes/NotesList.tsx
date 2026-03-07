'use client';

import NoteCard from './NoteCard';
import { Plus } from 'lucide-react';

const mockNotes = [
  { id: '1', title: 'Shopping ideas', content: 'Need to check prices for a new laptop. Compare Dell XPS vs MacBook Air. Also look at monitors.', createdAt: '2026-03-05T14:30:00Z' },
  { id: '2', title: 'Meeting notes - Project Alpha', content: 'Discussed project timeline. Deadline moved to April 15. Need to finalize API contracts by next week.', createdAt: '2026-03-04T10:15:00Z' },
  { id: '3', title: 'Travel plans', content: 'Look into flights to Lisbon for Easter. Check Airbnb in Alfama area. Budget: max €800 total.', createdAt: '2026-03-02T18:00:00Z' },
  { id: '4', title: 'Recipe - Pasta Carbonara', content: 'Ingredients: spaghetti, eggs, pecorino, guanciale, black pepper. Cook pasta al dente, mix eggs with cheese...', createdAt: '2026-02-28T20:45:00Z' },
  { id: '5', title: 'Book recommendations', content: 'Atomic Habits by James Clear, Deep Work by Cal Newport, The Pragmatic Programmer.', createdAt: '2026-02-25T09:30:00Z' },
];

export default function NotesList() {
  return (
    <div className="space-y-3">
      {mockNotes.map((note) => (
        <NoteCard
          key={note.id}
          title={note.title}
          content={note.content}
          createdAt={note.createdAt}
        />
      ))}

      <button className="w-full flex items-center justify-center gap-2 rounded-xl bg-accent px-4 py-3 text-sm font-semibold text-bg hover:bg-accent/90 transition-colors shadow-lg shadow-accent/20 mt-4">
        <Plus size={16} />
        New Note
      </button>
    </div>
  );
}
