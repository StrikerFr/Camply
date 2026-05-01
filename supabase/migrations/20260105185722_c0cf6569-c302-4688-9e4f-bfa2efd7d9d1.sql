-- Add parent_id column for reply support
ALTER TABLE public.college_reviews 
ADD COLUMN parent_id UUID REFERENCES public.college_reviews(id) ON DELETE CASCADE;

-- Add index for faster reply queries
CREATE INDEX idx_college_reviews_parent_id ON public.college_reviews(parent_id);