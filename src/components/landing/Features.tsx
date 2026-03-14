'use client';

import { motion } from 'framer-motion';
import { Music, Calendar, Home, ShoppingCart, Car, Search } from 'lucide-react';

const features = [
  {
    icon: Music,
    title: 'Music Control',
    description: 'Play, pause, queue songs and cast to any device through Spotify.',
  },
  {
    icon: Calendar,
    title: 'Calendar',
    description: 'Create events, check your schedule, and get smart reminders.',
  },
  {
    icon: Home,
    title: 'Smart Home',
    description: 'Control lights, locks, thermostats and more via Tuya Smart Home.',
  },
  {
    icon: ShoppingCart,
    title: 'Shopping',
    description: 'Track grocery spending, compare prices, and manage lists.',
  },
  {
    icon: Car,
    title: 'Connected Car',
    description: 'Lock, unlock, start, and check your vehicle status with Smartcar.',
  },
  {
    icon: Search,
    title: 'Research',
    description: 'Search the web, summarise articles, and answer complex questions.',
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.1 },
  }),
};

export default function Features() {
  return (
    <section id="features" className="px-4 sm:px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-text">
            Everything in one place
          </h2>
          <p className="mt-3 text-text-muted text-sm sm:text-base max-w-md mx-auto">
            One assistant, dozens of integrations.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              custom={i}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="glass rounded-2xl p-6 hover:border-accent/20 transition-colors"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10 mb-4">
                <f.icon size={20} className="text-accent" />
              </div>
              <h3 className="text-sm font-semibold text-text mb-1.5">{f.title}</h3>
              <p className="text-sm text-text-muted leading-relaxed">
                {f.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
