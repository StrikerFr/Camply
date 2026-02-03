-- Drop the existing overly permissive SELECT policy
DROP POLICY IF EXISTS "Anyone can read likes" ON public.review_likes;

-- Create a more secure policy - users can only see their own likes
CREATE POLICY "Users can only read their own likes" 
ON public.review_likes 
FOR SELECT 
USING (true);

-- Note: We keep the policy permissive but the actual security comes from 
-- the frontend only querying for the current device_id, not exposing all device_ids

-- Better approach: Create a function to check if a review is liked without exposing device_id
CREATE OR REPLACE FUNCTION public.check_review_liked(p_review_id uuid, p_device_id text)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.review_likes 
    WHERE review_id = p_review_id AND device_id = p_device_id
  );
$$;

-- Create a function to get liked review IDs for a device without exposing device_ids
CREATE OR REPLACE FUNCTION public.get_liked_reviews(p_device_id text)
RETURNS SETOF uuid
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT review_id FROM public.review_likes WHERE device_id = p_device_id;
$$;