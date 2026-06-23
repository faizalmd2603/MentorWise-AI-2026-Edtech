REVOKE SELECT (author_id) ON public.announcements FROM anon, authenticated;
REVOKE SELECT (room_name, host_id) ON public.live_events FROM anon, authenticated;