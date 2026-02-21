import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { Mosque } from '@/types/mosque';

const CHITTAGONG: [number, number] = [22.3569, 91.7832];

const createMosqueIcon = (verified: boolean) => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="40" viewBox="0 0 28 40">
    <path d="M14 0C6.268 0 0 6.268 0 14c0 10.5 14 26 14 26s14-15.5 14-26C28 6.268 21.732 0 14 0z" fill="${verified ? '#000000' : 'none'}" stroke="#000000" stroke-width="2"/>
    <text x="14" y="18" text-anchor="middle" fill="${verified ? '#ffffff' : '#000000'}" font-size="14">☪</text>
  </svg>`;
  return L.divIcon({
    html: svg,
    iconSize: [28, 40],
    iconAnchor: [14, 40],
    popupAnchor: [0, -40],
    className: '',
  });
};

interface MapViewProps {
  mosques: Mosque[];
  onSelectMosque: (mosque: Mosque) => void;
  selectedMosque: Mosque | null;
  pinDropMode?: boolean;
  onPinDrop?: (lat: number, lng: number) => void;
}

const MapView = ({ mosques, onSelectMosque, pinDropMode, onPinDrop }: MapViewProps) => {
  const mapRef = useRef<L.Map | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const markersRef = useRef<L.LayerGroup | null>(null);

  // Initialize map
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = L.map(containerRef.current, {
      center: CHITTAGONG,
      zoom: 13,
      zoomControl: false,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>',
    }).addTo(map);

    L.control.zoom({ position: 'bottomleft' }).addTo(map);

    markersRef.current = L.layerGroup().addTo(map);
    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Update markers when mosques change
  useEffect(() => {
    if (!markersRef.current) return;
    markersRef.current.clearLayers();

    mosques.forEach((mosque) => {
      const isVerified = mosque.confirmed_count >= 3;
      const marker = L.marker([mosque.lat, mosque.lng], {
        icon: createMosqueIcon(isVerified),
      });
      marker.on('click', () => onSelectMosque(mosque));
      marker.bindTooltip(mosque.name, { direction: 'top', offset: [0, -40] });
      markersRef.current!.addLayer(marker);
    });
  }, [mosques, onSelectMosque]);

  // Handle pin drop mode
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    if (pinDropMode && onPinDrop) {
      const handler = (e: L.LeafletMouseEvent) => onPinDrop(e.latlng.lat, e.latlng.lng);
      map.on('click', handler);
      map.getContainer().style.cursor = 'crosshair';
      return () => {
        map.off('click', handler);
        map.getContainer().style.cursor = '';
      };
    }
  }, [pinDropMode, onPinDrop]);

  return (
    <div className="w-full h-full relative">
      {pinDropMode && (
        <div className="absolute top-3 left-1/2 -translate-x-1/2 z-[1000] bg-primary text-primary-foreground text-xs font-medium px-4 py-2 rounded-full shadow-lg">
          Tap map to drop a pin
        </div>
      )}
      <div ref={containerRef} className="w-full h-full" />
    </div>
  );
};

export default MapView;
