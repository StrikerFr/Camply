-- Create colleges table
CREATE TABLE public.colleges (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  location TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create profiles table
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  college_id UUID REFERENCES public.colleges(id),
  course TEXT,
  year TEXT,
  avatar_url TEXT,
  onboarding_completed BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create interests enum and table
CREATE TYPE public.interest_category AS ENUM ('tech', 'cultural', 'management', 'sports', 'arts', 'music', 'entrepreneurship', 'social');

CREATE TABLE public.interests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  category interest_category NOT NULL,
  icon TEXT
);

-- Create user_interests junction table
CREATE TABLE public.user_interests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  interest_id UUID NOT NULL REFERENCES public.interests(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, interest_id)
);

-- Create user_skills table
CREATE TABLE public.user_skills (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  skill TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, skill)
);

-- Enable RLS on all tables
ALTER TABLE public.colleges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.interests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_interests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_skills ENABLE ROW LEVEL SECURITY;

-- Colleges: readable by all authenticated users
CREATE POLICY "Colleges are readable by authenticated users"
  ON public.colleges FOR SELECT
  TO authenticated
  USING (true);

-- Interests: readable by all authenticated users  
CREATE POLICY "Interests are readable by authenticated users"
  ON public.interests FOR SELECT
  TO authenticated
  USING (true);

-- Profiles: users can view their own and others in same college
CREATE POLICY "Users can view profiles in same college"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- User interests: users manage their own
CREATE POLICY "Users can view all interests"
  ON public.user_interests FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert their own interests"
  ON public.user_interests FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own interests"
  ON public.user_interests FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- User skills: users manage their own
CREATE POLICY "Users can view all skills"
  ON public.user_skills FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert their own skills"
  ON public.user_skills FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own skills"
  ON public.user_skills FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create trigger to update updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name)
  VALUES (NEW.id, NEW.raw_user_meta_data ->> 'full_name');
  RETURN NEW;
END;
$$;

-- Trigger on new user creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Seed default colleges
INSERT INTO public.colleges (name, location) VALUES
  ('IIT Delhi', 'New Delhi'),
  ('IIT Bombay', 'Mumbai'),
  ('IIT Madras', 'Chennai'),
  ('IIT Kanpur', 'Kanpur'),
  ('BITS Pilani', 'Pilani'),
  ('NIT Trichy', 'Tiruchirappalli'),
  ('VIT Vellore', 'Vellore'),
  ('DTU', 'New Delhi'),
  ('NSUT', 'New Delhi'),
  ('IIIT Hyderabad', 'Hyderabad'),
  ('SRM University', 'Chennai'),
  ('Manipal University', 'Manipal'),
  ('Amity University', 'Noida'),
  ('Christ University', 'Bangalore'),
  ('Symbiosis', 'Pune');

-- Seed interests
INSERT INTO public.interests (name, category, icon) VALUES
  ('Web Development', 'tech', 'code'),
  ('Mobile Development', 'tech', 'smartphone'),
  ('AI/ML', 'tech', 'brain'),
  ('Cybersecurity', 'tech', 'shield'),
  ('Data Science', 'tech', 'bar-chart'),
  ('Blockchain', 'tech', 'link'),
  ('Dance', 'cultural', 'music'),
  ('Drama', 'cultural', 'theater'),
  ('Music', 'music', 'music-2'),
  ('Singing', 'music', 'mic'),
  ('Painting', 'arts', 'palette'),
  ('Photography', 'arts', 'camera'),
  ('Public Speaking', 'management', 'megaphone'),
  ('Leadership', 'management', 'crown'),
  ('Event Management', 'management', 'calendar'),
  ('Marketing', 'management', 'trending-up'),
  ('Cricket', 'sports', 'trophy'),
  ('Football', 'sports', 'trophy'),
  ('Basketball', 'sports', 'trophy'),
  ('Badminton', 'sports', 'trophy'),
  ('Entrepreneurship', 'entrepreneurship', 'rocket'),
  ('Startup Culture', 'entrepreneurship', 'lightbulb'),
  ('Social Work', 'social', 'heart'),
  ('Environment', 'social', 'leaf');