import { createClient } from '@/lib/supabase/client';
import { useAuthStore } from '@/stores/authStore';
import type { User } from '@/lib/types';

function mapSupabaseUser(
  supabaseUser: { id: string; email?: string; user_metadata?: Record<string, unknown> },
): User {
  return {
    id: supabaseUser.id,
    email: supabaseUser.email || '',
    name: (supabaseUser.user_metadata?.name as string) || supabaseUser.email?.split('@')[0] || '',
    plan: (supabaseUser.user_metadata?.plan as User['plan']) || 'free',
    telegramChatId: supabaseUser.user_metadata?.telegram_chat_id as string | undefined,
    language: supabaseUser.user_metadata?.language as string | undefined,
  };
}

export async function login(email: string, password: string): Promise<User> {
  const supabase = createClient();

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    throw new Error(error.message);
  }

  const user = mapSupabaseUser(data.user);
  useAuthStore.getState().setUser(user);
  useAuthStore.getState().setToken(data.session.access_token);
  return user;
}

export async function register(
  name: string,
  email: string,
  password: string,
): Promise<User> {
  const supabase = createClient();

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { name },
    },
  });

  if (error) {
    throw new Error(error.message);
  }

  if (!data.user) {
    throw new Error('Registration failed. Please try again.');
  }

  const user = mapSupabaseUser(data.user);
  useAuthStore.getState().setUser(user);
  if (data.session) {
    useAuthStore.getState().setToken(data.session.access_token);
  }
  return user;
}

export async function forgotPassword(email: string): Promise<void> {
  const supabase = createClient();

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/login`,
  });

  if (error) {
    throw new Error(error.message);
  }
}

export async function fetchCurrentUser(): Promise<User | null> {
  const supabase = createClient();

  const { data: { user: supabaseUser }, error } = await supabase.auth.getUser();

  if (error || !supabaseUser) {
    useAuthStore.getState().logout();
    return null;
  }

  const { data: { session } } = await supabase.auth.getSession();

  const user = mapSupabaseUser(supabaseUser);
  useAuthStore.getState().setUser(user);
  if (session) {
    useAuthStore.getState().setToken(session.access_token);
  }
  return user;
}

export async function logout(): Promise<void> {
  const supabase = createClient();
  await supabase.auth.signOut();
  useAuthStore.getState().logout();
  window.location.href = '/login';
}
