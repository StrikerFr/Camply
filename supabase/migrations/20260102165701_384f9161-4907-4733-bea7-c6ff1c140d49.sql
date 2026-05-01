-- Drop the existing overly permissive SELECT policy
DROP POLICY IF EXISTS "Users can view profiles in same college" ON public.profiles;

-- Create a new properly scoped SELECT policy
-- Users can only view profiles of users in the same college, or their own profile
CREATE POLICY "Users can view profiles in same college" 
ON public.profiles 
FOR SELECT 
USING (
  auth.uid() = user_id 
  OR 
  college_id IN (
    SELECT college_id 
    FROM public.profiles 
    WHERE user_id = auth.uid()
  )
);