'use client';

import { motion } from 'framer-motion';
import { useChatStore } from '@/stores/chatStore';

type OrbState = 'idle' | 'thinking' | 'listening';

function getOrbState(isThinking: boolean): OrbState {
  if (isThinking) return 'thinking';
  return 'idle';
}

const stateLabels: Record<OrbState, string> = {
  idle: 'How can I help you?',
  thinking: 'Thinking...',
  listening: 'Listening...',
};

export default function Orb() {
  const isThinking = useChatStore((s) => s.isThinking);
  const state = getOrbState(isThinking);

  return (
    <div className="flex flex-col items-center gap-4 py-8">
      {/* Orb container */}
      <div className="relative flex items-center justify-center">
        {/* Outer glow */}
        <motion.div
          className="absolute rounded-full"
          style={{
            width: 140,
            height: 140,
            background:
              'radial-gradient(circle, rgba(201,164,97,0.12) 0%, transparent 70%)',
          }}
          animate={
            state === 'thinking'
              ? {
                  scale: [1, 1.3, 1],
                  opacity: [0.5, 0.8, 0.5],
                }
              : state === 'listening'
                ? {
                    scale: [1, 1.15, 1],
                    opacity: [0.6, 1, 0.6],
                  }
                : {
                    scale: [1, 1.1, 1],
                    opacity: [0.3, 0.5, 0.3],
                  }
          }
          transition={{
            duration: state === 'thinking' ? 1.5 : state === 'listening' ? 0.8 : 4,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />

        {/* Inner orb */}
        <motion.div
          className="absolute rounded-full"
          style={{
            width: 80,
            height: 80,
            background:
              'radial-gradient(circle at 35% 35%, rgba(201,164,97,0.3), rgba(201,164,97,0.08) 60%, transparent)',
            border: '1px solid rgba(201,164,97,0.2)',
            boxShadow: '0 0 40px rgba(201,164,97,0.1)',
          }}
          animate={
            state === 'thinking'
              ? {
                  scale: [1, 1.08, 1],
                  rotate: [0, 360],
                }
              : state === 'listening'
                ? {
                    scale: [1, 1.05, 1],
                  }
                : {
                    scale: [1, 1.04, 1],
                  }
          }
          transition={{
            duration: state === 'thinking' ? 1.5 : state === 'listening' ? 0.8 : 4,
            repeat: Infinity,
            ease: 'easeInOut',
            rotate: state === 'thinking'
              ? { duration: 3, repeat: Infinity, ease: 'linear' }
              : undefined,
          }}
        />

        {/* Core */}
        <motion.div
          className="relative rounded-full"
          style={{
            width: 32,
            height: 32,
            background:
              'radial-gradient(circle at 40% 40%, #c9a461, #a0823e)',
            boxShadow:
              '0 0 20px rgba(201,164,97,0.4), inset 0 0 8px rgba(255,255,255,0.1)',
          }}
          animate={
            state === 'thinking'
              ? { scale: [1, 1.15, 1] }
              : { scale: [1, 1.05, 1] }
          }
          transition={{
            duration: state === 'thinking' ? 1.5 : 4,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </div>

      {/* Label */}
      <motion.p
        className="text-sm text-text-muted"
        key={state}
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {stateLabels[state]}
      </motion.p>
    </div>
  );
}
