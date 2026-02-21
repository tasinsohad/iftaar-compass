import { Map, List, Plus } from 'lucide-react';
import type { TabType } from '@/types/mosque';

interface BottomNavProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

const BottomNav = ({ activeTab, onTabChange }: BottomNavProps) => {
  const tabs: { id: TabType; label: string; icon: typeof Map }[] = [
    { id: 'map', label: 'Map', icon: Map },
    { id: 'list', label: 'List', icon: List },
    { id: 'add', label: 'Add', icon: Plus },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t">
      <div className="flex items-center justify-around h-14 max-w-lg mx-auto">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => onTabChange(id)}
            className={`flex flex-col items-center gap-0.5 px-4 py-1 transition-colors ${
              activeTab === id ? 'text-foreground' : 'text-muted-foreground'
            }`}
          >
            <Icon size={20} strokeWidth={activeTab === id ? 2.5 : 1.5} />
            <span className="text-[10px] font-medium">{label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
};

export default BottomNav;
