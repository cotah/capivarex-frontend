'use client';

import { useState, useEffect } from 'react';

/* ── WMO weather-code → emoji ─────────────────────────── */
function wmoEmoji(code: number): string {
  if (code === 0) return '☀️';
  if (code <= 3) return '🌤️';
  if (code <= 48) return '🌫️';
  if (code <= 57) return '🌦️';
  if (code <= 67) return '🌧️';
  if (code <= 77) return '🌨️';
  if (code <= 82) return '🌧️';
  return '⛈️';
}

function wmoLabel(code: number): string {
  if (code === 0) return 'Clear sky';
  if (code === 1) return 'Mainly clear';
  if (code === 2) return 'Partly cloudy';
  if (code === 3) return 'Overcast';
  if (code <= 48) return 'Fog';
  if (code <= 57) return 'Drizzle';
  if (code <= 67) return 'Rain';
  if (code <= 77) return 'Snow';
  if (code <= 82) return 'Rain showers';
  return 'Thunderstorm';
}

export interface HourForecast {
  time: string;
  temp: number;
  icon: string;
}

export interface DayForecast {
  day: string;
  high: number;
  low: number;
  icon: string;
}

export interface WeatherData {
  city: string;
  temp: number;
  feelsLike: number;
  high: number;
  low: number;
  humidity: number;
  wind: string;
  condition: string;
  icon: string;
  hours: HourForecast[];
  days: DayForecast[];
}

const CACHE_KEY = 'capivarex_weather';
const CACHE_TTL = 15 * 60 * 1000; // 15 min

interface CachedWeather {
  data: WeatherData;
  ts: number;
}

function readCache(): WeatherData | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const cached: CachedWeather = JSON.parse(raw);
    if (Date.now() - cached.ts > CACHE_TTL) return null;
    return cached.data;
  } catch {
    return null;
  }
}

function writeCache(data: WeatherData) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({ data, ts: Date.now() }));
  } catch { /* quota */ }
}

const WEEKDAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

async function fetchCity(lat: number, lon: number): Promise<string> {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&zoom=10`,
      { headers: { 'Accept-Language': 'en' } },
    );
    const json = await res.json();
    return (
      json.address?.city ||
      json.address?.town ||
      json.address?.village ||
      json.address?.municipality ||
      'Unknown'
    );
  } catch {
    return 'Unknown';
  }
}

async function fetchWeather(lat: number, lon: number): Promise<WeatherData> {
  const city = await fetchCity(lat, lon);

  const params = new URLSearchParams({
    latitude: String(lat),
    longitude: String(lon),
    current: 'temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m',
    hourly: 'temperature_2m,weather_code',
    daily: 'weather_code,temperature_2m_max,temperature_2m_min',
    timezone: 'auto',
    forecast_days: '6',
  });

  const res = await fetch(`https://api.open-meteo.com/v1/forecast?${params}`);
  const json = await res.json();

  const current = json.current;
  const hourly = json.hourly;
  const daily = json.daily;

  // Build next 6 hours starting from current hour
  const nowHour = new Date().getHours();
  const hourStart = hourly.time.findIndex(
    (t: string) => new Date(t).getHours() >= nowHour && new Date(t).toDateString() === new Date().toDateString(),
  );
  const hours: HourForecast[] = [];
  for (let i = 0; i < 6 && hourStart + i < hourly.time.length; i++) {
    const idx = hourStart + i;
    hours.push({
      time: i === 0 ? 'Now' : new Date(hourly.time[idx]).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      temp: Math.round(hourly.temperature_2m[idx]),
      icon: wmoEmoji(hourly.weather_code[idx]),
    });
  }

  // Build 5-day forecast (skip today → indices 1..5)
  const days: DayForecast[] = [];
  for (let i = 1; i <= 5 && i < daily.time.length; i++) {
    const date = new Date(daily.time[i] + 'T00:00:00');
    days.push({
      day: i === 1 ? 'Tomorrow' : WEEKDAYS[date.getDay()],
      high: Math.round(daily.temperature_2m_max[i]),
      low: Math.round(daily.temperature_2m_min[i]),
      icon: wmoEmoji(daily.weather_code[i]),
    });
  }

  const data: WeatherData = {
    city,
    temp: Math.round(current.temperature_2m),
    feelsLike: Math.round(current.apparent_temperature),
    high: Math.round(daily.temperature_2m_max[0]),
    low: Math.round(daily.temperature_2m_min[0]),
    humidity: Math.round(current.relative_humidity_2m),
    wind: `${Math.round(current.wind_speed_10m)} km/h`,
    condition: wmoLabel(current.weather_code),
    icon: wmoEmoji(current.weather_code),
    hours,
    days,
  };

  writeCache(data);
  return data;
}

export function useWeather() {
  const [data, setData] = useState<WeatherData | null>(readCache);
  const [loading, setLoading] = useState(!readCache());

  useEffect(() => {
    // If we have a cache hit, still refresh in background but don't show loading
    const cached = readCache();
    if (cached) {
      setData(cached);
      setLoading(false);
    }

    if (!navigator.geolocation) {
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const result = await fetchWeather(pos.coords.latitude, pos.coords.longitude);
          setData(result);
        } catch {
          // keep cached data if available
        } finally {
          setLoading(false);
        }
      },
      () => {
        // Geolocation denied — keep cached data or null
        setLoading(false);
      },
      { timeout: 10000, maximumAge: 600000 },
    );
  }, []);

  return { data, loading };
}
