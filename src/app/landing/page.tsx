'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import LandingNav from '@/components/landing/LandingNav';
import Hero from '@/components/landing/Hero';

// Below-the-fold: lazy load (user doesn't see on first paint)
const Features = dynamic(() => import('@/components/landing/Features'));
const HowItWorks = dynamic(() => import('@/components/landing/HowItWorks'));
const Demo = dynamic(() => import('@/components/landing/Demo'));
const LandingPricing = dynamic(() => import('@/components/landing/LandingPricing'));
const FAQ = dynamic(() => import('@/components/landing/FAQ'));
const FinalCTA = dynamic(() => import('@/components/landing/FinalCTA'));
const Footer = dynamic(() => import('@/components/landing/Footer'));

export default function LandingPage() {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (navigator as unknown as { standalone?: boolean }).standalone === true;

    if (isStandalone) {
      router.replace('/chat');
      return;
    }

    setReady(true);
  }, [router]);

  /* Loading screen while checking standalone mode */
  if (!ready) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-bg">
        <Image
          src="/icons/icon-192.png"
          alt="CAPIVAREX"
          width={80}
          height={80}
          priority
          className="animate-pulse"
        />
      </div>
    );
  }

  return (
    <div className="relative z-10">
      <LandingNav />
      <Hero />
      <Features />
      <HowItWorks />
      <Demo />
      <LandingPricing />
      <FAQ />
      <FinalCTA />
      <Footer />
    </div>
  );
}
