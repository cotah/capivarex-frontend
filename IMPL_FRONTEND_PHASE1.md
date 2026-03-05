# Capivarex Frontend — Phase 1: Setup + Layout + Chat

## REPO
- **GitHub:** https://github.com/cotah/capivarex-frontend.git
- **Stack:** Next.js 14 (App Router) + Tailwind CSS + TypeScript
- **Deploy:** Vercel (connect repo after push)

---

## SETUP

### 1. Criar projeto Next.js

```bash
npx create-next-app@latest capivarex-frontend --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"
cd capivarex-frontend
```

### 2. Dependências extras

```bash
npm install framer-motion lucide-react zustand
```

- `framer-motion` — animações (orb, transições, fade-in)
- `lucide-react` — ícones
- `zustand` — state management (leve, sem boilerplate)

### 3. Estrutura de pastas

```
src/
├── app/
│   ├── layout.tsx          # Root layout (fonts, meta, providers)
│   ├── page.tsx            # Main app (chat view)
│   ├── globals.css         # Tailwind + custom styles
│   └── manifest.json       # PWA manifest (básico)
├── components/
│   ├── layout/
│   │   ├── TopBar.tsx      # Header com logo, nav, status
│   │   └── InputBar.tsx    # Input fixo no bottom
│   ├── chat/
│   │   ├── MessageList.tsx # Lista de mensagens
│   │   ├── Message.tsx     # Bubble individual
│   │   ├── MusicCard.tsx   # Card de música (Spotify)
│   │   ├── CalendarCard.tsx# Card de calendário
│   │   └── ThinkingDots.tsx# Animação de "pensando"
│   ├── orb/
│   │   └── Orb.tsx         # Orb animado central
│   └── services/
│       └── ServicePill.tsx # Pill de serviço conectado
├── stores/
│   └── chatStore.ts        # Zustand store (messages, loading, view)
├── lib/
│   ├── api.ts              # API client (fetch para backend)
│   └── types.ts            # TypeScript types
└── hooks/
    └── useChat.ts          # Hook para enviar mensagens
```

### 4. Environment variables

Criar `.env.local`:

```env
NEXT_PUBLIC_API_URL=https://capivarex-production.up.railway.app
```

---

## DESIGN SYSTEM

### Cores (CSS variables no globals.css)

```css
:root {
  --bg: #0a0a0f;
  --surface: rgba(255,255,255,0.03);
  --glass: rgba(255,255,255,0.06);
  --glass-border: rgba(255,255,255,0.08);
  --text: #e8e6e3;
  --text-muted: rgba(255,255,255,0.4);
  --accent: #c9a461;
  --accent-glow: rgba(201,164,97,0.15);
  --accent-soft: rgba(201,164,97,0.08);
  --success: #4ade80;
  --error: #f87171;
}
```

### Fontes

```typescript
// layout.tsx
import { DM_Sans, JetBrains_Mono } from 'next/font/google'

const dmSans = DM_Sans({ subsets: ['latin'], variable: '--font-sans' })
const jetbrains = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono' })
```

### Princípios de design

1. **Fundo escuro com profundidade** — gradientes radiais suaves, grid sutil
2. **Glass morphism** — `backdrop-filter: blur(20px)` + border sutil
3. **Dourado como accent** — premium, Jarvis
4. **Sem sidebar** — 3 views: Chat, Services, Insights
5. **Orb central** — respira, pulsa quando pensa
6. **Cartões contextuais** — música, calendário, lista, etc
7. **Animações suaves** — framer-motion, fade-in, slide-up

---

## COMPONENTES

### TopBar.tsx

```
┌─────────────────────────────────────────────────┐
│ (C) CAPIVAREX BETA    [Chat] [Services] [Insights]    ● All systems online │
└─────────────────────────────────────────────────┘
```

- Logo: círculo dourado com "C" + "CAPIVAREX" em letter-spacing
- Nav: 3 botões (chat/services/insights), active tem background accent-soft
- Status: bolinha verde + "All systems online"
- `position: fixed`, `backdrop-filter: blur(30px)`

### Orb.tsx

- 3 camadas: outer glow, inner orb, core
- Estados: `idle` (respira 4s), `thinking` (pulsa 1.5s + roda), `listening` (pulsa rápido 0.8s)
- Abaixo do orb: texto "How can I help you?" / "Thinking..." / "Listening..."
- Usar `framer-motion` para transições entre estados

### Message.tsx

- User: alinhado à direita, background accent com opacity, borda arredondada 20px (canto inferior direito 4px)
- Assistant: alinhado à esquerda, background glass, borda arredondada 20px (canto inferior esquerdo 4px)
- Timestamp em texto pequeno muted
- Se a mensagem tem `type`, renderizar card correspondente abaixo do texto

### MusicCard.tsx

- Dentro de mensagem do assistant quando `type === "music"`
- Mostra: ícone 🎵 + track name + artist + controles (⏮ ⏸ ⏭) + barra de progresso
- Background glass, border radius 16px

### CalendarCard.tsx

- Dentro de mensagem quando `type === "calendar"`
- Lista de eventos com hora (font mono, cor accent) + título + local
- Separador sutil entre eventos

### InputBar.tsx

```
┌──────────────────────────────────────────┐
│  Ask Capivarex anything...      🎤  [↑]  │
└──────────────────────────────────────────┘
```

- `position: fixed`, bottom 0, gradient fade acima
- Input com placeholder, sem border
- Botão microfone (futuro: Web Speech API)
- Botão enviar: círculo dourado quando tem texto, cinza quando vazio
- Enter = enviar

### ServicePill.tsx

- Pill com ícone + nome + status + bolinha verde/cinza
- Hover: background muda para accent-soft
- Grid responsivo: `grid-template-columns: repeat(auto-fill, minmax(160px, 1fr))`

---

## API CLIENT

### lib/api.ts

```typescript
const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function sendMessage(
  message: string,
  userId: string,
  chatId: string,
): Promise<any> {
  const response = await fetch(`${API_URL}/api/chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      // TODO: add JWT auth header when auth is implemented
    },
    body: JSON.stringify({
      message,
      user_id: userId,
      chat_id: chatId,
    }),
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }

  return response.json();
}

export async function getServiceStatus(userId: string): Promise<any> {
  const response = await fetch(`${API_URL}/api/auth/google/status?user_id=${userId}`);
  return response.json();
}
```

### lib/types.ts

```typescript
export type MessageRole = 'user' | 'assistant';

export type MessageType = 'text' | 'music' | 'calendar' | 'shopping' | 'weather';

export interface ChatMessage {
  id: string;
  role: MessageRole;
  text: string;
  time: string;
  type?: MessageType;
  data?: any;
}

export interface ServiceInfo {
  name: string;
  icon: string;
  connected: boolean;
  status: string;
}

export type ViewType = 'chat' | 'services' | 'insights';
```

### stores/chatStore.ts

```typescript
import { create } from 'zustand';
import { ChatMessage, ViewType } from '@/lib/types';

interface ChatStore {
  messages: ChatMessage[];
  isThinking: boolean;
  currentView: ViewType;
  addMessage: (msg: ChatMessage) => void;
  setThinking: (v: boolean) => void;
  setView: (v: ViewType) => void;
}

export const useChatStore = create<ChatStore>((set) => ({
  messages: [],
  isThinking: false,
  currentView: 'chat',
  addMessage: (msg) => set((s) => ({ messages: [...s.messages, msg] })),
  setThinking: (v) => set({ isThinking: v }),
  setView: (v) => set({ currentView: v }),
}));
```

### hooks/useChat.ts

```typescript
import { useChatStore } from '@/stores/chatStore';
import { sendMessage } from '@/lib/api';
import { nanoid } from 'nanoid'; // npm install nanoid

export function useChat() {
  const { addMessage, setThinking } = useChatStore();

  const send = async (text: string) => {
    // Add user message
    addMessage({
      id: nanoid(),
      role: 'user',
      text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    });

    setThinking(true);

    try {
      // TODO: use real user_id/chat_id from auth
      const response = await sendMessage(text, 'demo-user', 'demo-chat');

      addMessage({
        id: nanoid(),
        role: 'assistant',
        text: response.response || response.message || 'No response',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        type: response.type,
        data: response.data,
      });
    } catch (error) {
      addMessage({
        id: nanoid(),
        role: 'assistant',
        text: 'Sorry, something went wrong. Please try again.',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      });
    } finally {
      setThinking(false);
    }
  };

  return { send };
}
```

---

## BACKEND: CORS UPDATE NECESSÁRIO

O backend precisa aceitar requests do frontend. Adicionar ao Railway:

```
FRONTEND_URL=https://capivarex-frontend.vercel.app
```

(O domínio exato será definido depois do primeiro deploy na Vercel)

---

## PWA MANIFEST (básico, Phase 4 completa)

### app/manifest.json

```json
{
  "name": "Capivarex",
  "short_name": "Capivarex",
  "description": "Your AI Life Assistant",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#0a0a0f",
  "theme_color": "#c9a461",
  "icons": [
    { "src": "/icon-192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/icon-512.png", "sizes": "512x512", "type": "image/png" }
  ]
}
```

---

## O QUE FASE 1 ENTREGA

Ao final da Fase 1, o webapp deve:

1. ✅ Abrir em `localhost:3000` com layout completo (TopBar + Orb + InputBar)
2. ✅ Enviar mensagem → chamar API do backend → mostrar resposta
3. ✅ Orb anima quando está a pensar
4. ✅ 3 views funcionais (Chat, Services placeholder, Insights placeholder)
5. ✅ Responsivo (mobile + desktop)
6. ✅ Dark theme com design system completo
7. ✅ Push para GitHub `capivarex-frontend`
8. ✅ Deploy na Vercel (conectar repo)

## O QUE FASE 1 NÃO FAZ (futuro)

- ❌ Auth/Login (Fase 2)
- ❌ Stripe (Fase 2)
- ❌ OAuth connections (Fase 3)
- ❌ PWA install (Fase 4)
- ❌ Cast SDK (Fase 4)
- ❌ Landing page (Fase 5)

---

## REGRAS

- Seguir EXATAMENTE o design do conceito aprovado (cores, orb, glass, dourado)
- TypeScript strict
- Tailwind para estilos (não CSS modules)
- framer-motion para animações
- Componentes pequenos e reutilizáveis
- Mobile-first (responsivo)
- Sem hardcoded strings — preparar para i18n futuro
- `.env.local` para API URL
- Push para `main` do repo `capivarex-frontend`
