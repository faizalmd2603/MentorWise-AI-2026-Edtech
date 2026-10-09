import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { SiteLayout } from "@/components/SiteLayout";
import { supabase } from "@/integrations/supabase/client";
import { ShieldCheck, Users, Radio, Megaphone, Flag, Loader2 } from "lucide-react";

const ADMIN_EMAILS = ["mentorwiseaiedtech@gmail.com", "saifahmedmentorwise@gmail.com"];

export const Route = createFileRoute("/admin/")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "description", content: "Private administration area for the MentorWise AI team." },
      { property: "og:title", content: "Admin Console — MentorWise AI" },
      { property: "og:description", content: "Private administration area for the MentorWise AI team." },
      { title: "Admin Console — MentorWise AI" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: AdminHome,
});

function AdminHome() {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const check = (email: string | null | undefined) => {
      if (cancelled) return;
      if (!email) return navigate({ to: "/auth" });
      if (!ADMIN_EMAILS.includes(email.toLowerCase())) return navigate({ to: "/feed" });
      setReady(true);
    };
    supabase.auth.getUser().then(({ data }) => check(data.user?.email));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => check(s?.user?.email));
    return () => { cancelled = true; sub.subscription.unsubscribe(); };
  }, [navigate]);

  if (!ready) {
    return (
      <SiteLayout>
        <div className="mx-auto max-w-2xl px-4 py-24 text-center text-muted-foreground">
          <Loader2 className="mx-auto mb-3 h-6 w-6 animate-spin" /> Checking access…
        </div>
      </SiteLayout>
    );
  }

  const tiles = [
    { to: "/admin/announcements", icon: Megaphone, title: "Announcements", desc: "Publish posts to the public feed and email all members." },
    { to: "/events", icon: Radio, title: "Create Live Stream", desc: "Schedule, go live, and host voice & video events." },
    { to: "/admin/users", icon: Users, title: "Users", desc: "Invite, promote, suspend, or remove user accounts." },
    { to: "/admin/reports", icon: Flag, title: "Reports", desc: "Review reports filed by community members." },
  ] as const;

  return (
    <SiteLayout>
      <section className="mx-auto max-w-5xl px-4 py-12">
        <div className="mb-8">
          <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-foreground px-3 py-1 text-xs font-semibold text-background">
            <ShieldCheck className="h-3.5 w-3.5" /> Admin only
          </div>
          <h1 className="text-3xl font-bold sm:text-4xl">Admin Console</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Operational controls for founders. Streams, users, reports and announcements.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {tiles.map((t) => (
            <Link
              key={t.to}
              to={t.to}
              className="group flex items-start gap-4 rounded-2xl border border-border bg-card p-5 transition hover:shadow-md"
            >
              <div className="rounded-xl bg-primary/10 p-3 text-primary"><t.icon className="h-5 w-5" /></div>
              <div>
                <div className="font-semibold text-foreground">{t.title}</div>
                <div className="mt-1 text-sm text-muted-foreground">{t.desc}</div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </SiteLayout>
  );
}
