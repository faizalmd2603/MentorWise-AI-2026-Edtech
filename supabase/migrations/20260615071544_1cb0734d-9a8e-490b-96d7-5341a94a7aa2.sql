
DROP POLICY IF EXISTS "Events publicly readable" ON public.live_events;
CREATE POLICY "Events readable by authenticated users"
  ON public.live_events FOR SELECT
  TO authenticated
  USING (true);

DROP POLICY IF EXISTS "Deny anon access to email_otps" ON public.email_otps;
CREATE POLICY "Deny anon access to email_otps"
  ON public.email_otps FOR ALL
  TO anon
  USING (false)
  WITH CHECK (false);
