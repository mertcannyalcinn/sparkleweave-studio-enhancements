-- Create profiles table for user data
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT,
  handle TEXT UNIQUE,
  avatar_url TEXT,
  cover_url TEXT,
  bio TEXT,
  position TEXT DEFAULT 'midfielder' CHECK (position IN ('goalkeeper', 'defender', 'midfielder', 'forward')),
  qors_score DECIMAL(3,1) DEFAULT 5.0,
  matches_played INTEGER DEFAULT 0,
  reliability TEXT DEFAULT 'Yeni',
  fair_play_badge BOOLEAN DEFAULT false,
  goals INTEGER DEFAULT 0,
  assists INTEGER DEFAULT 0,
  mvp_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Profiles are viewable by everyone" 
ON public.profiles FOR SELECT USING (true);

CREATE POLICY "Users can update their own profile" 
ON public.profiles FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile" 
ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create player_ratings table
CREATE TABLE public.player_ratings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  rater_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  rated_user_id UUID NOT NULL,
  position TEXT NOT NULL CHECK (position IN ('goalkeeper', 'defender', 'midfielder', 'forward')),
  
  -- Position-specific skill ratings (1-10)
  skill_1 DECIMAL(3,1) NOT NULL CHECK (skill_1 >= 1 AND skill_1 <= 10),
  skill_2 DECIMAL(3,1) NOT NULL CHECK (skill_2 >= 1 AND skill_2 <= 10),
  skill_3 DECIMAL(3,1) NOT NULL CHECK (skill_3 >= 1 AND skill_3 <= 10),
  skill_4 DECIMAL(3,1) NOT NULL CHECK (skill_4 >= 1 AND skill_4 <= 10),
  
  -- Sportsmanship ratings (1-10)
  sportsmanship DECIMAL(3,1) NOT NULL CHECK (sportsmanship >= 1 AND sportsmanship <= 10),
  reliability DECIMAL(3,1) NOT NULL CHECK (reliability >= 1 AND reliability <= 10),
  teamwork DECIMAL(3,1) NOT NULL CHECK (teamwork >= 1 AND teamwork <= 10),
  communication DECIMAL(3,1) NOT NULL CHECK (communication >= 1 AND communication <= 10),
  
  average_rating DECIMAL(3,1) NOT NULL,
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  
  -- Prevent rating yourself
  CONSTRAINT no_self_rating CHECK (rater_id != rated_user_id)
);

-- Enable RLS on player_ratings
ALTER TABLE public.player_ratings ENABLE ROW LEVEL SECURITY;

-- RLS Policies for player_ratings
CREATE POLICY "Ratings are viewable by everyone" 
ON public.player_ratings FOR SELECT USING (true);

CREATE POLICY "Authenticated users can insert ratings" 
ON public.player_ratings FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = rater_id);

-- Function to handle new user profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, name, handle, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', NEW.raw_user_meta_data ->> 'name', 'Yeni Kullanıcı'),
    '@' || REPLACE(LOWER(COALESCE(NEW.raw_user_meta_data ->> 'full_name', NEW.raw_user_meta_data ->> 'name', 'user_' || SUBSTRING(NEW.id::text, 1, 8))), ' ', '_'),
    COALESCE(NEW.raw_user_meta_data ->> 'avatar_url', NEW.raw_user_meta_data ->> 'picture', NULL)
  );
  RETURN NEW;
END;
$$;

-- Trigger for new user profile creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Trigger for profile updates
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();