'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, X, Share, MoreVertical, Plus, Check } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

type PromptMode = 'native' | 'ios' | null;
type TutorialType = 'ios' | 'android' | null;

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

/* ── Tutorial Modal ── */
function InstallTutorial({
  type,
  onClose,
}: {
  type: 'ios' | 'android';
  onClose: () => void;
}) {
  const steps =
    type === 'ios'
      ? [
          {
            icon: <Share size={22} className="text-accent" />,
            text: 'Tap the Share button in your browser toolbar',
          },
          {
            icon: <Plus size={22} className="text-accent" />,
            text: 'Scroll down and tap "Add to Home Screen"',
          },
          {
            icon: <Check size={22} className="text-accent" />,
            text: 'Tap "Add" to install Capivarex',
          },
        ]
      : [
          {
            icon: <MoreVertical size={22} className="text-accent" />,
            text: 'Tap the menu button (⋮) in your browser',
          },
          {
            icon: <Download size={22} className="text-accent" />,
            text: 'Tap "Install app" or "Add to Home Screen"',
          },
          {
            icon: <Check size={22} className="text-accent" />,
            text: 'Confirm to install Capivarex',
          },
        ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center px-6"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-sm rounded-2xl bg-[#1a1a24] border border-white/10 p-6 shadow-2xl shadow-black/50"
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 rounded-lg p-1.5 text-text-muted hover:text-text hover:bg-white/5 transition-colors"
        >
          <X size={16} />
        </button>

        {/* Title */}
        <h3 className="text-lg font-semibold text-text mb-1">
          Install Capivarex
        </h3>
        <p className="text-sm text-text-muted mb-6">
          Follow these steps to add Capivarex to your home screen
        </p>

        {/* Steps */}
        <div className="space-y-4">
          {steps.map((step, i) => (
            <div key={i} className="flex items-center gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-accent/10 border border-accent/20">
                {step.icon}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-text-muted mb-0.5">
                  Step {i + 1}
                </p>
                <p className="text-sm text-text">{step.text}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Got it */}
        <button
          onClick={onClose}
          className="mt-6 w-full rounded-xl bg-accent/20 py-2.5 text-sm font-medium text-accent hover:bg-accent/30 transition-colors"
        >
          Got it
        </button>
      </motion.div>
    </motion.div>
  );
}

/* ── Main Component ── */
export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [visible, setVisible] = useState(false);
  const [mode, setMode] = useState<PromptMode>(null);
  const [tutorial, setTutorial] = useState<TutorialType>(null);

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
    if (mode === 'ios') {
      setTutorial('ios');
      return;
    }

    /* Native prompt (Android / Desktop) */
    if (deferredPrompt) {
      try {
        await deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === 'accepted') {
          setVisible(false);
        }
        setDeferredPrompt(null);
      } catch {
        /* prompt() failed — show Android tutorial as fallback */
        setTutorial('android');
      }
    } else {
      /* No deferred prompt available — show Android tutorial */
      setTutorial('android');
    }
  };

  const handleDismiss = () => {
    localStorage.setItem(DISMISSED_KEY, '1');
    setVisible(false);
  };

  return (
    <>
      <AnimatePresence>
        {visible && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            className="fixed bottom-36 md:bottom-20 left-4 right-4 z-50 mx-auto max-w-sm"
          >
            <div
              onClick={handleInstall}
              className="glass-strong rounded-2xl p-4 flex items-center gap-3 border border-accent/20 shadow-lg shadow-black/30 cursor-pointer"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent/15">
                {mode === 'ios' ? (
                  <Share size={18} className="text-accent" />
                ) : (
                  <Download size={18} className="text-accent" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-text">
                  Install Capivarex
                </p>
                {mode === 'ios' ? (
                  <p className="text-sm text-text-muted">
                    Tap{' '}
                    <span className="inline-flex items-center align-middle mx-0.5">
                      <Share size={12} className="text-accent" />
                    </span>{' '}
                    then &ldquo;Add to Home Screen&rdquo;
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
                    onClick={(e) => {
                      e.stopPropagation();
                      handleInstall();
                    }}
                    className="rounded-lg bg-accent/20 px-3 py-1.5 text-sm font-medium text-accent hover:bg-accent/30 transition-colors"
                  >
                    Install
                  </button>
                )}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDismiss();
                  }}
                  className="rounded-lg p-1.5 text-text-muted hover:text-text hover:bg-white/5 transition-colors"
                >
                  <X size={14} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tutorial modal */}
      <AnimatePresence>
        {tutorial && (
          <InstallTutorial
            type={tutorial}
            onClose={() => setTutorial(null)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
