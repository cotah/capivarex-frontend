'use client';

import { useState } from 'react';

interface DeviceCardProps {
  name: string;
  icon: string;
  status: string;
  room: string;
  type: string;
}

export default function DeviceCard({ name, icon, status, room, type }: DeviceCardProps) {
  const isToggleable = type === 'light' || type === 'plug';
  const [isOn, setIsOn] = useState(status === 'on');

  const statusLabel =
    type === 'lock'
      ? status
      : type === 'thermostat'
        ? status
        : type === 'camera'
          ? status
          : isOn
            ? 'ON'
            : 'OFF';

  const statusColor =
    isOn || status === 'locked' || status === 'closed' || status === 'recording'
      ? 'text-success'
      : 'text-text-muted';

  return (
    <div className="glass rounded-2xl p-5 hover:border-accent/20 hover:shadow-lg hover:shadow-accent/5 transition-all duration-200">
      <div className="flex items-start justify-between mb-3">
        <span className="text-2xl">{icon}</span>
        <div className="flex items-center gap-1.5">
          <span className={`inline-block w-1.5 h-1.5 rounded-full ${statusColor === 'text-success' ? 'bg-success' : 'bg-text-muted/40'}`} />
          <span className={`text-sm ${statusColor}`}>{statusLabel}</span>
        </div>
      </div>
      <p className="text-base font-medium text-text mb-0.5">{name}</p>
      <p className="text-sm text-text-muted mb-3">{room}</p>
      {isToggleable && (
        <button
          onClick={() => setIsOn(!isOn)}
          className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${
            isOn ? 'bg-amber-500' : 'bg-gray-600'
          }`}
        >
          <span
            className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-md transition-transform duration-200 ${
              isOn ? 'translate-x-6' : 'translate-x-0'
            }`}
          />
        </button>
      )}
    </div>
  );
}
