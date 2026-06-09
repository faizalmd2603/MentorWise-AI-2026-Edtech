import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { Mic, Brain, Target, CheckCircle2 } from "lucide-react";

const SITE = "https://mentorwiseaiedtechservice.lovable.app";

export const Route = createFileRoute("/interview")({
  head: () => ({
    meta: [
      { title: "Live AI Mock Interview Simulator (STAR Method) | MentorWise AI" },
      { name: "description", content: "Practice high-pressure technical and HR mock interviews. Get real-time behavioral analysis and structural communication feedback powered by GenAI." },
      { property: "og:title", content: "Live AI Mock Interview Simulator (STAR Method) | MentorWise AI" },
      { property: "og:description", content: "Practice high-pressure technical and HR mock interviews with real-time STAR-method behavioral analysis powered by GenAI." },
      { property: "og:url", content: `${SITE}/interview` },
    ],
    links: [{ rel: "canonical", href: `${SITE}/interview` }],
  }),
  component: InterviewPage,
});

function InterviewPage() {
  const features = [
    { icon: Mic, title: "Live Voice & Text Rounds", text: "Realistic technical and HR interview rounds powered by Google GenAI — speak or type your answers." },
    { icon: Brain, title: "STAR-Method Scoring", text: "Every answer is decomposed into Situation, Task, Action, Result with structural feedback." },
    { icon: Target, title: "Behavioral Analysis", text: "Real-time signals on clarity, confidence, filler words and structure — like a recruiter sitting beside you." },
  ];
  return (
    <SiteLayout>
      <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
        <div className="animate-fade-up">
          <div className="inline-flex items-center gap-2 rounded-full glass px-3 py-1.5 text-xs text-cyber">
            <Mic className="h-3.5 w-3.5" /> Mock Interview Agent
          </div>
          <h1 className="mt-4 font-display text-4xl font-bold sm:text-5xl">
            Live <span className="text-gradient">AI Mock Interview Simulator</span> with STAR-method scoring.
          </h1>
          <p className="mt-5 max-w-3xl text-muted-foreground">
            Practice high-pressure technical and HR mock interviews. Get real-time behavioral analysis and structural communication feedback powered by Google GenAI — completely free for every student.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link to="/agents" className="rounded-full bg-cyber px-5 py-3 text-sm font-semibold text-primary-foreground hover:scale-[1.03] hover:brightness-110 transition glow-cyan">Start mock interview</Link>
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
          <h2 className="font-display text-2xl font-bold">What you'll practice</h2>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2">
            {["HR rounds — 'Tell me about yourself', strengths/weaknesses", "Technical screens — DSA, system design fundamentals", "Behavioral cases — leadership, conflict, ambiguity", "Final-round case interviews for consulting & product"].map((t) => (
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
