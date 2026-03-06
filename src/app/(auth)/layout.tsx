'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4 pb-24">
      {/* Brand Logo */}
      <motion.div
        className="mb-2 flex flex-col items-center"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Image
          src="/logo-horizontal.png"
          alt="Capivarex"
          width={320}
          height={120}
          priority
          className="w-72 h-auto object-contain"
          style={{ filter: 'drop-shadow(0 0 8px rgba(201,164,97,0.3))' }}
        />
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
