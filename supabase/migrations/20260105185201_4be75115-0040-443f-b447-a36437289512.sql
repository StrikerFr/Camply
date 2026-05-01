-- Create anonymous reviews table for college
CREATE TABLE public.college_reviews (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  college_name TEXT NOT NULL DEFAULT 'IIT Patna',
  content TEXT NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  category TEXT NOT NULL DEFAULT 'General',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  is_approved BOOLEAN DEFAULT true
);

-- Enable Row Level Security
ALTER TABLE public.college_reviews ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read approved reviews
CREATE POLICY "Anyone can read approved reviews" 
ON public.college_reviews 
FOR SELECT 
USING (is_approved = true);

-- Allow anyone to insert reviews (anonymous)
CREATE POLICY "Anyone can insert reviews" 
ON public.college_reviews 
FOR INSERT 
WITH CHECK (true);

-- Add index for faster queries
CREATE INDEX idx_college_reviews_created_at ON public.college_reviews(created_at DESC);
CREATE INDEX idx_college_reviews_category ON public.college_reviews(category);