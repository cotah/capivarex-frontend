'use client';

import { Toaster } from 'react-hot-toast';
import InstallPrompt from '@/components/pwa/InstallPrompt';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
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
    </>
  );
}
