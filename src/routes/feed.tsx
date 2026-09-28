import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { memo, useMemo } from "react";
import { SiteLayout } from "@/components/SiteLayout";
import { listAnnouncements } from "@/lib/announcements.functions";
import { supabase } from "@/integrations/supabase/client";
import { sanitizeAnnouncementHtml } from "@/lib/sanitize";
import { useAuthReady } from "@/hooks/use-auth-ready";
import jaithoonPortrait from "@/assets/jaithoon-aasia-ms.jpeg.asset.json";
import { Megaphone, ShieldCheck, LogIn, Loader2, Mic2, Sparkles } from "lucide-react";

const SITE = "https://mentorwiseaiedtechservice.lovable.app";

export const Route = createFileRoute("/feed")({
  head: () => ({
    meta: [
      { title: "Announcements & Updates — MentorWise AI" },
      {
        name: "description",
        content:
          "Official announcements, updates, and posts from MentorWise AI founders Mohammed Faizal. M and Saif Ahmed. Z. Sign in to receive every update by email.",
      },
      { property: "og:title", content: "MentorWise AI — Founder Announcements & Posts" },
      {
        property: "og:description",
        content: "Official MentorWise AI announcements from the founders. Sign in to get every post by email.",
      },
      { property: "og:url", content: `${SITE}/feed` },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: `${SITE}/feed` }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          "@id": `${SITE}/feed`,
          url: `${SITE}/feed`,
          name: "MentorWise AI — Founder Announcements & Posts",
          description: "Official announcements, updates and posts from the MentorWise AI founding team.",
          isPartOf: { "@type": "WebSite", "@id": `${SITE}/#website`, url: `${SITE}/` },
        }),
      },
    ],
  }),
  component: FeedPage,
});

const AnnouncementItem = memo(({ a }: { a: any }) => {
  const sanitizedHtml = useMemo(() => 
    a.body_html ? sanitizeAnnouncementHtml(a.body_html) : null
  , [a.body_html]);

  return (
    <li className="motion-card rounded-2xl border border-border bg-card p-6 shadow-sm">
      <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
        <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          {a.author_name}
        </span>
        <time className="text-xs text-muted-foreground" dateTime={a.created_at}>
          {new Date(a.created_at).toLocaleString(undefined, {
            dateStyle: "medium",
            timeStyle: "short",
          })}
        </time>
      </div>
      <h2 className="text-lg font-bold text-foreground sm:text-xl">{a.title}</h2>
      {sanitizedHtml ? (
        <div
          className="prose prose-sm sm:prose-base dark:prose-invert mt-2 max-w-none text-foreground"
          dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
        />
      ) : (
        <p className="mt-2 whitespace-pre-wrap text-[15px] leading-relaxed text-foreground/90">
          {a.body}
        </p>
      )}
    </li>
  );
});

AnnouncementItem.displayName = "AnnouncementItem";

function FeedPage() {
  const fetchFeed = useServerFn(listAnnouncements);
  const auth = useAuthReady();

  const { data, isLoading } = useQuery({
    queryKey: ["announcements"],
    queryFn: () => fetchFeed(),
    staleTime: 60_000,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  async function signOut() {
    await supabase.auth.signOut();
  }

  return (
    <SiteLayout>
      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-20">
        <header className="mb-8 flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-foreground/5 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-foreground">
              <Megaphone className="h-3.5 w-3.5" />
              Founder feed
            </div>
            <h1 className="text-3xl font-bold text-foreground sm:text-4xl">
              Announcements & Updates
            </h1>
            <p className="mt-2 max-w-xl text-sm text-muted-foreground">
              Official posts from MentorWise AI founders. Sign in with your email
              to receive every announcement directly in your inbox.
            </p>
          </div>
          <div className="flex items-center gap-2">
            {!auth.isReady ? (
              <span className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs text-muted-foreground">
                <Loader2 className="h-3.5 w-3.5 animate-spin" /> Restoring session
              </span>
            ) : auth.user ? (
              <>
                <span className="hidden sm:inline-block text-xs text-muted-foreground">
                  {auth.email}
                </span>
                {auth.isAdmin && (
                  <Link
                    to="/admin/announcements"
                    className="inline-flex items-center gap-1.5 rounded-lg border border-foreground/20 bg-foreground px-3 py-1.5 text-xs font-semibold text-background"
                  >
                    <ShieldCheck className="h-3.5 w-3.5" />
                    Admin
                  </Link>
                )}
                <button
                  onClick={signOut}
                  className="rounded-lg border border-border px-3 py-1.5 text-xs text-foreground hover:bg-foreground/5"
                >
                  Sign out
                </button>
              </>
            ) : (
              <Link
                to="/auth"
                className="inline-flex items-center gap-1.5 rounded-lg bg-foreground px-3 py-1.5 text-xs font-semibold text-background"
              >
                <LogIn className="h-3.5 w-3.5" />
                Sign in for email updates
              </Link>
            )}
          </div>
        </header>

        <article className="contributor-spotlight group relative mb-12 overflow-hidden rounded-3xl border border-primary/35 bg-card">
          <div aria-hidden="true" className="gold-rule absolute inset-x-0 top-0 h-px" />
          <div className="grid md:grid-cols-[minmax(0,1fr)_20rem]">
            <div className="relative flex flex-col justify-center p-7 sm:p-10 lg:p-12">
              <div className="mb-7 inline-flex w-fit items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1.5 text-xs font-bold uppercase text-primary">
                <Sparkles className="h-3.5 w-3.5" />
                Community spotlight
              </div>
              <p className="text-xs font-semibold uppercase text-muted-foreground">Contributed to our platform</p>
              <h2 className="mt-3 text-3xl font-bold text-foreground sm:text-4xl">Jaithoon Aasia MS</h2>
              <blockquote className="mt-6 max-w-2xl border-l-2 border-primary pl-5 text-lg leading-relaxed text-foreground/85 sm:text-xl">
                Collaborated with MentorWise AI and host a session on 'How to build your own startup when you're still a student'.
              </blockquote>
              <div className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-primary">
                <Mic2 className="h-4 w-4" /> Student startup session
              </div>
            </div>

            <div className="relative min-h-80 overflow-hidden border-t border-primary/20 md:border-l md:border-t-0">
              <div aria-hidden="true" className="absolute inset-0 bg-primary/10 transition-opacity duration-500 group-hover:opacity-40" />
              <img
                src={jaithoonPortrait.url}
                alt="Jaithoon Aasia MS"
                width={768}
                height={768}
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.025]"
              />
              <div className="absolute inset-x-5 bottom-5 rounded-2xl border border-primary/25 bg-background/85 px-4 py-3 backdrop-blur-md">
                <p className="text-xs font-bold uppercase text-primary">MentorWise AI collaborator</p>
              </div>
            </div>
          </div>
        </article>

        {isLoading ? (
          <div className="motion-card rounded-xl border border-border bg-card p-6 text-muted-foreground">
            <span className="inline-flex items-center gap-2"><Loader2 className="h-4 w-4 animate-spin" /> Loading announcements…</span>
          </div>
        ) : !data?.announcements.length ? (
          <div className="motion-card rounded-xl border border-dashed border-border bg-card/50 p-10 text-center">
            <Megaphone className="mx-auto mb-3 h-8 w-8 text-muted-foreground" />
            <p className="text-foreground font-medium">No announcements yet</p>
            <p className="mt-1 text-sm text-muted-foreground">
              When the founders post, you'll see it here — and get it by email.
            </p>
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-[14rem_minmax(0,1fr)]">
            <aside className="hidden lg:block">
              <div className="sticky top-28 border-t border-primary/40 pt-5">
                <p className="text-xs font-bold uppercase text-primary">Latest from MentorWise</p>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">Official news, milestones and updates from the founders.</p>
              </div>
            </aside>
            <ol className="space-y-5">
            {data.announcements.map((a) => (
              <AnnouncementItem key={a.id} a={a} />
            ))}
            </ol>
          </div>
        )}
      </section>
    </SiteLayout>
  );
}
