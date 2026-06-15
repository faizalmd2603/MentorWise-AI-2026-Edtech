
CREATE TABLE public.user_reports (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  reporter_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  reported_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  reason TEXT NOT NULL,
  details TEXT,
  status TEXT NOT NULL DEFAULT 'open',
  resolved_by UUID REFERENCES auth.users(id),
  resolved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.user_reports TO authenticated;
GRANT ALL ON public.user_reports TO service_role;

ALTER TABLE public.user_reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can file reports"
  ON public.user_reports FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = reporter_id);

CREATE POLICY "Users can see their own filed reports"
  ON public.user_reports FOR SELECT
  TO authenticated
  USING (auth.uid() = reporter_id OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update reports"
  ON public.user_reports FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete reports"
  ON public.user_reports FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER user_reports_updated_at
  BEFORE UPDATE ON public.user_reports
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
