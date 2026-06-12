
-- Storage policies: only admins can upload to announcement-images; signed URLs are used for reads
CREATE POLICY "Admins can upload announcement images"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'announcement-images'
  AND public.has_role(auth.uid(), 'admin'::public.app_role)
);

CREATE POLICY "Admins can read announcement images"
ON storage.objects FOR SELECT TO authenticated
USING (
  bucket_id = 'announcement-images'
  AND public.has_role(auth.uid(), 'admin'::public.app_role)
);

CREATE POLICY "Admins can delete announcement images"
ON storage.objects FOR DELETE TO authenticated
USING (
  bucket_id = 'announcement-images'
  AND public.has_role(auth.uid(), 'admin'::public.app_role)
);

-- Increase announcement body length to accommodate rich HTML with embedded image URLs
ALTER TABLE public.announcements
  ADD COLUMN IF NOT EXISTS body_html text;
