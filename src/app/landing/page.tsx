'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import '@/components/landing/landing.css';

import NavBar from '@/components/landing/NavBar';
import HeroSection from '@/components/landing/HeroSection';
import MorningBriefingSection from '@/components/landing/MorningBriefingSection';
import FeaturesSection from '@/components/landing/FeaturesSection';
import HowItWorksSection from '@/components/landing/HowItWorksSection';
import CommunitySection from '@/components/landing/CommunitySection';
import PricingSection from '@/components/landing/PricingSection';
import CTASection from '@/components/landing/CTASection';
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

  if (!ready) {
    return (
      <div className="fixed inset-0 flex items-center justify-center" style={{ background: '#0A0A0A' }}>
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
    <div className="min-h-screen" style={{ background: '#0A0A0A', color: '#F8F8F8' }}>
      <NavBar />
      <HeroSection />
      <MorningBriefingSection />
      <FeaturesSection />
      <HowItWorksSection />
      <CommunitySection />
      <PricingSection />
      <CTASection />
      <Footer />
    </div>
  );
}
