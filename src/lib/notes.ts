import { createClient } from '@/lib/supabase/client';
import { useAuthStore } from '@/stores/authStore';
import type { Note, Reminder } from '@/lib/types';

function getUserId(): string {
  const user = useAuthStore.getState().user;
  if (!user) throw new Error('Not authenticated');
  return user.id;
}

/* ── Notes ── */

export async function fetchNotes(): Promise<Note[]> {
  const supabase = createClient();
  const userId = getUserId();
  const { data, error } = await supabase
    .from('notes')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return (data || []) as Note[];
}

export async function createNote(title: string, content: string): Promise<Note> {
  const supabase = createClient();
  const userId = getUserId();
  const { data, error } = await supabase
    .from('notes')
    .insert({ title, content, user_id: userId })
    .select()
    .single();

  if (error) throw error;
  return data as Note;
}

export async function deleteNote(id: string): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase.from('notes').delete().eq('id', id);
  if (error) throw error;
}

/* ── Reminders ── */

export async function fetchReminders(): Promise<Reminder[]> {
  const supabase = createClient();
  const userId = getUserId();
  const { data, error } = await supabase
    .from('reminders')
    .select('*')
    .eq('user_id', userId)
    .order('due_at', { ascending: true });

  if (error) throw error;
  return (data || []) as Reminder[];
}

export async function toggleReminder(id: string, completed: boolean): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase
    .from('reminders')
    .update({ completed })
    .eq('id', id);

  if (error) throw error;
}
