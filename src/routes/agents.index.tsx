import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { AGENTS, COMING_SECTIONS } from "@/lib/agents";
import * as Icons from "lucide-react";
import { Lock, Sparkles } from "lucide-react";
import { STOCK_AGENT_IMAGES as AGENT_IMAGES } from "@/lib/stock-images";

const SITE = "https://mentorwiseaiedtechservice.lovable.app";

export const Route = createFileRoute("/agents/")({
  head: () => ({
    meta: [
      { title: "Free AI Tools for Students — 12 in One App | MentorWise AI" },
      { name: "description", content: "12 free AI tools for students in one app — resume help, mock interview, LinkedIn help, free internships, free courses, study help, email writing and more." },
      { property: "og:title", content: "Free AI Tools for Students — 12 in One App | MentorWise AI" },
      { property: "og:description", content: "12 free AI tools for students — resume, interview, LinkedIn, internships, courses, study help and more. All free." },
      { property: "og:url", content: `${SITE}/agents` },
    ],
    links: [{ rel: "canonical", href: `${SITE}/agents` }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          "@id": `${SITE}/agents`,
          url: `${SITE}/agents`,
          name: "Free AI Tools for Students — 12 in One App",
          description: "The MentorWise AI Studio: 12 free AI agents for resume, interview, LinkedIn, internships, courses, study help and more.",
          hasPart: AGENTS.map((a) => ({
            "@type": "WebPage",
            "@id": `${SITE}/agents/${a.id}`,
            url: `${SITE}/agents/${a.id}`,
            name: a.name,
          })),
        }),
      },
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
            <Sparkles className="h-3.5 w-3.5" /> Unified AI Studio
          </div>
          <h1 className="mt-4 font-display text-4xl font-bold sm:text-5xl">Your AI <span className="text-gradient">Agent Studio</span></h1>
          <p className="mt-3 text-muted-foreground">One LLM-style workspace, 12 specialist agents, ready-to-use prompts, camera capture and file uploads. Switch agents from the sidebar — your conversation, supercharged.</p>
          <div className="mt-6 flex items-center justify-center gap-3">
            <Link
              to="/agents/$agentId"
              params={{ agentId: "core" }}
              className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-br from-cyber to-magenta px-5 py-2.5 text-sm font-semibold text-primary-foreground glow-cyan hover:brightness-110 transition"
            >
              <Sparkles className="h-4 w-4" /> Launch AI Studio
            </Link>
          </div>
        </div>


        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {AGENTS.map((agent, idx) => {
            const IconComp = (Icons as unknown as Record<string, React.ComponentType<{ className?: string }>>)[agent.icon] ?? Icons.Bot;
            const locked = !!agent.comingSoon;
            const inner = (
              <>
                <div className="relative aspect-square overflow-hidden bg-background/40">
                  <img
                    src={AGENT_IMAGES[agent.id]}
                    alt={`${agent.name} — ${agent.short}`}
                    width={1024}
                    height={1024}
                    loading="lazy"
                    className={`h-full w-full object-cover transition duration-500 group-hover:scale-[1.03] ${locked ? "grayscale-[35%] opacity-80" : ""}`}
                  />
                  {locked && (
                    <div className="absolute inset-0 flex items-center justify-center bg-background/40 backdrop-blur-[2px]">
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-background/80 px-3 py-1.5 text-xs font-semibold text-foreground ring-1 ring-border">
                        <Lock className="h-3.5 w-3.5 text-magenta" /> Locked · Launching soon
                      </span>
                    </div>
                  )}
                  {locked && (
                    <span className="absolute right-3 top-3 rounded-full bg-magenta/90 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-primary-foreground shadow">Soon</span>
                  )}
                  <div className={`absolute left-3 top-3 inline-flex h-9 w-9 items-center justify-center rounded-lg bg-background/70 backdrop-blur ${accentMap[agent.accent].split(" ").slice(-1).join(" ")}`}>
                    <IconComp className="h-4 w-4" />
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="font-display text-lg font-semibold text-foreground leading-tight">{agent.name}</h3>
                  <div className="mt-1 text-xs uppercase tracking-wider text-muted-foreground">{agent.short}</div>
                  <p className="mt-3 text-sm text-muted-foreground line-clamp-3">{agent.description}</p>
                  <div className={`mt-4 inline-flex items-center gap-1 text-xs font-semibold ${locked ? "text-muted-foreground" : "text-cyber"}`}>
                    {locked ? (<><Lock className="h-3 w-3" /> Locked</>) : "Launch chat →"}
                  </div>
                </div>
              </>
            );
            return (
              <div key={agent.id} className="group relative animate-pop-in hover:[transform:translateZ(0)]" style={{ animationDelay: `${idx * 60}ms` }}>
                {locked ? (
                  <div aria-disabled className="block h-full overflow-hidden rounded-2xl glass cursor-not-allowed">
                    {inner}
                  </div>
                ) : (
                  <Link
                    to="/agents/$agentId"
                    params={{ agentId: agent.id }}
                    className="block h-full overflow-hidden rounded-2xl glass transition duration-300 hover:-translate-y-2 hover:scale-[1.02] hover:glow-cyan"
                  >
                    {inner}
                  </Link>
                )}
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
