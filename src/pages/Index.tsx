import { useState, useMemo, useEffect } from 'react';
import Header from '@/components/Header';
import BottomNav from '@/components/BottomNav';
import MapView from '@/components/MapView';
import MosqueList from '@/components/MosqueList';
import MosqueDetail from '@/components/MosqueDetail';
import AddMosqueForm from '@/components/AddMosqueForm';
import SearchFilter from '@/components/SearchFilter';
import { useMosques } from '@/hooks/useMosques';
import { useGeolocation, getDistance } from '@/hooks/useGeolocation';
import type { Mosque, TabType, FilterType } from '@/types/mosque';
import { toast } from 'sonner';

const Index = () => {
  const [activeTab, setActiveTab] = useState<TabType>('map');
  const [selectedMosque, setSelectedMosque] = useState<Mosque | null>(null);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<FilterType>('all');
  const [showTooltip, setShowTooltip] = useState(true);
  const [pinDropMode, setPinDropMode] = useState(false);
  const [droppedPin, setDroppedPin] = useState<{ lat: number; lng: number } | null>(null);

  const { data: mosques = [], isLoading } = useMosques();
  const { position } = useGeolocation();

  useEffect(() => {
    if (showTooltip) {
      const t = setTimeout(() => setShowTooltip(false), 5000);
      return () => clearTimeout(t);
    }
  }, [showTooltip]);

  // Calculate distances
  const distances = useMemo(() => {
    const map = new Map<string, number>();
    if (!position) return map;
    mosques.forEach((m) => {
      map.set(m.id, getDistance(position.lat, position.lng, m.lat, m.lng));
    });
    return map;
  }, [mosques, position]);

  // Filter and sort mosques
  const filteredMosques = useMemo(() => {
    let result = mosques;

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter((m) => m.name.toLowerCase().includes(q) || m.area.toLowerCase().includes(q));
    }

    switch (filter) {
      case 'iftaar': result = result.filter((m) => m.offers_iftaar); break;
      case 'biriyani': result = result.filter((m) => m.offers_biriyani); break;
      case 'verified': result = result.filter((m) => m.confirmed_count >= 3); break;
      case 'nearby':
        if (position) {
          result = [...result].sort((a, b) => (distances.get(a.id) ?? Infinity) - (distances.get(b.id) ?? Infinity));
        }
        break;
    }

    // Default sort: nearby if location available, else most recent
    if (filter !== 'nearby') {
      if (position) {
        result = [...result].sort((a, b) => (distances.get(a.id) ?? Infinity) - (distances.get(b.id) ?? Infinity));
      }
    }

    return result;
  }, [mosques, search, filter, position, distances]);

  const handlePinDrop = (lat: number, lng: number) => {
    setDroppedPin({ lat, lng });
    setPinDropMode(false);
    setActiveTab('add');
    toast.success('Pin dropped! Fill in the details below.');
  };

  const handleRequestPinDrop = () => {
    setPinDropMode(true);
    setActiveTab('map');
  };

  const selectedDistance = selectedMosque ? distances.get(selectedMosque.id) ?? null : null;

  return (
    <div className="flex flex-col h-screen bg-background">
      <Header />

      {/* Tooltip on first load */}
      {showTooltip && activeTab === 'map' && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 z-[1000] bg-primary text-primary-foreground text-xs px-4 py-2 rounded-full shadow-lg animate-slide-up">
          Tap any pin to see Iftaar details. Tap + to add a mosque.
        </div>
      )}

      {/* Search & Filter - show on map and list tabs */}
      {(activeTab === 'map' || activeTab === 'list') && (
        <SearchFilter search={search} onSearchChange={setSearch} filter={filter} onFilterChange={setFilter} />
      )}

      {/* Main content */}
      <div className="flex-1 relative overflow-hidden">
        {activeTab === 'map' && (
          <MapView
            mosques={filteredMosques}
            onSelectMosque={setSelectedMosque}
            selectedMosque={selectedMosque}
            pinDropMode={pinDropMode}
            onPinDrop={handlePinDrop}
          />
        )}
        {activeTab === 'list' && (
          <div className="h-full overflow-y-auto">
            {isLoading ? (
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-foreground border-t-transparent" />
              </div>
            ) : (
              <MosqueList mosques={filteredMosques} distances={distances} onSelect={setSelectedMosque} />
            )}
          </div>
        )}
        {activeTab === 'add' && (
          <div className="h-full overflow-y-auto">
            <AddMosqueForm onSuccess={setActiveTab} droppedPin={droppedPin} onRequestPinDrop={handleRequestPinDrop} />
          </div>
        )}
      </div>

      {/* Mosque Detail Panel */}
      {selectedMosque && (
        <MosqueDetail mosque={selectedMosque} distance={selectedDistance} onClose={() => setSelectedMosque(null)} />
      )}

      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
};

export default Index;
