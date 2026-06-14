import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { SiteLayout } from "@/components/SiteLayout";
import { Typewriter } from "@/components/Typewriter";
import { ScrollIndicator } from "@/components/ScrollIndicator";
import banner from "@/assets/mw-banner.jpeg.asset.json";
import { ArrowRight, Sparkles, ShieldCheck, Zap, ExternalLink, Crown } from "lucide-react";

const SITE = "https://mentorwiseaiedtechservice.lovable.app";
const OG_IMAGE = `${SITE}${banner.url}`;

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "MentorWise AI | Free AI Career Operating System for Freshers" },
      { name: "description", content: "MentorWise AI — free 12-agent AI career stack for students. Resume Optimiser, Interview Coach, LinkedIn Agent, Internship Scout, Courses, Projects, Exams, Email Specialist, Humaniser, Social Media & 1-on-1 Mentor. 100% free forever." },
      { property: "og:title", content: "MentorWise AI | Free AI Career Operating System for Freshers" },
      { property: "og:description", content: "MentorWise AI — free 12-agent AI career stack for students. Resume Optimiser, Interview Coach, LinkedIn Agent, Internship Scout, Courses, Projects, Exams & more. 100% free forever." },
      { property: "og:url", content: `${SITE}/` },
      { property: "og:image", content: OG_IMAGE },
      { name: "twitter:image", content: OG_IMAGE },
    ],

    links: [{ rel: "canonical", href: `${SITE}/` }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: "MentorWise AI",
          url: SITE,
          description: "Free 12-agent AI career stack for students. Resume Optimiser, Interview Coach, LinkedIn Agent, Internship Scout, Courses, Projects, Exams, Email Specialist, Humaniser, Social Media & 1-on-1 Mentor — all powered by Google GenAI.",
        }),
      },
    ],
  }),
  component: Home,
});

function Home() {
  const [show, setShow] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => setShow(false), 2400);
    return () => clearTimeout(t);
  }, []);
  return (
    <SiteLayout>
      {show && <SplashScreen />}
      <Hero />
      <NexoraShowcase />
      <Highlights />
      <CTA />
    </SiteLayout>
  );
}

function NexoraShowcase() {
  return (
    <section className="mx-auto max-w-7xl px-4 pb-8 sm:px-6">
      <a
        href="https://nexora-sphere-ai.lovable.app/app"
        target="_blank"
        rel="noopener noreferrer"
        className="group relative block overflow-hidden rounded-3xl glass-strong p-8 sm:p-10 transition hover:-translate-y-1 hover:glow-cyan animate-fade-up"
      >
        <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-cyber/25 blur-3xl" />
        <div className="absolute -bottom-24 -left-20 h-64 w-64 rounded-full bg-magenta/20 blur-3xl" />
        <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex-1">
            <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-cyber/30 to-magenta/30 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-foreground ring-1 ring-cyber/40">
              <Crown className="h-3.5 w-3.5 text-cyber" /> Premium First Build · MentorWise AI Ecosystem
            </div>
            <h2 className="mt-4 font-display text-3xl font-bold sm:text-4xl">
              Nexora <span className="text-gradient">AI</span>
            </h2>
            <p className="mt-3 max-w-2xl text-sm text-muted-foreground sm:text-base">
              Our flagship education-grade LLM experience — a polished ChatGPT and Gemini-class web app, engineered as the first premium product under the MentorWise AI parent ecosystem.
            </p>
            <div className="mt-5 inline-flex items-center gap-2 rounded-full bg-cyber px-5 py-2.5 text-sm font-semibold text-primary-foreground glow-cyan group-hover:brightness-110 transition">
              Launch Nexora AI <ExternalLink className="h-4 w-4" />
            </div>
          </div>
          <div className="relative shrink-0">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-cyber/30 to-magenta/30 blur-2xl" />
            <div className="relative grid h-32 w-32 place-items-center rounded-3xl glass ring-1 ring-cyber/40 sm:h-40 sm:w-40">
              <Sparkles className="h-12 w-12 text-cyber animate-pulse sm:h-16 sm:w-16" />
            </div>
          </div>
        </div>
      </a>
    </section>
  );
}

function SplashScreen() {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background animate-scale-in">
      <div className="absolute inset-0 grid-bg opacity-80" />
      <div className="relative max-w-3xl px-6 text-center">
        <img src={banner.url} alt="MentorWise AI brand banner" className="mx-auto w-full max-w-xl rounded-2xl animate-float-glow" />
        <div className="mt-6 text-xs uppercase tracking-[0.3em] text-cyber animate-pulse">Initialising career arsenal…</div>
      </div>
    </div>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 pt-20 pb-24 sm:px-6 lg:pt-28">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div className="animate-fade-up">
            <div className="inline-flex items-center gap-2 rounded-full glass px-3 py-1.5 text-xs text-cyber">
              <Sparkles className="h-3.5 w-3.5" /> Powered by Google + Microsoft-class AI agents
            </div>
            <h1 className="mt-5 font-display text-4xl font-bold leading-[1.05] sm:text-5xl lg:text-6xl">
              The Ultimate <span className="text-gradient">AI-Powered</span>{" "}
              <span className="block mt-2 min-h-[1.15em]">
                <Typewriter
                  className="text-gradient"
                  phrases={[
                    "Career Arsenal.",
                    "Resume Optimiser.",
                    "Interview Coach.",
                    "Internship Scout.",
                    "Mentor on Demand.",
                  ]}
                />
              </span>
            </h1>
            <p className="mt-5 max-w-xl text-base text-muted-foreground sm:text-lg">
              MentorWise AI is the world's most advanced ecosystem for students and freshers — a suite of elite AI agents engineered to bypass ATS filters, crack top-tier interviews, and unlock premium internships at zero cost.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/agents" className="inline-flex items-center gap-2 rounded-full bg-cyber px-5 py-3 text-sm font-semibold text-primary-foreground transition hover:scale-[1.03] hover:brightness-110 glow-cyan">
                Deploy Your Agent <ArrowRight className="h-4 w-4" />
              </Link>
              <Link to="/founders" className="inline-flex items-center gap-2 rounded-full glass px-5 py-3 text-sm font-semibold text-foreground transition hover:scale-[1.03] hover:glow-cyan">
                Meet the Founders
              </Link>
            </div>
            <div className="mt-8 flex flex-wrap gap-6 text-xs text-muted-foreground">
              <div className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-cyber" /> Always 100% free</div>
              <div className="flex items-center gap-2"><Zap className="h-4 w-4 text-magenta" /> 12 specialist agents</div>
              <div className="flex items-center gap-2"><Sparkles className="h-4 w-4 text-purple-glow" /> MNC-grade output</div>
            </div>
          </div>

          <div className="relative animate-fade-up [animation-delay:120ms]">
            <div className="absolute -inset-6 rounded-3xl bg-gradient-to-br from-cyber/20 via-purple-glow/10 to-magenta/20 blur-2xl" />
            <div className="relative overflow-hidden rounded-3xl glass-strong p-2">
              <img src={banner.url} alt="MentorWise AI ecosystem preview" className="w-full rounded-2xl" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Highlights() {
  const items = [
    { title: "12 elite AI agents", desc: "Resume, Interview, LinkedIn, Internships, Exams and more — each tuned to MNC standards." },
    { title: "Free-tier optimized", desc: "Premium-quality responses delivered within free AI quotas, so every student gets equal access." },
    { title: "Built by students", desc: "Designed and operated from Chennai by a founding team that lives the fresher journey." },
  ];
  return (
    <section className="mx-auto max-w-7xl px-4 pb-12 sm:px-6">
      <div className="grid gap-4 md:grid-cols-3">
        {items.map((i, idx) => (
          <div key={i.title} className="glass rounded-2xl p-6 transition hover:glow-cyan animate-fade-up" style={{ animationDelay: `${idx * 80}ms` }}>
            <div className="font-display text-lg font-semibold text-foreground">{i.title}</div>
            <p className="mt-2 text-sm text-muted-foreground">{i.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function CTA() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
      <div className="relative overflow-hidden rounded-3xl glass-strong p-8 sm:p-12">
        <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-magenta/20 blur-3xl" />
        <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-cyber/20 blur-3xl" />
        <div className="relative">
          <h2 className="font-display text-3xl font-bold sm:text-4xl">Ready to scale from student to autonomous professional?</h2>
          <p className="mt-3 max-w-2xl text-muted-foreground">Deploy your first AI agent in seconds, or talk to the founders directly.</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link to="/agents" className="rounded-full bg-cyber px-5 py-3 text-sm font-semibold text-primary-foreground hover:scale-[1.03] hover:brightness-110 transition glow-cyan">Access AI Agents</Link>
            <Link to="/contact" className="rounded-full glass px-5 py-3 text-sm font-semibold text-foreground hover:scale-[1.03] hover:glow-cyan transition">Contact Us</Link>
          </div>
        </div>
      </div>
    </section>
  );
}
