-- Optimization indexes for events and feed
CREATE INDEX IF NOT EXISTS idx_live_events_scheduled_at ON public.live_events (scheduled_at DESC);
CREATE INDEX IF NOT EXISTS idx_event_messages_event_created ON public.event_messages (event_id, created_at ASC);
CREATE INDEX IF NOT EXISTS idx_event_messages_event_kind ON public.event_messages (event_id, kind);
