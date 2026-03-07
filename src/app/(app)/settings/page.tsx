'use client';

import { motion } from 'framer-motion';
import { Settings, Trash2 } from 'lucide-react';
import ProfileSection from '@/components/settings/ProfileSection';
import BillingSection from '@/components/settings/BillingSection';
import ConnectionsSection from '@/components/settings/ConnectionsSection';
import NotificationSettings from '@/components/settings/NotificationSettings';
import { logout } from '@/lib/auth';

export default function SettingsPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="px-4 py-8"
    >
      <div className="mx-auto max-w-2xl space-y-6">
        <div className="flex items-center gap-2">
          <Settings size={18} className="text-accent" />
          <h2 className="text-3xl font-semibold text-text">Settings</h2>
        </div>

        <ProfileSection />
        <BillingSection />
        <ConnectionsSection />
        <NotificationSettings />

        {/* Danger zone */}
        <section className="glass rounded-2xl p-5 space-y-4 border-error/10">
          <h3 className="flex items-center gap-2 text-base font-semibold text-error/80">
            <Trash2 size={16} />
            Danger Zone
          </h3>
          <div className="flex flex-col sm:flex-row gap-2">
            <button
              onClick={() => logout()}
              className="rounded-xl glass py-2 px-4 text-base text-text-muted hover:text-text transition-colors"
            >
              Sign Out
            </button>
            <button className="rounded-xl border border-error/20 py-2 px-4 text-base text-error/60 hover:text-error hover:border-error/40 transition-colors">
              Delete Account
            </button>
          </div>
        </section>
      </div>
    </motion.div>
  );
}
