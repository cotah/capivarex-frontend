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

export type ViewType = 'chat' | 'services' | 'insights';
