export type MessageRole = 'user' | 'assistant';

export type MessageType = 'text' | 'music' | 'calendar' | 'shopping' | 'weather' | 'image' | 'video';

export type MessageSource = 'text' | 'voice';

export type FileMediaType = 'image' | 'audio' | 'pdf' | 'document' | 'video' | 'text' | 'unknown';

export interface FileAttachment {
  filename: string;
  mediaType: FileMediaType;
  preview: string;
  fileId: string;
}

export interface ChatMessage {
  id: string;
  role: MessageRole;
  text: string;
  time: string;
  type?: MessageType;
  data?: Record<string, unknown>;
  source?: MessageSource;
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

/* ── Services ────────────────────────────── */

export interface ServiceDefinition {
  id: string;
  name: string;
  icon: string;
  description: string;
  category: string;
  plans: PlanType[];
  oauth?: string;
  authPath?: string;
  statusPath?: string;
  minPlan?: PlanType;
  comingSoon?: boolean;
}

export interface ServiceConnection {
  provider: string;
  connected: boolean;
  email?: string;
  status?: string;
  lastChecked?: string;
}

/* ── Conversations ────────────────────────── */

export interface ConversationSummary {
  id: string;
  title: string;
  created_at: string;
  updated_at: string;
}

export interface ConversationDetail {
  id: string;
  title: string;
  messages: ChatMessage[];
  created_at: string;
  updated_at: string;
}

/* ── Insights ────────────────────────────── */

export interface InsightStats {
  messages: number;
  groceryTotal: number;
  songsPlayed: number;
  events: number;
  shoppingTrips: number;
  avgPerTrip: number;
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

export interface GroceryProduct {
  name: string;
  quantity: number;
  avgPrice: number;
  total: number;
}

/* ── Activity ────────────────────────────── */

export interface ActivityItem {
  type: 'music' | 'calendar' | 'grocery' | 'email' | 'chat';
  time: string;
  text: string;
  icon: string;
}

export interface ActivityEntry {
  id: string;
  icon: string;
  time: string;
  description: string;
  service: string;
  agent: string;
  date: string;
}

/* ── Smarts ────────────────────────────── */

export interface SmartDevice {
  id: string;
  name: string;
  type: string;
  icon: string;
  status: string;
  room: string;
}

export interface Vehicle {
  id: string;
  name: string;
  battery: number;
  range: number;
  status: string;
  location: string;
  lastUpdated: string;
  isCharging: boolean;
}

/* ── Finance ────────────────────────────── */

export interface StockItem {
  symbol: string;
  name: string;
  price: number;
  change: number;
  positive: boolean;
}

export interface CryptoItem {
  symbol: string;
  name: string;
  price: number;
  change: number;
  positive: boolean;
}

export interface NewsArticle {
  id: string;
  title: string;
  source: string;
  timeAgo: string;
}

export interface PortfolioResponse {
  stocks: StockItem[];
  crypto: CryptoItem[];
}

/* ── Notes & Reminders ────────────────── */

export interface Note {
  id: string;
  title: string;
  content: string;
  created_at: string;
  user_id: string;
}

export interface Reminder {
  id: string;
  title: string;
  remind_at: string;
  done: boolean;
}
