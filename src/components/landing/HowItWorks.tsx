'use client';

import { motion } from 'framer-motion';

const steps = [
  {
    number: '01',
    title: 'Connect your services',
    description:
      'Link Spotify, Google Calendar, SmartThings, and more in a few clicks.',
  },
  {
    number: '02',
    title: 'Talk naturally',
    description:
      'Ask CAPIVAREX anything — play music, schedule events, control your home.',
  },
  {
    number: '03',
    title: 'Let AI handle it',
    description:
      'CAPIVAREX orchestrates multiple services to get things done for you.',
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="px-4 sm:px-6 py-24">
      <div className="mx-auto max-w-4xl">
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-text">
            How it works
          </h2>
        </motion.div>

        <div className="relative">
          {/* Connector line */}
          <div className="absolute left-6 top-0 bottom-0 w-px bg-accent/10 hidden sm:block" />

          <div className="space-y-10 sm:space-y-12">
            {steps.map((step, i) => (
              <motion.div
                key={step.number}
                className="flex items-start gap-6"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
              >
                {/* Number */}
                <div className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-accent/10 border border-accent/20">
                  <span className="text-sm font-bold text-accent">
                    {step.number}
                  </span>
                </div>

                {/* Content */}
                <div className="pt-1">
                  <h3 className="text-base font-semibold text-text mb-1">
                    {step.title}
                  </h3>
                  <p className="text-sm text-text-muted leading-relaxed max-w-md">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
