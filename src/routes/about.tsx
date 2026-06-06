import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { Sparkles, Target, Globe, Shield } from "lucide-react";

const SITE = "https://mentorwiseaiedtechservice.lovable.app";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — MentorWise AI" },
      { name: "description", content: "How MentorWise AI is democratizing elite career tooling for every student through a globally unique AI agent ecosystem." },
      { property: "og:title", content: "About — MentorWise AI" },
      { property: "og:description", content: "How MentorWise AI is democratizing elite career tooling for every student through a globally unique AI agent ecosystem." },
      { property: "og:url", content: `${SITE}/about` },
    ],
    links: [{ rel: "canonical", href: `${SITE}/about` }],
  }),
  component: About,
});

function About() {
  const pillars = [
    { icon: Target, title: "Our Mission", text: "Make MNC-grade career tooling free, accessible, and instantly actionable for every student on earth." },
    { icon: Globe, title: "Global Standard", text: "Every agent is benchmarked against Google, Microsoft, and top consulting outputs." },
    { icon: Shield, title: "Zero-cost Forever", text: "Built within free AI tiers so quality access never depends on a student's budget." },
    { icon: Sparkles, title: "Student-Native", text: "Designed by current students who understand the fresher journey from inside the trenches." },
  ];
  return (
    <SiteLayout>
      <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
        <div className="animate-fade-up">
          <div className="inline-flex items-center gap-2 rounded-full glass px-3 py-1.5 text-xs text-cyber">
            <Sparkles className="h-3.5 w-3.5" /> About MentorWise AI
          </div>
          <h1 className="mt-4 font-display text-4xl font-bold sm:text-5xl">
            Democratising the <span className="text-gradient">elite career playbook</span>.
          </h1>
          <p className="mt-5 max-w-3xl text-muted-foreground">
            MentorWise AI is a Chennai-born EdTech company building the world's most advanced AI agent ecosystem for students and freshers. We replace expensive consultants, scattered tools, and gatekept knowledge with a single command center of specialist AI agents — every one engineered to deliver outputs that match the bar of top MNCs while staying completely free to use.
          </p>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2">
          {pillars.map((p, i) => (
            <div key={p.title} className="glass rounded-2xl p-6 animate-fade-up" style={{ animationDelay: `${i * 70}ms` }}>
              <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-cyber/15 text-cyber ring-1 ring-cyber/30">
                <p.icon className="h-5 w-5" />
              </div>
              <h2 className="mt-4 font-display text-lg font-semibold">{p.title}</h2>
              <p className="mt-2 text-sm text-muted-foreground">{p.text}</p>
            </div>
          ))}
        </div>

        <div className="mt-16 rounded-3xl glass-strong p-8 sm:p-10">
          <h2 className="font-display text-2xl font-bold">Built for autonomy</h2>
          <p className="mt-3 text-muted-foreground max-w-3xl">
            From the first ATS-friendly resume to the final offer letter, MentorWise AI helps you operate like a one-person elite career team. Every agent is composable, every output is recruiter-ready, and every interaction respects your time and our shared mission: making elite outcomes the new baseline for students everywhere.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link to="/agents" className="rounded-full bg-cyber px-5 py-3 text-sm font-semibold text-primary-foreground hover:scale-[1.03] hover:brightness-110 transition glow-cyan">Explore the ecosystem</Link>
            <Link to="/founders" className="rounded-full glass px-5 py-3 text-sm font-semibold hover:scale-[1.03] hover:glow-cyan transition">Meet the founders</Link>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
