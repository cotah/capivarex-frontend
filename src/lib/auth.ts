import { useAuthStore } from '@/stores/authStore';
import type { User } from '@/lib/types';
import Cookies from 'js-cookie';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

function setSession(user: User, token: string) {
  useAuthStore.getState().setToken(token);
  useAuthStore.getState().setUser(user);
  Cookies.set('capivarex-token', token, { expires: 30, sameSite: 'lax' });
}

function clearSession() {
  useAuthStore.getState().logout();
  Cookies.remove('capivarex-token');
}

// --- Mock mode (until backend endpoints are ready) ---

const MOCK_USER: User = {
  id: 'mock-user-001',
  email: '',
  name: '',
  plan: 'free',
};

const MOCK_TOKEN = 'mock-jwt-token';

function isMockMode(): boolean {
  return !API_URL || API_URL.includes('localhost');
}

// --- Auth functions ---

export async function login(email: string, password: string): Promise<User> {
  if (isMockMode()) {
    const user = { ...MOCK_USER, email, name: email.split('@')[0] };
    setSession(user, MOCK_TOKEN);
    return user;
  }

  const res = await fetch(`${API_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as Record<string, string>).message || 'Login failed');
  }

  const data = await res.json();
  const user = data.user as User;
  const token = data.token as string;
  setSession(user, token);
  return user;
}

export async function register(
  name: string,
  email: string,
  password: string,
): Promise<User> {
  if (isMockMode()) {
    const user = { ...MOCK_USER, email, name };
    setSession(user, MOCK_TOKEN);
    return user;
  }

  const res = await fetch(`${API_URL}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(
      (err as Record<string, string>).message || 'Registration failed',
    );
  }

  const data = await res.json();
  const user = data.user as User;
  const token = data.token as string;
  setSession(user, token);
  return user;
}

export async function forgotPassword(email: string): Promise<void> {
  if (isMockMode()) return;

  const res = await fetch(`${API_URL}/api/auth/forgot`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(
      (err as Record<string, string>).message || 'Request failed',
    );
  }
}

export async function fetchCurrentUser(): Promise<User | null> {
  const token = useAuthStore.getState().token;
  if (!token) return null;

  if (isMockMode()) {
    return useAuthStore.getState().user;
  }

  try {
    const res = await fetch(`${API_URL}/api/auth/me`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      clearSession();
      return null;
    }

    const data = await res.json();
    const user = data.user as User;
    useAuthStore.getState().setUser(user);
    return user;
  } catch {
    clearSession();
    return null;
  }
}

export function logout() {
  clearSession();
  window.location.href = '/login';
}
