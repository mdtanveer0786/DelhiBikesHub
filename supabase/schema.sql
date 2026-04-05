-- ============================================================
-- DelhiBikesHub — Supabase Database Schema
-- Run this in the Supabase SQL Editor
-- ============================================================

-- ─── Profiles Table ────────────────────────────────────
-- Extends Supabase auth.users with application-specific fields
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  location TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Bikes Table ───────────────────────────────────────
CREATE TABLE IF NOT EXISTS bikes (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('Bike', 'Scooty')),
  brand TEXT NOT NULL,
  model TEXT NOT NULL,
  year INTEGER NOT NULL CHECK (year >= 1990 AND year <= 2030),
  km INTEGER NOT NULL CHECK (km >= 0),
  price INTEGER NOT NULL CHECK (price > 0),
  description TEXT DEFAULT '',
  city TEXT DEFAULT 'Delhi',
  locality TEXT NOT NULL,
  images TEXT[] DEFAULT '{}',
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'sold', 'pending', 'rejected')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Indexes ───────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_bikes_user_id ON bikes(user_id);
CREATE INDEX IF NOT EXISTS idx_bikes_status ON bikes(status);
CREATE INDEX IF NOT EXISTS idx_bikes_brand ON bikes(brand);
CREATE INDEX IF NOT EXISTS idx_bikes_type ON bikes(type);
CREATE INDEX IF NOT EXISTS idx_bikes_locality ON bikes(locality);
CREATE INDEX IF NOT EXISTS idx_bikes_price ON bikes(price);
CREATE INDEX IF NOT EXISTS idx_bikes_created_at ON bikes(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);

-- ─── Row Level Security ────────────────────────────────
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE bikes ENABLE ROW LEVEL SECURITY;

-- Profiles Policies
CREATE POLICY "Public profiles viewable by all"
  ON profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Service role can insert profiles"
  ON profiles FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Service role can delete profiles"
  ON profiles FOR DELETE
  USING (true);

-- Bikes Policies
CREATE POLICY "Active bikes viewable by all"
  ON bikes FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can insert bikes"
  ON bikes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own bikes"
  ON bikes FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own bikes"
  ON bikes FOR DELETE
  USING (auth.uid() = user_id);

-- ─── Auto-update timestamp trigger ────────────────────
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER bikes_updated_at
  BEFORE UPDATE ON bikes
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- ─── Seed Admin User (replace with your email) ────────
-- After creating your account via signup, run:
-- UPDATE profiles SET role = 'admin' WHERE email = 'your-email@example.com';
