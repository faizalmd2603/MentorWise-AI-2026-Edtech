import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { SiteLayout } from "@/components/SiteLayout";
import { AGENTS } from "@/lib/agents";
import { chatWithAgent, generateImage } from "@/lib/ai.functions";
import { useState, useRef, useEffect, useMemo } from "react";
import * as Icons from "lucide-react";
import {
  ArrowLeft,
  Send,
  Image as ImageIcon,
  Loader2,
  Paperclip,
  Camera,
  X,
  SwitchCamera,
  Sparkles,
  Plus,
  FileText as FileIcon,
  Video,
  Wand2,
  Lock,
  MessageSquarePlus,
} from "lucide-react";
import { Globe, Search, Zap, Brain, ChevronDown, Check } from "lucide-react";
import { MentorVideoCall } from "@/components/MentorVideoCall";
import { ResumeBuilder } from "@/components/ResumeBuilder";
import { ChatMarkdown } from "@/components/ChatMarkdown";
import { useAuthReady } from "@/hooks/use-auth-ready";

const SITE = "https://mentorwiseai.store";

export const Route = createFileRoute("/agents/$agentId")({
  head: ({ params }) => {
    const agent = AGENTS.find((a) => a.id === params.agentId);
    const title = agent ? `${agent.name} — MentorWise AI` : "Agent — MentorWise AI";
    const description = agent
      ? `${agent.short}. ${agent.description} Chat with camera, file and image upload powered by MentorWise AI.`
      : "Specialist AI agent in the MentorWise AI ecosystem.";
    const url = `${SITE}/agents/${params.agentId}`;
    return {
      meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:url", content: url },
      ],
      links: [{ rel: "canonical", href: url }],
      scripts: agent
        ? [
            {
              type: "application/ld+json",
              children: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "Service",
                name: agent.name,
                description: agent.description,
                serviceType: agent.short,
                provider: { "@type": "Organization", name: "MentorWise AI", url: SITE },
                areaServed: "Worldwide",
                url,
              }),
            },
          ]
        : undefined,
    };
  },
  component: AgentChat,
});

type Attachment = { kind: "image" | "file"; name: string; mime: string; dataUrl: string };
type Source = { title: string; link: string; date?: string | null; source?: string | null };
type Msg = {
  role: "user" | "assistant";
  content: string;
  image?: string;
  attachments?: Attachment[];
  sources?: Source[];
  searchQuery?: string | null;
};

const MAX_ATTACH = 4;
const MAX_BYTES = 7 * 1024 * 1024; // 7MB per file

function readFileAsDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(String(r.result));
    r.onerror = reject;
    r.readAsDataURL(file);
  });
}

function AgentChat() {
  const { agentId } = useParams({ from: "/agents/$agentId" });
  const agent = AGENTS.find((a) => a.id === agentId);
  const { isReady, user } = useAuthReady();
  const chat = useServerFn(chatWithAgent);
  const imgFn = useServerFn(generateImage);

  const greeting = useMemo(
    () =>
      agent
        ? agent.comingSoon
          ? `Hi, I'm the ${agent.name}. I'm launching soon — ask me anything and I'll preview what I will deliver once live.`
          : `Hi, I'm the ${agent.name}. ${agent.description} How can I help you today?`
        : "",
    [agent],
  );

  const [messages, setMessages] = useState<Msg[]>(agent ? [{ role: "assistant", content: greeting }] : []);
  const [input, setInput] = useState("");
  const [attach, setAttach] = useState<Attachment[]>([]);
  const [imgPrompt, setImgPrompt] = useState("");
  const [showImg, setShowImg] = useState(false);
  const [loading, setLoading] = useState(false);
  const [phase, setPhase] = useState<"searching" | "reading" | "thinking" | "typing">("typing");
  const [mode, setMode] = useState<"fast" | "think" | "search">("fast");
  const [modeOpen, setModeOpen] = useState(false);
  const [imgLoading, setImgLoading] = useState(false);
  const [cameraOpen, setCameraOpen] = useState(false);
  const [facingMode, setFacingMode] = useState<"user" | "environment">("environment");
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [showPlus, setShowPlus] = useState(false);
  const [callOpen, setCallOpen] = useState(false);
  const [resumeOpen, setResumeOpen] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const imageRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Reset chat when switching agents
  useEffect(() => {
    if (agent) {
      setMessages([{ role: "assistant", content: greeting }]);
      setAttach([]);
      setInput("");
    }
  }, [agentId, agent, greeting]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  // Camera lifecycle
  useEffect(() => {
    if (!cameraOpen) {
      streamRef.current?.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        setCameraError(null);
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: { ideal: facingMode }, width: { ideal: 1280 }, height: { ideal: 720 } },
          audio: false,
        });
        if (cancelled) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play().catch(() => {});
        }
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Camera unavailable.";
        setCameraError(msg.includes("Permission") || msg.includes("denied")
          ? "Camera permission denied. Please allow camera access in your browser settings."
          : "Could not start camera. Try switching the front/back camera.");
      }
    })();
    return () => {
      cancelled = true;
      streamRef.current?.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    };
  }, [cameraOpen, facingMode]);

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

  function addAttachment(a: Attachment) {
    setAttach((cur) => {
      if (cur.length >= MAX_ATTACH) return cur;
      return [...cur, a];
    });
  }

  function mimeFor(file: File, kind: "image" | "file") {
    if (file.type) return file.type;
    const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
    const map: Record<string, string> = {
      pdf: "application/pdf",
      jpg: "image/jpeg",
      jpeg: "image/jpeg",
      png: "image/png",
      webp: "image/webp",
      gif: "image/gif",
      doc: "application/msword",
      docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      xls: "application/vnd.ms-excel",
      xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      csv: "text/csv",
      txt: "text/plain",
    };
    return map[ext] ?? (kind === "image" ? "image/png" : "application/octet-stream");
  }

  async function handleFiles(files: FileList | null, kind: "image" | "file") {
    if (!files) return;
    for (const file of Array.from(files)) {
      if (file.size > MAX_BYTES) {
        alert(`${file.name} is larger than 7MB. Please pick a smaller file.`);
        continue;
      }
      const mime = mimeFor(file, kind);
      const dataUrl = await readFileAsDataURL(file);
      addAttachment({
        kind: kind === "image" || mime.startsWith("image/") ? "image" : "file",
        name: file.name,
        mime,
        dataUrl,
      });
    }
    setShowPlus(false);
  }


  function captureFromCamera() {
    const video = videoRef.current;
    if (!video) return;
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth || 1280;
    canvas.height = video.videoHeight || 720;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL("image/jpeg", 0.9);
    addAttachment({
      kind: "image",
      name: `camera-${Date.now()}.jpg`,
      mime: "image/jpeg",
      dataUrl,
    });
    setCameraOpen(false);
  }

  async function send(textOverride?: string) {
    const text = (textOverride ?? input).trim();
    if ((!text && attach.length === 0) || loading) return;
    if (!user) {
      setMessages((m) => [
        ...m,
        { role: "user", content: text || "(see attached)", attachments: attach.length ? attach : undefined },
        { role: "assistant", content: "Please sign in to chat with this agent. Tap the Sign in button below to continue — it's free." },
      ]);
      setInput("");
      setAttach([]);
      return;
    }
    const userMsg: Msg = { role: "user", content: text || "(see attached)", attachments: attach.length ? attach : undefined };
    const newMessages: Msg[] = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    const sentAttachments = attach;
    setAttach([]);
    setLoading(true);
    const searching = mode === "search" && agent!.id !== "humaniser";
    setPhase(searching ? "searching" : mode === "think" ? "thinking" : "typing");
    const timers: ReturnType<typeof setTimeout>[] = [];
    if (searching) {
      timers.push(setTimeout(() => setPhase("reading"), 2200));
      timers.push(setTimeout(() => setPhase("typing"), 4800));
    }
    try {
      const res = await chat({
        data: {
          agentId: agent!.id,
          messages: newMessages.map((m) => ({
            role: m.role,
            content: m.content,
            attachments: m.attachments,
          })),
          mode,
        },
      });
      setMessages((m) => [
        ...m,
        {
          role: "assistant",
          content: res.reply,
          sources: (res.sources ?? []) as Source[],
          searchQuery: res.searchQuery ?? null,
        },
      ]);
    } catch (e) {
      console.error(e, "sent with", sentAttachments.length, "attachments");
      const msg = e instanceof Error ? e.message : "";
      const isAuth = /unauthor/i.test(msg) || /authorization/i.test(msg);
      setMessages((m) => [
        ...m,
        {
          role: "assistant",
          content: isAuth
            ? "You need to sign in to chat with this agent. Tap the Sign in button below — it's free and only takes a moment."
            : `I ran into a problem reaching the AI service. ${msg ? `(${msg}) ` : ""}Please try again in a moment.`,
        },
      ]);
    } finally {
      timers.forEach(clearTimeout);
      setLoading(false);
      textareaRef.current?.focus();
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

  const showPrompts = messages.length <= 1 && !loading;

  return (
    <SiteLayout>
      {/* Ambient 3D backdrop */}
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 -left-20 h-[480px] w-[480px] rounded-full bg-cyber/20 blur-3xl animate-orb" />
        <div className="absolute top-1/3 -right-32 h-[520px] w-[520px] rounded-full bg-magenta/20 blur-3xl animate-orb" style={{ animationDelay: "-4s" }} />
        <div className="absolute bottom-0 left-1/3 h-[420px] w-[420px] rounded-full bg-purple-glow/20 blur-3xl animate-orb" style={{ animationDelay: "-8s" }} />
      </div>

      <div className="mx-auto max-w-7xl px-3 py-6 sm:px-6 sm:py-8">
        <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
          {/* Sidebar — agent selection (Gemini-inspired) */}
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <Link to="/agents" className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground">
              <ArrowLeft className="h-3.5 w-3.5" /> All agents
            </Link>
            <div className="mt-3 max-h-[78vh] overflow-y-auto rounded-3xl glass p-3 tilt-3d">
              <Link
                to="/agents"
                className="mb-2 flex items-center gap-3 rounded-full bg-gradient-to-r from-cyber/20 to-magenta/10 px-4 py-2.5 text-sm font-medium text-foreground ring-1 ring-cyber/30 hover:ring-cyber/60 transition"
              >
                <MessageSquarePlus className="h-4 w-4 text-cyber" />
                <span>New chat</span>
              </Link>
              <div className="px-3 pt-2 pb-1 text-[10px] uppercase tracking-[0.18em] text-muted-foreground flex items-center gap-2">
                <Sparkles className="h-3 w-3 text-cyber" /> Agents
              </div>
              {AGENTS.map((a) => {
                const Ic = (Icons as unknown as Record<string, React.ComponentType<{ className?: string }>>)[a.icon] ?? Icons.Bot;
                const active = a.id === agent.id;
                const locked = !!a.comingSoon;
                const baseClass = `group flex items-center gap-3 rounded-full px-3 py-2 text-sm transition my-0.5`;
                const stateClass = active
                  ? "bg-gradient-to-r from-cyber/25 via-magenta/15 to-transparent text-foreground ring-1 ring-cyber/40"
                  : locked
                    ? "text-muted-foreground/70 cursor-not-allowed"
                    : "text-muted-foreground hover:bg-card/70 hover:text-foreground";
                const iconWrap = `inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full ring-1 ring-border ${active ? "bg-cyber/20 text-cyber ring-cyber/40" : "bg-card/60 group-hover:text-cyber"}`;
                const content = (
                  <>
                    <span className={iconWrap}>
                      {locked ? <Lock className="h-3.5 w-3.5 text-magenta" /> : <Ic className="h-3.5 w-3.5" />}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="truncate font-medium leading-tight">{a.name}</div>
                      <div className="truncate text-[11px] text-muted-foreground">{locked ? "Locked · Soon" : a.short}</div>
                    </div>
                  </>
                );
                return locked ? (
                  <div key={a.id} aria-disabled className={baseClass + " " + stateClass}>
                    {content}
                  </div>
                ) : (
                  <Link
                    key={a.id}
                    to="/agents/$agentId"
                    params={{ agentId: a.id }}
                    className={baseClass + " " + stateClass}
                  >
                    {content}
                  </Link>
                );
              })}
            </div>
          </aside>

          {/* Chat panel */}
          {agent.comingSoon ? (
            <section className="flex h-[82vh] flex-col items-center justify-center overflow-hidden rounded-3xl glass-strong tilt-3d p-8 text-center">
              <div className="inline-flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-magenta/30 to-cyber/20 ring-1 ring-magenta/40">
                <Lock className="h-7 w-7 text-magenta" />
              </div>
              <h1 className="mt-6 font-display text-2xl font-bold">{agent.name} is locked</h1>
              <p className="mt-2 max-w-md text-sm text-muted-foreground">
                This agent is launching soon under the MentorWise AI ecosystem. Explore the other live agents in the meantime.
              </p>
              <Link
                to="/agents"
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-gradient-to-br from-cyber to-magenta px-5 py-2.5 text-sm font-semibold text-primary-foreground glow-cyan hover:brightness-110 transition"
              >
                <ArrowLeft className="h-4 w-4" /> Back to AI Studio
              </Link>
            </section>
          ) : (
          <section className="flex h-[82vh] flex-col overflow-hidden rounded-3xl glass-strong tilt-3d">
            <header className="flex items-center gap-3 border-b border-border/50 px-5 py-4">
              <div className="relative">
                <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-cyber/30 to-magenta/20 text-cyber ring-1 ring-cyber/40 animate-float-y">
                  <IconComp className="h-5 w-5" />
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-cyber ring-2 ring-background animate-pulse" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h1 className="font-display text-lg font-semibold truncate shimmer-text">{agent.name}</h1>
                  {agent.comingSoon && (
                    <span className="rounded-full bg-magenta/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-magenta ring-1 ring-magenta/40">
                      Preview
                    </span>
                  )}
                </div>
                <div className="text-xs text-muted-foreground truncate">{agent.short}</div>
              </div>
              {agent.id === "mentor" && (
                <button
                  onClick={() => setCallOpen(true)}
                  className="shrink-0 inline-flex items-center gap-1.5 rounded-full bg-gradient-to-br from-cyber to-magenta px-3 py-1.5 text-xs font-semibold text-primary-foreground glow-cyan hover:brightness-110 transition"
                  type="button"
                >
                  <Video className="h-3.5 w-3.5" /> Video Call
                </button>
              )}
              {agent.id === "resume" && (
                <button
                  onClick={() => setResumeOpen(true)}
                  className="shrink-0 inline-flex items-center gap-1.5 rounded-full bg-gradient-to-br from-cyber to-magenta px-3 py-1.5 text-xs font-semibold text-primary-foreground glow-cyan hover:brightness-110 transition"
                  type="button"
                >
                  <Wand2 className="h-3.5 w-3.5" /> Build Resume
                </button>
              )}
            </header>

            {isReady && !user && (
              <div className="border-b border-border/50 bg-gradient-to-r from-cyber/15 via-magenta/10 to-transparent px-5 py-3 flex items-center gap-3">
                <Lock className="h-4 w-4 text-cyber shrink-0" />
                <div className="flex-1 text-xs sm:text-sm text-muted-foreground">
                  Sign in to chat with <span className="text-foreground font-medium">{agent.name}</span> — it's free.
                </div>
                <Link
                  to="/auth"
                  className="shrink-0 inline-flex items-center gap-1.5 rounded-full bg-gradient-to-br from-cyber to-magenta px-3 py-1.5 text-xs font-semibold text-primary-foreground glow-cyan hover:brightness-110 transition"
                >
                  Sign in
                </Link>
              </div>
            )}


            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto px-3 py-6 sm:px-6 space-y-4">
              {messages.map((m, i) => (
                <div key={i} className={`flex animate-fade-up ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[88%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-lg ${
                      m.role === "user"
                        ? "whitespace-pre-wrap bg-gradient-to-br from-cyber/25 to-magenta/10 text-foreground ring-1 ring-cyber/40"
                        : "bg-card/85 text-foreground ring-1 ring-border"
                    }`}
                  >
                    {m.role === "assistant" ? (
                      <>
                        {m.searchQuery && (
                          <div className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-cyber/10 px-2.5 py-1 text-[11px] font-medium text-cyber ring-1 ring-cyber/30">
                            <Globe className="h-3 w-3" />
                            Searched Google · “{m.searchQuery}”
                          </div>
                        )}
                        <ChatMarkdown content={m.content} />
                        {m.sources && m.sources.length > 0 && (
                          <div className="mt-3 border-t border-border/50 pt-3">
                            <div className="mb-1.5 text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                              Live web sources
                            </div>
                            <div className="flex flex-wrap gap-1.5">
                              {m.sources.slice(0, 6).map((s, si) => (
                                <a
                                  key={si}
                                  href={s.link}
                                  target="_blank"
                                  rel="noopener noreferrer nofollow"
                                  className="group inline-flex max-w-[15rem] items-center gap-1.5 rounded-full bg-background/60 px-2.5 py-1 text-[11px] ring-1 ring-border transition hover:ring-cyber/50"
                                  title={s.title}
                                >
                                  <img
                                    src={`https://www.google.com/s2/favicons?sz=32&domain=${new URL(s.link).hostname}`}
                                    alt=""
                                    className="h-3.5 w-3.5 rounded-sm"
                                    loading="lazy"
                                  />
                                  <span className="truncate group-hover:text-cyber">
                                    {s.source || new URL(s.link).hostname.replace(/^www\./, "")}
                                  </span>
                                  {s.date && <span className="shrink-0 text-muted-foreground">· {s.date}</span>}
                                </a>
                              ))}
                            </div>
                          </div>
                        )}
                      </>
                    ) : (
                      m.content
                    )}
                    {m.attachments && m.attachments.length > 0 && (
                      <div className="mt-3 grid grid-cols-2 gap-2">
                        {m.attachments.map((a, idx) => (
                          <div key={idx} className="rounded-xl bg-background/40 p-1.5 ring-1 ring-border">
                            {a.kind === "image" ? (
                              <img src={a.dataUrl} alt={a.name} className="h-28 w-full rounded-lg object-cover" />
                            ) : (
                              <div className="flex items-center gap-2 px-2 py-3">
                                <FileIcon className="h-4 w-4 text-cyber shrink-0" />
                                <span className="truncate text-xs">{a.name}</span>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                    {m.image && <img src={m.image} alt="AI-generated" className="mt-3 rounded-xl max-w-full" />}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start animate-fade-up">
                  <div className="flex items-center gap-2.5 rounded-2xl bg-card/85 px-4 py-3 text-sm ring-1 ring-border text-muted-foreground">
                    <span className="relative inline-flex h-5 w-5 items-center justify-center">
                      <span className="absolute inset-0 rounded-full bg-cyber/25 animate-ping" />
                      {phase === "thinking" ? (
                        <Loader2 className="relative h-4 w-4 animate-spin text-cyber" />
                      ) : phase === "reading" ? (
                        <Globe className="relative h-4 w-4 text-magenta animate-float-y" />
                      ) : (
                        <Search className="relative h-4 w-4 text-cyber animate-float-y" />
                      )}
                    </span>
                    <span className="shimmer-text font-medium">
                      {phase === "searching"
                        ? "Searching the web…"
                        : phase === "reading"
                          ? "Reading top results…"
                          : phase === "thinking"
                            ? "Thinking it through…"
                            : "Typing"}
                    </span>
                    <span className="flex gap-1">
                      {[0, 1, 2].map((d) => (
                        <span
                          key={d}
                          className="h-1.5 w-1.5 rounded-full bg-cyber/70 animate-bounce"
                          style={{ animationDelay: `${d * 140}ms` }}
                        />
                      ))}
                    </span>
                  </div>
                </div>
              )}

              {/* Quick prompts */}
              {showPrompts && (
                <div className="grid gap-2 pt-4 sm:grid-cols-2">
                  {agent.prompts.map((p, idx) => (
                    <button
                      key={idx}
                      onClick={() => send(p)}
                      className="group text-left rounded-2xl bg-card/60 p-3 text-sm ring-1 ring-border hover:ring-cyber/50 hover:bg-card/80 transition animate-fade-up hover:-translate-y-0.5"
                      style={{ animationDelay: `${idx * 60}ms` }}
                      type="button"
                    >
                      <div className="flex items-start gap-2">
                        <Sparkles className="h-4 w-4 mt-0.5 text-cyber shrink-0 group-hover:text-magenta transition" />
                        <span>{p}</span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Attachment preview */}
            {attach.length > 0 && (
              <div className="border-t border-border/50 px-3 py-2 sm:px-5 flex flex-wrap gap-2">
                {attach.map((a, idx) => (
                  <div key={idx} className="relative rounded-xl bg-card/70 p-1.5 ring-1 ring-border animate-scale-in">
                    {a.kind === "image" ? (
                      <img src={a.dataUrl} alt={a.name} className="h-14 w-14 rounded-lg object-cover" />
                    ) : (
                      <div className="flex h-14 w-32 items-center gap-1.5 px-2 text-xs">
                        <FileIcon className="h-4 w-4 text-cyber shrink-0" />
                        <span className="truncate">{a.name}</span>
                      </div>
                    )}
                    <button
                      onClick={() => setAttach((cur) => cur.filter((_, i) => i !== idx))}
                      className="absolute -top-1 -right-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-destructive-foreground ring-2 ring-background"
                      aria-label={`Remove ${a.name}`}
                      type="button"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Image gen panel */}
            {showImg && (
              <div className="border-t border-border/50 px-3 py-3 sm:px-5 flex gap-2 animate-fade-up">
                <input
                  value={imgPrompt}
                  onChange={(e) => setImgPrompt(e.target.value)}
                  placeholder="Describe the image to generate…"
                  className="flex-1 rounded-xl bg-input px-3 py-2 text-sm outline-none ring-1 ring-border focus:ring-cyber"
                />
                <button
                  onClick={generate}
                  disabled={imgLoading || !imgPrompt.trim()}
                  className="rounded-xl bg-magenta/90 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50 hover:brightness-110 transition glow-magenta"
                  type="button"
                >
                  {imgLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Generate"}
                </button>
              </div>
            )}

            {/* Composer */}
            <footer className="border-t border-border/50 p-3 sm:p-4">
              <div className="flex items-end gap-2">
                {/* Plus menu */}
                <div className="relative">
                  <button
                    onClick={() => setShowPlus((v) => !v)}
                    className={`h-11 w-11 shrink-0 inline-flex items-center justify-center rounded-2xl ring-1 ring-border transition ${
                      showPlus ? "bg-cyber/20 text-cyber ring-cyber/40 rotate-45" : "bg-card/60 text-muted-foreground hover:text-foreground"
                    }`}
                    aria-label="Add attachment"
                    type="button"
                  >
                    <Plus className="h-5 w-5 transition-transform" />
                  </button>
                  {showPlus && (
                    <div className="absolute bottom-14 left-0 z-20 w-56 rounded-2xl glass-strong p-2 animate-scale-in shadow-xl">
                      <button
                        onClick={() => { imageRef.current?.click(); }}
                        className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm hover:bg-card/70 text-left"
                        type="button"
                      >
                        <ImageIcon className="h-4 w-4 text-cyber" /> Upload image
                      </button>
                      <button
                        onClick={() => { fileRef.current?.click(); }}
                        className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm hover:bg-card/70 text-left"
                        type="button"
                      >
                        <Paperclip className="h-4 w-4 text-magenta" /> Upload file (PDF, DOC, XLS, image)
                      </button>
                      <button
                        onClick={() => { setShowPlus(false); setCameraOpen(true); }}
                        className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm hover:bg-card/70 text-left"
                        type="button"
                      >
                        <Camera className="h-4 w-4 text-purple-glow" /> Open camera
                      </button>
                      <button
                        onClick={() => { setShowPlus(false); setShowImg((v) => !v); }}
                        className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm hover:bg-card/70 text-left"
                        type="button"
                      >
                        <Sparkles className="h-4 w-4 text-cyber" /> Generate image
                      </button>
                    </div>
                  )}
                </div>

                <input
                  ref={imageRef}
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={(e) => { void handleFiles(e.target.files, "image"); e.target.value = ""; }}
                />
                <input
                  ref={fileRef}
                  type="file"
                  multiple
                  className="hidden"
                  accept=".pdf,.jpg,.jpeg,.png,.webp,.gif,.doc,.docx,.xls,.xlsx,.csv,.txt,application/pdf,image/*,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,text/csv,text/plain"
                  onChange={(e) => { void handleFiles(e.target.files, "file"); e.target.value = ""; }}
                />


                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setModeOpen((v) => !v)}
                    aria-label="Choose response mode"
                    className="h-11 shrink-0 inline-flex items-center gap-1.5 rounded-2xl bg-card/60 px-3 text-xs font-semibold ring-1 ring-border hover:ring-cyber/40 transition"
                  >
                    {mode === "fast" ? <Zap className="h-4 w-4 text-cyber" /> : mode === "think" ? <Brain className="h-4 w-4 text-cyber" /> : <Globe className="h-4 w-4 text-cyber" />}
                    <span className="hidden sm:inline">{mode === "fast" ? "Fast" : mode === "think" ? "Think" : "Search"}</span>
                    <ChevronDown className={`h-3.5 w-3.5 transition-transform ${modeOpen ? "rotate-180" : ""}`} />
                  </button>
                  {modeOpen && (
                    <div className="absolute bottom-14 left-0 z-20 w-64 rounded-2xl glass-strong p-2 animate-scale-in shadow-xl">
                      {([
                        { id: "fast", icon: Zap, label: "Fast", desc: "Quick, instant answers" },
                        { id: "think", icon: Brain, label: "Think", desc: "Deeper reasoning for complex questions" },
                        { id: "search", icon: Globe, label: "Search the web", desc: "Live results with real links" },
                      ] as const).filter((o) => !(o.id === "search" && agent.id === "humaniser")).map((o) => (
                        <button
                          key={o.id}
                          type="button"
                          onClick={() => { setMode(o.id); setModeOpen(false); textareaRef.current?.focus(); }}
                          className={`flex w-full items-start gap-2.5 rounded-xl px-3 py-2 text-left hover:bg-card/70 ${mode === o.id ? "bg-card/70" : ""}`}
                        >
                          <o.icon className="mt-0.5 h-4 w-4 text-cyber" />
                          <span className="flex-1">
                            <span className="block text-sm font-semibold">{o.label}</span>
                            <span className="block text-[11px] text-muted-foreground">{o.desc}</span>
                          </span>
                          {mode === o.id && <Check className="mt-0.5 h-4 w-4 text-cyber" />}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <textarea
                  ref={textareaRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      void send();
                    }
                  }}
                  rows={1}
                  placeholder={`Message ${agent.name}…`}
                  className="flex-1 resize-none rounded-2xl bg-input px-4 py-3 text-sm outline-none ring-1 ring-border focus:ring-cyber min-h-[44px] max-h-32"
                />
                <button
                  onClick={() => void send()}
                  aria-label="Send message"
                  disabled={loading || (!input.trim() && attach.length === 0)}
                  className="h-11 shrink-0 inline-flex items-center gap-2 rounded-2xl bg-gradient-to-br from-cyber to-magenta px-4 text-sm font-semibold text-primary-foreground disabled:opacity-50 hover:brightness-110 transition glow-cyan"
                  type="button"
                >
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                </button>
              </div>
              <p className="mt-2 text-[11px] text-muted-foreground">
                Attach photos, files, or capture from your front/back camera. Powered by MentorWise AI.
              </p>
            </footer>
          </section>
          )}
        </div>
      </div>

      {/* Camera modal */}
      {cameraOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-md p-4 animate-fade-up">
          <div className="w-full max-w-2xl rounded-3xl glass-strong p-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3">
              <div className="flex items-center gap-2 font-display">
                <Camera className="h-5 w-5 text-cyber" />
                <span>Camera capture</span>
                <span className="rounded-full bg-cyber/15 px-2 py-0.5 text-[10px] uppercase tracking-wider text-cyber ring-1 ring-cyber/40">
                  {facingMode === "user" ? "Front" : "Back"}
                </span>
              </div>
              <button
                onClick={() => setCameraOpen(false)}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-card/60 ring-1 ring-border hover:text-foreground"
                aria-label="Close camera"
                type="button"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="relative overflow-hidden rounded-2xl bg-black aspect-video">
              {cameraError ? (
                <div className="absolute inset-0 flex items-center justify-center p-6 text-center text-sm text-muted-foreground">
                  {cameraError}
                </div>
              ) : (
                <video ref={videoRef} playsInline muted className="h-full w-full object-cover" />
              )}
            </div>
            <div className="mt-4 flex items-center justify-center gap-3">
              <button
                onClick={() => setFacingMode((f) => (f === "user" ? "environment" : "user"))}
                className="inline-flex items-center gap-2 rounded-2xl bg-card/70 px-4 py-2.5 text-sm ring-1 ring-border hover:ring-cyber/40 transition"
                type="button"
              >
                <SwitchCamera className="h-4 w-4" /> Switch
              </button>
              <button
                onClick={captureFromCamera}
                disabled={!!cameraError}
                className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-br from-cyber to-magenta px-6 py-2.5 text-sm font-semibold text-primary-foreground disabled:opacity-50 hover:brightness-110 transition glow-cyan"
                type="button"
              >
                <Camera className="h-4 w-4" /> Capture
              </button>
            </div>
          </div>
        </div>
      )}
      {agent.id === "mentor" && callOpen && (
        <MentorVideoCall open={callOpen} onClose={() => setCallOpen(false)} />
      )}
      {agent.id === "resume" && (
        <ResumeBuilder open={resumeOpen} onClose={() => setResumeOpen(false)} />
      )}
    </SiteLayout>
  );
}
