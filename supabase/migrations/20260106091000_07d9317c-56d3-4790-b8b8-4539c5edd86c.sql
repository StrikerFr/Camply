-- Add likes column to college_reviews table
ALTER TABLE public.college_reviews ADD COLUMN likes integer NOT NULL DEFAULT 0;

-- Create a table to track who liked what (using session/device id for anonymous users)
CREATE TABLE public.review_likes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  review_id UUID NOT NULL REFERENCES public.college_reviews(id) ON DELETE CASCADE,
  device_id TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(review_id, device_id)
);

-- Enable RLS
ALTER TABLE public.review_likes ENABLE ROW LEVEL SECURITY;

-- Anyone can read likes
CREATE POLICY "Anyone can read likes" ON public.review_likes FOR SELECT USING (true);

-- Anyone can insert likes
CREATE POLICY "Anyone can insert likes" ON public.review_likes FOR INSERT WITH CHECK (true);

-- Anyone can delete their own likes
CREATE POLICY "Anyone can delete their own likes" ON public.review_likes FOR DELETE USING (true);