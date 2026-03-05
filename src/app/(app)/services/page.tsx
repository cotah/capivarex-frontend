'use client';

import { motion } from 'framer-motion';
import { Zap } from 'lucide-react';
import ServicePill from '@/components/services/ServicePill';
import type { ServiceInfo } from '@/lib/types';

const placeholderServices: ServiceInfo[] = [
  { name: 'Google Calendar', icon: '📅', connected: true, status: 'Connected' },
  { name: 'Spotify', icon: '🎵', connected: true, status: 'Connected' },
  { name: 'Gmail', icon: '✉️', connected: false, status: 'Not connected' },
  { name: 'Notion', icon: '📝', connected: false, status: 'Not connected' },
  { name: 'Todoist', icon: '✅', connected: false, status: 'Not connected' },
  { name: 'WhatsApp', icon: '💬', connected: false, status: 'Coming soon' },
];

export default function ServicesPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
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
