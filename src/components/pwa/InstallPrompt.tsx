'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, X } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    /* Already dismissed this session */
    if (sessionStorage.getItem('pwa-dismissed')) return;

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setVisible(true);
    };

    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setVisible(false);
    }
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    sessionStorage.setItem('pwa-dismissed', '1');
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 40 }}
          className="fixed bottom-20 left-4 right-4 z-50 mx-auto max-w-sm"
        >
          <div className="glass-strong rounded-2xl p-4 flex items-center gap-3 border border-accent/20 shadow-lg shadow-black/30">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent/15">
              <Download size={18} className="text-accent" />
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-text">Install Capivarex</p>
              <p className="text-[11px] text-text-muted">
                Add to home screen for a better experience
              </p>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <button
                onClick={handleInstall}
                className="rounded-lg bg-accent/20 px-3 py-1.5 text-xs font-medium text-accent hover:bg-accent/30 transition-colors"
              >
                Install
              </button>
              <button
                onClick={handleDismiss}
                className="rounded-lg p-1.5 text-text-muted hover:text-text hover:bg-white/5 transition-colors"
              >
                <X size={14} />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
