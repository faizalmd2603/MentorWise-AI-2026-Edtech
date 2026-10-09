import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { SiteLayout } from "@/components/SiteLayout";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { useAuthReady } from "@/hooks/use-auth-ready";
import { getMyProfile, updateMyProfile } from "@/lib/profile.functions";
import {
  User, Mail, Phone, GraduationCap, Building2, Linkedin, Briefcase,
  Lock, LogIn, UserPlus, Loader2, ShieldCheck, Camera, LogOut, Check,
} from "lucide-react";

const SITE = "https://mentorwiseaiedtechservice.lovable.app";

export const Route = createFileRoute("/account")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "My Account — MentorWise AI" },
      { name: "description", content: "Manage your MentorWise AI account, update your profile, change your password, and switch between student and working professional." },
      { property: "og:title", content: "My Account — MentorWise AI" },
      { property: "og:description", content: "Sign in, sign up, and manage your MentorWise AI profile." },
    ],
    links: [{ rel: "canonical", href: `${SITE}/account` }],
  }),
  component: AccountPage,
});

function AccountPage() {
  const auth = useAuthReady();
  if (!auth.isReady) {
    return (
      <SiteLayout>
        <div className="mx-auto flex min-h-[60vh] max-w-md items-center justify-center px-4">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      </SiteLayout>
    );
  }
  return (
    <SiteLayout>
      <section className="mx-auto max-w-5xl px-4 py-14 sm:px-6">
        {auth.user ? <ProfileHub /> : <AuthPanel />}
      </section>
    </SiteLayout>
  );
}

/* ------------------------- Signed-out: Auth panel ------------------------- */

function AuthPanel() {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true); setError(null); setInfo(null);
    try {
      if (mode === "signin") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      } else {
        const { data, error } = await supabase.auth.signUp({
          email, password,
          options: { data: { full_name: fullName }, emailRedirectTo: `${window.location.origin}/auth/confirm` },
        });
        if (error) {
          if (/already regist|already exists|User already/i.test(error.message)) {
            await supabase.auth.resend({
              type: "signup",
              email,
              options: { emailRedirectTo: `${window.location.origin}/auth/confirm` },
            });
            setInfo("This email is already registered. We sent a fresh verification link — open it on this device, then sign in.");
            setMode("signin");
            return;
          }
          throw error;
        }
        if (data.session) { setInfo("Account created."); return; }
        setInfo("Check your email to confirm your account, then sign in.");
      }
    } catch (e: any) {
      setError(e?.message ?? "Something went wrong");
    } finally { setLoading(false); }
  }

  async function google() {
    setError(null);
    try {
      const result = await lovable.auth.signInWithOAuth("google", {
        redirect_uri: window.location.origin,
      });
      if (result.error) throw result.error;
    } catch (e: any) { setError(e?.message ?? "Google sign-in failed"); }
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_1.1fr]">
      <div className="animate-fade-up">
        <div className="pill"><ShieldCheck className="h-3.5 w-3.5" /> Secure account access</div>
        <h1 className="mt-4 font-display text-4xl font-bold tracking-tight sm:text-5xl">
          Your MentorWise <span className="text-gradient">Account</span>
        </h1>
        <p className="mt-3 max-w-md text-muted-foreground">
          Sign in to unlock the 12-agent AI Studio, personal announcements, saved resumes and live events. New here? Create a free account in seconds.
        </p>
        <ul className="mt-8 space-y-3 text-sm text-muted-foreground">
          {["Free forever — no credit card", "Access all 12 AI agents", "Live events & mentor calls", "Your data, encrypted"].map((t) => (
            <li key={t} className="flex items-center gap-2"><Check className="h-4 w-4 text-primary" /> {t}</li>
          ))}
        </ul>
      </div>

      <div className="rounded-3xl border border-border bg-card/70 p-6 shadow-xl backdrop-blur animate-scale-in sm:p-8">
        <div className="mb-6 flex rounded-full bg-secondary p-1">
          <button
            onClick={() => setMode("signin")}
            className={`flex-1 rounded-full px-4 py-2 text-sm font-semibold transition ${mode === "signin" ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground"}`}
          >
            <LogIn className="mr-1.5 inline h-4 w-4" /> Sign in
          </button>
          <button
            onClick={() => setMode("signup")}
            className={`flex-1 rounded-full px-4 py-2 text-sm font-semibold transition ${mode === "signup" ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground"}`}
          >
            <UserPlus className="mr-1.5 inline h-4 w-4" /> Sign up
          </button>
        </div>

        <form onSubmit={submit} className="space-y-3">
          {mode === "signup" && (
            <Field icon={<User className="h-4 w-4" />} label="Full name" value={fullName} onChange={setFullName} required />
          )}
          <Field icon={<Mail className="h-4 w-4" />} label="Email" type="email" value={email} onChange={setEmail} required />
          <Field icon={<Lock className="h-4 w-4" />} label="Password" type="password" value={password} onChange={setPassword} required minLength={8} />
          {error && <p className="text-sm text-destructive">{error}</p>}
          {info && <p className="text-sm text-primary">{info}</p>}
          <button
            disabled={loading}
            className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-sm transition hover:brightness-110 disabled:opacity-60"
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            {mode === "signin" ? "Sign in" : "Create account"}
          </button>
        </form>

        <div className="my-4 flex items-center gap-3 text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
          <div className="h-px flex-1 bg-border" /> or <div className="h-px flex-1 bg-border" />
        </div>

        <button onClick={google} className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-border bg-card px-5 py-2.5 text-sm font-semibold text-foreground transition hover:bg-secondary">
          <svg viewBox="0 0 24 24" className="h-4 w-4"><path fill="#EA4335" d="M12 10.2v3.9h5.5c-.24 1.26-1.63 3.7-5.5 3.7-3.31 0-6-2.74-6-6.1s2.69-6.1 6-6.1c1.88 0 3.14.8 3.86 1.49l2.63-2.53C16.87 2.86 14.63 2 12 2 6.98 2 3 6.02 3 11s3.98 9 9 9c5.19 0 8.62-3.65 8.62-8.79 0-.59-.06-1.04-.14-1.51z"/></svg>
          Continue with Google
        </button>

        <p className="mt-4 text-center text-[11px] text-muted-foreground">
          By continuing you agree to our <Link to="/about" className="underline">terms</Link>.
        </p>
      </div>
    </div>
  );
}

/* --------------------------- Signed-in: Profile --------------------------- */

function ProfileHub() {
  const navigate = useNavigate();
  const auth = useAuthReady();
  const getProfile = useServerFn(getMyProfile);
  const updateProfile = useServerFn(updateMyProfile);

  const q = useQuery({
    queryKey: ["my-profile", auth.user?.id],
    queryFn: async () => await getProfile(),
    enabled: !!auth.user,
    staleTime: 30_000,
  });

  const [form, setForm] = useState<any>(null);
  useEffect(() => { if (q.data && !form) setForm(q.data); }, [q.data]); // eslint-disable-line

  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [savedErr, setSavedErr] = useState<string | null>(null);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true); setSaved(false); setSavedErr(null);
    try {
      await updateProfile({
        data: {
          full_name: form.full_name ?? null,
          phone: form.phone ?? null,
          avatar_url: form.avatar_url ?? null,
          institute: form.institute ?? null,
          degree: form.degree ?? null,
          year_of_study: form.year_of_study ?? null,
          designation: form.designation ?? null,
          linkedin_url: form.linkedin_url ?? null,
          account_type: form.account_type ?? "student",
        },
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2200);
    } catch (e: any) { setSavedErr(e?.message ?? "Save failed"); }
    finally { setSaving(false); }
  }

  async function signOut() {
    await supabase.auth.signOut();
    navigate({ to: "/", replace: true });
  }

  if (q.isLoading || !form) {
    return <div className="flex justify-center py-24"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>;
  }

  const isPro = form.account_type === "professional";

  return (
    <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
      {/* Sidebar */}
      <aside className="space-y-4">
        <div className="rounded-3xl border border-border bg-card p-6 text-center animate-fade-up">
          <div className="relative mx-auto h-24 w-24 overflow-hidden rounded-full ring-4 ring-primary/20">
            {form.avatar_url ? (
              <img src={form.avatar_url} alt="Avatar" className="h-full w-full object-cover" />
            ) : (
              <div className="grid h-full w-full place-items-center bg-secondary text-2xl font-bold text-primary">
                {(form.full_name || form.email || "U").slice(0, 1).toUpperCase()}
              </div>
            )}
          </div>
          <div className="mt-3 font-display text-lg font-semibold">{form.full_name || "Add your name"}</div>
          <div className="text-xs text-muted-foreground">{form.email}</div>
          {auth.isAdmin && (
            <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-amber-500/15 px-2.5 py-1 text-[11px] font-semibold text-amber-700 dark:text-amber-300">
              <ShieldCheck className="h-3 w-3" /> Admin
            </div>
          )}
        </div>

        <div className="rounded-3xl border border-border bg-card p-2">
          <Link to="/feed" className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium hover:bg-secondary">
            Announcements
          </Link>
          <Link to="/agents" className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium hover:bg-secondary">
            AI Studio
          </Link>
          <Link to="/events" className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium hover:bg-secondary">
            Live Events
          </Link>
          <button onClick={signOut} className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-destructive hover:bg-destructive/10">
            <LogOut className="h-4 w-4" /> Sign out
          </button>
        </div>
      </aside>

      {/* Main */}
      <form onSubmit={save} className="space-y-6">
        {/* Type toggle */}
        <div className="rounded-3xl border border-border bg-card p-6 animate-fade-up">
          <div className="text-xs uppercase tracking-[0.28em] text-muted-foreground">I am a</div>
          <div className="mt-3 grid grid-cols-2 gap-3">
            {(["student", "professional"] as const).map((v) => (
              <button
                type="button"
                key={v}
                onClick={() => setForm({ ...form, account_type: v })}
                className={`rounded-2xl border-2 p-4 text-left transition ${form.account_type === v ? "border-primary bg-primary/5" : "border-border hover:border-primary/40"}`}
              >
                <div className="font-display text-base font-semibold capitalize">{v === "student" ? "Student" : "Working Professional"}</div>
                <div className="mt-1 text-xs text-muted-foreground">
                  {v === "student" ? "Studying at a college / institute" : "Currently employed or freelancing"}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Profile fields */}
        <div className="rounded-3xl border border-border bg-card p-6 animate-fade-up [animation-delay:80ms] sm:p-8">
          <h2 className="font-display text-2xl font-semibold">Personal details</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <Field icon={<User className="h-4 w-4" />} label="Full name" value={form.full_name ?? ""} onChange={(v) => setForm({ ...form, full_name: v })} required />
            <Field icon={<Mail className="h-4 w-4" />} label="Email" value={form.email ?? ""} onChange={() => {}} disabled />
            <Field icon={<Phone className="h-4 w-4" />} label="Phone number" value={form.phone ?? ""} onChange={(v) => setForm({ ...form, phone: v })} />
            <Field icon={<Camera className="h-4 w-4" />} label="Profile image URL" placeholder="https://…" value={form.avatar_url ?? ""} onChange={(v) => setForm({ ...form, avatar_url: v })} />
          </div>
        </div>

        {isPro ? (
          <div className="rounded-3xl border border-border bg-card p-6 animate-fade-up [animation-delay:120ms] sm:p-8">
            <h2 className="font-display text-2xl font-semibold">Work</h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <Field icon={<Building2 className="h-4 w-4" />} label="Organization" value={form.institute ?? ""} onChange={(v) => setForm({ ...form, institute: v })} />
              <Field icon={<Briefcase className="h-4 w-4" />} label="Designation" value={form.designation ?? ""} onChange={(v) => setForm({ ...form, designation: v })} />
            </div>
          </div>
        ) : (
          <div className="rounded-3xl border border-border bg-card p-6 animate-fade-up [animation-delay:120ms] sm:p-8">
            <h2 className="font-display text-2xl font-semibold">Education</h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <Field icon={<Building2 className="h-4 w-4" />} label="Institute" value={form.institute ?? ""} onChange={(v) => setForm({ ...form, institute: v })} />
              <Field icon={<GraduationCap className="h-4 w-4" />} label="Degree" value={form.degree ?? ""} onChange={(v) => setForm({ ...form, degree: v })} />
              <Field icon={<GraduationCap className="h-4 w-4" />} label="Year of study (optional)" value={form.year_of_study ?? ""} onChange={(v) => setForm({ ...form, year_of_study: v })} />
            </div>
          </div>
        )}

        <div className="rounded-3xl border border-border bg-card p-6 animate-fade-up [animation-delay:160ms] sm:p-8">
          <h2 className="font-display text-2xl font-semibold">Social</h2>
          <div className="mt-5">
            <Field icon={<Linkedin className="h-4 w-4" />} label="LinkedIn profile URL (optional)" placeholder="https://linkedin.com/in/…" value={form.linkedin_url ?? ""} onChange={(v) => setForm({ ...form, linkedin_url: v })} />
          </div>
        </div>

        <div className="sticky bottom-4 flex items-center justify-between gap-3 rounded-full border border-border bg-card/95 px-4 py-3 shadow-lg backdrop-blur">
          <div className="text-xs text-muted-foreground">
            {saved && <span className="text-primary">✓ Saved</span>}
            {savedErr && <span className="text-destructive">{savedErr}</span>}
          </div>
          <button disabled={saving} className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-2 text-sm font-semibold text-primary-foreground shadow-sm transition hover:brightness-110 disabled:opacity-60">
            {saving && <Loader2 className="h-4 w-4 animate-spin" />} Save changes
          </button>
        </div>

        <PasswordCard />
      </form>
    </div>
  );
}

function PasswordCard() {
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  async function change(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
    if (next.length < 8) { setMsg({ ok: false, text: "Password must be at least 8 characters" }); return; }
    if (next !== confirm) { setMsg({ ok: false, text: "Passwords do not match" }); return; }
    setLoading(true);
    try {
      const { data: u } = await supabase.auth.getUser();
      if (!u.user?.email) throw new Error("No email on account");
      // Re-verify current password
      const { error: reErr } = await supabase.auth.signInWithPassword({ email: u.user.email, password: current });
      if (reErr) throw new Error("Current password is incorrect");
      const { error } = await supabase.auth.updateUser({ password: next });
      if (error) throw error;
      setMsg({ ok: true, text: "Password updated" });
      setCurrent(""); setNext(""); setConfirm("");
    } catch (e: any) { setMsg({ ok: false, text: e?.message ?? "Could not update password" }); }
    finally { setLoading(false); }
  }

  return (
    <form onSubmit={change} className="rounded-3xl border border-border bg-card p-6 animate-fade-up [animation-delay:200ms] sm:p-8">
      <h2 className="font-display text-2xl font-semibold">Change password</h2>
      <div className="mt-5 grid gap-4 sm:grid-cols-3">
        <Field icon={<Lock className="h-4 w-4" />} label="Current password" type="password" value={current} onChange={setCurrent} />
        <Field icon={<Lock className="h-4 w-4" />} label="New password" type="password" value={next} onChange={setNext} minLength={8} />
        <Field icon={<Lock className="h-4 w-4" />} label="Confirm new password" type="password" value={confirm} onChange={setConfirm} minLength={8} />
      </div>
      {msg && <p className={`mt-3 text-sm ${msg.ok ? "text-primary" : "text-destructive"}`}>{msg.text}</p>}
      <button disabled={loading} className="mt-5 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition hover:brightness-110 disabled:opacity-60">
        {loading && <Loader2 className="h-4 w-4 animate-spin" />} Update password
      </button>
    </form>
  );
}

/* ------------------------------- Field UI ------------------------------- */

function Field({
  icon, label, value, onChange, type = "text", required, disabled, placeholder, minLength,
}: {
  icon?: React.ReactNode;
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
  disabled?: boolean;
  placeholder?: string;
  minLength?: number;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {icon} {label}
      </span>
      <input
        type={type}
        value={value}
        required={required}
        disabled={disabled}
        placeholder={placeholder}
        minLength={minLength}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-2xl border border-border bg-background px-4 py-2.5 text-sm text-foreground shadow-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:opacity-60"
      />
    </label>
  );
}
