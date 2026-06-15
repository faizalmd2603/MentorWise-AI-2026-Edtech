-- Restrict column-level SELECT on announcements.author_id
REVOKE SELECT ON public.announcements FROM anon, authenticated, PUBLIC;
REVOKE SELECT (author_id) ON public.announcements FROM anon, authenticated, PUBLIC;

-- Re-grant SELECT on all safe columns explicitly (excluding author_id)
GRANT SELECT (id, title, body, body_html, author_name, created_at, updated_at)
  ON public.announcements TO anon, authenticated;

-- service_role keeps full access for server-side writes/reads
GRANT ALL ON public.announcements TO service_role;