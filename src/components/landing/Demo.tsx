'use client';

import { motion } from 'framer-motion';
import { Music } from 'lucide-react';

const messages = [
  { role: 'user', text: 'Play something chill while I cook dinner' },
  {
    role: 'assistant',
    text: 'Playing "Chill Vibes" playlist on Spotify. I also set a 30-minute timer for your dinner.',
    hasCard: true,
    track: 'Chill Vibes Mix',
    artist: 'Spotify Radio',
  },
  { role: 'user', text: 'Turn on the kitchen lights to 60%' },
  {
    role: 'assistant',
    text: 'Done! Kitchen lights are now at 60% brightness.',
  },
  { role: 'user', text: 'What do I have tomorrow morning?' },
  {
    role: 'assistant',
    text: 'Tomorrow at 9:00 AM you have "Team standup" and at 10:30 AM "Dentist appointment".',
  },
];

export default function Demo() {
  return (
    <section id="demo" className="px-4 sm:px-6 py-24">
      <div className="mx-auto max-w-2xl">
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-text">
            See it in action
          </h2>
        </motion.div>

        {/* Chat mockup */}
        <motion.div
          className="glass rounded-2xl p-4 sm:p-6 overflow-hidden"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          {/* Mockup header */}
          <div className="flex items-center gap-2 mb-5 pb-3 border-b border-white/5">
            <div className="h-2 w-2 rounded-full bg-accent/60" />
            <span className="text-[11px] text-text-muted">Capivarex Chat</span>
          </div>

          <div className="space-y-3">
            {messages.map((msg, i) => (
              <motion.div
                key={i}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: 0.1 + i * 0.08 }}
              >
                <div className="flex flex-col max-w-[80%]">
                  <div
                    className={`px-3.5 py-2 text-xs leading-relaxed rounded-2xl ${
                      msg.role === 'user'
                        ? 'bg-accent/15 border border-accent/20 text-text rounded-br'
                        : 'glass text-text rounded-bl'
                    }`}
                  >
                    {msg.text}
                  </div>

                  {/* Music card mini */}
                  {msg.hasCard && (
                    <div className="mt-1.5 glass rounded-xl p-3 flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/10">
                        <Music size={14} className="text-accent" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[11px] font-medium text-text truncate">
                          {msg.track}
                        </p>
                        <p className="text-[10px] text-text-muted truncate">
                          {msg.artist}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
