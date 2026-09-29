DROP POLICY IF EXISTS "Messages readable by authenticated users" ON public.event_messages;

CREATE POLICY "Signed-in users can read messages in live event rooms"
ON public.event_messages
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM public.live_events
    WHERE live_events.id = event_messages.event_id
  )
);