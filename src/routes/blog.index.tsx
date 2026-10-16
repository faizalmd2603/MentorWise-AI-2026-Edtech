import { createFileRoute, Link, useRouter, type ErrorRouteComponent } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { BookOpen, Clock, ArrowRight } from "lucide-react";
import {
  listPublishedArticles,
  type ArticleSummary,
} from "@/lib/articles.functions";

const SITE = "https://mentorwiseai.store";

export const Route = createFileRoute("/blog/")({
  loader: () => listPublishedArticles(),
  head: () => ({
    meta: [
      { name: "twitter:card", content: "summary_large_image" },
      { title: "Blog — MentorWise AI | Career, AI & Student Success" },
      {
        name: "description",
        content:
          "Guides, playbooks and insights from MentorWise AI on careers, AI tools, resumes, interviews, and student growth.",
      },
      { property: "og:title", content: "MentorWise AI Blog" },
      {
        property: "og:description",
        content: "Career, AI, and student growth insights from MentorWise AI.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: `${SITE}/blog` },
    ],
    links: [{ rel: "canonical", href: `${SITE}/blog` }],
  }),
  errorComponent: BlogError as ErrorRouteComponent,
  notFoundComponent: () => <SiteLayout><div className="p-16 text-center">Not found</div></SiteLayout>,
  component: BlogIndex,
});

function BlogError({ reset }: { error: Error; reset: () => void }) {
  const router = useRouter();
  return (
    <SiteLayout>
      <div className="mx-auto max-w-2xl px-4 py-24 text-center">
        <h1 className="font-display text-2xl font-bold">Blog didn't load</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong fetching articles.
        </p>
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

function truncate(s: string | null | undefined, n = 140) {
  if (!s) return "";
  if (s.length <= n) return s;
  return s.slice(0, n).replace(/\s+\S*$/, "") + "…";
}

function BlogIndex() {
  const articles = Route.useLoaderData() as ArticleSummary[];

  return (
    <SiteLayout>
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="animate-fade-up">
          <div className="inline-flex items-center gap-2 rounded-full glass px-3 py-1.5 text-xs text-cyber">
            <BookOpen className="h-3.5 w-3.5" /> MentorWise Blog
          </div>
          <h1 className="mt-4 font-display text-4xl font-bold sm:text-5xl">
            Insights that <span className="text-gradient">move careers forward</span>.
          </h1>
          <p className="mt-4 max-w-2xl text-muted-foreground">
            Deep-dives, guides, and playbooks on careers, AI tools, and student growth —
            written to help you win.
          </p>
        </div>

        {articles.length === 0 ? (
          <div className="mt-16 rounded-3xl glass-strong p-10 text-center">
            <h2 className="font-display text-xl font-semibold">No articles yet</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              New articles will appear here as they're published.
            </p>
          </div>
        ) : (
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {articles.map((a, i) => (
              <Link
                key={`${a.slug}-${a.language_code}`}
                to="/blog/$slug"
                params={{ slug: a.slug }}
                className="group glass rounded-2xl overflow-hidden animate-fade-up hover:glow-cyan transition"
                style={{ animationDelay: `${i * 50}ms` }}
              >
                <div className="relative aspect-[16/9] w-full overflow-hidden bg-gradient-to-br from-cyber/20 via-primary/10 to-magenta/20">
                  {a.cover_image ? (
                    <img
                      src={a.cover_image}
                      alt={a.title}
                      loading="lazy"
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <BookOpen className="h-10 w-10 text-cyber/60" />
                    </div>
                  )}
                </div>
                <div className="p-5">
                  {a.focus_keyword && (
                    <span className="inline-block rounded-full bg-cyber/15 px-2.5 py-0.5 text-[11px] font-medium uppercase tracking-wide text-cyber ring-1 ring-cyber/30">
                      {a.focus_keyword}
                    </span>
                  )}
                  <h2 className="mt-3 font-display text-lg font-semibold leading-snug line-clamp-2">
                    {a.title}
                  </h2>
                  <p className="mt-2 text-sm text-muted-foreground line-clamp-3">
                    {truncate(a.excerpt ?? a.meta_description, 140)}
                  </p>
                  <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      {a.reading_time_minutes || 1} min read
                    </span>
                    <span className="inline-flex items-center gap-1 text-cyber">
                      Read <ArrowRight className="h-3.5 w-3.5" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </SiteLayout>
  );
}
