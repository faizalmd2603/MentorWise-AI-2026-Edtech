import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { SiteLayout } from "@/components/SiteLayout";
import { supabase } from "@/integrations/supabase/client";
import { requestEmailOtp, verifyEmailOtp } from "@/lib/auth-otp.functions";
import { Mail, ShieldCheck, Loader2 } from "lucide-react";

const SITE = "https://mentorwiseaiedtechservice.lovable.app";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign in — MentorWise AI" },
      {
        name: "description",
        content:
          "Sign in or sign up for MentorWise AI with your email. A 6-digit one-time code is sent to your inbox — no passwords needed.",
      },
      { property: "og:title", content: "Sign in — MentorWise AI" },
      { property: "og:description", content: "Email OTP login for MentorWise AI members." },
    ],
    links: [{ rel: "canonical", href: `${SITE}/auth` }],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const requestOtp = useServerFn(requestEmailOtp);
  const verifyOtp = useServerFn(verifyEmailOtp);

  const [step, setStep] = useState<"email" | "otp">("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  async function onRequest(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setInfo(null);
    setLoading(true);
    try {
      await requestOtp({ data: { email: email.trim().toLowerCase() } });
      setStep("otp");
      setInfo("We emailed you a 6-digit code. It expires in 10 minutes.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not send code.");
    } finally {
      setLoading(false);
    }
  }

  async function onVerify(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
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
      navigate({ to: "/feed" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not verify code.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <SiteLayout>
      <section className="mx-auto max-w-md px-4 py-16 sm:py-24">
        <div className="rounded-2xl border border-border bg-card p-7 shadow-xl">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-foreground text-background">
              {step === "email" ? <Mail className="h-5 w-5" /> : <ShieldCheck className="h-5 w-5" />}
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">
                {step === "email" ? "Sign in to MentorWise AI" : "Enter your 6-digit code"}
              </h1>
              <p className="text-sm text-muted-foreground">
                {step === "email"
                  ? "We'll email a one-time code to verify it's you."
                  : `Code sent to ${email}`}
              </p>
            </div>
          </div>

          {error && (
            <div className="mb-4 rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-200">
              {error}
            </div>
          )}
          {info && step === "otp" && (
            <div className="mb-4 rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-200">
              {info}
            </div>
          )}

          {step === "email" ? (
            <form onSubmit={onRequest} className="space-y-4">
              <label className="block text-sm font-medium text-foreground">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                autoComplete="email"
                className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-foreground/30"
              />
              <button
                type="submit"
                disabled={loading || !email}
                className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-foreground px-4 py-2.5 text-sm font-semibold text-background transition disabled:opacity-50"
              >
                {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                Send code
              </button>
              <p className="pt-1 text-xs text-muted-foreground">
                New here? Just enter your email — your account is created the first time you sign in.
              </p>
            </form>
          ) : (
            <form onSubmit={onVerify} className="space-y-4">
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
              <button
                type="submit"
                disabled={loading || otp.length !== 6}
                className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-foreground px-4 py-2.5 text-sm font-semibold text-background transition disabled:opacity-50"
              >
                {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                Verify and sign in
              </button>
              <button
                type="button"
                onClick={() => {
                  setStep("email");
                  setOtp("");
                  setError(null);
                }}
                className="w-full text-xs text-muted-foreground underline-offset-4 hover:underline"
              >
                Use a different email
              </button>
            </form>
          )}
        </div>
      </section>
    </SiteLayout>
  );
}
