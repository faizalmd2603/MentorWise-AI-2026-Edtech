import { createFileRoute, Link, notFound, useRouter, type ErrorRouteComponent } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { BookOpen, Clock, FileText, ArrowLeft } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { getArticleBySlug, type Article, type ArticleSummary } from "@/lib/articles.functions";

const SITE = "https://mentorwiseaiedtechservice.lovable.app";

export const Route = createFileRoute("/blog/$slug")({
  loader: async ({ params }) => {
    const res = await getArticleBySlug({ data: { slug: params.slug } });
    if (!res) throw notFound();
    return res;
  },
  head: ({ params, loaderData }) => {
    const data = loaderData as { article: Article; related: ArticleSummary[] } | undefined;
    if (!data) {
      return {
        meta: [{ title: "Article not found" }, { name: "robots", content: "noindex" }],
      };
    }
    const a = data.article;
    const url = `${SITE}/blog/${params.slug}`;
    const desc = a.meta_description ?? a.excerpt ?? a.title;
    const meta: Array<Record<string, string>> = [
      { title: `${a.title} | MentorWise AI Blog` },
      { name: "description", content: desc },
      { property: "og:title", content: a.og_title ?? a.title },
      { property: "og:description", content: a.og_description ?? desc },
      { property: "og:type", content: "article" },
      { property: "og:url", content: url },
      { name: "twitter:card", content: a.cover_image ? "summary_large_image" : "summary" },
    ];
    if (a.cover_image) {
      meta.push({ property: "og:image", content: a.cover_image });
      meta.push({ name: "twitter:image", content: a.cover_image });
    }
    if (a.focus_keyword) {
      const kws = [a.focus_keyword, ...(a.secondary_keywords ?? [])].filter(Boolean).join(", ");
      meta.push({ name: "keywords", content: kws });
    }
    return {
      meta,
      links: [{ rel: "canonical", href: url }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: a.title,
            description: desc,
            image: a.cover_image ? [a.cover_image] : undefined,
            datePublished: a.created_at,
            dateModified: a.updated_at,
            mainEntityOfPage: url,
            author: { "@type": "Organization", name: "MentorWise AI" },
            publisher: {
              "@type": "Organization",
              name: "MentorWise AI",
              url: SITE,
            },
          }),
        },
      ],
    };
  },
  errorComponent: ArticleError as ErrorRouteComponent,
  notFoundComponent: ArticleNotFound,
  component: ArticlePage,
});

function ArticleError({ reset }: { error: Error; reset: () => void }) {
  const router = useRouter();
  return (
    <SiteLayout>
      <div className="mx-auto max-w-2xl px-4 py-24 text-center">
        <h1 className="font-display text-2xl font-bold">Article didn't load</h1>
        <button
          className="mt-6 rounded-full bg-cyber px-5 py-2.5 text-sm font-semibold text-primary-foreground"
          onClick={() => {
            router.invalidate();
            reset();
          }}
        >
          Try again
        </button>
      </div>
    </SiteLayout>
  );
}

function ArticleNotFound() {
  return (
    <SiteLayout>
      <div className="mx-auto max-w-2xl px-4 py-24 text-center">
        <h1 className="font-display text-3xl font-bold">Article not found</h1>
        <p className="mt-3 text-muted-foreground">
          This article may have been unpublished or the link is incorrect.
        </p>
        <Link
          to="/blog"
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-cyber px-5 py-2.5 text-sm font-semibold text-primary-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> Back to blog
        </Link>
      </div>
    </SiteLayout>
  );
}

type Takeaway = { takeaway?: string; _heading?: string };

function ArticlePage() {
  const { article, related } = Route.useLoaderData() as { article: Article; related: ArticleSummary[] };
  const takeaways: Takeaway[] = Array.isArray(article.key_takeaways)
    ? (article.key_takeaways as Takeaway[])
    : [];
  const takeawayHeading =
    takeaways.find((t: Takeaway) => t?._heading)?._heading ?? "Key Takeaways";

  return (
    <SiteLayout>
      <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
        <Link
          to="/blog"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-cyber transition"
        >
          <ArrowLeft className="h-4 w-4" /> All articles
        </Link>

        <header className="mt-6">
          {article.focus_keyword && (
            <span className="inline-block rounded-full bg-cyber/15 px-3 py-1 text-xs font-medium uppercase tracking-wide text-cyber ring-1 ring-cyber/30">
              {article.focus_keyword}
            </span>
          )}
          <h1 className="mt-4 font-display text-3xl font-bold leading-tight sm:text-5xl">
            {article.title}
          </h1>
          <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" /> {article.reading_time_minutes || 1} min read
            </span>
            {article.word_count > 0 && (
              <span className="inline-flex items-center gap-1.5">
                <FileText className="h-3.5 w-3.5" /> {article.word_count.toLocaleString()} words
              </span>
            )}
            <span>
              {new Date(article.created_at).toLocaleDateString(undefined, {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          </div>
        </header>

        {article.cover_image && (
          <div className="mt-8 overflow-hidden rounded-2xl glass-strong">
            <div className="aspect-[16/9] w-full">
              <img
                src={article.cover_image}
                alt={article.title}
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        )}

        <div className="prose prose-invert mt-10 max-w-none prose-headings:font-display prose-headings:tracking-tight prose-h1:text-3xl prose-h2:mt-10 prose-h2:text-2xl prose-h3:text-xl prose-p:leading-[1.75] prose-p:text-[15px] prose-a:text-cyber hover:prose-a:underline prose-img:rounded-xl prose-code:rounded prose-code:bg-card/50 prose-code:px-1.5 prose-code:py-0.5 prose-pre:rounded-xl prose-pre:bg-card/70 prose-blockquote:border-cyber/50 prose-blockquote:text-muted-foreground prose-strong:text-foreground prose-li:marker:text-cyber">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{article.content}</ReactMarkdown>
        </div>

        {takeaways.length > 0 && (
          <section className="mt-12 rounded-2xl glass-strong p-6 sm:p-8">
            <h2 className="font-display text-xl font-bold">{takeawayHeading}</h2>
            <ul className="mt-4 space-y-3">
              {takeaways.map((t, i) => (
                <li key={i} className="flex gap-3 text-sm text-foreground/90">
                  <span className="mt-1.5 h-1.5 w-1.5 flex-none rounded-full bg-cyber" />
                  <span>{t?.takeaway}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {related.length > 0 && (
          <section className="mt-16">
            <h2 className="font-display text-xl font-bold">Related articles</h2>
            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              {(related as ArticleSummary[]).map((r) => (
                <Link
                  key={r.slug}
                  to="/blog/$slug"
                  params={{ slug: r.slug }}
                  className="group glass rounded-2xl overflow-hidden hover:glow-cyan transition"
                >
                  <div className="aspect-[16/9] w-full overflow-hidden bg-gradient-to-br from-cyber/20 via-primary/10 to-magenta/20">
                    {r.cover_image ? (
                      <img
                        src={r.cover_image}
                        alt={r.title}
                        loading="lazy"
                        className="h-full w-full object-cover transition group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center">
                        <BookOpen className="h-8 w-8 text-cyber/60" />
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-display text-base font-semibold line-clamp-2">
                      {r.title}
                    </h3>
                    <p className="mt-1.5 text-xs text-muted-foreground line-clamp-2">
                      {r.excerpt ?? r.meta_description}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </article>
    </SiteLayout>
  );
}
