'use client';

import Link from 'next/link';
import { Car, MapPin, Battery, Gauge } from 'lucide-react';

interface Vehicle {
  id: string;
  name: string;
  battery: number;
  range: number;
  status: string;
  location: string;
  lastUpdated: string;
  isCharging: boolean;
}

const mockVehicles: Vehicle[] = [
  {
    id: '1',
    name: 'Tesla Model 3',
    battery: 78,
    range: 310,
    status: 'parked',
    location: 'Home — Dublin, Ireland',
    lastUpdated: '2026-03-07T04:10:00Z',
    isCharging: false,
  },
];

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins} min ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

function batteryColor(pct: number): string {
  if (pct > 50) return 'bg-success';
  if (pct > 20) return 'bg-yellow-400';
  return 'bg-error';
}

interface VehicleListProps {
  connected?: boolean;
}

export default function VehicleList({ connected = true }: VehicleListProps) {
  if (!connected) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <Car size={48} className="text-text-muted/30 mb-4" />
        <p className="text-sm font-medium text-text mb-1">No vehicle connected</p>
        <p className="text-xs text-text-muted mb-4">Connect your car with Smartcar</p>
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
    <div className="space-y-3">
      {mockVehicles.map((v) => (
        <div key={v.id} className="glass rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <Car size={18} className="text-accent" />
            <p className="text-sm font-semibold text-text">{v.name}</p>
            <span className="ml-auto rounded-full bg-white/5 px-2.5 py-0.5 text-[10px] text-text-muted uppercase tracking-wider">
              {v.status}
            </span>
          </div>

          {/* Battery */}
          <div className="flex items-center gap-3 mb-3">
            <Battery size={14} className="text-text-muted flex-shrink-0" />
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-text">{v.battery}%</span>
                {v.isCharging && (
                  <span className="text-[10px] text-success">Charging</span>
                )}
              </div>
              <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
                <div
                  className={`h-full rounded-full ${batteryColor(v.battery)} transition-all`}
                  style={{ width: `${v.battery}%` }}
                />
              </div>
            </div>
          </div>

          {/* Range */}
          <div className="flex items-center gap-3 mb-2">
            <Gauge size={14} className="text-text-muted flex-shrink-0" />
            <span className="text-xs text-text">{v.range} km range</span>
          </div>

          {/* Location */}
          <div className="flex items-center gap-3 mb-2">
            <MapPin size={14} className="text-text-muted flex-shrink-0" />
            <span className="text-xs text-text-muted">{v.location}</span>
          </div>

          <p className="text-[10px] text-text-muted/50 mt-3">
            Last updated {timeAgo(v.lastUpdated)}
          </p>
        </div>
      ))}
    </div>
  );
}
