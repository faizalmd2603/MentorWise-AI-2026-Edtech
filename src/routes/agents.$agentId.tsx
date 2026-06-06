import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { SiteLayout } from "@/components/SiteLayout";
import { AGENTS } from "@/lib/agents";
import { chatWithAgent, generateImage } from "@/lib/ai.functions";
import { useState, useRef, useEffect } from "react";
import * as Icons from "lucide-react";
import { ArrowLeft, Send, Image as ImageIcon, Loader2 } from "lucide-react";

export const Route = createFileRoute("/agents/$agentId")({
  head: ({ params }) => {
    const agent = AGENTS.find((a) => a.id === params.agentId);
    const title = agent ? `${agent.name} — MentorWise AI` : "Agent — MentorWise AI";
    return {
      meta: [
        { title },
        { name: "description", content: agent?.description ?? "MentorWise AI agent" },
        { property: "og:title", content: title },
        { property: "og:description", content: agent?.description ?? "MentorWise AI agent" },
      ],
    };
  },
  component: AgentChat,
});

type Msg = { role: "user" | "assistant"; content: string; image?: string };

function AgentChat() {
  const { agentId } = useParams({ from: "/agents/$agentId" });
  const agent = AGENTS.find((a) => a.id === agentId);
  const chat = useServerFn(chatWithAgent);
  const imgFn = useServerFn(generateImage);
  const [messages, setMessages] = useState<Msg[]>(
    agent
      ? [{ role: "assistant", content: agent.comingSoon
          ? `Hi, I'm the ${agent.name}. I'm launching soon. You can preview my capabilities here — ask me anything and I'll share what I'll be able to do once I'm live.`
          : `Hi, I'm the ${agent.name}. ${agent.description} How can I help you today?` }]
      : [],
  );
  const [input, setInput] = useState("");
  const [imgPrompt, setImgPrompt] = useState("");
  const [showImg, setShowImg] = useState(false);
  const [loading, setLoading] = useState(false);
  const [imgLoading, setImgLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  if (!agent) {
    return (
      <SiteLayout>
        <div className="mx-auto max-w-2xl px-4 py-24 text-center">
          <h1 className="font-display text-2xl">Agent not found</h1>
          <Link to="/agents" className="mt-4 inline-block text-cyber underline">Back to ecosystem</Link>
        </div>
      </SiteLayout>
    );
  }

  const IconComp = (Icons as unknown as Record<string, React.ComponentType<{ className?: string }>>)[agent.icon] ?? Icons.Bot;

  async function send() {
    const text = input.trim();
    if (!text || loading) return;
    const newMessages: Msg[] = [...messages, { role: "user", content: text }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);
    try {
      const res = await chat({
        data: {
          agentId: agent!.id,
          messages: newMessages.map((m) => ({ role: m.role, content: m.content })),
        },
      });
      setMessages((m) => [...m, { role: "assistant", content: res.reply }]);
    } catch (e) {
      console.error(e);
      setMessages((m) => [...m, { role: "assistant", content: "I ran into a problem reaching the AI service. Please try again in a moment." }]);
    } finally {
      setLoading(false);
    }
  }

  async function generate() {
    const p = imgPrompt.trim();
    if (!p || imgLoading) return;
    setImgLoading(true);
    setMessages((m) => [...m, { role: "user", content: `Generate image: ${p}` }]);
    try {
      const res = await imgFn({ data: { prompt: p } });
      setMessages((m) => [...m, { role: "assistant", content: "Here is your generated image:", image: res.url }]);
      setImgPrompt("");
      setShowImg(false);
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Image generation failed.";
      setMessages((m) => [...m, { role: "assistant", content: msg }]);
    } finally {
      setImgLoading(false);
    }
  }

  return (
    <SiteLayout>
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
          {/* Sidebar */}
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <Link to="/agents" className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground">
              <ArrowLeft className="h-3.5 w-3.5" /> All agents
            </Link>
            <div className="mt-3 max-h-[70vh] overflow-y-auto rounded-2xl glass p-2">
              {AGENTS.map((a) => {
                const Ic = (Icons as unknown as Record<string, React.ComponentType<{ className?: string }>>)[a.icon] ?? Icons.Bot;
                const active = a.id === agent.id;
                return (
                  <Link
                    key={a.id}
                    to="/agents/$agentId"
                    params={{ agentId: a.id }}
                    className={`flex items-start gap-3 rounded-xl px-3 py-2.5 text-sm transition ${active ? "bg-cyber/10 text-foreground ring-1 ring-cyber/30" : "text-muted-foreground hover:bg-card/70 hover:text-foreground"}`}
                  >
                    <Ic className="h-4 w-4 mt-0.5 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="truncate font-medium">{a.name}</div>
                      {a.comingSoon && <div className="text-[10px] uppercase tracking-wider text-magenta">Soon</div>}
                    </div>
                  </Link>
                );
              })}
            </div>
          </aside>

          {/* Chat */}
          <section className="flex h-[78vh] flex-col overflow-hidden rounded-2xl glass-strong">
            <header className="flex items-center gap-3 border-b border-border/50 px-5 py-4">
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-cyber/15 text-cyber ring-1 ring-cyber/30">
                <IconComp className="h-5 w-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h2 className="font-display text-lg font-semibold truncate">{agent.name}</h2>
                  {agent.comingSoon && <span className="rounded-full bg-magenta/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-magenta ring-1 ring-magenta/40">Preview</span>}
                </div>
                <div className="text-xs text-muted-foreground truncate">{agent.short}</div>
              </div>
            </header>

            <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-6 sm:px-6 space-y-4">
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap ${
                    m.role === "user"
                      ? "bg-cyber/15 text-foreground ring-1 ring-cyber/30"
                      : "bg-card/80 text-foreground ring-1 ring-border"
                  }`}>
                    {m.content}
                    {m.image && (
                      <img src={m.image} alt="Generated" className="mt-3 rounded-xl max-w-full" />
                    )}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="rounded-2xl bg-card/80 px-4 py-3 text-sm ring-1 ring-border flex items-center gap-2 text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" /> Thinking…
                  </div>
                </div>
              )}
            </div>

            {showImg && (
              <div className="border-t border-border/50 px-4 py-3 sm:px-6 flex gap-2">
                <input
                  value={imgPrompt}
                  onChange={(e) => setImgPrompt(e.target.value)}
                  placeholder="Describe the image to generate…"
                  className="flex-1 rounded-xl bg-input px-3 py-2 text-sm outline-none ring-1 ring-border focus:ring-cyber"
                />
                <button
                  onClick={generate}
                  disabled={imgLoading || !imgPrompt.trim()}
                  className="rounded-xl bg-magenta/90 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50 hover:brightness-110 transition"
                >
                  {imgLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Generate"}
                </button>
              </div>
            )}

            <footer className="border-t border-border/50 p-3 sm:p-4">
              <div className="flex items-end gap-2">
                <button
                  onClick={() => setShowImg((v) => !v)}
                  className={`h-11 w-11 shrink-0 inline-flex items-center justify-center rounded-xl ring-1 ring-border transition ${showImg ? "bg-magenta/20 text-magenta ring-magenta/40" : "bg-card/60 text-muted-foreground hover:text-foreground"}`}
                  title="Generate image"
                  type="button"
                >
                  <ImageIcon className="h-5 w-5" />
                </button>
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      send();
                    }
                  }}
                  rows={1}
                  placeholder={`Message ${agent.name}…`}
                  className="flex-1 resize-none rounded-xl bg-input px-3 py-3 text-sm outline-none ring-1 ring-border focus:ring-cyber min-h-[44px] max-h-32"
                />
                <button
                  onClick={send}
                  disabled={loading || !input.trim()}
                  className="h-11 shrink-0 inline-flex items-center gap-2 rounded-xl bg-cyber px-4 text-sm font-semibold text-primary-foreground disabled:opacity-50 hover:brightness-110 transition glow-cyan"
                >
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                </button>
              </div>
              <p className="mt-2 text-[11px] text-muted-foreground">
                MentorWise AI responses are tuned for free-tier limits — concise, MNC-grade, and never use markdown formatting.
              </p>
            </footer>
          </section>
        </div>
      </div>
    </SiteLayout>
  );
}
