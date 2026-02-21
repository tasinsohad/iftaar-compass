import { useState } from 'react';
import { MapPin, Loader2 } from 'lucide-react';
import { useAddMosque } from '@/hooks/useMosques';
import { useGeolocation } from '@/hooks/useGeolocation';
import { toast } from 'sonner';
import type { TabType } from '@/types/mosque';

interface AddMosqueFormProps {
  onSuccess: (tab: TabType) => void;
  droppedPin: { lat: number; lng: number } | null;
  onRequestPinDrop: () => void;
}

const AddMosqueForm = ({ onSuccess, droppedPin, onRequestPinDrop }: AddMosqueFormProps) => {
  const { position, requestLocation } = useGeolocation();
  const addMosque = useAddMosque();

  const [name, setName] = useState('');
  const [area, setArea] = useState('');
  const [offersIftaar, setOffersIftaar] = useState(true);
  const [offersBiriyani, setOffersBiriyani] = useState(false);
  const [iftaarTime, setIftaarTime] = useState('Maghrib time');
  const [notes, setNotes] = useState('');
  const [useCurrentLocation, setUseCurrentLocation] = useState(false);

  const selectedLat = useCurrentLocation ? position?.lat : droppedPin?.lat;
  const selectedLng = useCurrentLocation ? position?.lng : droppedPin?.lng;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !area.trim()) {
      toast.error('Please fill in mosque name and area');
      return;
    }
    if (selectedLat == null || selectedLng == null) {
      toast.error('Please select a location on the map or use your current location');
      return;
    }

    addMosque.mutate(
      {
        name: name.trim(),
        area: area.trim(),
        lat: selectedLat,
        lng: selectedLng,
        offers_iftaar: offersIftaar,
        offers_biriyani: offersBiriyani,
        iftaar_time: iftaarTime || null,
        notes: notes.trim() || null,
        capacity: null,
      },
      {
        onSuccess: () => {
          toast.success('Mosque added! JazakAllahu Khairan 🤲');
          setName('');
          setArea('');
          setNotes('');
          onSuccess('map');
        },
        onError: () => toast.error('Failed to add mosque. Please try again.'),
      }
    );
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 space-y-4 pb-20">
      <h2 className="text-lg font-bold">Add a Mosque</h2>
      <p className="text-xs text-muted-foreground">Share an Iftaar location to help the community.</p>

      <div className="space-y-3">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Mosque Name *"
          className="w-full px-3 py-2.5 text-sm bg-card border rounded-lg focus:outline-none focus:ring-1 focus:ring-foreground placeholder:text-muted-foreground"
        />
        <input
          type="text"
          value={area}
          onChange={(e) => setArea(e.target.value)}
          placeholder="Area / Neighborhood *"
          className="w-full px-3 py-2.5 text-sm bg-card border rounded-lg focus:outline-none focus:ring-1 focus:ring-foreground placeholder:text-muted-foreground"
        />

        {/* Offerings */}
        <div className="space-y-2">
          <p className="text-xs font-semibold">What's Offered?</p>
          <div className="flex gap-3">
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input type="checkbox" checked={offersIftaar} onChange={(e) => setOffersIftaar(e.target.checked)} className="accent-black w-4 h-4" />
              Free Iftaar
            </label>
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input type="checkbox" checked={offersBiriyani} onChange={(e) => setOffersBiriyani(e.target.checked)} className="accent-black w-4 h-4" />
              Biriyani
            </label>
          </div>
        </div>

        <input
          type="text"
          value={iftaarTime}
          onChange={(e) => setIftaarTime(e.target.value)}
          placeholder="Iftaar Time (e.g., 6:15 PM)"
          className="w-full px-3 py-2.5 text-sm bg-card border rounded-lg focus:outline-none focus:ring-1 focus:ring-foreground placeholder:text-muted-foreground"
        />

        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Any additional notes..."
          className="w-full px-3 py-2.5 text-sm bg-card border rounded-lg focus:outline-none focus:ring-1 focus:ring-foreground resize-none h-20 placeholder:text-muted-foreground"
        />

        {/* Location */}
        <div className="space-y-2">
          <p className="text-xs font-semibold">Location *</p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => {
                setUseCurrentLocation(false);
                onRequestPinDrop();
              }}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-medium border rounded-lg transition-colors ${
                !useCurrentLocation && droppedPin ? 'bg-primary text-primary-foreground' : 'hover:bg-card'
              }`}
            >
              <MapPin size={14} /> Drop Pin on Map
            </button>
            <button
              type="button"
              onClick={() => {
                setUseCurrentLocation(true);
                requestLocation();
              }}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-medium border rounded-lg transition-colors ${
                useCurrentLocation && position ? 'bg-primary text-primary-foreground' : 'hover:bg-card'
              }`}
            >
              <MapPin size={14} /> Use My Location
            </button>
          </div>
          {selectedLat != null && selectedLng != null && (
            <p className="text-[10px] text-muted-foreground">📍 {selectedLat.toFixed(4)}, {selectedLng.toFixed(4)}</p>
          )}
        </div>
      </div>

      <button
        type="submit"
        disabled={addMosque.isPending}
        className="w-full py-3 bg-primary text-primary-foreground rounded-xl font-semibold text-sm hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
      >
        {addMosque.isPending ? <><Loader2 size={16} className="animate-spin" /> Submitting...</> : 'Submit Mosque'}
      </button>
    </form>
  );
};

export default AddMosqueForm;
