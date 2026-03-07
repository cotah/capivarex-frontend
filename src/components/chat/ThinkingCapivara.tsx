'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

export default function ThinkingCapivara() {
  const [dots, setDots] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => prev.length >= 3 ? '' : prev + '.');
    }, 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center gap-3 py-6">
      <div className="relative w-20 h-20">
        <Image
          src="/capivara-smart.png"
          alt="Capivarex thinking"
          width={80}
          height={80}
          className="w-full h-full object-contain"
        />
        {/* Olho esquerdo - glow */}
        <div className="absolute w-3 h-3 rounded-full animate-eye-glow"
          style={{ top: '30%', left: '25%', backgroundColor: '#F6B93B' }}
        />
        {/* Olho direito - glow */}
        <div className="absolute w-3 h-3 rounded-full animate-eye-glow"
          style={{ top: '30%', right: '25%', backgroundColor: '#F6B93B' }}
        />
      </div>
      <p className="text-gray-400 text-sm">
        Preparing something for you{dots}
      </p>
    </div>
  );
}
