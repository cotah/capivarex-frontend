export type MessageRole = 'user' | 'assistant';

export type MessageType = 'text' | 'music' | 'calendar' | 'shopping' | 'weather';

export interface ChatMessage {
  id: string;
  role: MessageRole;
  text: string;
  time: string;
  type?: MessageType;
  data?: Record<string, unknown>;
}

export interface ServiceInfo {
  name: string;
  icon: string;
  connected: boolean;
  status: string;
}

export type PlanType = 'free' | 'me' | 'everywhere';

export interface User {
  id: string;
  email: string;
  name: string;
  plan: PlanType;
  telegramChatId?: string;
  language?: string;
}

export interface PlanInfo {
  id: PlanType;
  name: string;
  price: string;
  priceValue: number;
  features: string[];
  highlighted?: boolean;
}

/* ── Phase 3: Services ────────────────────────────── */

export interface ServiceDefinition {
  id: string;
  name: string;
  icon: string;
  description: string;
  authPath?: string;
  statusPath?: string;
  minPlan: PlanType;
  comingSoon?: boolean;
}

export interface ServiceConnection {
  provider: string;
  connected: boolean;
  email?: string;
  status?: string;
  lastChecked?: string;
}

/* ── Phase 3: Insights ────────────────────────────── */

export interface InsightStats {
  messages: number;
  groceryTotal: number;
  songsPlayed: number;
  events: number;
}

export interface MonthlySpending {
  month: string;
  total: number;
}

export interface StoreSpending {
  name: string;
  total: number;
  percentage: number;
}

export interface ActivityItem {
  type: 'music' | 'calendar' | 'grocery' | 'email' | 'chat';
  time: string;
  text: string;
  icon: string;
}
