'use client';

import { useChatStore } from '@/stores/chatStore';
import { ViewType } from '@/lib/types';
import { MessageSquare, Zap, BarChart3, Circle } from 'lucide-react';

const navItems: { view: ViewType; label: string; icon: typeof MessageSquare }[] = [
  { view: 'chat', label: 'Chat', icon: MessageSquare },
  { view: 'services', label: 'Services', icon: Zap },
  { view: 'insights', label: 'Insights', icon: BarChart3 },
];

export default function TopBar() {
  const { currentView, setView } = useChatStore();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass-strong">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
        {/* Logo */}
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent/20 border border-accent/30">
            <span className="text-sm font-bold text-accent">C</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold tracking-[0.2em] text-text uppercase">
              Capivarex
            </span>
            <span className="rounded-full bg-accent/10 px-2 py-0.5 text-[10px] font-medium text-accent uppercase tracking-wider">
              Beta
            </span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="hidden sm:flex items-center gap-1">
          {navItems.map(({ view, label, icon: Icon }) => (
            <button
              key={view}
              onClick={() => setView(view)}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all duration-200 ${
                currentView === view
                  ? 'bg-accent-soft text-accent'
                  : 'text-text-muted hover:text-text hover:bg-white/5'
              }`}
            >
              <Icon size={14} />
              {label}
            </button>
          ))}
        </nav>

        {/* Status */}
        <div className="flex items-center gap-2">
          <Circle size={6} className="fill-success text-success" />
          <span className="text-[11px] text-text-muted hidden sm:inline">
            All systems online
          </span>
        </div>
      </div>

      {/* Mobile nav */}
      <nav className="flex sm:hidden items-center justify-center gap-1 pb-2 px-4">
        {navItems.map(({ view, label, icon: Icon }) => (
          <button
            key={view}
            onClick={() => setView(view)}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all duration-200 ${
              currentView === view
                ? 'bg-accent-soft text-accent'
                : 'text-text-muted hover:text-text hover:bg-white/5'
            }`}
          >
            <Icon size={14} />
            {label}
          </button>
        ))}
      </nav>
    </header>
  );
}
