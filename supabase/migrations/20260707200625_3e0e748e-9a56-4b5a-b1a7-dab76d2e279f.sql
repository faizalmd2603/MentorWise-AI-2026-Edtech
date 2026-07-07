CREATE TABLE public.articles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL,
  language_code text NOT NULL DEFAULT 'en',
  language_name text,
  title text NOT NULL,
  content text NOT NULL DEFAULT '',
  excerpt text,
  cover_image text,
  meta_description text,
  focus_keyword text,
  secondary_keywords jsonb NOT NULL DEFAULT '[]'::jsonb,
  key_takeaways jsonb NOT NULL DEFAULT '[]'::jsonb,
  word_count integer NOT NULL DEFAULT 0,
  reading_time_minutes integer NOT NULL DEFAULT 0,
  internal_link_slugs jsonb NOT NULL DEFAULT '[]'::jsonb,
  website_domain text,
  og_title text,
  og_description text,
  status text NOT NULL DEFAULT 'draft',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT articles_slug_lang_unique UNIQUE (slug, language_code),
  CONSTRAINT articles_status_check CHECK (status IN ('published','draft'))
);

CREATE INDEX articles_status_created_idx ON public.articles (status, created_at DESC);
CREATE INDEX articles_slug_idx ON public.articles (slug);

GRANT SELECT ON public.articles TO anon, authenticated;
GRANT ALL ON public.articles TO service_role;

ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Published articles are viewable by everyone"
  ON public.articles FOR SELECT
  USING (status = 'published');

CREATE TRIGGER articles_set_updated_at
  BEFORE UPDATE ON public.articles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();