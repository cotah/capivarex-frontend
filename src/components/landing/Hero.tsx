'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Play } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center px-4 pt-14">
      {/* Orb */}
      <motion.div
        className="relative mb-8 flex items-center justify-center"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
      >
        {/* Outer glow */}
        <motion.div
          className="absolute rounded-full"
          style={{
            width: 220,
            height: 220,
            background:
              'radial-gradient(circle, rgba(201,164,97,0.12) 0%, transparent 70%)',
          }}
          animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        />
        {/* Inner ring */}
        <motion.div
          className="absolute rounded-full"
          style={{
            width: 120,
            height: 120,
            background:
              'radial-gradient(circle at 35% 35%, rgba(201,164,97,0.25), rgba(201,164,97,0.06) 60%, transparent)',
            border: '1px solid rgba(201,164,97,0.15)',
          }}
          animate={{ scale: [1, 1.04, 1] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        />
        {/* Core */}
        <motion.div
          className="relative rounded-full"
          style={{
            width: 48,
            height: 48,
            background: 'radial-gradient(circle at 40% 40%, #c9a461, #a0823e)',
            boxShadow: '0 0 30px rgba(201,164,97,0.4), inset 0 0 10px rgba(255,255,255,0.1)',
          }}
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        />
      </motion.div>

      {/* Headline */}
      <motion.h1
        className="text-center text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-text max-w-3xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        Your AI{' '}
        <span className="text-accent">Life Assistant</span>
      </motion.h1>

      <motion.p
        className="mt-4 text-center text-base sm:text-lg text-text-muted max-w-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.35 }}
      >
        Manage your music, calendar, smart home, groceries, and more — all
        through one intelligent conversation.
      </motion.p>

      {/* CTAs */}
      <motion.div
        className="mt-8 flex flex-col sm:flex-row items-center gap-3"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
      >
        <Link
          href="/register"
          className="flex items-center gap-2 rounded-xl bg-accent px-6 py-3 text-sm font-semibold text-bg hover:bg-accent/90 transition-colors shadow-lg shadow-accent/20"
        >
          Get Started Free
          <ArrowRight size={16} />
        </Link>
        <button
          onClick={() =>
            document.getElementById('demo')?.scrollIntoView({ behavior: 'smooth' })
          }
          className="flex items-center gap-2 rounded-xl glass px-6 py-3 text-sm font-medium text-text hover:bg-white/10 transition-colors"
        >
          <Play size={14} />
          See how it works
        </button>
      </motion.div>
    </section>
  );
}
