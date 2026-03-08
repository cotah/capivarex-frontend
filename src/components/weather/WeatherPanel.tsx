'use client';

import { useState } from 'react';
import { Search, Loader2 } from 'lucide-react';
import type { WeatherData } from '@/hooks/useWeather';

interface WeatherPanelProps {
  data: WeatherData;
  searching?: boolean;
  onSearch: (city: string) => void;
}

export default function WeatherPanel({ data: d, searching, onSearch }: WeatherPanelProps) {
  const [query, setQuery] = useState('');

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter' && query.trim()) {
      onSearch(query.trim());
      setQuery('');
    }
  }

  return (
    <div className="w-[calc(100vw-2rem)] md:w-80 rounded-2xl bg-gray-900/95 backdrop-blur-xl border border-amber-500/20 shadow-2xl shadow-black/50 overflow-hidden">
      {/* Header + current */}
      <div className="p-4 pb-3">
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm text-gray-400">{d.city}</p>
          <span className="text-3xl">{d.icon}</span>
        </div>
        <p className="text-4xl font-bold text-white">{d.temp}°C</p>
        <p className="text-sm text-gray-400 mt-0.5">{d.condition}</p>
      </div>

      {/* Info grid */}
      <div className="grid grid-cols-2 gap-2 mx-4 mb-4">
        {[
          { label: 'Feels like', value: `${d.feelsLike}°` },
          { label: 'High / Low', value: `${d.high}° / ${d.low}°` },
          { label: 'Humidity', value: `${d.humidity}%` },
          { label: 'Wind', value: d.wind },
        ].map((item) => (
          <div
            key={item.label}
            className="bg-white/5 border border-white/10 rounded-xl p-2.5"
          >
            <p className="text-[11px] text-gray-400">{item.label}</p>
            <p className="text-sm font-medium text-white">{item.value}</p>
          </div>
        ))}
      </div>

      {/* Hourly */}
      <div className="px-4 mb-4">
        <p className="text-xs text-amber-400 mb-2">Next hours</p>
        <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-hide">
          {d.hours.map((h) => (
            <div
              key={h.time}
              className="flex flex-col items-center gap-1 shrink-0"
            >
              <span className="text-[11px] text-gray-400">{h.time}</span>
              <span className="text-lg">{h.icon}</span>
              <span className="text-xs font-medium text-white">{h.temp}°</span>
            </div>
          ))}
        </div>
      </div>

      {/* 5-day */}
      <div className="px-4 mb-3">
        <p className="text-xs text-amber-400 mb-2">5-day forecast</p>
        <div className="space-y-1.5">
          {d.days.map((day) => (
            <div key={day.day} className="flex items-center gap-3">
              <span className="text-sm text-white w-24 truncate">
                {day.day}
              </span>
              <span className="text-base">{day.icon}</span>
              <span className="text-sm text-white ml-auto">
                {day.high}° /{' '}
                <span className="text-gray-400">{day.low}°</span>
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Search */}
      <div className="p-3 pt-2 border-t border-white/5">
        <div className="flex items-center gap-2 rounded-lg bg-white/5 border border-white/10 px-3 py-2">
          {searching ? (
            <Loader2 size={14} className="text-amber-400 shrink-0 animate-spin" />
          ) : (
            <Search size={14} className="text-gray-500 shrink-0" />
          )}
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search location..."
            className="flex-1 bg-transparent text-sm text-white placeholder:text-gray-500 outline-none"
          />
        </div>
      </div>
    </div>
  );
}
