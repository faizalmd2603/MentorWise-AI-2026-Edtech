import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { SiteLayout } from "@/components/SiteLayout";
import { supabase } from "@/integrations/supabase/client";
import { listReports, resolveReport } from "@/lib/admin.functions";
import { Loader2, ShieldCheck, Flag, CheckCircle2, XCircle, RotateCcw } from "lucide-react";

const ADMIN_EMAILS = ["mentorwiseaiedtech@gmail.com", "saifahmedmentorwise@gmail.com"];

export const Route = createFileRoute("/admin/reports")({
  head: () => ({
    meta: [
      { title: "Admin · Reports — MentorWise AI" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: AdminReports,
});

function AdminReports() {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);
  const qc = useQueryClient();
  const listFn = useServerFn(listReports);
  const resolveFn = useServerFn(resolveReport);

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

  const list = useQuery({ queryKey: ["admin", "reports"], queryFn: () => listFn(), enabled: ready });
  const mut = useMutation({
    mutationFn: (v: { report_id: string; status: "open" | "resolved" | "dismissed" }) => resolveFn({ data: v }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "reports"] }),
  });

  if (!ready) {
    return (
      <SiteLayout>
        <div className="mx-auto max-w-2xl px-4 py-24 text-center text-muted-foreground">
          <Loader2 className="mx-auto mb-3 h-6 w-6 animate-spin" /> Checking access…
        </div>
      </SiteLayout>
    );
  }

  return (
    <SiteLayout>
      <section className="mx-auto max-w-5xl px-4 py-12">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-foreground px-3 py-1 text-xs font-semibold text-background">
              <ShieldCheck className="h-3.5 w-3.5" /> Admin only
            </div>
            <h1 className="text-3xl font-bold flex items-center gap-2"><Flag className="h-7 w-7 text-red-500" /> User Reports</h1>
            <p className="mt-1 text-sm text-muted-foreground">Triage reports submitted by community members.</p>
          </div>
          <Link to="/admin" className="rounded-lg border border-border px-3 py-1.5 text-xs hover:bg-foreground/5">← Admin home</Link>
        </div>

        <ul className="space-y-3">
          {list.isLoading && <li className="rounded-xl border border-border bg-card p-4 text-muted-foreground">Loading…</li>}
          {list.data?.reports.map((r) => (
            <li key={r.id} className="rounded-2xl border border-border bg-card p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold uppercase ${
                      r.status === "open" ? "bg-amber-500/15 text-amber-600"
                      : r.status === "resolved" ? "bg-emerald-500/15 text-emerald-600"
                      : "bg-muted text-muted-foreground"}`}>{r.status}</span>
                    <span className="text-xs text-muted-foreground">{new Date(r.created_at).toLocaleString()}</span>
                  </div>
                  <div className="mt-1.5 font-semibold text-foreground">{r.reason}</div>
                  {r.details && <p className="mt-1 text-sm text-foreground/80">{r.details}</p>}
                  <div className="mt-2 text-xs text-muted-foreground">
                    Reported user: <span className="font-medium text-foreground">{r.reported_email || r.reported_user_id}</span>
                    <span className="mx-2">·</span>
                    By: <span className="font-medium text-foreground">{r.reporter_email || r.reporter_id}</span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {r.status !== "resolved" && (
                    <button onClick={() => mut.mutate({ report_id: r.id, status: "resolved" })}
                      className="inline-flex items-center gap-1 rounded-md border border-emerald-500/30 px-2.5 py-1 text-xs text-emerald-600 hover:bg-emerald-500/10">
                      <CheckCircle2 className="h-3.5 w-3.5" /> Resolve
                    </button>
                  )}
                  {r.status !== "dismissed" && (
                    <button onClick={() => mut.mutate({ report_id: r.id, status: "dismissed" })}
                      className="inline-flex items-center gap-1 rounded-md border border-border px-2.5 py-1 text-xs hover:bg-foreground/5">
                      <XCircle className="h-3.5 w-3.5" /> Dismiss
                    </button>
                  )}
                  {r.status !== "open" && (
                    <button onClick={() => mut.mutate({ report_id: r.id, status: "open" })}
                      className="inline-flex items-center gap-1 rounded-md border border-border px-2.5 py-1 text-xs hover:bg-foreground/5">
                      <RotateCcw className="h-3.5 w-3.5" /> Reopen
                    </button>
                  )}
                </div>
              </div>
            </li>
          ))}
          {list.data && list.data.reports.length === 0 && (
            <li className="rounded-xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
              No reports filed yet.
            </li>
          )}
        </ul>
      </section>
    </SiteLayout>
  );
}
