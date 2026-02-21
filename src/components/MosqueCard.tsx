import { CheckCircle, AlertTriangle, Navigation, Users } from 'lucide-react';
import type { Mosque } from '@/types/mosque';

interface MosqueCardProps {
  mosque: Mosque;
  distance?: number | null;
  onSelect: (mosque: Mosque) => void;
}

const MosqueCard = ({ mosque, distance, onSelect }: MosqueCardProps) => {
  const isVerified = mosque.confirmed_count >= 3;
  const needsVerification = mosque.disputed_count >= 3;

  const handleNavigate = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${mosque.lat},${mosque.lng}`, '_blank');
  };

  return (
    <div
      onClick={() => onSelect(mosque)}
      className="bg-card border rounded-xl p-4 cursor-pointer hover:border-foreground transition-colors"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <h3 className="font-semibold text-sm truncate">{mosque.name}</h3>
            {isVerified && <CheckCircle size={14} className="shrink-0 text-foreground" />}
            {needsVerification && <AlertTriangle size={14} className="shrink-0 text-muted-foreground" />}
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">{mosque.area}</p>
        </div>
        {distance != null && (
          <span className="text-xs text-muted-foreground shrink-0">{distance < 1 ? `${Math.round(distance * 1000)}m` : `${distance.toFixed(1)}km`}</span>
        )}
      </div>

      <div className="flex items-center gap-2 mt-2.5 flex-wrap">
        {mosque.offers_iftaar && <span className="pill-badge">Iftaar</span>}
        {mosque.offers_biriyani && <span className="pill-badge">Biriyani</span>}
        {mosque.iftaar_time && <span className="pill-badge-outline">{mosque.iftaar_time}</span>}
      </div>

      <div className="flex items-center justify-between mt-3">
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Users size={12} /> {mosque.confirmed_count} confirmed
          </span>
          {mosque.capacity && <span>{mosque.capacity} servings</span>}
        </div>
        <button
          onClick={handleNavigate}
          className="flex items-center gap-1 text-xs font-medium bg-primary text-primary-foreground px-3 py-1.5 rounded-full hover:opacity-90 transition-opacity"
        >
          <Navigation size={12} /> Navigate
        </button>
      </div>
    </div>
  );
};

export default MosqueCard;
