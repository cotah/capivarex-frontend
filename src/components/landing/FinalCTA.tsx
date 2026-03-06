'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function FinalCTA() {
  return (
    <section className="px-4 sm:px-6 py-24">
      <motion.div
        className="mx-auto max-w-2xl text-center"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-3xl sm:text-4xl font-bold text-text mb-4">
          Ready to simplify your life?
        </h2>
        <p className="text-text-muted text-sm mb-8 max-w-md mx-auto">
          Join thousands of users who let Capivarex handle the details
          so they can focus on what matters.
        </p>
        <Link
          href="/register"
          className="inline-flex items-center gap-2 rounded-xl bg-accent px-8 py-3.5 text-sm font-semibold text-bg hover:bg-accent/90 transition-colors shadow-lg shadow-accent/20"
        >
          Get Started Free
          <ArrowRight size={16} />
        </Link>
      </motion.div>
    </section>
  );
}
