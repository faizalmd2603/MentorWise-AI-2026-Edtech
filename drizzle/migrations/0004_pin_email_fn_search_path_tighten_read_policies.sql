ALTER FUNCTION public.move_to_dlq(text,text,bigint,jsonb) SET search_path = '';
ALTER FUNCTION public.read_email_batch(text,integer,integer) SET search_path = '';
ALTER FUNCTION public.enqueue_email(text,jsonb) SET search_path = '';
ALTER FUNCTION public.delete_email(text,bigint) SET search_path = '';

DROP POLICY IF EXISTS "Events readable by authenticated users" ON public.live_events;
CREATE POLICY "Events readable by signed-in users" ON public.live_events
  FOR SELECT TO authenticated USING (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Announcements are publicly readable" ON public.announcements;
CREATE POLICY "Published announcements are publicly readable" ON public.announcements
  FOR SELECT TO anon, authenticated USING (created_at <= now());