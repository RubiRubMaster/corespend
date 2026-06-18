CREATE TABLE public.contracts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  company_id uuid REFERENCES public.companies(id) ON DELETE SET NULL,
  area text NOT NULL,
  file_url text NOT NULL,
  status text NOT NULL DEFAULT 'In Analyse',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.contracts TO authenticated;
GRANT ALL ON public.contracts TO service_role;

ALTER TABLE public.contracts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users read own contracts" ON public.contracts
  FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "users insert own contracts" ON public.contracts
  FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "users update own contracts" ON public.contracts
  FOR UPDATE TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY "users delete own contracts" ON public.contracts
  FOR DELETE TO authenticated USING (user_id = auth.uid());

CREATE TRIGGER contracts_touch_updated_at
  BEFORE UPDATE ON public.contracts
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

CREATE INDEX contracts_user_id_idx ON public.contracts(user_id);
CREATE INDEX contracts_area_idx ON public.contracts(area);

CREATE POLICY "users read own corespend docs" ON storage.objects
  FOR SELECT TO authenticated
  USING (bucket_id = 'corespend-documents' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "users upload own corespend docs" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'corespend-documents' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "users update own corespend docs" ON storage.objects
  FOR UPDATE TO authenticated
  USING (bucket_id = 'corespend-documents' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "users delete own corespend docs" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'corespend-documents' AND auth.uid()::text = (storage.foldername(name))[1]);
