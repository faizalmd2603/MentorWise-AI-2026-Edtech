
-- Hide live_events.room_name from clients; only server fns (service role) can read it
REVOKE SELECT (room_name) ON public.live_events FROM anon, authenticated;

-- Hide announcements.author_id from public clients (still readable via service role)
REVOKE SELECT (author_id) ON public.announcements FROM anon, authenticated, PUBLIC;
