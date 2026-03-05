'use client';

import { useChatStore } from '@/stores/chatStore';
import TopBar from '@/components/layout/TopBar';
import InputBar from '@/components/layout/InputBar';
import Orb from '@/components/orb/Orb';
import MessageList from '@/components/chat/MessageList';
import ServicePill from '@/components/services/ServicePill';
import { ServiceInfo } from '@/lib/types';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart3, Zap } from 'lucide-react';

const placeholderServices: ServiceInfo[] = [
  { name: 'Google Calendar', icon: '📅', connected: true, status: 'Connected' },
  { name: 'Spotify', icon: '🎵', connected: true, status: 'Connected' },
  { name: 'Gmail', icon: '✉️', connected: false, status: 'Not connected' },
  { name: 'Notion', icon: '📝', connected: false, status: 'Not connected' },
  { name: 'Todoist', icon: '✅', connected: false, status: 'Not connected' },
  { name: 'WhatsApp', icon: '💬', connected: false, status: 'Coming soon' },
];

function ChatView() {
  const messages = useChatStore((s) => s.messages);
  const hasMessages = messages.length > 0;

  return (
    <div className="flex flex-col h-full">
      {!hasMessages && <Orb />}
      <MessageList />
    </div>
  );
}

function ServicesView() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="px-4 py-8"
    >
      <div className="mx-auto max-w-3xl">
        <div className="flex items-center gap-2 mb-6">
          <Zap size={18} className="text-accent" />
          <h2 className="text-lg font-semibold text-text">Connected Services</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {placeholderServices.map((service) => (
            <ServicePill key={service.name} service={service} />
          ))}
        </div>
        <p className="mt-6 text-xs text-text-muted text-center">
          More integrations coming soon. Connect your services to unlock the full potential of Capivarex.
        </p>
      </div>
    </motion.div>
  );
}

function InsightsView() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="px-4 py-8"
    >
      <div className="mx-auto max-w-3xl">
        <div className="flex items-center gap-2 mb-6">
          <BarChart3 size={18} className="text-accent" />
          <h2 className="text-lg font-semibold text-text">Insights</h2>
        </div>
        <div className="glass rounded-2xl p-8 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-accent/10 mx-auto mb-4">
            <BarChart3 size={28} className="text-accent/50" />
          </div>
          <p className="text-sm text-text-muted mb-1">
            Insights will appear here as you use Capivarex.
          </p>
          <p className="text-xs text-text-muted/60">
            Start chatting to generate personalized insights about your productivity.
          </p>
        </div>
      </div>
    </motion.div>
  );
}

export default function Home() {
  const currentView = useChatStore((s) => s.currentView);

  return (
    <main className="relative z-10 flex flex-col h-screen">
      <TopBar />

      {/* Content area below TopBar, above InputBar */}
      <div className="flex-1 overflow-y-auto pt-14 sm:pt-14 pb-24">
        <div className="mx-auto max-w-3xl h-full">
          <AnimatePresence mode="wait">
            {currentView === 'chat' && (
              <motion.div
                key="chat"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="h-full flex flex-col"
              >
                <ChatView />
              </motion.div>
            )}
            {currentView === 'services' && (
              <ServicesView key="services" />
            )}
            {currentView === 'insights' && (
              <InsightsView key="insights" />
            )}
          </AnimatePresence>
        </div>
      </div>

      {currentView === 'chat' && <InputBar />}
    </main>
  );
}
