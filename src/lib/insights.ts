import { apiClient } from '@/lib/api';
import type {
  InsightStats,
  MonthlySpending,
  StoreSpending,
  GroceryProduct,
} from '@/lib/types';

export async function fetchInsightStats(
  month: string,
): Promise<InsightStats> {
  const data = await apiClient<Record<string, unknown>>(
    `/api/webapp/insights/grocery/stats?month=${month}`,
  );

  return {
    messages: (data.messages as number) || 0,
    groceryTotal: (data.grocery_total as number) || (data.total_spent as number) || (data.groceryTotal as number) || 0,
    songsPlayed: (data.songs_played as number) || (data.songsPlayed as number) || 0,
    events: (data.events as number) || 0,
    shoppingTrips: (data.shopping_trips as number) || (data.trips as number) || (data.shoppingTrips as number) || 0,
    avgPerTrip: (data.avg_per_trip as number) || (data.avgPerTrip as number) || 0,
  };
}

export async function fetchGrocerySpending(
  months: number = 6,
): Promise<MonthlySpending[]> {
  const data = await apiClient<Record<string, unknown>>(
    `/api/webapp/insights/grocery/monthly?months=${months}`,
  );

  if (data.months) {
    return (data.months as Array<{ month: string; total: number }>).map((m) => ({
      month: m.month,
      total: m.total,
    }));
  }

  return [];
}

export async function fetchStoreRanking(
  month: string,
): Promise<StoreSpending[]> {
  const data = await apiClient<Record<string, unknown>>(
    `/api/webapp/insights/grocery/stores?month=${month}`,
  );

  if (data.stores) {
    return data.stores as StoreSpending[];
  }

  return [];
}

export async function fetchGroceryProducts(): Promise<GroceryProduct[]> {
  const data = await apiClient<Record<string, unknown>>(
    '/api/webapp/insights/grocery/products',
  );

  if (data.products) {
    return (data.products as Array<Record<string, unknown>>).map((p) => ({
      name: p.name as string,
      quantity: p.quantity as number,
      avgPrice: (p.avg_price as number) || (p.avgPrice as number) || 0,
      total: p.total as number,
    }));
  }

  return [];
}
