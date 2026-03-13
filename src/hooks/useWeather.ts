'use client';

import { useState, useEffect, useCallback } from 'react';
import { apiClient } from '@/lib/api';
import { useAuthStore } from '@/stores/authStore';

const CACHE_KEY = 'capivarex_weather';
const CITY_KEY = 'capivarex_weather_city';
const CACHE_TTL = 15 * 60 * 1000; // 15 min
const FALLBACK_CITY = 'Dublin';

/* ── Condition text → emoji ─────────────────────────── */
function conditionEmoji(text: string): string {
  const t = text.toLowerCase();
  if (t.includes('sunny') || t.includes('clear')) return '☀️';
  if (t.includes('partly cloudy') || t.includes('partly')) return '🌤️';
  if (t.includes('cloudy') || t.includes('overcast')) return '☁️';
  if (t.includes('mist') || t.includes('fog')) return '🌫️';
  if (t.includes('thunder')) return '⛈️';
  if (t.includes('snow') || t.includes('sleet') || t.includes('blizzard') || t.includes('ice')) return '🌨️';
  if (t.includes('drizzle') || t.includes('light rain')) return '🌦️';
  if (t.includes('rain') || t.includes('shower')) return '🌧️';
  return '🌤️';
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

interface CachedWeather {
  data: WeatherData;
  ts: number;
}

const WEEKDAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

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

function readLastCity(): string {
  try {
    return localStorage.getItem(CITY_KEY) || '';
  } catch {
    return '';
  }
}

function writeLastCity(city: string) {
  try {
    localStorage.setItem(CITY_KEY, city);
  } catch { /* quota */ }
}

function mapResponse(json: Record<string, unknown>): WeatherData {
  const current = json.current as Record<string, unknown>;
  const location = json.location as Record<string, unknown>;
  const forecast = json.forecast as Record<string, unknown> | undefined;
  const forecastDays = (forecast?.forecastday || []) as Record<string, unknown>[];

  // Today's forecast for high/low
  const todayForecast = forecastDays[0] as Record<string, unknown> | undefined;

  // Hourly — next 6 hours from now
  const nowHour = new Date().getHours();
  const todayHours = ((todayForecast?.hour || []) as Record<string, unknown>[]);
  const day1 = forecastDays[1] as Record<string, unknown> | undefined;
  const tomorrowHours = ((day1?.hour || []) as Record<string, unknown>[]);
  const allHours = [...todayHours, ...tomorrowHours];

  const hourStart = todayHours.findIndex(
    (h) => new Date(h.time as string).getHours() >= nowHour,
  );
  const hours: HourForecast[] = [];
  for (let i = 0; i < 6; i++) {
    const idx = hourStart >= 0 ? hourStart + i : i;
    const h = allHours[idx];
    if (!h) break;
    const hCond = h.condition as Record<string, unknown> | undefined;
    hours.push({
      time: i === 0 ? 'Now' : new Date(h.time as string).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      temp: Math.round(h.temp_c as number),
      icon: conditionEmoji((hCond?.text as string) || ''),
    });
  }

  // 5-day forecast (skip today → indices 1..5)
  const days: DayForecast[] = [];
  for (let i = 1; i < forecastDays.length && days.length < 5; i++) {
    const fd = forecastDays[i];
    const fdDay = fd.day as Record<string, unknown>;
    const fdCond = fdDay.condition as Record<string, unknown> | undefined;
    const date = new Date((fd.date as string) + 'T00:00:00');
    days.push({
      day: i === 1 ? 'Tomorrow' : WEEKDAYS[date.getDay()],
      high: Math.round(fdDay.maxtemp_c as number),
      low: Math.round(fdDay.mintemp_c as number),
      icon: conditionEmoji((fdCond?.text as string) || ''),
    });
  }

  const city = (location?.name as string) || 'Unknown';
  writeLastCity(city);

  const curCond = current.condition as Record<string, unknown> | undefined;
  const todayDay = todayForecast?.day as Record<string, unknown> | undefined;

  return {
    city,
    temp: Math.round(current.temp_c as number),
    feelsLike: Math.round(current.feelslike_c as number),
    high: todayDay ? Math.round(todayDay.maxtemp_c as number) : Math.round(current.temp_c as number),
    low: todayDay ? Math.round(todayDay.mintemp_c as number) : Math.round(current.temp_c as number),
    humidity: Math.round(current.humidity as number),
    wind: `${Math.round(current.wind_kph as number)} km/h`,
    condition: (curCond?.text as string) || '',
    icon: conditionEmoji((curCond?.text as string) || ''),
    hours,
    days,
  };
}

async function fetchWeatherByQuery(query: string): Promise<WeatherData> {
  const json = await apiClient<Record<string, unknown>>(
    `/api/webapp/weather?q=${encodeURIComponent(query)}`,
  );
  const data = mapResponse(json);
  writeCache(data);
  return data;
}

export function useWeather() {
  const [data, setData] = useState<WeatherData | null>(readCache);
  const [loading, setLoading] = useState(!readCache());
  // Wait for the auth token before fetching. Without this, the fetch can fire
  // before the Supabase session is available, resulting in a silenced 401.
  const token = useAuthStore((s) => s.token);

  /* ── Initial load: geolocation → last city → fallback ── */
  useEffect(() => {
    if (!token) return;  // don't fetch without auth token

    const cached = readCache();
    if (cached) {
      setData(cached);
      setLoading(false);
    }

    function loadByCity(city: string) {
      fetchWeatherByQuery(city)
        .then(setData)
        .catch(() => { /* keep cached */ })
        .finally(() => setLoading(false));
    }

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          loadByCity(`${pos.coords.latitude},${pos.coords.longitude}`);
        },
        () => {
          // Denied — use last city or fallback
          loadByCity(readLastCity() || FALLBACK_CITY);
        },
        { timeout: 10000, maximumAge: 600000 },
      );
    } else {
      loadByCity(readLastCity() || FALLBACK_CITY);
    }
  }, [token]);

  /* ── Search by city name ── */
  const searchCity = useCallback(async (city: string) => {
    if (!city.trim()) return;
    setLoading(true);
    try {
      const result = await fetchWeatherByQuery(city.trim());
      setData(result);
    } catch {
      // keep current data
    } finally {
      setLoading(false);
    }
  }, []);

  return { data, loading, searchCity };
}
