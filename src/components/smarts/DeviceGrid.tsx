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

  useEffect(() => {
    if (!connected) {
      setLoading(false);
      return;
    }
    async function load() {
      try {
        const data = await apiClient<SmartDevice[]>('/api/webapp/smarts/devices');
        setDevices(data);
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
        icon={Home}
        title="No smart home connected"
        description="Connect your SmartThings account to control devices"
        actionLabel="Connect"
        actionHref="/services"
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
