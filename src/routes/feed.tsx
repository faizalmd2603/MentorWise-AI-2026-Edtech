import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { SiteLayout } from "@/components/SiteLayout";
import { listAnnouncements } from "@/lib/announcements.functions";
import { supabase } from "@/integrations/supabase/client";
import { sanitizeAnnouncementHtml } from "@/lib/sanitize";
import { Megaphone, ShieldCheck, LogIn } from "lucide-react";

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
    ],
    links: [{ rel: "canonical", href: `${SITE}/feed` }],
  }),
  component: FeedPage,
});

function FeedPage() {
  const fetchFeed = useServerFn(listAnnouncements);
  const [user, setUser] = useState<{ email: string | null; isAdmin: boolean } | null>(null);

  useEffect(() => {
    let mounted = true;
    supabase.auth.getUser().then(({ data }) => {
      if (!mounted) return;
      const email = data.user?.email?.toLowerCase() ?? null;
      const admins = ["mentorwiseaiedtech@gmail.com", "saifahmedmentorwise@gmail.com"];
      setUser(email ? { email, isAdmin: admins.includes(email) } : null);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      const email = session?.user?.email?.toLowerCase() ?? null;
      const admins = ["mentorwiseaiedtech@gmail.com", "saifahmedmentorwise@gmail.com"];
      setUser(email ? { email, isAdmin: admins.includes(email) } : null);
    });
    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  const { data, isLoading } = useQuery({
    queryKey: ["announcements"],
    queryFn: () => fetchFeed(),
    refetchOnWindowFocus: true,
  });

  async function signOut() {
    await supabase.auth.signOut();
  }

  return (
    <SiteLayout>
      <section className="mx-auto max-w-3xl px-4 py-12 sm:py-16">
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
            {user ? (
              <>
                <span className="hidden sm:inline-block text-xs text-muted-foreground">
                  {user.email}
                </span>
                {user.isAdmin && (
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

        {isLoading ? (
          <div className="rounded-xl border border-border bg-card p-6 text-muted-foreground">
            Loading announcements…
          </div>
        ) : !data?.announcements.length ? (
          <div className="rounded-xl border border-dashed border-border bg-card/50 p-10 text-center">
            <Megaphone className="mx-auto mb-3 h-8 w-8 text-muted-foreground" />
            <p className="text-foreground font-medium">No announcements yet</p>
            <p className="mt-1 text-sm text-muted-foreground">
              When the founders post, you'll see it here — and get it by email.
            </p>
          </div>
        ) : (
          <ol className="space-y-5">
            {data.announcements.map((a) => (
              <li
                key={a.id}
                className="rounded-2xl border border-border bg-card p-6 shadow-sm transition hover:shadow-md"
              >
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
                {a.body_html ? (
                  <div
                    className="prose prose-sm sm:prose-base dark:prose-invert mt-2 max-w-none text-foreground"
                    dangerouslySetInnerHTML={{ __html: sanitizeAnnouncementHtml(a.body_html) }}
                  />
                ) : (
                  <p className="mt-2 whitespace-pre-wrap text-[15px] leading-relaxed text-foreground/90">
                    {a.body}
                  </p>
                )}
              </li>
            ))}
          </ol>
        )}
      </section>
    </SiteLayout>
  );
}
