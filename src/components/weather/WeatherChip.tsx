'use client';

import { useState, useRef, useEffect } from 'react';
import { useWeather } from '@/hooks/useWeather';
import WeatherPanel from './WeatherPanel';

export default function WeatherChip() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const { data, loading, searchCity } = useWeather();

  /* Close on click outside */
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  if (!data && loading) return null;
  if (!data) return null;

  return (
    <div ref={ref} className="relative shrink-0">
      <button
        onClick={() => setOpen((p) => !p)}
        className="flex items-center gap-1.5 rounded-full bg-white/5 backdrop-blur border border-white/10 px-3 py-1 text-sm text-gray-300 hover:bg-white/10 transition-colors"
      >
        <span>{data.icon}</span>
        <span>{data.temp}°C</span>
        <span className="hidden md:inline text-text-muted">{data.city}</span>
      </button>

      {/* Desktop: absolute dropdown */}
      {open && (
        <div className="hidden md:block absolute top-full mt-2 right-0 z-50">
          <WeatherPanel data={data} searching={loading} onSearch={searchCity} />
        </div>
      )}

      {/* Mobile: fixed centered overlay */}
      {open && (
        <div className="md:hidden fixed inset-0 z-50 flex items-start justify-center pt-24">
          <div
            className="absolute inset-0 bg-black/50"
            onMouseDown={() => setOpen(false)}
          />
          <div className="relative mx-4 max-h-[70vh] overflow-y-auto rounded-2xl">
            <WeatherPanel data={data} searching={loading} onSearch={searchCity} />
          </div>
        </div>
      )}
    </div>
  );
}
