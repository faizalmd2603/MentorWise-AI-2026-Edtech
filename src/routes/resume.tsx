import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { FileText, ShieldCheck, Zap, CheckCircle2 } from "lucide-react";

const SITE = "https://mentorwiseaiedtechservice.lovable.app";

export const Route = createFileRoute("/resume")({
  head: () => ({
    meta: [
      { title: "Free Resume Optimiser for Freshers & College Students | MentorWise AI" },
      { name: "description", content: "Optimise your resume with AI. Get recruiter-ready, impact-driven bullet points and structurally flawless formatting engineered to clear top MNC hiring filters. 100% free for students." },
      { property: "og:title", content: "Free Resume Optimiser for Freshers & College Students | MentorWise AI" },
      { property: "og:description", content: "Optimise your resume with AI. Get recruiter-ready, impact-driven bullet points and structurally flawless formatting engineered to clear top MNC hiring filters. 100% free for students." },
      { property: "og:url", content: `${SITE}/resume` },
    ],
    links: [{ rel: "canonical", href: `${SITE}/resume` }],
  }),
  component: ResumePage,
});

function ResumePage() {
  const features = [
    { icon: ShieldCheck, title: "Resume Optimiser Engine", text: "Structurally optimized to clear Workday, Taleo, Greenhouse and Lever parsers without keyword stuffing." },
    { icon: Zap, title: "Recruiter-Ready in Minutes", text: "Google GenAI translates raw experience into MNC-grade bullet points that quantify impact." },
    { icon: FileText, title: "Fresher-First Templates", text: "Engineered for zero-experience students — projects, coursework and internships positioned like real wins." },
  ];
  return (
    <SiteLayout>
      <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
        <div className="animate-fade-up">
          <div className="inline-flex items-center gap-2 rounded-full glass px-3 py-1.5 text-xs text-cyber">
            <FileText className="h-3.5 w-3.5" /> Resume Agent
          </div>
          <h1 className="mt-4 font-display text-4xl font-bold sm:text-5xl">
            Free <span className="text-gradient">ATS Resume Builder</span> for freshers & college students.
          </h1>
          <p className="mt-5 max-w-3xl text-muted-foreground">
            Reverse-engineer enterprise recruitment software. MentorWise AI's resume agent crafts a structurally flawless, ATS-compliant resume engineered to clear the top MNC hiring filters used by Google, Microsoft, Deloitte and TCS.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link to="/agents" className="rounded-full bg-cyber px-5 py-3 text-sm font-semibold text-primary-foreground hover:scale-[1.03] hover:brightness-110 transition glow-cyan">Launch Resume Agent</Link>
            <Link to="/agents" className="rounded-full glass px-5 py-3 text-sm font-semibold hover:scale-[1.03] hover:glow-cyan transition">See all 12 agents</Link>
          </div>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-3">
          {features.map((f, i) => (
            <div key={f.title} className="glass rounded-2xl p-6 animate-fade-up" style={{ animationDelay: `${i * 70}ms` }}>
              <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-cyber/15 text-cyber ring-1 ring-cyber/30">
                <f.icon className="h-5 w-5" />
              </div>
              <h2 className="mt-4 font-display text-lg font-semibold">{f.title}</h2>
              <p className="mt-2 text-sm text-muted-foreground">{f.text}</p>
            </div>
          ))}
        </div>

        <div className="mt-16 rounded-3xl glass-strong p-8 sm:p-10">
          <h2 className="font-display text-2xl font-bold">Why students choose MentorWise AI</h2>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2">
            {["100% free forever — no paywall, no credit card", "Built on Google GenAI for enterprise-grade quality", "Optimised for Indian campus + global MNC hiring", "Zero design skills required"].map((t) => (
              <li key={t} className="flex items-start gap-2 text-sm text-muted-foreground">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-cyber" /> {t}
              </li>
            ))}
          </ul>
        </div>
      </section>
    </SiteLayout>
  );
}
