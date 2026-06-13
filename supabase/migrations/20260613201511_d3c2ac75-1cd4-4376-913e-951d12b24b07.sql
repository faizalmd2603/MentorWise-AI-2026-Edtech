CREATE TABLE IF NOT EXISTS public.contact_rate_limit (
  ip TEXT PRIMARY KEY,
  count INTEGER NOT NULL DEFAULT 0,
  window_start TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT ALL ON public.contact_rate_limit TO service_role;
ALTER TABLE public.contact_rate_limit ENABLE ROW LEVEL SECURITY;