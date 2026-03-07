'use client';

import DeviceCard from './DeviceCard';
import Link from 'next/link';
import { Home } from 'lucide-react';

const mockDevices = [
  { id: '1', name: 'Living Room Light', type: 'light', icon: '💡', status: 'on', room: 'Living Room' },
  { id: '2', name: 'Bedroom Light', type: 'light', icon: '💡', status: 'off', room: 'Bedroom' },
  { id: '3', name: 'Front Door Lock', type: 'lock', icon: '🔒', status: 'locked', room: 'Entrance' },
  { id: '4', name: 'Thermostat', type: 'thermostat', icon: '🌡️', status: '21°C', room: 'Hallway' },
  { id: '5', name: 'Kitchen Plug', type: 'plug', icon: '🔌', status: 'on', room: 'Kitchen' },
  { id: '6', name: 'Garage Door', type: 'lock', icon: '🚪', status: 'closed', room: 'Garage' },
  { id: '7', name: 'Garden Camera', type: 'camera', icon: '📹', status: 'recording', room: 'Garden' },
  { id: '8', name: 'Bathroom Light', type: 'light', icon: '💡', status: 'off', room: 'Bathroom' },
];

interface DeviceGridProps {
  connected?: boolean;
}

export default function DeviceGrid({ connected = true }: DeviceGridProps) {
  if (!connected) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <Home size={48} className="text-text-muted/30 mb-4" />
        <p className="text-sm font-medium text-text mb-1">No smart home connected</p>
        <p className="text-xs text-text-muted mb-4">Connect your SmartThings account to control devices</p>
        <Link
          href="/services"
          className="rounded-xl bg-accent px-5 py-2.5 text-sm font-semibold text-bg hover:bg-accent/90 transition-colors shadow-lg shadow-accent/20"
        >
          Connect
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {mockDevices.map((d) => (
        <DeviceCard
          key={d.id}
          name={d.name}
          icon={d.icon}
          status={d.status}
          room={d.room}
          type={d.type}
        />
      ))}
    </div>
  );
}
