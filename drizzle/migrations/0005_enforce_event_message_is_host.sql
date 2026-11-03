CREATE OR REPLACE FUNCTION public.enforce_event_message_is_host()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  NEW.is_host := EXISTS (SELECT 1 FROM public.live_events e WHERE e.id = NEW.event_id AND e.host_id = NEW.user_id)
                 OR public.has_role(NEW.user_id, 'admin'::public.app_role);
  RETURN NEW;
END;
$$;
REVOKE EXECUTE ON FUNCTION public.enforce_event_message_is_host() FROM PUBLIC, anon, authenticated;
DROP TRIGGER IF EXISTS event_messages_enforce_is_host ON public.event_messages;
CREATE TRIGGER event_messages_enforce_is_host
BEFORE INSERT OR UPDATE ON public.event_messages
FOR EACH ROW EXECUTE FUNCTION public.enforce_event_message_is_host();