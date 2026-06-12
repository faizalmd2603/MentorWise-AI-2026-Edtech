import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { SiteLayout } from "@/components/SiteLayout";
import banner from "@/assets/mw-banner.jpeg.asset.json";
import { ArrowRight, Sparkles, ShieldCheck, Zap } from "lucide-react";

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
      <Highlights />
      <CTA />
    </SiteLayout>
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
              The Ultimate <span className="text-gradient">AI-Powered</span> Career Arsenal.
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
