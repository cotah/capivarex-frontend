'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

const faqs = [
  {
    q: 'What is Capivarex?',
    a: 'Capivarex is an AI-powered life assistant that connects your music, calendar, smart home, shopping, car, and more into one intelligent conversation.',
  },
  {
    q: 'Is my data safe?',
    a: 'Yes. All communication is encrypted end-to-end and we are fully GDPR compliant. We never sell your data to third parties.',
  },
  {
    q: 'Which services are supported?',
    a: 'Currently we support Spotify, Google Calendar, Gmail, SmartThings, Smartcar, and GitHub. WhatsApp, Outlook, and Canva integrations are coming soon.',
  },
  {
    q: 'Can I use it on my phone?',
    a: 'Absolutely. Capivarex is a PWA — install it directly from your browser on iOS or Android for a native app experience.',
  },
  {
    q: 'How does the free plan work?',
    a: 'The free plan includes 30 messages per day, 5 agents, and Telegram access. No credit card required.',
  },
  {
    q: 'Can I cast media to my TV?',
    a: 'Yes. With the Everywhere plan, you can cast music, videos, and other media to any Chromecast-enabled device.',
  },
  {
    q: 'How do I cancel my subscription?',
    a: 'You can cancel anytime from the Settings page. Your plan will remain active until the end of the billing period.',
  },
];

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-white/5 last:border-0">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between py-4 text-left"
      >
        <span className="text-sm font-medium text-text pr-4">{q}</span>
        <ChevronDown
          size={16}
          className={`shrink-0 text-text-muted transition-transform duration-200 ${
            open ? 'rotate-180' : ''
          }`}
        />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <p className="pb-4 text-xs text-text-muted leading-relaxed">
              {a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FAQ() {
  return (
    <section id="faq" className="px-4 sm:px-6 py-24">
      <div className="mx-auto max-w-2xl">
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-text">
            Frequently asked questions
          </h2>
        </motion.div>

        <motion.div
          className="glass rounded-2xl px-6"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          {faqs.map((faq) => (
            <FAQItem key={faq.q} {...faq} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
