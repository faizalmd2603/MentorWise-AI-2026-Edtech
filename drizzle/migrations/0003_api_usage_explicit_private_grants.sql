REVOKE ALL ON TABLE public.api_usage_events FROM PUBLIC, anon, authenticated;
GRANT ALL ON TABLE public.api_usage_events TO service_role;