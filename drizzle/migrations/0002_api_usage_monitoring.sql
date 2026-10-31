CREATE TABLE public.api_usage_events (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 recorded_at timestamptz NOT NULL DEFAULT now(),
 provider text NOT NULL,
 model text NOT NULL,
 operation text NOT NULL,
 status integer NOT NULL,
 duration_ms integer NOT NULL,
 input_tokens bigint,
 output_tokens bigint,
 total_tokens bigint,
 remaining_tokens bigint,
 remaining_requests bigint,
 quota_reset text
);
GRANT ALL ON public.api_usage_events TO service_role;
ALTER TABLE public.api_usage_events ENABLE ROW LEVEL SECURITY;
CREATE INDEX api_usage_events_provider_time ON public.api_usage_events(provider, recorded_at DESC);
CREATE FUNCTION public.api_usage_report() RETURNS jsonb
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
 SELECT jsonb_build_object(
 'startedAt', (SELECT min(recorded_at) FROM public.api_usage_events),
 'providers', COALESCE((SELECT jsonb_agg(summary) FROM (
 SELECT provider, count(*) AS requests, count(*) FILTER (WHERE status >= 400 OR status = 0) AS errors,
 sum(input_tokens) AS input_tokens, sum(output_tokens) AS output_tokens, sum(total_tokens) AS total_tokens,
 count(*) FILTER (WHERE total_tokens IS NOT NULL) AS metered_requests,
 (SELECT row_to_json(latest) FROM (SELECT recorded_at, status, model, remaining_tokens, remaining_requests, quota_reset FROM public.api_usage_events e2 WHERE e2.provider = e.provider ORDER BY recorded_at DESC LIMIT 1) latest) AS latest
 FROM public.api_usage_events e GROUP BY provider
 ) summary), '[]'::jsonb),
 'recent', COALESCE((SELECT jsonb_agg(recent) FROM (SELECT provider, model, operation, status, duration_ms, total_tokens, recorded_at FROM public.api_usage_events ORDER BY recorded_at DESC LIMIT 20) recent), '[]'::jsonb)
 );
$$;
REVOKE ALL ON FUNCTION public.api_usage_report() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.api_usage_report() TO service_role;