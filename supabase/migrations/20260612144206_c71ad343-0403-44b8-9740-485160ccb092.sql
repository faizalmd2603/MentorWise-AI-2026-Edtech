
-- 1) Restrict profiles SELECT to owner only
DROP POLICY IF EXISTS "Profiles are publicly readable" ON public.profiles;
CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);
REVOKE SELECT ON public.profiles FROM anon;

-- 2) announcement_email_log: admin-only SELECT (writes via service role)
CREATE POLICY "Admins can view email log"
  ON public.announcement_email_log FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- 3) email_otps: explicit deny-all policy so RLS has at least one policy documented
CREATE POLICY "No direct access to OTPs"
  ON public.email_otps FOR SELECT
  TO authenticated
  USING (false);

-- 4) Public read of announcement images (bucket stays private to writes)
DROP POLICY IF EXISTS "Public can view announcement images" ON storage.objects;
CREATE POLICY "Public can view announcement images"
  ON storage.objects FOR SELECT
  TO anon, authenticated
  USING (bucket_id = 'announcement-images');

-- 5) Lock down SECURITY DEFINER function execution
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM anon, authenticated, public;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated;
-- handle_new_user runs from auth trigger only
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM anon, authenticated, public;
REVOKE EXECUTE ON FUNCTION public.set_updated_at() FROM anon, authenticated, public;
