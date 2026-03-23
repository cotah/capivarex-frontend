'use client';

import Image from 'next/image';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4 pb-24">
      {/* Brand Logo */}
      <div className="mb-2 flex flex-col items-center animate-in fade-in">
        <Image
          src="/logo-horizontal.png"
          alt="CAPIVAREX"
          width={320}
          height={120}
          priority
          className="w-72 h-auto object-contain"
          style={{ filter: 'drop-shadow(0 0 8px rgba(201,164,97,0.3))' }}
        />
      </div>

      {/* Card */}
      <div
        className="w-full max-w-sm glass rounded-2xl p-6 animate-in fade-in"
        style={{ animationDelay: '100ms' }}
      >
        {children}
      </div>
    </div>
  );
}
