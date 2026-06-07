
CREATE TABLE public.mobilfunk_uploads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  original_filename TEXT NOT NULL,
  mime_type TEXT,
  size_bytes BIGINT NOT NULL,
  storage_path TEXT NOT NULL,
  customer_email TEXT,
  customer_company TEXT,
  customer_note TEXT,
  notification_sent_at TIMESTAMPTZ,
  notification_error TEXT
);

GRANT ALL ON public.mobilfunk_uploads TO service_role;
ALTER TABLE public.mobilfunk_uploads ENABLE ROW LEVEL SECURITY;
-- No policies = no access for anon/authenticated. Only service_role (used in server functions) can read/write.

-- Storage: allow anonymous uploads into this specific bucket only
CREATE POLICY "Anyone can upload mobilfunk documents"
ON storage.objects FOR INSERT
TO anon, authenticated
WITH CHECK (bucket_id = 'mobilfunk-uploads');
