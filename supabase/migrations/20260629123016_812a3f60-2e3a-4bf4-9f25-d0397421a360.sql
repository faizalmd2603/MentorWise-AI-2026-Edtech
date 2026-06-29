
-- 1) Column-level REVOKEs on announcements.author_id
REVOKE SELECT (author_id) ON public.announcements FROM anon, authenticated, PUBLIC;

-- 2) Column-level REVOKEs on live_events sensitive columns
REVOKE SELECT (room_name, host_id) ON public.live_events FROM anon, authenticated, PUBLIC;

-- 3) Lock down SECURITY DEFINER email helper functions: revoke from PUBLIC, grant only to service_role, and pin search_path.
DO $$
DECLARE
  fn record;
BEGIN
  FOR fn IN
    SELECT p.oid::regprocedure AS sig
    FROM pg_proc p
    JOIN pg_namespace n ON n.oid = p.pronamespace
    WHERE n.nspname = 'public'
      AND p.proname IN ('enqueue_email','delete_email','read_email_batch','move_to_dlq')
  LOOP
    EXECUTE format('REVOKE ALL ON FUNCTION %s FROM PUBLIC, anon, authenticated', fn.sig);
    EXECUTE format('GRANT EXECUTE ON FUNCTION %s TO service_role', fn.sig);
    EXECUTE format('ALTER FUNCTION %s SET search_path = public, pg_temp', fn.sig);
  END LOOP;
END$$;
