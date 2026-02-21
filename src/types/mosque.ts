export interface Mosque {
  id: string;
  name: string;
  area: string;
  lat: number;
  lng: number;
  offers_iftaar: boolean;
  offers_biriyani: boolean;
  iftaar_time: string | null;
  notes: string | null;
  capacity: number | null;
  confirmed_count: number;
  disputed_count: number;
  created_at: string;
}

export interface Comment {
  id: string;
  mosque_id: string;
  text: string | null;
  is_confirmed: boolean;
  created_at: string;
}

export type FilterType = 'all' | 'iftaar' | 'biriyani' | 'verified' | 'nearby';

export type TabType = 'map' | 'list' | 'add';
