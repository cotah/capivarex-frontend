'use client';

import { useState, useEffect } from 'react';
import { Car, MapPin, Battery, Gauge } from 'lucide-react';
import { apiClient } from '@/lib/api';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import EmptyState from '@/components/shared/EmptyState';
import type { Vehicle } from '@/lib/types';

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
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!connected) {
      setLoading(false);
      return;
    }
    async function load() {
      try {
        const resp = await apiClient<{ vehicles: Record<string, unknown>[] } | Record<string, unknown>[]>('/api/webapp/smarts/vehicles');
        const raw = Array.isArray(resp) ? resp : (resp.vehicles || []);
        setVehicles(
          raw.map((v) => ({
            id: v.id as string,
            name: v.name as string,
            battery: v.battery as number,
            range: v.range as number,
            status: v.status as string,
            location: v.location as string,
            lastUpdated: (v.last_updated as string) || (v.lastUpdated as string) || '',
            isCharging: (v.is_charging as boolean) || (v.isCharging as boolean) || false,
          })),
        );
      } catch {
        // toast already shown
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [connected]);

  if (!connected) {
    return (
      <EmptyState
        icon={Car}
        title="No vehicle connected"
        description="Connect your car with Smartcar"
        actionLabel="Connect"
        actionHref="/services"
      />
    );
  }

  if (loading) return <LoadingSpinner />;

  if (vehicles.length === 0) {
    return (
      <EmptyState
        icon={Car}
        title="No vehicles found"
        description="Your connected vehicles will appear here."
      />
    );
  }

  return (
    <div className="space-y-3">
      {vehicles.map((v) => (
        <div key={v.id} className="glass rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <Car size={18} className="text-accent" />
            <p className="text-base font-semibold text-text">{v.name}</p>
            <span className="ml-auto rounded-full bg-white/5 px-2.5 py-0.5 text-sm text-text-muted uppercase tracking-wider">
              {v.status}
            </span>
          </div>

          {/* Battery */}
          <div className="flex items-center gap-3 mb-3">
            <Battery size={14} className="text-text-muted flex-shrink-0" />
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-text">{v.battery}%</span>
                {v.isCharging && (
                  <span className="text-sm text-success">Charging</span>
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
            <span className="text-sm text-text">{v.range} km range</span>
          </div>

          {/* Location */}
          <div className="flex items-center gap-3 mb-2">
            <MapPin size={14} className="text-text-muted flex-shrink-0" />
            <span className="text-sm text-text-muted">{v.location}</span>
          </div>

          <p className="text-sm text-text-muted/50 mt-3">
            Last updated {timeAgo(v.lastUpdated)}
          </p>
        </div>
      ))}
    </div>
  );
}
