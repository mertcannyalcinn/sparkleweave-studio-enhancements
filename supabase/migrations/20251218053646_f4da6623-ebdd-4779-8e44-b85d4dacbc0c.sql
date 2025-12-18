-- Create profile_comments table for user profile comments
CREATE TABLE public.profile_comments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  profile_user_id UUID NOT NULL,
  commenter_id UUID NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.profile_comments ENABLE ROW LEVEL SECURITY;

-- Anyone can view comments
CREATE POLICY "Comments are viewable by everyone" 
ON public.profile_comments 
FOR SELECT 
USING (true);

-- Authenticated users can add comments
CREATE POLICY "Authenticated users can add comments" 
ON public.profile_comments 
FOR INSERT 
WITH CHECK (auth.uid() = commenter_id);

-- Users can delete their own comments
CREATE POLICY "Users can delete their own comments" 
ON public.profile_comments 
FOR DELETE 
USING (auth.uid() = commenter_id);

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.profile_comments;