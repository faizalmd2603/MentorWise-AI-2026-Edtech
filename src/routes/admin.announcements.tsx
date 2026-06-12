import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { SiteLayout } from "@/components/SiteLayout";
import { supabase } from "@/integrations/supabase/client";
import {
  createAnnouncement,
  deleteAnnouncement,
  listAnnouncements,
} from "@/lib/announcements.functions";
import { ShieldCheck, Loader2, Send, Trash2 } from "lucide-react";
import { RichEditor } from "@/components/RichEditor";

const ADMIN_EMAILS = [
  "mentorwiseaiedtech@gmail.com",
  "saifahmedmentorwise@gmail.com",
];

export const Route = createFileRoute("/admin/announcements")({
  head: () => ({
    meta: [
      { title: "Admin · Announcements — MentorWise AI" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: AdminPage,
});

function AdminPage() {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const createFn = useServerFn(createAnnouncement);
  const deleteFn = useServerFn(deleteAnnouncement);
  const listFn = useServerFn(listAnnouncements);
  const qc = useQueryClient();

  useEffect(() => {
    let cancelled = false;

    function evaluate(email: string | null | undefined) {
      if (cancelled) return;
      if (!email) {
        navigate({ to: "/auth" });
        return;
      }
      const lower = email.toLowerCase();
      if (!ADMIN_EMAILS.includes(lower)) {
        navigate({ to: "/feed" });
        return;
      }
      setIsAdmin(true);
      setReady(true);
    }

    // First, check existing session synchronously from storage
    supabase.auth.getSession().then(({ data }) => {
      if (cancelled) return;
      const email = data.session?.user?.email ?? null;
      if (email) {
        evaluate(email);
      }
      // If no session yet, wait for onAuthStateChange below (INITIAL_SESSION)
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      const email = session?.user?.email ?? null;
      // Ignore token-refresh churn; only act when we have a user or explicit sign-out
      if (email) {
        evaluate(email);
      } else if (_event === "SIGNED_OUT") {
        if (!cancelled) navigate({ to: "/auth" });
      } else if (_event === "INITIAL_SESSION" && !session) {
        if (!cancelled) navigate({ to: "/auth" });
      }
    });

    return () => {
      cancelled = true;
      sub.subscription.unsubscribe();
    };
  }, [navigate]);

  const list = useQuery({
    queryKey: ["announcements"],
    queryFn: () => listFn(),
    enabled: isAdmin,
  });

  const [title, setTitle] = useState("");
  const [bodyHtml, setBodyHtml] = useState("");
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const bodyPlain = bodyHtml.replace(/<[^>]+>/g, "").trim();

  const createMut = useMutation({
    mutationFn: (vars: { title: string; bodyHtml: string }) => createFn({ data: vars }),
    onSuccess: () => {
      setTitle("");
      setBodyHtml("");
      setSuccess("Published. Your post is live on the feed and emails are being delivered to all members.");
      qc.invalidateQueries({ queryKey: ["announcements"] });
      setTimeout(() => setSuccess(null), 6000);
    },
    onError: (e: Error) => setSubmitError(e.message),
  });

  const deleteMut = useMutation({
    mutationFn: (id: string) => deleteFn({ data: { id } }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["announcements"] }),
  });

  if (!ready) {
    return (
      <SiteLayout>
        <div className="mx-auto max-w-2xl px-4 py-24 text-center text-muted-foreground">
          <Loader2 className="mx-auto mb-3 h-6 w-6 animate-spin" />
          Checking access…
        </div>
      </SiteLayout>
    );
  }

  return (
    <SiteLayout>
      <section className="mx-auto max-w-3xl px-4 py-12">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-foreground px-3 py-1 text-xs font-semibold text-background">
              <ShieldCheck className="h-3.5 w-3.5" />
              Admin only
            </div>
            <h1 className="text-3xl font-bold text-foreground">Post an announcement</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Every post appears on the public feed and is emailed to all signed-up members.
            </p>
          </div>
          <Link
            to="/feed"
            className="rounded-lg border border-border px-3 py-1.5 text-xs text-foreground hover:bg-foreground/5"
          >
            View feed →
          </Link>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            setSubmitError(null);
            createMut.mutate({ title: title.trim(), bodyHtml });
          }}
          className="space-y-4 rounded-2xl border border-border bg-card p-6"
        >
          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">Title</label>
            <input
              required
              maxLength={200}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What's the headline?"
              className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-foreground/30"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">Message</label>
            <RichEditor
              value={bodyHtml}
              onChange={setBodyHtml}
              placeholder="Share an update, link, or image… Format with bold, colors, bullets, emojis and more."
            />
            <div className="mt-1 text-right text-xs text-muted-foreground">{bodyPlain.length} characters</div>
          </div>

          {submitError && (
            <div className="rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-700 dark:text-red-200">
              {submitError}
            </div>
          )}
          {success && (
            <div className="rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-700 dark:text-emerald-200">
              {success}
            </div>
          )}

          <button
            type="submit"
            disabled={createMut.isPending || !title.trim() || bodyPlain.length < 3}
            className="inline-flex items-center gap-2 rounded-lg bg-foreground px-5 py-2.5 text-sm font-semibold text-background transition disabled:opacity-50"
          >
            {createMut.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
            Publish & email all members
          </button>
        </form>

        <div className="mt-10">
          <h2 className="mb-3 text-lg font-semibold text-foreground">Recent posts</h2>
          <ul className="space-y-3">
            {list.data?.announcements.map((a) => (
              <li
                key={a.id}
                className="flex items-start justify-between gap-3 rounded-xl border border-border bg-card p-4"
              >
                <div>
                  <div className="text-xs text-muted-foreground">
                    {new Date(a.created_at).toLocaleString()} · {a.author_name}
                  </div>
                  <div className="mt-0.5 font-semibold text-foreground">{a.title}</div>
                </div>
                <button
                  onClick={() => {
                    if (confirm("Delete this announcement?")) deleteMut.mutate(a.id);
                  }}
                  className="rounded-md border border-red-500/30 p-1.5 text-red-300 hover:bg-red-500/10"
                  aria-label="Delete"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </li>
            ))}
            {list.data && list.data.announcements.length === 0 && (
              <li className="rounded-xl border border-dashed border-border p-4 text-sm text-muted-foreground">
                No posts yet.
              </li>
            )}
          </ul>
        </div>
      </section>
    </SiteLayout>
  );
}
