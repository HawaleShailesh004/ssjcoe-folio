-- =============================================================================
-- Fix: "infinite recursion detected in policy for relation profiles"
-- =============================================================================
-- Cause: A policy on profiles (or on placements/other tables) does
--   (SELECT role FROM profiles WHERE id = auth.uid())
-- which triggers RLS on profiles again → recursion.
--
-- Fix: Use a SECURITY DEFINER function to get the current user's role
-- without going through RLS on profiles.
-- =============================================================================

-- 1. Helper that returns the current user's role (bypasses RLS)
CREATE OR REPLACE FUNCTION public.get_my_role()
RETURNS text
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid() LIMIT 1;
$$;

-- 2. Drop policies on profiles that reference profiles (they cause recursion)
DROP POLICY IF EXISTS "Superadmin reads all profiles" ON profiles;
DROP POLICY IF EXISTS "Users read own profile" ON profiles;

-- 3. Recreate without recursion: use get_my_role() instead of subquery to profiles
CREATE POLICY "Users read own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Superadmin reads all profiles"
  ON profiles FOR SELECT
  USING (get_my_role() = 'superadmin');

-- 4. Ensure public can read approved placements (no reference to profiles)
DROP POLICY IF EXISTS "Public reads approved placements" ON placements;
CREATE POLICY "Public reads approved placements"
  ON placements FOR SELECT
  USING (status = 'approved');

-- 5. Helper for dept_id so policies never SELECT from profiles (avoids recursion)
CREATE OR REPLACE FUNCTION public.get_my_dept_id()
RETURNS uuid
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT dept_id FROM public.profiles WHERE id = auth.uid() LIMIT 1;
$$;

-- 6. Fix HOD policy on placements: use helpers instead of subquery to profiles
DROP POLICY IF EXISTS "HOD manages own dept placements" ON placements;
CREATE POLICY "HOD manages own dept placements"
  ON placements FOR ALL
  USING (get_my_role() = 'hod' AND dept_id = get_my_dept_id());

-- Run this in Supabase SQL Editor, then refresh your app.
