'use client';
import { useT } from '@/i18n';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Play } from 'lucide-react';

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || '';

export default function Hero() {
  const t = useT();
  return (
    <section className="relative min-h-screen overflow-hidden">
      {/* Video background */}
      <video
        src="/capivara-hero.mp4"
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover opacity-45"
      />

      {/* Dark overlay for legibility */}
      <div className="absolute inset-0 bg-black/30 z-[1]" />

      {/* Content */}
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4">
        {/* Headline */}
        <motion.h1
          className="text-center text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-text max-w-3xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Your AI{' '}
          <span className="text-accent">{t('landing.life_assistant')}</span>
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
            href={`${APP_URL}/register`}
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
      </div>
    </section>
  );
}
