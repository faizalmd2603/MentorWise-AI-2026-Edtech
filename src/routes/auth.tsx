import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
import { SiteLayout } from "@/components/SiteLayout";
import { supabase } from "@/integrations/supabase/client";
import { requestEmailOtp, verifyEmailOtp } from "@/lib/auth-otp.functions";
import { useAuthReady } from "@/hooks/use-auth-ready";
import { Mail, ShieldCheck, Loader2, Lock, UserPlus, LogIn } from "lucide-react";

const SITE = "https://mentorwiseaiedtechservice.lovable.app";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign in or Sign up — MentorWise AI" },
      {
        name: "description",
        content:
          "Create your MentorWise AI account or sign in with email and password. New members register with full name, age, contact, email, and institute.",
      },
      { property: "og:title", content: "Sign in or Sign up — MentorWise AI" },
      { property: "og:description", content: "Email + password login and registration for MentorWise AI members." },
    ],
    links: [{ rel: "canonical", href: `${SITE}/auth` }],
  }),
  component: AuthPage,
});

type Mode = "signin" | "signup" | "otp";

function AuthPage() {
  const navigate = useNavigate();
  const requestOtp = useServerFn(requestEmailOtp);
  const verifyOtp = useServerFn(verifyEmailOtp);
  const auth = useAuthReady();

  const [mode, setMode] = useState<Mode>("signin");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  // shared
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // signup
  const [fullName, setFullName] = useState("");
  const [age, setAge] = useState("");
  const [contact, setContact] = useState("");
  const [institute, setInstitute] = useState("");
  const [confirmPw, setConfirmPw] = useState("");

  // otp fallback
  const [otpStep, setOtpStep] = useState<"email" | "code">("email");
  const [otp, setOtp] = useState("");

  useEffect(() => {
    if (auth.isReady && auth.user) navigate({ to: "/account", replace: true });
  }, [auth.isReady, auth.user, navigate]);

  function reset() {
    setError(null);
    setInfo(null);
  }

  async function onSignIn(e: React.FormEvent) {
    e.preventDefault();
    reset();
    setLoading(true);
    try {
      const { error: err } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      });
      if (err) throw new Error(err.message);
      navigate({ to: "/account" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not sign in.");
    } finally {
      setLoading(false);
    }
  }

  async function onSignUp(e: React.FormEvent) {
    e.preventDefault();
    reset();
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirmPw) {
      setError("Passwords do not match.");
      return;
    }
    const ageNum = parseInt(age, 10);
    if (!Number.isFinite(ageNum) || ageNum < 5 || ageNum > 120) {
      setError("Please enter a valid age.");
      return;
    }
    setLoading(true);
    try {
      const cleanEmail = email.trim().toLowerCase();
      const { data, error: err } = await supabase.auth.signUp({
        email: cleanEmail,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/confirm`,
          data: {
            full_name: fullName.trim(),
            display_name: fullName.trim(),
            age: String(ageNum),
            contact_number: contact.trim(),
            institute: institute.trim(),
          },
        },
      });
      if (err) {
        if (/already regist|already exists|User already/i.test(err.message)) {
          await supabase.auth.resend({
            type: "signup",
            email: cleanEmail,
            options: { emailRedirectTo: `${window.location.origin}/auth/confirm` },
          });
          setInfo(
            "This email is already registered. We sent a fresh verification link — open it on this device. Already verified? Just sign in below, or use the 6-digit code option.",
          );
          setMode("signin");
          return;
        }
        throw new Error(err.message);
      }
      if (data.session) {
        navigate({ to: "/account" });
      } else {
        setInfo("Account created. Open the verification link we emailed you on this device, then sign in.");
        setMode("signin");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not sign up.");
    } finally {
      setLoading(false);
    }
  }

  async function onOtpRequest(e: React.FormEvent) {
    e.preventDefault();
    reset();
    setLoading(true);
    try {
      await requestOtp({ data: { email: email.trim().toLowerCase() } });
      setOtpStep("code");
      setInfo("We emailed you a 6-digit code. It expires in 10 minutes.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not send code.");
    } finally {
      setLoading(false);
    }
  }

  async function onOtpVerify(e: React.FormEvent) {
    e.preventDefault();
    reset();
    setLoading(true);
    try {
      const res = await verifyOtp({
        data: { email: email.trim().toLowerCase(), otp: otp.trim() },
      });
      const { error: vErr } = await supabase.auth.verifyOtp({
        email: res.email,
        token_hash: res.token_hash,
        type: "magiclink",
      });
      if (vErr) throw new Error(vErr.message);
      navigate({ to: "/account" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not verify code.");
    } finally {
      setLoading(false);
    }
  }

  const inputCls =
    "w-full rounded-lg border border-input bg-background px-3 py-2.5 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-foreground/30";
  const btnCls =
    "inline-flex w-full items-center justify-center gap-2 rounded-lg bg-foreground px-4 py-2.5 text-sm font-semibold text-background transition disabled:opacity-50";

  return (
    <SiteLayout>
      <section className="mx-auto max-w-md px-4 py-12 sm:py-20">
        <div className="rounded-2xl border border-border bg-card p-7 shadow-xl">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-foreground text-background">
              {mode === "signup" ? <UserPlus className="h-5 w-5" /> : mode === "otp" ? <ShieldCheck className="h-5 w-5" /> : <LogIn className="h-5 w-5" />}
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">
                {mode === "signup" ? "Create your account" : mode === "otp" ? "Sign in with a code" : "Sign in to MentorWise AI"}
              </h1>
              <p className="text-sm text-muted-foreground">
                {mode === "signup"
                  ? "Fill in your details to register as a member."
                  : mode === "otp"
                  ? "We'll email a 6-digit code instead of a password."
                  : "Use your email and password."}
              </p>
            </div>
          </div>

          {mode !== "otp" && (
            <div className="mb-5 grid grid-cols-2 rounded-lg border border-border p-1 text-sm">
              <button
                type="button"
                onClick={() => { setMode("signin"); reset(); }}
                className={`rounded-md px-3 py-1.5 font-medium transition ${mode === "signin" ? "bg-foreground text-background" : "text-muted-foreground"}`}
              >
                Sign in
              </button>
              <button
                type="button"
                onClick={() => { setMode("signup"); reset(); }}
                className={`rounded-md px-3 py-1.5 font-medium transition ${mode === "signup" ? "bg-foreground text-background" : "text-muted-foreground"}`}
              >
                Sign up
              </button>
            </div>
          )}

          {error && (
            <div className="mb-4 rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-200">
              {error}
            </div>
          )}
          {info && (
            <div className="mb-4 rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-200">
              {info}
            </div>
          )}

          {mode === "signin" && (
            <form onSubmit={onSignIn} className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-foreground">Email</label>
                <input type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputCls} placeholder="you@example.com" />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-foreground">Password</label>
                <input type="password" required autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} className={inputCls} placeholder="Your password" />
              </div>
              <button type="submit" disabled={loading || !email || !password} className={btnCls}>
                {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                <Lock className="h-4 w-4" /> Sign in
              </button>
              <div className="flex items-center justify-between pt-1 text-xs">
                <button type="button" onClick={() => { setMode("otp"); setOtpStep("email"); reset(); }} className="text-muted-foreground underline-offset-4 hover:underline">
                  <Mail className="mr-1 inline h-3 w-3" /> Use email code instead
                </button>
                <button type="button" onClick={() => { setMode("signup"); reset(); }} className="text-muted-foreground underline-offset-4 hover:underline">
                  New here? Sign up
                </button>
              </div>
            </form>
          )}

          {mode === "signup" && (
            <form onSubmit={onSignUp} className="space-y-3">
              <div>
                <label className="mb-1 block text-sm font-medium text-foreground">Full name</label>
                <input required value={fullName} onChange={(e) => setFullName(e.target.value)} className={inputCls} placeholder="Jane Doe" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-sm font-medium text-foreground">Age</label>
                  <input required type="number" min={5} max={120} value={age} onChange={(e) => setAge(e.target.value)} className={inputCls} placeholder="18" />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-foreground">Contact number</label>
                  <input required type="tel" value={contact} onChange={(e) => setContact(e.target.value)} className={inputCls} placeholder="+1 555 0100" />
                </div>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-foreground">Email</label>
                <input required type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputCls} placeholder="you@example.com" />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-foreground">Institute</label>
                <input required value={institute} onChange={(e) => setInstitute(e.target.value)} className={inputCls} placeholder="School / College / Company" />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-foreground">Create password</label>
                <input required type="password" autoComplete="new-password" minLength={8} value={password} onChange={(e) => setPassword(e.target.value)} className={inputCls} placeholder="At least 8 characters" />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-foreground">Confirm password</label>
                <input required type="password" autoComplete="new-password" minLength={8} value={confirmPw} onChange={(e) => setConfirmPw(e.target.value)} className={inputCls} placeholder="Re-enter password" />
              </div>
              <button type="submit" disabled={loading} className={btnCls}>
                {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                <UserPlus className="h-4 w-4" /> Create account
              </button>
              <p className="pt-1 text-xs text-muted-foreground">
                By signing up you agree to receive announcement emails from the MentorWise AI team.
              </p>
            </form>
          )}

          {mode === "otp" && otpStep === "email" && (
            <form onSubmit={onOtpRequest} className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-foreground">Email</label>
                <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className={inputCls} placeholder="you@example.com" />
              </div>
              <button type="submit" disabled={loading || !email} className={btnCls}>
                {loading && <Loader2 className="h-4 w-4 animate-spin" />} Send code
              </button>
              <button type="button" onClick={() => { setMode("signin"); reset(); }} className="w-full text-xs text-muted-foreground underline-offset-4 hover:underline">
                Back to password sign in
              </button>
            </form>
          )}

          {mode === "otp" && otpStep === "code" && (
            <form onSubmit={onOtpVerify} className="space-y-4">
              <label className="block text-sm font-medium text-foreground">6-digit code</label>
              <input
                type="text"
                inputMode="numeric"
                pattern="\d{6}"
                maxLength={6}
                required
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                placeholder="123456"
                className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-center text-2xl font-mono tracking-[0.6em] text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-foreground/30"
              />
              <button type="submit" disabled={loading || otp.length !== 6} className={btnCls}>
                {loading && <Loader2 className="h-4 w-4 animate-spin" />} Verify and sign in
              </button>
              <button type="button" onClick={() => { setOtpStep("email"); setOtp(""); reset(); }} className="w-full text-xs text-muted-foreground underline-offset-4 hover:underline">
                Use a different email
              </button>
            </form>
          )}
        </div>
      </section>
    </SiteLayout>
  );
}
