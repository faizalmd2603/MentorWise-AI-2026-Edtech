import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { AGENTS, COMING_SECTIONS } from "@/lib/agents";
import * as Icons from "lucide-react";
import { Lock, Sparkles } from "lucide-react";

export const Route = createFileRoute("/agents/")({
  head: () => ({
    meta: [
      { title: "Agent Ecosystem — MentorWise AI" },
      { name: "description", content: "Deploy any of 12 specialist AI agents engineered for elite student careers." },
      { property: "og:title", content: "Agent Ecosystem — MentorWise AI" },
      { property: "og:description", content: "Deploy any of 12 specialist AI agents engineered for elite student careers." },
    ],
  }),
  component: AgentsIndex,
});

const accentMap = {
  cyan: "from-cyber/30 to-cyber/0 text-cyber",
  magenta: "from-magenta/30 to-magenta/0 text-magenta",
  purple: "from-purple-glow/30 to-purple-glow/0 text-purple-glow",
} as const;

function AgentsIndex() {
  return (
    <SiteLayout>
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="mx-auto max-w-3xl text-center animate-fade-up">
          <div className="inline-flex items-center gap-2 rounded-full glass px-3 py-1.5 text-xs text-cyber">
            <Sparkles className="h-3.5 w-3.5" /> The Ecosystem
          </div>
          <h1 className="mt-4 font-display text-4xl font-bold sm:text-5xl">Your AI <span className="text-gradient">Agent Arsenal</span></h1>
          <p className="mt-3 text-muted-foreground">Select an agent to start a private conversation. Every agent is tuned to deliver MNC-grade output within free-tier limits.</p>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {AGENTS.map((agent, idx) => {
            const IconComp = (Icons as unknown as Record<string, React.ComponentType<{ className?: string }>>)[agent.icon] ?? Icons.Bot;
            return (
              <div key={agent.id} className="group relative animate-fade-up" style={{ animationDelay: `${idx * 40}ms` }}>
                <Link
                  to="/agents/$agentId"
                  params={{ agentId: agent.id }}
                  className="block h-full rounded-2xl glass p-6 transition hover:-translate-y-1 hover:glow-cyan"
                >
                  <div className={`inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${accentMap[agent.accent]}`}>
                    <IconComp className="h-6 w-6" />
                  </div>
                  <div className="mt-4 flex items-start justify-between gap-2">
                    <h3 className="font-display text-lg font-semibold text-foreground leading-tight">{agent.name}</h3>
                    {agent.comingSoon && (
                      <span className="shrink-0 rounded-full bg-magenta/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-magenta ring-1 ring-magenta/40">Soon</span>
                    )}
                  </div>
                  <div className="mt-1 text-xs uppercase tracking-wider text-muted-foreground">{agent.short}</div>
                  <p className="mt-3 text-sm text-muted-foreground">{agent.description}</p>
                  <div className="mt-5 inline-flex items-center gap-1 text-xs font-semibold text-cyber">
                    {agent.comingSoon ? "Preview agent →" : "Launch chat →"}
                  </div>
                </Link>
              </div>
            );
          })}
        </div>

        <div className="mt-16">
          <h2 className="font-display text-2xl font-bold text-foreground">Upcoming Programs</h2>
          <p className="mt-1 text-sm text-muted-foreground">Locked experiences launching soon for every MentorWise AI student.</p>
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {COMING_SECTIONS.map((s, idx) => {
              const IconComp = (Icons as unknown as Record<string, React.ComponentType<{ className?: string }>>)[s.icon] ?? Icons.Sparkles;
              return (
                <div key={s.id} className="relative rounded-2xl glass p-6 animate-fade-up" style={{ animationDelay: `${idx * 60}ms` }}>
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-glow/30 to-magenta/0 text-purple-glow">
                    <IconComp className="h-6 w-6" />
                  </div>
                  <div className="mt-4 flex items-start justify-between gap-2">
                    <h3 className="font-display text-base font-semibold text-foreground leading-tight">{s.name}</h3>
                    <span className="rounded-full bg-magenta/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-magenta ring-1 ring-magenta/40">Soon</span>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">{s.description}</p>
                  <button disabled className="mt-5 inline-flex items-center gap-2 rounded-full bg-muted/50 px-3 py-1.5 text-xs font-semibold text-muted-foreground cursor-not-allowed">
                    <Lock className="h-3.5 w-3.5" /> Locked
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
