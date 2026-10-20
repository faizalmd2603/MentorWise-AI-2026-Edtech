CREATE TABLE public.chat_threads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  agent_id text NOT NULL,
  title text NOT NULL DEFAULT 'New chat',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.chat_threads TO authenticated;
GRANT ALL ON public.chat_threads TO service_role;
ALTER TABLE public.chat_threads ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Own threads select" ON public.chat_threads FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Own threads insert" ON public.chat_threads FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Own threads update" ON public.chat_threads FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Own threads delete" ON public.chat_threads FOR DELETE TO authenticated USING (auth.uid() = user_id);
CREATE INDEX chat_threads_user_agent_idx ON public.chat_threads (user_id, agent_id, updated_at DESC);

CREATE TABLE public.chat_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  thread_id uuid NOT NULL REFERENCES public.chat_threads(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  role text NOT NULL CHECK (role IN ('user','assistant')),
  content text NOT NULL DEFAULT '',
  sources jsonb,
  search_query text,
  attachment_names text[],
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.chat_messages TO authenticated;
GRANT ALL ON public.chat_messages TO service_role;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Own messages select" ON public.chat_messages FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Own messages insert" ON public.chat_messages FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id AND EXISTS (SELECT 1 FROM public.chat_threads t WHERE t.id = thread_id AND t.user_id = auth.uid()));
CREATE POLICY "Own messages delete" ON public.chat_messages FOR DELETE TO authenticated USING (auth.uid() = user_id);
CREATE INDEX chat_messages_thread_idx ON public.chat_messages (thread_id, created_at);

CREATE TABLE public.resume_drafts (
  user_id uuid PRIMARY KEY,
  data jsonb NOT NULL DEFAULT '{}'::jsonb,
  template_id text,
  assistant_messages jsonb NOT NULL DEFAULT '[]'::jsonb,
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.resume_drafts TO authenticated;
GRANT ALL ON public.resume_drafts TO service_role;
ALTER TABLE public.resume_drafts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Own draft select" ON public.resume_drafts FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Own draft insert" ON public.resume_drafts FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Own draft update" ON public.resume_drafts FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Own draft delete" ON public.resume_drafts FOR DELETE TO authenticated USING (auth.uid() = user_id);