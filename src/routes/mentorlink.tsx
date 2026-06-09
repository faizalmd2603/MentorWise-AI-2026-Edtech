import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { Linkedin, Sparkles, LayoutGrid, Wand2, CheckCircle2 } from "lucide-react";

const SITE = "https://mentorwiseaiedtechservice.lovable.app";

export const Route = createFileRoute("/mentorlink")({
  head: () => ({
    meta: [
      { title: "MentorLink AI — Premium Personal Brand & LinkedIn Intelligence OS" },
      { name: "description", content: "Transform your networking presence. Features AI Year in Review (Career Wrapped), automated high-end interactive carousel generators, and an AI Post Humanizer to completely bypass robotic text patterns for corporate reach." },
      { property: "og:title", content: "MentorLink AI — Premium Personal Brand & LinkedIn Intelligence OS" },
      { property: "og:description", content: "Career Wrapped, carousel generator and AI post humanizer — engineered to bypass robotic patterns and unlock corporate reach on LinkedIn." },
      { property: "og:url", content: `${SITE}/mentorlink` },
    ],
    links: [{ rel: "canonical", href: `${SITE}/mentorlink` }],
  }),
  component: MentorLinkPage,
});

function MentorLinkPage() {
  const features = [
    { icon: Sparkles, title: "AI Year in Review", text: "Career Wrapped — a cinematic recap of your year's wins, perfect for end-of-year LinkedIn posts that drive engagement." },
    { icon: LayoutGrid, title: "Interactive Carousel Generator", text: "Auto-generates high-end, on-brand LinkedIn carousels in seconds — design-grade output, zero Canva required." },
    { icon: Wand2, title: "AI Post Humanizer", text: "Rewrites robotic GenAI output into natural, human-toned posts engineered to bypass detector patterns and unlock corporate reach." },
  ];
  return (
    <SiteLayout>
      <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
        <div className="animate-fade-up">
          <div className="inline-flex items-center gap-2 rounded-full glass px-3 py-1.5 text-xs text-cyber">
            <Linkedin className="h-3.5 w-3.5" /> MentorLink AI
          </div>
          <h1 className="mt-4 font-display text-4xl font-bold sm:text-5xl">
            Premium <span className="text-gradient">Personal Brand & LinkedIn Intelligence OS</span>.
          </h1>
          <p className="mt-5 max-w-3xl text-muted-foreground">
            Transform your networking presence. MentorLink AI ships AI Year in Review (Career Wrapped), an automated high-end interactive carousel generator, and an AI Post Humanizer engineered to completely bypass robotic text patterns for serious corporate reach.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link to="/agents" className="rounded-full bg-cyber px-5 py-3 text-sm font-semibold text-primary-foreground hover:scale-[1.03] hover:brightness-110 transition glow-cyan">Launch MentorLink</Link>
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
          <h2 className="font-display text-2xl font-bold">Built for serious corporate reach</h2>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2">
            {["Bypass AI-detector patterns with natural rewrites", "Design-grade carousels without opening Figma", "Profile audits that mirror recruiter heuristics", "Free forever — built for students, not influencers"].map((t) => (
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
