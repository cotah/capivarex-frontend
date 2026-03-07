'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Home } from 'lucide-react';
import SubTabs from '@/components/shared/SubTabs';
import DeviceGrid from '@/components/smarts/DeviceGrid';
import VehicleList from '@/components/smarts/VehicleCard';

const tabs = [
  { id: 'devices', label: 'Devices' },
  { id: 'vehicles', label: 'Vehicles' },
];

export default function SmartsPage() {
  const [activeTab, setActiveTab] = useState('devices');

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
            <h2 className="text-3xl font-semibold text-text">Smarts</h2>
          </div>
          <SubTabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />
        </div>

        {/* Content */}
        {activeTab === 'devices' ? <DeviceGrid /> : <VehicleList />}
      </div>
    </motion.div>
  );
}
