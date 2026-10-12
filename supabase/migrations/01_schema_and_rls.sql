-- PrajaConnect AI - PostgreSQL Database Schema & Row-Level Security
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Table: Profiles
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  preferred_language TEXT DEFAULT 'te',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table: Villages
CREATE TABLE IF NOT EXISTS public.villages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  village_code TEXT UNIQUE NOT NULL,
  state TEXT DEFAULT 'Telangana',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table: Wards
CREATE TABLE IF NOT EXISTS public.wards (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  village_id UUID REFERENCES public.villages ON DELETE CASCADE,
  ward_number INTEGER NOT NULL,
  ward_name TEXT NOT NULL,
  representative_name TEXT,
  representative_phone TEXT,
  UNIQUE(village_id, ward_number)
);

-- Table: Complaints
CREATE TABLE IF NOT EXISTS public.complaints (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  complaint_number TEXT UNIQUE NOT NULL,
  citizen_id UUID REFERENCES public.profiles(id),
  village_id UUID REFERENCES public.villages(id),
  ward_id UUID REFERENCES public.wards(id),
  category_key TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  landmark TEXT NOT NULL,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  urgency TEXT DEFAULT 'NORMAL',
  status TEXT DEFAULT 'SUBMITTED',
  photo_url TEXT,
  audio_url TEXT,
  submitted_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table: Complaint History / Audit Trail
CREATE TABLE IF NOT EXISTS public.complaint_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  complaint_id UUID REFERENCES public.complaints(id) ON DELETE CASCADE,
  action_type TEXT NOT NULL,
  action_description TEXT NOT NULL,
  actor_name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table: Citizen Feedback
CREATE TABLE IF NOT EXISTS public.complaint_feedback (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  complaint_id UUID REFERENCES public.complaints(id) ON DELETE CASCADE,
  satisfaction_rating INTEGER CHECK (satisfaction_rating BETWEEN 1 AND 5),
  outcome TEXT NOT NULL,
  comments TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Row-Level Security (RLS)
ALTER TABLE public.complaints ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.complaint_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.complaint_feedback ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Citizens read own complaints" ON public.complaints
  FOR SELECT USING (auth.uid() = citizen_id);

CREATE POLICY "Public read aggregated complaints" ON public.complaints
  FOR SELECT USING (true);

CREATE POLICY "Citizens create complaints" ON public.complaints
  FOR INSERT WITH CHECK (auth.uid() = citizen_id);
