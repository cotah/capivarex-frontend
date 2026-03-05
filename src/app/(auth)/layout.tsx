'use client';

import { motion } from 'framer-motion';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4 py-12">
      {/* Small Orb */}
      <motion.div
        className="mb-6 flex flex-col items-center gap-3"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Orb */}
        <div className="relative flex items-center justify-center">
          <motion.div
            className="absolute rounded-full"
            style={{
              width: 60,
              height: 60,
              background:
                'radial-gradient(circle, rgba(201,164,97,0.12) 0%, transparent 70%)',
            }}
            animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          />
          <div
            className="relative rounded-full"
            style={{
              width: 20,
              height: 20,
              background: 'radial-gradient(circle at 40% 40%, #c9a461, #a0823e)',
              boxShadow: '0 0 20px rgba(201,164,97,0.4)',
            }}
          />
        </div>

        {/* Brand */}
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold tracking-[0.2em] text-text uppercase">
            Capivarex
          </span>
        </div>
      </motion.div>

      {/* Card */}
      <motion.div
        className="w-full max-w-sm glass rounded-2xl p-6"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        {children}
      </motion.div>
    </div>
  );
}
