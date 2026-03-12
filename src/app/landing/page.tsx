'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import LandingNav from '@/components/landing/LandingNav';
import Hero from '@/components/landing/Hero';
import Features from '@/components/landing/Features';
import HowItWorks from '@/components/landing/HowItWorks';
import Demo from '@/components/landing/Demo';
import LandingPricing from '@/components/landing/LandingPricing';
import FAQ from '@/components/landing/FAQ';
import FinalCTA from '@/components/landing/FinalCTA';
import Footer from '@/components/landing/Footer';

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
