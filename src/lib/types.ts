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
