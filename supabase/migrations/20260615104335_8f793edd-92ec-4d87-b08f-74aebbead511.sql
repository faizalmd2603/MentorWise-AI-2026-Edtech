ALTER TABLE public.live_events ADD COLUMN IF NOT EXISTS meeting_url text;
GRANT SELECT (meeting_url) ON public.live_events TO authenticated;