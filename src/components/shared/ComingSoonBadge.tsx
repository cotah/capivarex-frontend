'use client';

import { useState } from 'react';

interface ComingSoonBadgeProps {
  children: React.ReactNode;
  message?: string;
}

export default function ComingSoonBadge({
  children,
  message = 'Esta funcionalidade está em beta fechado e será liberada em breve.',
}: ComingSoonBadgeProps) {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div className="relative">
      <div
        className="opacity-40 cursor-not-allowed select-none pointer-events-auto"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setShowTooltip(true);
          setTimeout(() => setShowTooltip(false), 3000);
        }}
      >
        {children}
      </div>

      {/* Badge */}
      <div className="absolute top-3 right-3 z-10">
        <span className="rounded-full bg-accent/15 border border-accent/20 px-2.5 py-0.5 text-xs font-medium text-accent uppercase tracking-wider">
          Em Breve
        </span>
      </div>

      {/* Tooltip */}
      {showTooltip && (
        <div className="absolute inset-0 z-20 flex items-center justify-center p-4">
          <div
            className="glass rounded-xl px-4 py-3 text-sm text-text text-center shadow-lg border border-accent/20 max-w-xs"
            onClick={() => setShowTooltip(false)}
          >
            {message}
          </div>
        </div>
      )}
    </div>
  );
}
