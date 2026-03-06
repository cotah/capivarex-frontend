'use client';

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
