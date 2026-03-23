'use client';

import { Toaster } from 'react-hot-toast';
import { LazyMotion, domAnimation } from 'framer-motion';
import InstallPrompt from '@/components/pwa/InstallPrompt';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <LazyMotion features={domAnimation}>
      {children}
      <InstallPrompt />
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: 'rgba(255,255,255,0.08)',
            backdropFilter: 'blur(20px)',
            color: '#e8e6e3',
            border: '1px solid rgba(255,255,255,0.08)',
            fontSize: '13px',
          },
        }}
      />
    </LazyMotion>
  );
}
