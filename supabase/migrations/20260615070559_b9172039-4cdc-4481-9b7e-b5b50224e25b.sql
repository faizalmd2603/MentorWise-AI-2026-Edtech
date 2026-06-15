
-- 1. event_messages: SELECT only for authenticated users
DROP POLICY IF EXISTS "Messages readable by all" ON public.event_messages;
CREATE POLICY "Messages readable by authenticated users"
  ON public.event_messages FOR SELECT
  TO authenticated
  USING (true);

-- 2. Announcement images: public read access (admin upload only)
DROP POLICY IF EXISTS "Public can read announcement images" ON storage.objects;
CREATE POLICY "Public can read announcement images"
  ON storage.objects FOR SELECT
  TO public
  USING (bucket_id = 'announcement-images');

-- 3. contact_rate_limit: explicitly deny client access (only service role writes via SECURITY DEFINER path)
DROP POLICY IF EXISTS "No client access to rate limit" ON public.contact_rate_limit;
CREATE POLICY "No client access to rate limit"
  ON public.contact_rate_limit FOR ALL
  TO authenticated, anon
  USING (false)
  WITH CHECK (false);
