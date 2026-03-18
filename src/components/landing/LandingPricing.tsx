'use client';

import { motion } from 'framer-motion';
import PricingCards from '@/components/billing/PricingCards';

export default function LandingPricing() {
  return (
    <section id="pricing" className="px-4 sm:px-6 py-24">
      <div className="mx-auto max-w-4xl">
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-text">
            Simple pricing
          </h2>
          <p className="mt-3 text-text-muted text-sm">
            Choose the plan that fits your needs.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <PricingCards />
        </motion.div>
      </div>
    </section>
  );
}
