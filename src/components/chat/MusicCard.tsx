'use client';

import { Music, SkipBack, Play, SkipForward } from 'lucide-react';
import CastButton from '@/components/cast/CastButton';

interface MusicCardProps {
  data?: Record<string, unknown>;
}

export default function MusicCard({ data }: MusicCardProps) {
  const track = (data?.track as string) || 'Unknown Track';
  const artist = (data?.artist as string) || 'Unknown Artist';

  return (
    <div className="mt-2 glass rounded-2xl p-4 max-w-xs">
      <div className="flex items-center gap-3 mb-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10">
          <Music size={18} className="text-accent" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-base font-medium text-text truncate">{track}</p>
          <p className="text-sm text-text-muted truncate">{artist}</p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mb-3 h-1 rounded-full bg-white/5">
        <div className="h-full w-1/3 rounded-full bg-accent/50" />
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-4">
        <button className="text-text-muted hover:text-text transition-colors">
          <SkipBack size={16} />
        </button>
        <button className="flex h-8 w-8 items-center justify-center rounded-full bg-accent/20 text-accent hover:bg-accent/30 transition-colors">
          <Play size={14} />
        </button>
        <button className="text-text-muted hover:text-text transition-colors">
          <SkipForward size={16} />
        </button>
        <CastButton size={14} />
      </div>
    </div>
  );
}
