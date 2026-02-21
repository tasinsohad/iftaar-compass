import { useState } from 'react';
import { X, CheckCircle, AlertTriangle, Navigation, Users, Clock, MapPin } from 'lucide-react';
import type { Mosque } from '@/types/mosque';
import { useComments, useAddComment } from '@/hooks/useMosques';

interface MosqueDetailProps {
  mosque: Mosque;
  distance?: number | null;
  onClose: () => void;
}

const MosqueDetail = ({ mosque, distance, onClose }: MosqueDetailProps) => {
  const { data: comments = [] } = useComments(mosque.id);
  const addComment = useAddComment();
  const [commentText, setCommentText] = useState('');
  const isVerified = mosque.confirmed_count >= 3;
  const needsVerification = mosque.disputed_count >= 3;

  const handleConfirm = (isConfirmed: boolean) => {
    addComment.mutate({ mosque_id: mosque.id, text: commentText || null, is_confirmed: isConfirmed });
    setCommentText('');
  };

  const handleNavigate = () => {
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${mosque.lat},${mosque.lng}`, '_blank');
  };

  return (
    <div className="fixed inset-x-0 bottom-14 z-40 bg-background border-t rounded-t-2xl max-h-[70vh] overflow-y-auto animate-slide-up md:inset-x-auto md:right-0 md:top-0 md:bottom-0 md:w-96 md:rounded-none md:border-l md:border-t-0 md:max-h-none">
      <div className="sticky top-0 bg-background border-b px-4 py-3 flex items-center justify-between">
        <h2 className="font-bold text-base truncate pr-2">{mosque.name}</h2>
        <button onClick={onClose} className="p-1 hover:bg-card rounded-full"><X size={18} /></button>
      </div>

      <div className="p-4 space-y-4">
        {/* Status badges */}
        <div className="flex items-center gap-2 flex-wrap">
          {isVerified && (
            <span className="pill-badge gap-1"><CheckCircle size={12} /> Verified</span>
          )}
          {needsVerification && (
            <span className="pill-badge-outline gap-1 text-muted-foreground border-muted-foreground"><AlertTriangle size={12} /> Needs Verification</span>
          )}
          {mosque.offers_iftaar && <span className="pill-badge">Iftaar</span>}
          {mosque.offers_biriyani && <span className="pill-badge">Biriyani</span>}
        </div>

        {/* Info */}
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPin size={14} /> <span>{mosque.area}</span>
            {distance != null && <span className="ml-auto">{distance < 1 ? `${Math.round(distance * 1000)}m away` : `${distance.toFixed(1)}km away`}</span>}
          </div>
          {mosque.iftaar_time && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock size={14} /> <span>{mosque.iftaar_time}</span>
            </div>
          )}
          {mosque.capacity && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Users size={14} /> <span>Can serve ~{mosque.capacity} people</span>
            </div>
          )}
          {mosque.notes && <p className="text-muted-foreground bg-card rounded-lg p-3 text-xs">{mosque.notes}</p>}
        </div>

        {/* Navigate button */}
        <button
          onClick={handleNavigate}
          className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground py-2.5 rounded-xl font-medium text-sm hover:opacity-90 transition-opacity"
        >
          <Navigation size={16} /> Navigate to Mosque
        </button>

        {/* Verification */}
        <div className="border-t pt-4">
          <p className="text-xs font-semibold mb-2">{mosque.confirmed_count} people confirmed this</p>
          <textarea
            value={commentText}
            onChange={(e) => setCommentText(e.target.value.slice(0, 200))}
            placeholder="Add a comment (optional, max 200 chars)..."
            className="w-full text-sm bg-card border rounded-lg p-2.5 resize-none h-16 focus:outline-none focus:ring-1 focus:ring-foreground placeholder:text-muted-foreground"
          />
          <div className="flex gap-2 mt-2">
            <button
              onClick={() => handleConfirm(true)}
              disabled={addComment.isPending}
              className="flex-1 py-2 text-xs font-medium bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              ✅ Confirmed
            </button>
            <button
              onClick={() => handleConfirm(false)}
              disabled={addComment.isPending}
              className="flex-1 py-2 text-xs font-medium border rounded-lg hover:bg-card transition-colors disabled:opacity-50"
            >
              ❌ Seems Wrong
            </button>
          </div>
        </div>

        {/* Comments */}
        {comments.length > 0 && (
          <div className="border-t pt-4 space-y-2">
            <p className="text-xs font-semibold">Community Comments</p>
            {comments.map((c) => (
              <div key={c.id} className="bg-card rounded-lg p-2.5 text-xs">
                <div className="flex items-center gap-1 text-muted-foreground mb-1">
                  <span>{c.is_confirmed ? '✅' : '❌'}</span>
                  <span>{new Date(c.created_at).toLocaleDateString()}</span>
                </div>
                {c.text && <p>{c.text}</p>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MosqueDetail;
