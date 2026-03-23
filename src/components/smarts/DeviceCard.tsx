'use client';

import { useState } from 'react';
import { apiClient } from '@/lib/api';
import { Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

interface DeviceCardProps {
  id: string;
  name: string;
  icon: string;
  status: string;
  room: string;
  type: string;
}

export default function DeviceCard({ id, name, icon, status, room, type }: DeviceCardProps) {
  const isToggleable = type === 'light' || type === 'plug';
  const [isOn, setIsOn] = useState(status === 'on');
  const [toggling, setToggling] = useState(false);

  const handleToggle = async () => {
    const newValue = !isOn;
    setIsOn(newValue); // Optimistic update
    setToggling(true);
    try {
      const resp = await apiClient<{ ok: boolean; error?: string }>(`/api/webapp/smarts/devices/${id}/command`, {
        method: 'POST',
        body: JSON.stringify({ code: 'switch_led', value: newValue }),
      });
      if (!resp.ok) {
        setIsOn(!newValue); // Revert on failure
        if (resp.error) {
          toast.error(resp.error, { duration: 5000 });
        }
      }
    } catch {
      setIsOn(!newValue); // Revert on error
    } finally {
      setToggling(false);
    }
  };

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
          {toggling ? (
            <Loader2 size={12} className="animate-spin text-accent" />
          ) : (
            <span className={`inline-block w-1.5 h-1.5 rounded-full ${statusColor === 'text-success' ? 'bg-success' : 'bg-text-muted/40'}`} />
          )}
          <span className={`text-sm ${statusColor}`}>{statusLabel}</span>
        </div>
      </div>
      <p className="text-base font-medium text-text mb-0.5">{name}</p>
      <p className="text-sm text-text-muted mb-3">{room}</p>
      {isToggleable && (
        <button
          onClick={handleToggle}
          disabled={toggling}
          className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${
            isOn ? 'bg-amber-500' : 'bg-gray-600'
          } ${toggling ? 'opacity-50' : ''}`}
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
