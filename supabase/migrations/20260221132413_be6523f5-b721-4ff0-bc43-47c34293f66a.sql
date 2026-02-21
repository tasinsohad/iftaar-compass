
-- Create mosques table
CREATE TABLE public.mosques (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  area TEXT NOT NULL,
  lat DOUBLE PRECISION NOT NULL,
  lng DOUBLE PRECISION NOT NULL,
  offers_iftaar BOOLEAN NOT NULL DEFAULT true,
  offers_biriyani BOOLEAN NOT NULL DEFAULT false,
  iftaar_time TEXT DEFAULT 'Maghrib time',
  notes TEXT,
  capacity INTEGER,
  confirmed_count INTEGER NOT NULL DEFAULT 0,
  disputed_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create comments table
CREATE TABLE public.comments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  mosque_id UUID NOT NULL REFERENCES public.mosques(id) ON DELETE CASCADE,
  text TEXT CHECK (char_length(text) <= 200),
  is_confirmed BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.mosques ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;

-- Public read access for mosques
CREATE POLICY "Anyone can view mosques" ON public.mosques FOR SELECT USING (true);

-- Anyone can insert mosques (anonymous community submissions)
CREATE POLICY "Anyone can add mosques" ON public.mosques FOR INSERT WITH CHECK (true);

-- Anyone can update confirmed/disputed counts
CREATE POLICY "Anyone can update mosque counts" ON public.mosques FOR UPDATE USING (true) WITH CHECK (true);

-- Public read access for comments
CREATE POLICY "Anyone can view comments" ON public.comments FOR SELECT USING (true);

-- Anyone can add comments
CREATE POLICY "Anyone can add comments" ON public.comments FOR INSERT WITH CHECK (true);

-- Enable realtime for both tables
ALTER PUBLICATION supabase_realtime ADD TABLE public.mosques;
ALTER PUBLICATION supabase_realtime ADD TABLE public.comments;

-- Create index for faster mosque lookups
CREATE INDEX idx_comments_mosque_id ON public.comments(mosque_id);
CREATE INDEX idx_mosques_area ON public.mosques(area);
