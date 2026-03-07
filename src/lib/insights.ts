import type {
  InsightStats,
  MonthlySpending,
  StoreSpending,
  ActivityItem,
} from '@/lib/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

/* ── Mock data (used when backend endpoints are not available) ── */

const MOCK_STATS: InsightStats = {
  messages: 247,
  groceryTotal: 187.5,
  songsPlayed: 84,
  events: 12,
  shoppingTrips: 3,
  avgPerTrip: 42.52,
};

const MOCK_SPENDING: MonthlySpending[] = [
  { month: '2025-10', total: 156.3 },
  { month: '2025-11', total: 210.8 },
  { month: '2025-12', total: 178.2 },
  { month: '2026-01', total: 195.6 },
  { month: '2026-02', total: 165.4 },
  { month: '2026-03', total: 187.5 },
];

const MOCK_STORES: StoreSpending[] = [
  { name: 'Lidl', total: 67.3, percentage: 36 },
  { name: 'Dunnes Stores', total: 55.2, percentage: 29 },
  { name: 'Aldi', total: 42.0, percentage: 22 },
  { name: 'Tesco', total: 23.0, percentage: 12 },
];

const MOCK_ACTIVITIES: ActivityItem[] = [
  { type: 'music', time: '2:41 PM', text: 'Played Candy Shop (50 Cent)', icon: '🎵' },
  { type: 'calendar', time: '1:30 PM', text: 'Created event "Team Standup"', icon: '📅' },
  { type: 'grocery', time: '11:00 AM', text: 'Added 5 items to shopping list', icon: '🛒' },
  { type: 'email', time: '9:15 AM', text: 'Replied to João about project Alpha', icon: '📧' },
  { type: 'chat', time: '8:50 AM', text: 'Asked about Dublin weather', icon: '💬' },
  { type: 'music', time: '8:30 AM', text: 'Created playlist "Morning Focus"', icon: '🎵' },
  { type: 'calendar', time: '8:00 AM', text: 'Checked today\'s schedule', icon: '📅' },
  { type: 'grocery', time: 'Yesterday', text: 'Bought groceries at Lidl — €32.50', icon: '🛒' },
  { type: 'email', time: 'Yesterday', text: 'Drafted email to client', icon: '📧' },
  { type: 'chat', time: 'Yesterday', text: 'Translated document EN→PT', icon: '💬' },
];

/* ── API functions with fallback to mocks ── */

async function safeFetch<T>(url: string, fallback: T): Promise<T> {
  try {
    const res = await fetch(url);
    if (!res.ok) return fallback;
    return (await res.json()) as T;
  } catch {
    return fallback;
  }
}

export async function fetchInsightStats(
  userId: string,
  month: string,
): Promise<InsightStats> {
  const data = await safeFetch<Record<string, unknown>>(
    `${API_URL}/api/insights/stats?user_id=${userId}&month=${month}`,
    {},
  );

  if (data.messages != null) {
    return {
      messages: data.messages as number,
      groceryTotal: data.grocery_total as number,
      songsPlayed: data.songs_played as number,
      events: data.events as number,
      shoppingTrips: (data.shopping_trips as number) || 0,
      avgPerTrip: (data.avg_per_trip as number) || 0,
    };
  }

  return MOCK_STATS;
}

export async function fetchGrocerySpending(
  userId: string,
  months: number = 6,
): Promise<MonthlySpending[]> {
  const data = await safeFetch<Record<string, unknown>>(
    `${API_URL}/api/insights/grocery?user_id=${userId}&months=${months}`,
    {},
  );

  if (data.months) {
    return (data.months as Array<{ month: string; total: number }>).map((m) => ({
      month: m.month,
      total: m.total,
    }));
  }

  return MOCK_SPENDING;
}

export async function fetchStoreRanking(
  userId: string,
  month: string,
): Promise<StoreSpending[]> {
  const data = await safeFetch<Record<string, unknown>>(
    `${API_URL}/api/insights/stores?user_id=${userId}&month=${month}`,
    {},
  );

  if (data.stores) {
    return data.stores as StoreSpending[];
  }

  return MOCK_STORES;
}

export async function fetchActivityFeed(
  userId: string,
  limit: number = 10,
): Promise<ActivityItem[]> {
  const data = await safeFetch<Record<string, unknown>>(
    `${API_URL}/api/insights/activity?user_id=${userId}&limit=${limit}`,
    {},
  );

  if (data.activities) {
    return data.activities as ActivityItem[];
  }

  return MOCK_ACTIVITIES;
}
