'use client';
import Link from 'next/link';
import { Brain } from 'lucide-react';
import { useChatStore } from '@/stores/chatStore';

/**
 * Memory FAB — floating action button (desktop only).
 * Shows a Brain icon in the bottom-right corner.
 * Pulses with neon glow while the AI is thinking (memorising context).
 */
export default function MemoryFab() {
  const isThinking = useChatStore((s) => s.isThinking);

  return (
    <Link
      href="/memory"
      aria-label="Memory"
      className={[
        // Only visible on desktop (md+)
        'hidden md:flex',
        // Positioning
        'fixed bottom-6 right-6 z-40',
        // Shape
        'h-10 w-10 items-center justify-center rounded-full',
        // Base style — subtle glass
        'bg-bg/80 backdrop-blur-md border border-glass-border',
        'text-accent transition-all duration-300',
        // Hover
        'hover:border-accent/40 hover:bg-accent-soft',
        // Pulse animation when thinking
        isThinking ? 'animate-brain-pulse' : 'opacity-40 hover:opacity-80',
      ].join(' ')}
    >
      <Brain size={18} />
    </Link>
  );
}
