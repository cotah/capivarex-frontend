'use client';

import { useState } from 'react';
import ActivityGroup from './ActivityGroup';

interface Activity {
  id: string;
  icon: string;
  time: string;
  description: string;
  service: string;
  agent: string;
  date: string;
}

const mockActivities: Activity[] = [
  // Today
  { id: '1', icon: '🎵', time: '2:41 PM', description: 'Played Candy Shop — 50 Cent', service: 'Spotify', agent: 'Music Agent', date: 'today' },
  { id: '2', icon: '📅', time: '1:30 PM', description: 'Created event "Team Standup" at 3:00 PM', service: 'Google Calendar', agent: 'Calendar Agent', date: 'today' },
  { id: '3', icon: '🛒', time: '11:00 AM', description: 'Added 5 items to shopping list', service: 'Shopping', agent: 'Mercado Agent', date: 'today' },
  { id: '4', icon: '📧', time: '9:15 AM', description: 'Replied to João about Project Alpha', service: 'Gmail', agent: 'Email Agent', date: 'today' },
  { id: '5', icon: '💡', time: '8:30 AM', description: 'Turned on Living Room Light', service: 'SmartThings', agent: 'SmartHome Agent', date: 'today' },
  { id: '6', icon: '🌤️', time: '8:00 AM', description: 'Weather briefing: 14°C, partly cloudy', service: 'Weather', agent: 'Weather Agent', date: 'today' },

  // Yesterday
  { id: '7', icon: '🔍', time: '6:00 PM', description: 'Researched "best electric cars 2026"', service: 'Web Search', agent: 'Research Agent', date: 'yesterday' },
  { id: '8', icon: '🎵', time: '4:30 PM', description: 'Created playlist "Workout Mix"', service: 'Spotify', agent: 'Music Agent', date: 'yesterday' },
  { id: '9', icon: '📦', time: '2:00 PM', description: 'Tracked package #EU38472 — Out for delivery', service: 'Tracking', agent: 'Tracking Agent', date: 'yesterday' },
  { id: '10', icon: '🛒', time: '10:00 AM', description: 'Scanned receipt from Lidl — €42.30', service: 'Shopping', agent: 'Mercado Agent', date: 'yesterday' },
  { id: '11', icon: '📅', time: '9:00 AM', description: 'Reminded: Dentist appointment tomorrow', service: 'Reminders', agent: 'Reminder Agent', date: 'yesterday' },

  // This Week
  { id: '12', icon: '🚗', time: '5:00 PM', description: 'Checked car battery: 78%, 310km range', service: 'Smartcar', agent: 'Car Agent', date: 'this_week' },
  { id: '13', icon: '💻', time: '3:00 PM', description: 'Created GitHub issue #42 on capivarex repo', service: 'GitHub', agent: 'Dev Agent', date: 'this_week' },
  { id: '14', icon: '🍽️', time: '11:00 AM', description: 'Found 3 Italian restaurants near you', service: 'Restaurants', agent: 'Restaurant Agent', date: 'this_week' },
  { id: '15', icon: '📊', time: '9:30 AM', description: 'Finance update: AAPL +2.3%, BTC +3.2%', service: 'Finance', agent: 'Finance Agent', date: 'this_week' },
];

const GROUP_LABELS: Record<string, string> = {
  today: 'Today',
  yesterday: 'Yesterday',
  this_week: 'This Week',
};

export default function ActivityFeedPage() {
  const [showAll, setShowAll] = useState(false);
  const visible = showAll ? mockActivities : mockActivities.slice(0, 11);

  const groups = ['today', 'yesterday', 'this_week']
    .map((key) => ({
      label: GROUP_LABELS[key],
      items: visible.filter((a) => a.date === key),
    }))
    .filter((g) => g.items.length > 0);

  return (
    <div className="space-y-6">
      {groups.map((group) => (
        <ActivityGroup key={group.label} label={group.label} items={group.items} />
      ))}

      {!showAll && mockActivities.length > 11 && (
        <button
          onClick={() => setShowAll(true)}
          className="w-full rounded-xl glass px-4 py-3 text-xs font-medium text-text-muted hover:text-text hover:bg-white/5 transition-colors"
        >
          Load more
        </button>
      )}
    </div>
  );
}
