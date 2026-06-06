import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { SiteLayout } from "@/components/SiteLayout";
import { submitContactForm } from "@/lib/contact.functions";
import { useState } from "react";
import { Mail, MessageCircle, Linkedin, Loader2, CheckCircle2 } from "lucide-react";

const SITE = "https://mentorwiseaiedtechservice.lovable.app";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact MentorWise AI" },
      { name: "description", content: "Reach the MentorWise AI team in Chennai — instant AI acknowledgement plus personal follow-up from the founders." },
      { property: "og:title", content: "Contact MentorWise AI" },
      { property: "og:description", content: "Reach the MentorWise AI team in Chennai — instant AI acknowledgement plus personal follow-up from the founders." },
      { property: "og:url", content: `${SITE}/contact` },
    ],
    links: [{ rel: "canonical", href: `${SITE}/contact` }],
  }),
  component: Contact,
});

function Contact() {
  const submit = useServerFn(submitContactForm);
  const [form, setForm] = useState({ fullName: "", email: "", occupation: "", query: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [aiResolved, setAiResolved] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg(null);
    setStatus("loading");
    try {
      const res = await submit({ data: form });
      setAiResolved(res.aiResolved);
      setStatus("success");
      setForm({ fullName: "", email: "", occupation: "", query: "" });
    } catch (e) {
      console.error(e);
      const msg = e instanceof Error ? e.message : "Something went wrong. Please try again.";
      setErrorMsg(msg);
      setStatus("error");
    }
  }

  return (
    <SiteLayout>
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="text-center max-w-2xl mx-auto animate-fade-up">
          <div className="inline-flex items-center gap-2 rounded-full glass px-3 py-1.5 text-xs text-cyber">Get in touch</div>
          <h1 className="mt-4 font-display text-4xl font-bold sm:text-5xl">
            Let's build your <span className="text-gradient">career arsenal</span>.
          </h1>
          <p className="mt-3 text-muted-foreground">
            Send us your query — MentorWise AI will acknowledge instantly via email and our founders will personally follow up.
          </p>
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-[1fr_1fr]">
          <form onSubmit={handleSubmit} className="rounded-3xl glass-strong p-6 sm:p-8 space-y-4 animate-fade-up">
            {status === "success" ? (
              <div className="flex flex-col items-center text-center py-8">
                <div className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-cyber/15 text-cyber ring-1 ring-cyber/40 glow-cyan">
                  <CheckCircle2 className="h-7 w-7" />
                </div>
                <h2 className="mt-4 font-display text-2xl font-bold">Query received</h2>
                <p className="mt-2 text-sm text-muted-foreground max-w-md">
                  {aiResolved
                    ? "MentorWise AI has emailed you an immediate response along with our founders' direct contact details. Check your inbox."
                    : "MentorWise AI has emailed you an acknowledgement with our founders' direct contact details. We'll follow up personally very soon."}
                </p>
                <button onClick={() => setStatus("idle")} className="mt-6 rounded-full glass px-5 py-2.5 text-sm font-semibold hover:glow-cyan transition">Send another query</button>
              </div>
            ) : (
              <>
                <div>
                  <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Full name</label>
                  <input
                    required
                    maxLength={120}
                    value={form.fullName}
                    onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                    className="mt-1.5 w-full rounded-xl bg-input px-3.5 py-2.5 text-sm outline-none ring-1 ring-border focus:ring-cyber"
                    placeholder="Your full name"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Email address</label>
                  <input
                    required
                    type="email"
                    maxLength={254}
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="mt-1.5 w-full rounded-xl bg-input px-3.5 py-2.5 text-sm outline-none ring-1 ring-border focus:ring-cyber"
                    placeholder="you@example.com"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Occupation</label>
                  <input
                    required
                    maxLength={120}
                    value={form.occupation}
                    onChange={(e) => setForm({ ...form, occupation: e.target.value })}
                    className="mt-1.5 w-full rounded-xl bg-input px-3.5 py-2.5 text-sm outline-none ring-1 ring-border focus:ring-cyber"
                    placeholder="Student · B.Com · College name"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Your query</label>
                  <textarea
                    required
                    minLength={5}
                    value={form.query}
                    onChange={(e) => setForm({ ...form, query: e.target.value })}
                    rows={6}
                    className="mt-1.5 w-full resize-y rounded-xl bg-input px-3.5 py-2.5 text-sm outline-none ring-1 ring-border focus:ring-cyber"
                    placeholder="Write anything — questions, partnership ideas, internship help, feedback…"
                  />
                </div>
                {errorMsg && <div className="text-sm text-destructive">{errorMsg}</div>}
                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-cyber px-5 py-3 text-sm font-semibold text-primary-foreground disabled:opacity-60 hover:brightness-110 transition glow-cyan"
                >
                  {status === "loading" ? <><Loader2 className="h-4 w-4 animate-spin" /> Sending…</> : "Send query"}
                </button>
                <p className="text-[11px] text-muted-foreground text-center">
                  You'll get an instant acknowledgement email from MentorWise AI at the address you enter above.
                </p>
              </>
            )}
          </form>

          <aside className="space-y-4 animate-fade-up [animation-delay:120ms]">
            <div className="rounded-3xl glass-strong p-6 sm:p-8">
              <h3 className="font-display text-xl font-bold">Direct lines</h3>
              <p className="mt-2 text-sm text-muted-foreground">Skip the queue — talk to us instantly.</p>
              <div className="mt-5 grid gap-3">
                <a href="mailto:mentorwiseaiedtech@gmail.com" className="flex items-center gap-3 rounded-xl glass px-4 py-3 text-sm hover:glow-cyan transition">
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-cyber/15 text-cyber"><Mail className="h-4 w-4" /></span>
                  <span><span className="block font-semibold">Email us</span><span className="text-xs text-muted-foreground">mentorwiseaiedtech@gmail.com</span></span>
                </a>
                <a href="https://wa.me/916383969289" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 rounded-xl glass px-4 py-3 text-sm hover:glow-cyan transition">
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-cyber/15 text-cyber"><MessageCircle className="h-4 w-4" /></span>
                  <span><span className="block font-semibold">Chat on WhatsApp</span><span className="text-xs text-muted-foreground">+91 63839 69289</span></span>
                </a>
                <a href="https://www.linkedin.com/in/mohammed-faizal-m-b3242b311?utm_source=share_via&utm_content=profile&utm_medium=member_ios" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 rounded-xl glass px-4 py-3 text-sm hover:glow-cyan transition">
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-cyber/15 text-cyber"><Linkedin className="h-4 w-4" /></span>
                  <span><span className="block font-semibold">Connect on LinkedIn</span><span className="text-xs text-muted-foreground">Mohammed Faizal M</span></span>
                </a>
              </div>
            </div>
            <div className="rounded-3xl glass p-6">
              <div className="text-xs uppercase tracking-[0.2em] text-cyber">Headquarters</div>
              <div className="mt-2 font-display text-lg">Chennai, Tamil Nadu, India</div>
              <p className="mt-2 text-sm text-muted-foreground">Operating remotely across India · Available worldwide.</p>
            </div>
          </aside>
        </div>
      </section>
    </SiteLayout>
  );
}
