'use client';

import { useState, useEffect } from 'react';
import { Plus, StickyNote } from 'lucide-react';
import { fetchNotes } from '@/lib/notes';
import NoteCard from './NoteCard';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import EmptyState from '@/components/shared/EmptyState';
import type { Note } from '@/lib/types';

export default function NotesList() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await fetchNotes();
        setNotes(data);
      } catch {
        // error handled upstream
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) return <LoadingSpinner />;

  if (notes.length === 0) {
    return (
      <EmptyState
        icon={StickyNote}
        title="No notes yet"
        description="Ask Capivarex to take a note or create one yourself."
      />
    );
  }

  return (
    <div className="space-y-3">
      {notes.map((note) => (
        <NoteCard
          key={note.id}
          title={note.title}
          content={note.content}
          createdAt={note.created_at}
        />
      ))}

      <button className="w-full flex items-center justify-center gap-2 rounded-xl bg-accent px-4 py-3 text-base font-semibold text-bg hover:bg-accent/90 transition-colors shadow-lg shadow-accent/20 mt-4">
        <Plus size={16} />
        New Note
      </button>
    </div>
  );
}
