'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || '';

const sections = [
  { id: 'features', label: 'Features' },
  { id: 'how-it-works', label: 'How it works' },
  { id: 'pricing', label: 'Pricing' },
  { id: 'faq', label: 'FAQ' },
];

export default function LandingNav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'glass-strong shadow-lg shadow-black/20' : 'bg-transparent'
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 sm:px-6 py-2 sm:py-2">
        <Image
          src="/logo-horizontal.png"
          alt="Capivarex"
          width={200}
          height={50}
          priority
          className="h-8 sm:h-10 w-auto object-contain"
        />

        <nav className="hidden sm:flex items-center gap-1.5">
          {sections.map(({ id, label }) => (
            <button
              key={id}
              onClick={() => scrollTo(id)}
              className="rounded-lg px-4 py-2 text-base font-medium text-text-muted hover:text-text hover:bg-white/5 transition-colors"
            >
              {label}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            href={`${APP_URL}/login`}
            className="whitespace-nowrap rounded-lg px-3 py-1.5 text-sm font-medium text-text-muted hover:text-text transition-colors sm:px-5 sm:py-2 sm:text-base"
          >
            Sign In
          </Link>
          <Link
            href={`${APP_URL}/register`}
            className="whitespace-nowrap rounded-xl bg-accent px-4 py-2 text-sm font-semibold text-bg hover:bg-accent/90 transition-colors shadow-lg shadow-accent/20 sm:px-6 sm:py-2.5 sm:text-base"
          >
            Get Started
          </Link>
        </div>
      </div>
    </header>
  );
}
