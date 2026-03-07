'use client';

import { Search } from 'lucide-react';

const mockData = {
  city: 'Dublin',
  temp: 14,
  feelsLike: 11,
  high: 16,
  low: 9,
  humidity: 72,
  wind: '18 km/h',
  condition: 'Partly Cloudy',
  icon: '🌤️',
  hours: [
    { time: 'Now', temp: 14, icon: '🌤️' },
    { time: '14:00', temp: 15, icon: '🌤️' },
    { time: '15:00', temp: 15, icon: '☁️' },
    { time: '16:00', temp: 14, icon: '☁️' },
    { time: '17:00', temp: 13, icon: '🌧️' },
    { time: '18:00', temp: 12, icon: '🌧️' },
  ],
  days: [
    { day: 'Tomorrow', high: 15, low: 8, icon: '🌧️' },
    { day: 'Sunday', high: 13, low: 7, icon: '☁️' },
    { day: 'Monday', high: 16, low: 9, icon: '🌤️' },
    { day: 'Tuesday', high: 17, low: 10, icon: '☀️' },
    { day: 'Wednesday', high: 14, low: 8, icon: '🌧️' },
  ],
};

export default function WeatherPanel() {
  const d = mockData;

  return (
    <div className="w-[calc(100vw-2rem)] md:w-80 rounded-2xl bg-gray-900/90 backdrop-blur-xl border border-white/10 shadow-2xl overflow-hidden">
      {/* Header + current */}
      <div className="p-4 pb-3">
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm text-text-muted">{d.city}</p>
          <span className="text-3xl">{d.icon}</span>
        </div>
        <p className="text-4xl font-bold text-text">{d.temp}°C</p>
        <p className="text-sm text-text-muted mt-0.5">{d.condition}</p>
      </div>

      {/* Info grid */}
      <div className="grid grid-cols-2 gap-px bg-white/5 mx-4 rounded-xl overflow-hidden mb-4">
        {[
          { label: 'Feels like', value: `${d.feelsLike}°` },
          { label: 'High / Low', value: `${d.high}° / ${d.low}°` },
          { label: 'Humidity', value: `${d.humidity}%` },
          { label: 'Wind', value: d.wind },
        ].map((item) => (
          <div key={item.label} className="bg-gray-900/80 p-2.5">
            <p className="text-[11px] text-text-muted">{item.label}</p>
            <p className="text-sm font-medium text-text">{item.value}</p>
          </div>
        ))}
      </div>

      {/* Hourly */}
      <div className="px-4 mb-4">
        <p className="text-xs text-text-muted mb-2">Next hours</p>
        <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-hide">
          {d.hours.map((h) => (
            <div
              key={h.time}
              className="flex flex-col items-center gap-1 shrink-0"
            >
              <span className="text-[11px] text-text-muted">{h.time}</span>
              <span className="text-lg">{h.icon}</span>
              <span className="text-xs font-medium text-text">{h.temp}°</span>
            </div>
          ))}
        </div>
      </div>

      {/* 5-day */}
      <div className="px-4 mb-3">
        <p className="text-xs text-text-muted mb-2">5-day forecast</p>
        <div className="space-y-1.5">
          {d.days.map((day) => (
            <div key={day.day} className="flex items-center gap-3">
              <span className="text-sm text-text w-24 truncate">{day.day}</span>
              <span className="text-base">{day.icon}</span>
              <span className="text-sm text-text ml-auto">
                {day.high}° / <span className="text-text-muted">{day.low}°</span>
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Search */}
      <div className="p-3 pt-2 border-t border-white/5">
        <div className="flex items-center gap-2 rounded-lg bg-white/5 px-3 py-2">
          <Search size={14} className="text-text-muted shrink-0" />
          <input
            type="text"
            placeholder="Search location..."
            className="flex-1 bg-transparent text-sm text-text placeholder:text-text-muted outline-none"
          />
        </div>
      </div>
    </div>
  );
}
