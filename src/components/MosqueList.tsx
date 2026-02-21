import type { Mosque } from '@/types/mosque';
import MosqueCard from './MosqueCard';

interface MosqueListProps {
  mosques: Mosque[];
  distances: Map<string, number>;
  onSelect: (mosque: Mosque) => void;
}

const MosqueList = ({ mosques, distances, onSelect }: MosqueListProps) => {
  if (mosques.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center px-4">
        <p className="text-lg font-semibold">No mosques found</p>
        <p className="text-sm text-muted-foreground mt-1">Try adjusting your search or filters, or add a new mosque!</p>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-3 pb-20">
      {mosques.map((mosque) => (
        <MosqueCard
          key={mosque.id}
          mosque={mosque}
          distance={distances.get(mosque.id) ?? null}
          onSelect={onSelect}
        />
      ))}
    </div>
  );
};

export default MosqueList;
