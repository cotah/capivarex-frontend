'use client';
import { useT } from '@/i18n';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Home } from 'lucide-react';
import SubTabs from '@/components/shared/SubTabs';
import DeviceGrid from '@/components/smarts/DeviceGrid';
import VehicleList from '@/components/smarts/VehicleCard';
import { useServicesStore } from '@/stores/servicesStore';

const tabs = [
  { id: 'devices', label: 'Devices' },
  { id: 'vehicles', label: 'Vehicles' },
];

export default function SmartsPage() {
  const t = useT();
  const [activeTab, setActiveTab] = useState('devices');
  const connections = useServicesStore((s) => s.connections);

  const smartHomeConnected = connections.find((c) => c.provider === 'tuya')?.connected ?? false;
  const smartcarConnected = connections.find((c) => c.provider === 'smartcar')?.connected ?? false;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="px-4 py-8"
    >
      <div className="mx-auto max-w-3xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Home size={18} className="text-accent" />
            <h2 className="text-3xl font-semibold text-text">{t('nav.smarts')}</h2>
          </div>
          <SubTabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />
        </div>

        {/* Content */}
        {activeTab === 'devices' ? (
          <DeviceGrid connected={smartHomeConnected} />
        ) : (
          <VehicleList connected={smartcarConnected} />
        )}
      </div>
    </motion.div>
  );
}
