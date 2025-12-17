-- Create matches table
CREATE TABLE public.matches (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  match_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  location TEXT,
  home_team_score INTEGER DEFAULT 0,
  away_team_score INTEGER DEFAULT 0,
  status TEXT DEFAULT 'completed',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create match_participants table
CREATE TABLE public.match_participants (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  match_id UUID REFERENCES public.matches(id) ON DELETE CASCADE NOT NULL,
  user_id UUID NOT NULL,
  team TEXT NOT NULL CHECK (team IN ('home', 'away')),
  goals INTEGER DEFAULT 0,
  assists INTEGER DEFAULT 0,
  is_mvp BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(match_id, user_id)
);

-- Enable RLS
ALTER TABLE public.matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.match_participants ENABLE ROW LEVEL SECURITY;

-- RLS Policies for matches
CREATE POLICY "Matches are viewable by everyone" 
ON public.matches FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create matches" 
ON public.matches FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL);

-- RLS Policies for match_participants
CREATE POLICY "Match participants are viewable by everyone" 
ON public.match_participants FOR SELECT USING (true);

CREATE POLICY "Authenticated users can add participants" 
ON public.match_participants FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL);

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.matches;
ALTER PUBLICATION supabase_realtime ADD TABLE public.match_participants;