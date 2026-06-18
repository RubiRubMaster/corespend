
-- Companies (Tenants)
CREATE TABLE public.companies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.companies TO authenticated;
GRANT ALL ON public.companies TO service_role;
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;

-- Profiles (one per auth user) with company_id
CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  company_id uuid NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  email text,
  full_name text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Per-company application state snapshot (whole CoreSpend store as JSONB)
CREATE TABLE public.company_state (
  company_id uuid PRIMARY KEY REFERENCES public.companies(id) ON DELETE CASCADE,
  state jsonb NOT NULL DEFAULT '{}'::jsonb,
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.company_state TO authenticated;
GRANT ALL ON public.company_state TO service_role;
ALTER TABLE public.company_state ENABLE ROW LEVEL SECURITY;

-- Helper: get current user's company_id (security definer to avoid RLS recursion)
CREATE OR REPLACE FUNCTION public.current_company_id()
RETURNS uuid LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT company_id FROM public.profiles WHERE id = auth.uid()
$$;

-- RLS Policies
-- companies: members can read own; only owner can update; insert allowed for signed-in (used by trigger via service_role anyway)
CREATE POLICY "members read own company" ON public.companies FOR SELECT TO authenticated
  USING (id = public.current_company_id());
CREATE POLICY "owner updates company" ON public.companies FOR UPDATE TO authenticated
  USING (id = public.current_company_id()) WITH CHECK (id = public.current_company_id());

-- profiles: user can see/edit own profile
CREATE POLICY "self read profile" ON public.profiles FOR SELECT TO authenticated
  USING (id = auth.uid());
CREATE POLICY "self update profile" ON public.profiles FOR UPDATE TO authenticated
  USING (id = auth.uid()) WITH CHECK (id = auth.uid());

-- company_state: members can read & write their own company's state
CREATE POLICY "members read company_state" ON public.company_state FOR SELECT TO authenticated
  USING (company_id = public.current_company_id());
CREATE POLICY "members upsert company_state" ON public.company_state FOR INSERT TO authenticated
  WITH CHECK (company_id = public.current_company_id());
CREATE POLICY "members update company_state" ON public.company_state FOR UPDATE TO authenticated
  USING (company_id = public.current_company_id()) WITH CHECK (company_id = public.current_company_id());

-- Auto-create company + profile + state on new user
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_company_id uuid;
  v_company_name text;
BEGIN
  v_company_name := COALESCE(
    NULLIF(NEW.raw_user_meta_data->>'company_name', ''),
    NULLIF(split_part(NEW.email, '@', 2), ''),
    'Mein Unternehmen'
  );
  INSERT INTO public.companies (name, created_by) VALUES (v_company_name, NEW.id)
    RETURNING id INTO v_company_id;
  INSERT INTO public.profiles (id, company_id, email, full_name)
    VALUES (NEW.id, v_company_id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email));
  INSERT INTO public.company_state (company_id, state) VALUES (v_company_id, '{}'::jsonb);
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- updated_at helper
CREATE OR REPLACE FUNCTION public.touch_updated_at()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

CREATE TRIGGER touch_companies BEFORE UPDATE ON public.companies
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();
CREATE TRIGGER touch_profiles BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();
CREATE TRIGGER touch_company_state BEFORE UPDATE ON public.company_state
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- Attach mobilfunk_uploads to user + company; backfill is N/A (existing rows can stay NULL but lock down RLS)
ALTER TABLE public.mobilfunk_uploads
  ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS company_id uuid REFERENCES public.companies(id) ON DELETE CASCADE;

CREATE INDEX IF NOT EXISTS mobilfunk_uploads_company_id_idx ON public.mobilfunk_uploads(company_id);

ALTER TABLE public.mobilfunk_uploads ENABLE ROW LEVEL SECURITY;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.mobilfunk_uploads TO authenticated;
GRANT ALL ON public.mobilfunk_uploads TO service_role;

DROP POLICY IF EXISTS "members read own uploads" ON public.mobilfunk_uploads;
CREATE POLICY "members read own uploads" ON public.mobilfunk_uploads FOR SELECT TO authenticated
  USING (company_id = public.current_company_id());
DROP POLICY IF EXISTS "members insert own uploads" ON public.mobilfunk_uploads;
CREATE POLICY "members insert own uploads" ON public.mobilfunk_uploads FOR INSERT TO authenticated
  WITH CHECK (company_id = public.current_company_id() AND user_id = auth.uid());
