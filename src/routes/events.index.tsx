import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { SiteLayout } from "@/components/SiteLayout";
import { createEvent, listEvents, deleteEvent, setEventStatus } from "@/lib/events.functions";
import { useAuthReady } from "@/hooks/use-auth-ready";
import { Radio, Calendar, Plus, Trash2, Play, Square, LogIn, Video, Loader2 } from "lucide-react";

const SITE = "https://mentorwiseaiedtechservice.lovable.app";

export const Route = createFileRoute("/events/")({
  head: () => ({
    meta: [
      { title: "Live Events — MentorWise AI" },
      { name: "description", content: "Join live voice and video events hosted by MentorWise AI founders. Free, interactive, mentor-led sessions for students." },
      { name: "keywords", content: "live mentor events, free webinar, student live session, AI Q&A, career live talk" },
      { property: "og:title", content: "MentorWise AI — Live Events" },
      { property: "og:description", content: "Join live mentor sessions with chat, reactions, and hand raise." },
      { property: "og:url", content: `${SITE}/events` },
    ],
    links: [{ rel: "canonical", href: `${SITE}/events` }],
  }),
  component: EventsPage,
});

function EventsPage() {
  const fetchList = useServerFn(listEvents);
  const createFn = useServerFn(createEvent);
  const delFn = useServerFn(deleteEvent);
  const statusFn = useServerFn(setEventStatus);
  const auth = useAuthReady();
  const user = auth.user ? { id: auth.user.id, email: auth.email ?? "", isAdmin: auth.isAdmin } : null;
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: "", description: "", scheduled_at: "" });
  const [busy, setBusy] = useState(false);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["events"],
    queryFn: () => fetchList(),
    staleTime: 45_000,
    refetchInterval: 30_000,
    refetchOnWindowFocus: false,
  });

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      await createFn({ data: { ...form, scheduled_at: new Date(form.scheduled_at).toISOString() } });
      setForm({ title: "", description: "", scheduled_at: "" });
      setShowForm(false);
      refetch();
    } catch (err) {
      alert((err as Error).message);
    } finally { setBusy(false); }
  }

  return (
    <SiteLayout>
      <section className="mx-auto max-w-5xl px-4 py-12 sm:py-16">
        <header className="mb-8 flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-foreground/5 px-3 py-1 text-xs font-semibold uppercase tracking-wider">
              <Radio className="h-3.5 w-3.5" /> Live Events
            </div>
            <h1 className="text-3xl font-bold sm:text-4xl">Live mentor sessions</h1>
            <p className="mt-2 max-w-xl text-sm text-muted-foreground">
              Voice & video events hosted by our founders. Chat, react, and raise your hand to be heard. Sign in to attend.
            </p>
          </div>
          {!auth.isReady ? (
            <span className="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" /> Restoring session
            </span>
          ) : user?.isAdmin && (
            <button onClick={() => setShowForm((v) => !v)} className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">
              <Plus className="h-4 w-4" /> {showForm ? "Cancel" : "New Event"}
            </button>
          )}
        </header>

        {showForm && user?.isAdmin && (
          <form onSubmit={handleCreate} className="motion-card mb-8 space-y-3 rounded-2xl border border-border bg-card p-5">
            <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Event title" className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm" />
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Description" rows={3} className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm" />
            <input required type="datetime-local" value={form.scheduled_at} onChange={(e) => setForm({ ...form, scheduled_at: e.target.value })} className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm" />
            <button disabled={busy} className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-50">{busy ? "Creating…" : "Create Event"}</button>
          </form>
        )}

        {isLoading ? (
          <div className="motion-card rounded-xl border border-border bg-card p-6 text-muted-foreground">
            <span className="inline-flex items-center gap-2"><Loader2 className="h-4 w-4 animate-spin" /> Loading live events…</span>
          </div>
        ) : !data?.events.length ? (
          <div className="motion-card rounded-xl border border-dashed border-border bg-card/50 p-10 text-center">
            <Video className="mx-auto mb-3 h-8 w-8 text-muted-foreground" />
            <p className="font-medium">No live events yet</p>
            <p className="mt-1 text-sm text-muted-foreground">Check back soon — founders post new sessions here.</p>
          </div>
        ) : (
          <ul className="grid gap-4 sm:grid-cols-2">
            {data.events.map((e) => (
              <li key={e.id} className="motion-card group relative rounded-2xl border border-border bg-card p-5 shadow-sm">
                <div className="mb-2 flex items-center justify-between">
                  <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide ${e.status === "live" ? "bg-red-500/15 text-red-600" : e.status === "ended" ? "bg-muted text-muted-foreground" : "bg-primary/10 text-primary"}`}>
                    {e.status === "live" && <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-red-500" />}
                    {e.status}
                  </span>
                  <time className="text-xs text-muted-foreground"><Calendar className="mr-1 inline h-3 w-3" />{new Date(e.scheduled_at).toLocaleString()}</time>
                </div>
                <h2 className="text-lg font-bold">{e.title}</h2>
                <p className="mt-1 text-xs text-muted-foreground">Host: {e.host_name}</p>
                {e.description && <p className="mt-2 line-clamp-3 text-sm text-foreground/80">{e.description}</p>}
                <div className="mt-4 flex flex-wrap items-center gap-2">
                  {user ? (
                    <Link to="/events/$eventId" params={{ eventId: e.id }} className="inline-flex items-center gap-1.5 rounded-lg bg-foreground px-3 py-1.5 text-xs font-semibold text-background">
                      <Play className="h-3.5 w-3.5" /> {e.status === "live" ? "Join Live" : "Enter Room"}
                    </Link>
                  ) : (
                    <Link to="/auth" className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground">
                      <LogIn className="h-3.5 w-3.5" /> Sign in to attend
                    </Link>
                  )}
                  {user?.isAdmin && (
                    <>
                      {e.status !== "live" && <button onClick={async () => { await statusFn({ data: { event_id: e.id, status: "live" } }); refetch(); }} className="rounded-lg border border-border px-2.5 py-1.5 text-xs">Go Live</button>}
                      {e.status === "live" && <button onClick={async () => { await statusFn({ data: { event_id: e.id, status: "ended" } }); refetch(); }} className="inline-flex items-center gap-1 rounded-lg border border-border px-2.5 py-1.5 text-xs"><Square className="h-3 w-3" /> End</button>}
                      <button onClick={async () => { if (confirm("Delete event?")) { await delFn({ data: { event_id: e.id } }); refetch(); } }} className="inline-flex items-center gap-1 rounded-lg border border-border px-2.5 py-1.5 text-xs text-destructive"><Trash2 className="h-3 w-3" /></button>
                    </>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </SiteLayout>
  );
}
