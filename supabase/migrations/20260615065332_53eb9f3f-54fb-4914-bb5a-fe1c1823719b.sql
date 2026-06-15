-- Live events feature
CREATE TABLE public.live_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  host_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  host_name text NOT NULL,
  title text NOT NULL,
  description text,
  scheduled_at timestamptz NOT NULL DEFAULT now(),
  status text NOT NULL DEFAULT 'scheduled', -- scheduled | live | ended
  room_name text NOT NULL UNIQUE,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.live_events TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.live_events TO authenticated;
GRANT ALL ON public.live_events TO service_role;
ALTER TABLE public.live_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Events publicly readable" ON public.live_events FOR SELECT USING (true);
CREATE POLICY "Admins can insert events" ON public.live_events FOR INSERT TO authenticated
  WITH CHECK (has_role(auth.uid(),'admin'::app_role) AND auth.uid() = host_id);
CREATE POLICY "Admins can update events" ON public.live_events FOR UPDATE TO authenticated
  USING (has_role(auth.uid(),'admin'::app_role)) WITH CHECK (has_role(auth.uid(),'admin'::app_role));
CREATE POLICY "Admins can delete events" ON public.live_events FOR DELETE TO authenticated
  USING (has_role(auth.uid(),'admin'::app_role));
CREATE TRIGGER live_events_updated BEFORE UPDATE ON public.live_events
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.event_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid NOT NULL REFERENCES public.live_events(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  user_name text NOT NULL,
  is_host boolean NOT NULL DEFAULT false,
  kind text NOT NULL DEFAULT 'message', -- message | reaction | hand_raise | hand_lower | system
  content text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.event_messages TO anon;
GRANT SELECT, INSERT ON public.event_messages TO authenticated;
GRANT ALL ON public.event_messages TO service_role;
ALTER TABLE public.event_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Messages readable by all" ON public.event_messages FOR SELECT USING (true);
CREATE POLICY "Signed-in users can post" ON public.event_messages FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

ALTER PUBLICATION supabase_realtime ADD TABLE public.event_messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.live_events;