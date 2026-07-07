import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";

function serverPublic() {
  return createClient<Database>(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_PUBLISHABLE_KEY!,
    { auth: { storage: undefined, persistSession: false, autoRefreshToken: false } },
  );
}

export type ArticleSummary = {
  slug: string;
  title: string;
  excerpt: string | null;
  meta_description: string | null;
  cover_image: string | null;
  focus_keyword: string | null;
  reading_time_minutes: number;
  language_code: string;
  created_at: string;
};

export type Article = ArticleSummary & {
  id: string;
  content: string;
  key_takeaways: Array<{ takeaway: string; _heading?: string }>;
  secondary_keywords: string[];
  internal_link_slugs: string[];
  word_count: number;
  og_title: string | null;
  og_description: string | null;
  language_name: string | null;
  updated_at: string;
};

const SUMMARY_COLS =
  "slug,title,excerpt,meta_description,cover_image,focus_keyword,reading_time_minutes,language_code,created_at";

export const listPublishedArticles = createServerFn({ method: "GET" }).handler(async () => {
  const sb = serverPublic();
  const { data, error } = await sb
    .from("articles")
    .select(SUMMARY_COLS)
    .eq("status", "published")
    .order("created_at", { ascending: false })
    .limit(100);
  if (error) throw new Error(error.message);
  return (data ?? []) as unknown as ArticleSummary[];
});

export const getArticleBySlug = createServerFn({ method: "GET" })
  .inputValidator((d: { slug: string; language?: string }) => d)
  .handler(async ({ data }) => {
    const sb = serverPublic();
    const lang = data.language ?? "en";
    const { data: row, error } = await sb
      .from("articles")
      .select("*")
      .eq("slug", data.slug)
      .eq("language_code", lang)
      .eq("status", "published")
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (!row) return null;

    let related: ArticleSummary[] = [];
    const linkSlugs = (row.internal_link_slugs as unknown as string[] | null) ?? [];
    if (linkSlugs.length > 0) {
      const { data: rel } = await sb
        .from("articles")
        .select(SUMMARY_COLS)
        .in("slug", linkSlugs)
        .eq("status", "published")
        .eq("language_code", lang)
        .limit(6);
      related = (rel ?? []) as unknown as ArticleSummary[];
    }

    return { article: row as unknown as Article, related };
  });
