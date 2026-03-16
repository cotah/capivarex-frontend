'use client';

import { useState, useEffect } from 'react';
import { Home } from 'lucide-react';
import { apiClient } from '@/lib/api';
import DeviceCard from './DeviceCard';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import EmptyState from '@/components/shared/EmptyState';
import type { SmartDevice } from '@/lib/types';

interface DeviceGridProps {
  connected?: boolean;
}

export default function DeviceGrid({ connected = true }: DeviceGridProps) {
  const [devices, setDevices] = useState<SmartDevice[]>([]);
  const [loading, setLoading] = useState(true);
  const [isConnected, setIsConnected] = useState(connected);

  useEffect(() => {
    async function load() {
      try {
        const resp = await apiClient<{ devices: SmartDevice[]; connected: boolean } | SmartDevice[]>(
          '/api/webapp/smarts/devices'
        );
        if (Array.isArray(resp)) {
          setDevices(resp);
          setIsConnected(resp.length > 0);
        } else {
          setDevices(resp.devices || []);
          setIsConnected(resp.connected ?? (resp.devices?.length > 0));
        }
      } catch {
        setIsConnected(false);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) return <LoadingSpinner />;

  if (!isConnected) {
    return (
      <EmptyState
        icon={Home}
        title="No smart home connected"
        description="Connect your Tuya Smart / Smart Life account to control devices"
        actionLabel="Connect"
        actionHref="/settings"
      />
    );
  }

  if (loading) return <LoadingSpinner />;

  if (devices.length === 0) {
    return (
      <EmptyState
        icon={Home}
        title="No devices found"
        description="Your smart home devices will appear here once detected."
      />
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {devices.map((d) => (
        <DeviceCard
          key={d.id}
          id={d.id}
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
