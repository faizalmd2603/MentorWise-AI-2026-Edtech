import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { SiteLayout } from "@/components/SiteLayout";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, CheckCircle2, AlertTriangle } from "lucide-react";
import type { EmailOtpType } from "@supabase/supabase-js";

const SITE = "https://mentorwiseaiedtechservice.lovable.app";

export const Route = createFileRoute("/auth/confirm")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Confirming your email — MentorWise AI" },
      { name: "description", content: "Finishing email verification for your MentorWise AI account." },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Confirming your email — MentorWise AI" },
      { property: "og:description", content: "Finishing email verification for your MentorWise AI account." },
    ],
    links: [{ rel: "canonical", href: `${SITE}/auth/confirm` }],
  }),
  component: ConfirmPage,
});

function ConfirmPage() {
  const navigate = useNavigate();
  const [state, setState] = useState<"working" | "done" | "error">("working");
  const [message, setMessage] = useState("Verifying your email…");

  useEffect(() => {
    let cancelled = false;

    async function run() {
      const url = new URL(window.location.href);
      const params = url.searchParams;
      const hash = new URLSearchParams(url.hash.replace(/^#/, ""));

      const errDesc = params.get("error_description") ?? hash.get("error_description");
      const tokenHash = params.get("token_hash") ?? hash.get("token_hash");
      const type = (params.get("type") ?? hash.get("type")) as EmailOtpType | null;
      const code = params.get("code");
      const accessToken = hash.get("access_token");
      const refreshToken = hash.get("refresh_token");

      try {
        if (errDesc) throw new Error(errDesc);

        if (tokenHash && type) {
          // Works on any device/browser — no PKCE verifier needed.
          const { error } = await supabase.auth.verifyOtp({ token_hash: tokenHash, type });
          if (error) throw error;
        } else if (accessToken && refreshToken) {
          const { error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });
          if (error) throw error;
        } else if (code) {
          const { error } = await supabase.auth.exchangeCodeForSession(code);
          if (error) throw error;
        } else {
          const { data } = await supabase.auth.getSession();
          if (!data.session) throw new Error("This confirmation link is missing its verification token.");
        }

        const { data: userData } = await supabase.auth.getUser();
        if (cancelled) return;
        if (!userData.user) throw new Error("Verification succeeded but no session was created. Please sign in.");

        setState("done");
        setMessage("Email verified. Taking you to your account…");
        setTimeout(() => navigate({ to: "/account", replace: true }), 900);
      } catch (e) {
        if (cancelled) return;
        setState("error");
        setMessage(
          e instanceof Error && e.message
            ? e.message
            : "We could not verify this link. It may have expired or already been used.",
        );
      }
    }

    void run();
    return () => {
      cancelled = true;
    };
  }, [navigate]);

  return (
    <SiteLayout>
      <section className="mx-auto max-w-md px-4 py-20">
        <div className="rounded-2xl border border-border bg-card p-8 text-center shadow-xl">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-foreground text-background">
            {state === "working" ? (
              <Loader2 className="h-6 w-6 animate-spin" />
            ) : state === "done" ? (
              <CheckCircle2 className="h-6 w-6" />
            ) : (
              <AlertTriangle className="h-6 w-6" />
            )}
          </div>
          <h1 className="text-xl font-bold text-foreground">
            {state === "error" ? "Verification problem" : "Email verification"}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">{message}</p>
          {state === "error" && (
            <button
              type="button"
              onClick={() => navigate({ to: "/auth" })}
              className="mt-6 inline-flex items-center justify-center rounded-lg bg-foreground px-4 py-2.5 text-sm font-semibold text-background"
            >
              Go to sign in
            </button>
          )}
        </div>
      </section>
    </SiteLayout>
  );
}
