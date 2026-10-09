import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { SiteLayout } from "@/components/SiteLayout";
import { supabase } from "@/integrations/supabase/client";
import {
  listUsers,
  inviteUser,
  setUserRole,
  banUser,
  deleteUser,
} from "@/lib/admin.functions";
import { Loader2, ShieldCheck, UserPlus, Trash2, ShieldOff, Shield, Ban, CheckCircle2 } from "lucide-react";

const ADMIN_EMAILS = ["mentorwiseaiedtech@gmail.com", "saifahmedmentorwise@gmail.com"];

export const Route = createFileRoute("/admin/users")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "description", content: "Private administration area for the MentorWise AI team." },
      { property: "og:title", content: "Admin · Users — MentorWise AI" },
      { property: "og:description", content: "Private administration area for the MentorWise AI team." },
      { title: "Admin · Users — MentorWise AI" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: AdminUsers,
});

function AdminUsers() {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);
  const qc = useQueryClient();

  const listFn = useServerFn(listUsers);
  const inviteFn = useServerFn(inviteUser);
  const roleFn = useServerFn(setUserRole);
  const banFn = useServerFn(banUser);
  const delFn = useServerFn(deleteUser);

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

  const list = useQuery({ queryKey: ["admin", "users"], queryFn: () => listFn(), enabled: ready });

  const [invite, setInvite] = useState({ email: "", full_name: "", role: "member" as "admin" | "member" });
  const [msg, setMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);
  const [q, setQ] = useState("");

  const inviteMut = useMutation({
    mutationFn: () => inviteFn({ data: invite }),
    onSuccess: () => {
      setMsg({ type: "ok", text: `Invitation email sent to ${invite.email}.` });
      setInvite({ email: "", full_name: "", role: "member" });
      qc.invalidateQueries({ queryKey: ["admin", "users"] });
    },
    onError: (e: Error) => setMsg({ type: "err", text: e.message }),
  });
  const roleMut = useMutation({
    mutationFn: (v: { user_id: string; role: "admin" | "member"; action: "add" | "remove" }) => roleFn({ data: v }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "users"] }),
  });
  const banMut = useMutation({
    mutationFn: (v: { user_id: string; duration_hours: number }) => banFn({ data: v }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "users"] }),
  });
  const delMut = useMutation({
    mutationFn: (user_id: string) => delFn({ data: { user_id } }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "users"] }),
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

  const filtered = (list.data?.users ?? []).filter((u) => {
    const needle = q.trim().toLowerCase();
    if (!needle) return true;
    return (
      u.email.toLowerCase().includes(needle) ||
      (u.full_name ?? "").toLowerCase().includes(needle) ||
      (u.institute ?? "").toLowerCase().includes(needle)
    );
  });

  return (
    <SiteLayout>
      <section className="mx-auto max-w-6xl px-4 py-12">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-foreground px-3 py-1 text-xs font-semibold text-background">
              <ShieldCheck className="h-3.5 w-3.5" /> Admin only
            </div>
            <h1 className="text-3xl font-bold">Users</h1>
            <p className="mt-1 text-sm text-muted-foreground">Invite, promote, suspend or delete accounts.</p>
          </div>
          <Link to="/admin" className="rounded-lg border border-border px-3 py-1.5 text-xs hover:bg-foreground/5">← Admin home</Link>
        </div>

        <form
          onSubmit={(e) => { e.preventDefault(); setMsg(null); inviteMut.mutate(); }}
          className="mb-6 grid gap-3 rounded-2xl border border-border bg-card p-5 sm:grid-cols-[1fr_1fr_140px_auto]"
        >
          <input required type="email" placeholder="email@example.com" value={invite.email}
            onChange={(e) => setInvite({ ...invite, email: e.target.value })}
            className="rounded-lg border border-input bg-background px-3 py-2 text-sm" />
          <input placeholder="Full name (optional)" value={invite.full_name}
            onChange={(e) => setInvite({ ...invite, full_name: e.target.value })}
            className="rounded-lg border border-input bg-background px-3 py-2 text-sm" />
          <select value={invite.role}
            onChange={(e) => setInvite({ ...invite, role: e.target.value as "admin" | "member" })}
            className="rounded-lg border border-input bg-background px-3 py-2 text-sm">
            <option value="member">Member</option>
            <option value="admin">Admin</option>
          </select>
          <button disabled={inviteMut.isPending || !invite.email}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-50">
            {inviteMut.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <UserPlus className="h-4 w-4" />} Invite
          </button>
        </form>

        {msg && (
          <div className={`mb-4 rounded-lg border px-3 py-2 text-sm ${msg.type === "ok"
            ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-700 dark:text-emerald-200"
            : "border-red-500/40 bg-red-500/10 text-red-700 dark:text-red-200"}`}>{msg.text}</div>
        )}

        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search email, name or institute…"
          className="mb-3 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm" />

        <div className="overflow-x-auto rounded-2xl border border-border bg-card">
          <table className="w-full min-w-[760px] text-sm">
            <thead className="bg-foreground/5 text-left text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="px-3 py-2.5">User</th>
                <th className="px-3 py-2.5">Roles</th>
                <th className="px-3 py-2.5">Joined</th>
                <th className="px-3 py-2.5">Last sign-in</th>
                <th className="px-3 py-2.5">Status</th>
                <th className="px-3 py-2.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {list.isLoading && <tr><td colSpan={6} className="px-3 py-6 text-center text-muted-foreground">Loading…</td></tr>}
              {filtered.map((u) => {
                const banned = u.banned_until && new Date(u.banned_until) > new Date();
                const isAdmin = u.roles.includes("admin");
                return (
                  <tr key={u.id} className="border-t border-border align-top">
                    <td className="px-3 py-2.5">
                      <div className="font-medium text-foreground">{u.full_name ?? u.display_name ?? "—"}</div>
                      <div className="text-xs text-muted-foreground">{u.email}</div>
                      {u.institute && <div className="text-xs text-muted-foreground">{u.institute}</div>}
                    </td>
                    <td className="px-3 py-2.5">
                      <div className="flex flex-wrap gap-1">
                        {u.roles.length ? u.roles.map((r) => (
                          <span key={r} className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase ${r === "admin" ? "bg-amber-500/15 text-amber-600" : "bg-muted text-muted-foreground"}`}>{r}</span>
                        )) : <span className="text-xs text-muted-foreground">none</span>}
                      </div>
                    </td>
                    <td className="px-3 py-2.5 text-xs text-muted-foreground">{new Date(u.created_at).toLocaleDateString()}</td>
                    <td className="px-3 py-2.5 text-xs text-muted-foreground">{u.last_sign_in_at ? new Date(u.last_sign_in_at).toLocaleString() : "—"}</td>
                    <td className="px-3 py-2.5">
                      {banned
                        ? <span className="inline-flex items-center gap-1 rounded-full bg-red-500/15 px-2 py-0.5 text-[11px] font-semibold text-red-600"><Ban className="h-3 w-3" /> Suspended</span>
                        : <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[11px] font-semibold text-emerald-600"><CheckCircle2 className="h-3 w-3" /> Active</span>}
                    </td>
                    <td className="px-3 py-2.5">
                      <div className="flex flex-wrap justify-end gap-1.5">
                        <button onClick={() => roleMut.mutate({ user_id: u.id, role: "admin", action: isAdmin ? "remove" : "add" })}
                          title={isAdmin ? "Demote to member" : "Promote to admin"}
                          className="inline-flex items-center gap-1 rounded-md border border-border px-2 py-1 text-xs hover:bg-foreground/5">
                          {isAdmin ? <ShieldOff className="h-3.5 w-3.5" /> : <Shield className="h-3.5 w-3.5" />}
                          {isAdmin ? "Demote" : "Promote"}
                        </button>
                        <button onClick={() => banMut.mutate({ user_id: u.id, duration_hours: banned ? 0 : 24 * 30 })}
                          className="inline-flex items-center gap-1 rounded-md border border-border px-2 py-1 text-xs hover:bg-foreground/5">
                          <Ban className="h-3.5 w-3.5" /> {banned ? "Unban" : "Ban 30d"}
                        </button>
                        <button onClick={() => { if (confirm(`Delete ${u.email}? This cannot be undone.`)) delMut.mutate(u.id); }}
                          className="inline-flex items-center gap-1 rounded-md border border-red-500/30 px-2 py-1 text-xs text-red-600 hover:bg-red-500/10">
                          <Trash2 className="h-3.5 w-3.5" /> Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {!list.isLoading && filtered.length === 0 && (
                <tr><td colSpan={6} className="px-3 py-6 text-center text-muted-foreground">No users found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </SiteLayout>
  );
}
