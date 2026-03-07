'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, X, Share } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

type PromptMode = 'native' | 'ios' | null;

const DISMISSED_KEY = 'pwa-install-dismissed';

function isStandalone(): boolean {
  if (typeof window === 'undefined') return false;
  if (window.matchMedia('(display-mode: standalone)').matches) return true;
  if ((navigator as unknown as { standalone?: boolean }).standalone === true)
    return true;
  return false;
}

function isIOS(): boolean {
  if (typeof navigator === 'undefined') return false;
  return (
    /iPad|iPhone|iPod/.test(navigator.userAgent) &&
    !(window as unknown as { MSStream?: unknown }).MSStream
  );
}

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [visible, setVisible] = useState(false);
  const [mode, setMode] = useState<PromptMode>(null);

  useEffect(() => {
    /* Already installed as PWA */
    if (isStandalone()) return;

    /* User already dismissed permanently */
    if (localStorage.getItem(DISMISSED_KEY)) return;

    /* ── iOS path ── */
    if (isIOS()) {
      setMode('ios');
      setVisible(true);
      return;
    }

    /* ── Native beforeinstallprompt path (Android / Desktop) ── */
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setMode('native');
      setVisible(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    /* Hide banner if app gets installed */
    const installedHandler = () => setVisible(false);
    window.addEventListener('appinstalled', installedHandler);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
      window.removeEventListener('appinstalled', installedHandler);
    };
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
    localStorage.setItem(DISMISSED_KEY, '1');
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 40 }}
          className="fixed bottom-36 md:bottom-20 left-4 right-4 z-50 mx-auto max-w-sm"
        >
          <div className="glass-strong rounded-2xl p-4 flex items-center gap-3 border border-accent/20 shadow-lg shadow-black/30">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent/15">
              {mode === 'ios' ? (
                <Share size={18} className="text-accent" />
              ) : (
                <Download size={18} className="text-accent" />
              )}
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-text">Install Capivarex</p>
              {mode === 'ios' ? (
                <p className="text-sm text-text-muted">
                  Tap <span className="inline-flex items-center align-middle mx-0.5"><Share size={12} className="text-accent" /></span> then &ldquo;Add to Home Screen&rdquo;
                </p>
              ) : (
                <p className="text-sm text-text-muted">
                  Add to home screen for a better experience
                </p>
              )}
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              {mode === 'native' && (
                <button
                  onClick={handleInstall}
                  className="rounded-lg bg-accent/20 px-3 py-1.5 text-sm font-medium text-accent hover:bg-accent/30 transition-colors"
                >
                  Install
                </button>
              )}
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
