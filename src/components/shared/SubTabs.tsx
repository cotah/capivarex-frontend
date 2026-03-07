'use client';

interface SubTabsProps {
  tabs: { id: string; label: string }[];
  activeTab: string;
  onChange: (id: string) => void;
}

export default function SubTabs({ tabs, activeTab, onChange }: SubTabsProps) {
  return (
    <div className="flex items-center gap-2">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={`rounded-[10px] px-4 py-1.5 text-base font-medium transition-all duration-200 ${
            activeTab === tab.id
              ? 'bg-accent-soft text-accent'
              : 'glass text-text-muted hover:text-text hover:bg-white/5'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
