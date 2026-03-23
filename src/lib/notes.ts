import { apiClient } from '@/lib/api';
import type { Note, Reminder } from '@/lib/types';

/* ── Notes ── */

export async function fetchNotes(): Promise<Note[]> {
  const data = await apiClient<Note[] | { notes: Note[] }>('/api/webapp/notes');
  return Array.isArray(data) ? data : (data.notes || []);
}

export async function createNote(title: string, content: string): Promise<Note> {
  return apiClient<Note>('/api/webapp/notes', {
    method: 'POST',
    body: JSON.stringify({ title, content }),
  });
}

export async function updateNote(id: string, fields: { title?: string; content?: string }): Promise<Note> {
  return apiClient<Note>(`/api/webapp/notes/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(fields),
  });
}

export async function deleteNote(id: string): Promise<void> {
  return apiClient<void>(`/api/webapp/notes/${id}`, {
    method: 'DELETE',
  });
}

/* ── Reminders ── */

export async function fetchReminders(): Promise<Reminder[]> {
  const data = await apiClient<Reminder[] | { reminders: Reminder[] }>('/api/webapp/reminders');
  return Array.isArray(data) ? data : (data.reminders || []);
}

export async function toggleReminder(id: string, done: boolean): Promise<void> {
  return apiClient<void>(`/api/webapp/reminders/${id}`, {
    method: 'PATCH',
    body: JSON.stringify({ done }),
  });
}
