-- Announcements: hide internal author_id from public/data API readers
REVOKE SELECT ON public.announcements FROM anon, authenticated;
GRANT SELECT (id, author_name, title, body, body_html, created_at, updated_at)
  ON public.announcements TO anon, authenticated;

-- Live events: hide internal host_id and legacy room_name; anon has no read policy at all
REVOKE SELECT ON public.live_events FROM anon, authenticated;
GRANT SELECT (id, host_name, title, description, scheduled_at, status, meeting_url, created_at, updated_at)
  ON public.live_events TO authenticated;

-- Announcement images bucket is private; signed URLs are used instead of blanket public read
DROP POLICY IF EXISTS "Public can read announcement images" ON storage.objects;