import { useEffect, useMemo, useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { chatWithAgent } from "@/lib/ai.functions";
import {
  X,
  Plus,
  Trash2,
  Download,
  Sparkles,
  Bot,
  Loader2,
  Upload,
  ChevronRight,
  ChevronLeft,
  Send,
} from "lucide-react";

type Edu = { school: string; degree: string; year: string; score: string };
type Exp = { role: string; company: string; period: string; bullets: string };
type Proj = { name: string; tech: string; link: string; bullets: string };
type Cert = { name: string; issuer: string; year: string };
type Link = { label: string; url: string };

type ResumeData = {
  photo: string;
  fullName: string;
  headline: string;
  summary: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  website: string;
  links: Link[];
  education: Edu[];
  experience: Exp[];
  projects: Proj[];
  certifications: Cert[];
  achievements: string;
  skills: string;
};

const EMPTY: ResumeData = {
  photo: "",
  fullName: "",
  headline: "",
  summary: "",
  email: "",
  phone: "",
  location: "",
  linkedin: "",
  website: "",
  links: [],
  education: [{ school: "", degree: "", year: "", score: "" }],
  experience: [{ role: "", company: "", period: "", bullets: "" }],
  projects: [{ name: "", tech: "", link: "", bullets: "" }],
  certifications: [{ name: "", issuer: "", year: "" }],
  achievements: "",
  skills: "",
};

const STORAGE_KEY = "mw-resume-draft-v1";

const STEPS = [
  { key: "profile", label: "Profile & Photo" },
  { key: "contact", label: "Contact & Links" },
  { key: "summary", label: "Headline & Summary" },
  { key: "experience", label: "Experience" },
  { key: "education", label: "Education" },
  { key: "projects", label: "Projects" },
  { key: "skills", label: "Skills" },
  { key: "certifications", label: "Certifications" },
  { key: "achievements", label: "Achievements" },
  { key: "export", label: "Review & Export" },
] as const;

type StepKey = (typeof STEPS)[number]["key"];

export function ResumeBuilder({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [data, setData] = useState<ResumeData>(EMPTY);
  const [step, setStep] = useState<StepKey>("profile");
  const [aiOpen, setAiOpen] = useState(false);
  const [aiMsgs, setAiMsgs] = useState<{ role: "user" | "assistant"; content: string }[]>([]);
  const [aiInput, setAiInput] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const chat = useServerFn(chatWithAgent);
  const printRef = useRef<HTMLDivElement>(null);

  // Persist draft
  useEffect(() => {
    if (!open) return;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setData({ ...EMPTY, ...JSON.parse(raw) });
    } catch {
      /* ignore */
    }
  }, [open]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch {
      /* ignore */
    }
  }, [data]);

  const stepIdx = STEPS.findIndex((s) => s.key === step);
  const guidance = useMemo(() => stepGuidance(step), [step]);

  // Auto-show step guidance in AI panel
  useEffect(() => {
    if (!open) return;
    setAiMsgs((m) => {
      if (m.length === 0)
        return [
          {
            role: "assistant",
            content:
              "Hi, I'm your Resume AI assistant. I'll guide you step by step. " + guidance,
          },
        ];
      return m;
    });
  }, [open, guidance]);

  function update<K extends keyof ResumeData>(k: K, v: ResumeData[K]) {
    setData((d) => ({ ...d, [k]: v }));
  }

  async function onPhoto(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    if (f.size > 3 * 1024 * 1024) {
      alert("Photo must be under 3MB.");
      return;
    }
    const r = new FileReader();
    r.onload = () => update("photo", String(r.result));
    r.readAsDataURL(f);
  }

  async function askAI(textOverride?: string) {
    const text = (textOverride ?? aiInput).trim();
    if (!text || aiLoading) return;
    // Build a compact snapshot so we stay well under the 8000-char limit
    // enforced by the chat server function input validator. Photos (large
    // data URLs) are stripped because they would also blow past the cap.
    const d = data;
    const snapshot = {
      step,
      fullName: d.fullName,
      headline: d.headline,
      summary: d.summary.slice(0, 800),
      contact: {
        email: d.email,
        phone: d.phone,
        location: d.location,
        linkedin: d.linkedin,
        website: d.website,
        links: d.links
          .filter((l) => l.label.trim() || l.url.trim())
          .slice(0, 5)
          .map((l) => ({ label: l.label, url: l.url })),
      },
      education: d.education
        .filter((e) => e.school.trim() || e.degree.trim())
        .slice(0, 6)
        .map((e) => ({
          school: e.school,
          degree: e.degree,
          year: e.year,
          score: e.score,
        })),
      experience: d.experience
        .filter((x) => x.role.trim() || x.company.trim())
        .slice(0, 6)
        .map((x) => ({
          role: x.role,
          company: x.company,
          period: x.period,
          bullets: x.bullets.slice(0, 900),
        })),
      projects: d.projects
        .filter((p) => p.name.trim())
        .slice(0, 6)
        .map((p) => ({
          name: p.name,
          tech: p.tech,
          link: p.link,
          bullets: p.bullets.slice(0, 600),
        })),
      certifications: d.certifications
        .filter((c) => c.name.trim())
        .slice(0, 6)
        .map((c) => ({ name: c.name, issuer: c.issuer, year: c.year })),
      skills: d.skills.slice(0, 800),
      achievements: d.achievements.slice(0, 500),
    };
    // Cap the whole prompt under the 8000-char input cap enforced by the
    // chat server function: the question is trimmed to 3000 chars and the
    // resume snapshot absorbs any remaining overflow, so long pastes never
    // get rejected with a generic "AI is unreachable" error.
    const question =
      text.length > 3000 ? `${text.slice(0, 3000)}…(question truncated)` : text;
    const instructions =
      `. You are the side assistant inside the ATS Resume Builder. Current step: ${step}. ` +
      `Reply with concise, ATS-friendly, recruiter-grade guidance based on the ACTUAL resume data in the snapshot. If they ask you to write content, give them the exact text to paste.`;
    let json = JSON.stringify(snapshot);
    const prefix = `User asks: ${question}${instructions} Resume snapshot (JSON): `;
    const maxJson = Math.max(200, 7800 - prefix.length);
    if (json.length > maxJson) json = `${json.slice(0, maxJson)}…(truncated)`;
    const ctx = `${prefix}${json}.`;
    const next = [...aiMsgs, { role: "user" as const, content: text }];
    setAiMsgs(next);
    setAiInput("");
    setAiLoading(true);
    try {
      const history = next.slice(-6).map((m) => ({
        role: m.role,
        content: m.content.slice(0, 1000),
      }));
      const res = await chat({
        data: {
          agentId: "resume",
          messages: [...history.slice(0, -1), { role: "user" as const, content: ctx }],
        },
      });
      setAiMsgs((m) => [...m, { role: "assistant", content: res.reply }]);
    } catch (err) {
      console.error("ResumeBuilder askAI failed", err);
      const message = err instanceof Error ? err.message : String(err ?? "");
      const friendly = /unauthor/i.test(message)
        ? "Please sign in to your MentorWise AI account to use the assistant."
        : /rate|429/i.test(message)
          ? "I'm getting a lot of requests. Try again in a moment."
          : /quota|402/i.test(message)
            ? "Daily AI quota is exhausted. Please try again later."
            : "AI is unreachable right now. Please retry shortly.";
      setAiMsgs((m) => [...m, { role: "assistant", content: friendly }]);
    } finally {
      setAiLoading(false);
    }
  }

  function downloadPDF() {
    window.print();
  }

  function resetAll() {
    if (!confirm("Clear all resume fields? This cannot be undone.")) return;
    setData(EMPTY);
    setStep("profile");
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] bg-background/95 backdrop-blur-md overflow-y-auto print:bg-white print:static print:overflow-visible">
      {/* Top bar — hidden in print */}
      <div className="sticky top-0 z-10 border-b border-border/60 bg-background/90 backdrop-blur px-4 py-3 print:hidden">
        <div className="mx-auto max-w-7xl flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-cyber" />
            <h2 className="font-display text-lg font-semibold">ATS Resume Builder</h2>
            <span className="hidden sm:inline rounded-full bg-cyber/15 px-2 py-0.5 text-[10px] uppercase tracking-wider text-cyber ring-1 ring-cyber/40">
              MNC-grade
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={resetAll}
              className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-card/60 px-3 py-1.5 text-xs ring-1 ring-border hover:ring-destructive/50 transition"
              type="button"
            >
              <Trash2 className="h-3.5 w-3.5" /> Reset
            </button>
            <button
              onClick={downloadPDF}
              className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-br from-cyber to-magenta px-4 py-1.5 text-xs font-semibold text-primary-foreground glow-cyan hover:brightness-110 transition"
              type="button"
            >
              <Download className="h-3.5 w-3.5" /> Download PDF
            </button>
            <button
              onClick={onClose}
              className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-card/60 ring-1 ring-border hover:text-foreground"
              aria-label="Close"
              type="button"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-3 py-6 sm:px-6 print:p-0 print:max-w-none">
        <div className="grid gap-6 lg:grid-cols-[340px_1fr] print:block">
          {/* Form column */}
          <div className="space-y-4 print:hidden">
            {/* Stepper */}
            <div className="rounded-2xl glass p-3">
              <div className="flex items-center justify-between mb-2">
                <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                  Step {stepIdx + 1} of {STEPS.length}
                </div>
                <div className="flex gap-1">
                  <button
                    disabled={stepIdx === 0}
                    onClick={() => setStep(STEPS[Math.max(0, stepIdx - 1)].key)}
                    className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-card/60 ring-1 ring-border disabled:opacity-40"
                    type="button"
                    aria-label="Previous step"
                  >
                    <ChevronLeft className="h-3.5 w-3.5" />
                  </button>
                  <button
                    disabled={stepIdx === STEPS.length - 1}
                    onClick={() => setStep(STEPS[Math.min(STEPS.length - 1, stepIdx + 1)].key)}
                    className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-card/60 ring-1 ring-border disabled:opacity-40"
                    type="button"
                    aria-label="Next step"
                  >
                    <ChevronRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
              <div className="flex flex-col gap-1">
                {STEPS.map((s, i) => (
                  <button
                    key={s.key}
                    onClick={() => setStep(s.key)}
                    className={`text-left text-xs rounded-lg px-2 py-1.5 transition flex items-center gap-2 ${
                      s.key === step
                        ? "bg-cyber/15 text-foreground ring-1 ring-cyber/40"
                        : "text-muted-foreground hover:text-foreground hover:bg-card/60"
                    }`}
                    type="button"
                  >
                    <span
                      className={`inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-semibold ${
                        i < stepIdx
                          ? "bg-cyber text-primary-foreground"
                          : i === stepIdx
                            ? "bg-magenta text-primary-foreground"
                            : "bg-card/70 text-muted-foreground ring-1 ring-border"
                      }`}
                    >
                      {i + 1}
                    </span>
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Step fields */}
            <div className="rounded-2xl glass-strong p-4 space-y-3">
              <StepFields step={step} data={data} update={update} onPhoto={onPhoto} />
            </div>

            <button
              onClick={() => setAiOpen(true)}
              className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-card/60 px-4 py-3 text-sm ring-1 ring-border hover:ring-cyber/40 transition"
              type="button"
            >
              <Bot className="h-4 w-4 text-cyber" /> Ask AI for this step
            </button>
          </div>

          {/* Live preview */}
          <div className="print:block">
            <div className="hidden sm:block mb-2 text-[10px] uppercase tracking-[0.18em] text-muted-foreground print:hidden">
              Live Preview · ATS-optimised A4
            </div>
            <div ref={printRef} className="resume-page mx-auto bg-white text-[#111] shadow-2xl print:shadow-none print:mx-0">
              <ResumePreview data={data} tpl={tpl} />
            </div>
          </div>
        </div>
      </div>

      {/* Floating AI assistant — circle button */}
      <button
        onClick={() => setAiOpen((v) => !v)}
        className="fixed bottom-6 right-6 z-[70] inline-flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-cyber to-magenta text-primary-foreground shadow-2xl glow-cyan hover:scale-105 transition print:hidden"
        aria-label="Open AI assistant"
        type="button"
      >
        <Bot className="h-6 w-6" />
        <span className="absolute -top-1 -right-1 inline-flex h-3 w-3 rounded-full bg-cyber ring-2 ring-background animate-pulse" />
      </button>

      {/* AI assistant panel */}
      {aiOpen && (
        <div className="fixed bottom-24 right-4 z-[70] w-[min(380px,calc(100vw-2rem))] h-[min(520px,70vh)] rounded-3xl glass-strong shadow-2xl flex flex-col overflow-hidden print:hidden animate-scale-in">
          <div className="flex items-center justify-between border-b border-border/50 px-4 py-3">
            <div className="flex items-center gap-2">
              <div className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-cyber/30 to-magenta/20 text-cyber ring-1 ring-cyber/40">
                <Bot className="h-4 w-4" />
              </div>
              <div>
                <div className="text-sm font-semibold">Resume AI Guide</div>
                <div className="text-[10px] text-muted-foreground">
                  Step: {STEPS[stepIdx].label}
                </div>
              </div>
            </div>
            <button
              onClick={() => setAiOpen(false)}
              className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-card/60 ring-1 ring-border"
              type="button"
              aria-label="Close assistant"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto px-3 py-3 space-y-2">
            {aiMsgs.map((m, i) => (
              <div
                key={i}
                className={`max-w-[92%] rounded-2xl px-3 py-2 text-xs leading-relaxed whitespace-pre-wrap ${
                  m.role === "user"
                    ? "ml-auto bg-cyber/20 ring-1 ring-cyber/40"
                    : "bg-card/85 ring-1 ring-border"
                }`}
              >
                {m.content}
              </div>
            ))}
            {aiLoading && (
              <div className="bg-card/85 ring-1 ring-border rounded-2xl px-3 py-2 text-xs inline-flex items-center gap-2">
                <Loader2 className="h-3.5 w-3.5 animate-spin text-cyber" /> Thinking…
              </div>
            )}
          </div>
          <div className="border-t border-border/50 p-2 flex flex-wrap gap-1.5">
            {quickAsks(step).map((q) => (
              <button
                key={q}
                onClick={() => void askAI(q)}
                className="rounded-full bg-card/60 px-2.5 py-1 text-[11px] ring-1 ring-border hover:ring-cyber/40"
                type="button"
              >
                {q}
              </button>
            ))}
          </div>
          <div className="border-t border-border/50 p-2 flex gap-2">
            <input
              value={aiInput}
              onChange={(e) => setAiInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") void askAI();
              }}
              placeholder="Ask for help on this step…"
              className="flex-1 rounded-xl bg-input px-3 py-2 text-xs outline-none ring-1 ring-border focus:ring-cyber"
            />
            <button
              onClick={() => void askAI()}
              disabled={aiLoading || !aiInput.trim()}
              className="rounded-xl bg-gradient-to-br from-cyber to-magenta px-3 text-primary-foreground disabled:opacity-50"
              type="button"
              aria-label="Send"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      <style>{RESUME_CSS}</style>
    </div>
  );
}

function stepGuidance(step: StepKey): string {
  switch (step) {
    case "profile":
      return "Upload a clean, professional headshot (light background, shoulders visible) and enter your full legal name as it appears on your ID.";
    case "contact":
      return "Add a professional email (firstname.lastname@), phone with country code, city, LinkedIn URL, and portfolio/GitHub URLs. All links must be clickable.";
    case "summary":
      return "Write a 1-line recruiter-magnet headline (role + value), then a 2-3 sentence summary quantifying your strengths.";
    case "experience":
      return "List most recent first. Each bullet should start with a strong verb and end with a metric (%, ₹, time, scale).";
    case "education":
      return "Include degree, institution, year, and CGPA/%. Keep it tight — recruiters scan, they don't read.";
    case "projects":
      return "Each project: name, tech stack, link, and 2-3 impact bullets. Show what you built and what changed.";
    case "skills":
      return "Comma-separated technical + tools. Mirror keywords from the JD to clear ATS filters.";
    case "certifications":
      return "Only list certificates from recognised issuers (Google, AWS, Microsoft, NPTEL, Coursera).";
    case "achievements":
      return "Awards, ranks, scholarships, hackathon wins, publications. One per line.";
    case "export":
      return "Review the preview on the right. Hit Download PDF to export a clean, ATS-friendly single-page resume.";
  }
}

function quickAsks(step: StepKey): string[] {
  switch (step) {
    case "summary":
      return ["Write my headline", "Draft a 3-line summary", "Make it more impact-driven"];
    case "experience":
      return ["Rewrite my bullets with metrics", "Suggest 3 strong action verbs"];
    case "projects":
      return ["Suggest portfolio projects", "Quantify my project impact"];
    case "skills":
      return ["What skills should I add?", "Match skills to a Data Analyst JD"];
    default:
      return ["Guide me on this step", "Show an example"];
  }
}

/* ===================== Step fields ===================== */

function StepFields({
  step,
  data,
  update,
  onPhoto,
}: {
  step: StepKey;
  data: ResumeData;
  update: <K extends keyof ResumeData>(k: K, v: ResumeData[K]) => void;
  onPhoto: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  if (step === "profile") {
    return (
      <>
        <div className="flex items-center gap-3">
          <div className="h-20 w-20 rounded-2xl bg-card/60 ring-1 ring-border overflow-hidden">
            {data.photo ? (
              <img src={data.photo} alt="Profile" className="h-full w-full object-cover" />
            ) : (
              <div className="h-full w-full flex items-center justify-center text-[10px] text-muted-foreground">
                No photo
              </div>
            )}
          </div>
          <label className="cursor-pointer inline-flex items-center gap-1.5 rounded-xl bg-card/60 px-3 py-2 text-xs ring-1 ring-border hover:ring-cyber/40 transition">
            <Upload className="h-3.5 w-3.5" /> Upload photo
            <input type="file" accept="image/*" className="hidden" onChange={onPhoto} />
          </label>
        </div>
        <Field label="Full name" value={data.fullName} onChange={(v) => update("fullName", v)} placeholder="Faizal Ahmed" />
      </>
    );
  }

  if (step === "contact") {
    return (
      <>
        <Field label="Email" value={data.email} onChange={(v) => update("email", v)} placeholder="you@gmail.com" />
        <Field label="Phone" value={data.phone} onChange={(v) => update("phone", v)} placeholder="+91 9xxxxxxxxx" />
        <Field label="Location" value={data.location} onChange={(v) => update("location", v)} placeholder="Chennai, India" />
        <Field label="LinkedIn URL" value={data.linkedin} onChange={(v) => update("linkedin", v)} placeholder="https://linkedin.com/in/username" />
        <Field label="Website / Portfolio URL" value={data.website} onChange={(v) => update("website", v)} placeholder="https://yourname.com" />
        <ListEditor
          title="Other links (GitHub, Behance, etc.)"
          items={data.links}
          empty={{ label: "", url: "" }}
          render={(it, set) => (
            <>
              <Field label="Label" value={it.label} onChange={(v) => set({ ...it, label: v })} placeholder="GitHub" />
              <Field label="URL" value={it.url} onChange={(v) => set({ ...it, url: v })} placeholder="https://github.com/you" />
            </>
          )}
          onChange={(v) => update("links", v)}
        />
      </>
    );
  }

  if (step === "summary") {
    return (
      <>
        <Field label="Headline" value={data.headline} onChange={(v) => update("headline", v)} placeholder="B.Com Final Year | Aspiring Data Analyst | Excel · SQL · Power BI" />
        <Area label="Professional summary" value={data.summary} onChange={(v) => update("summary", v)} placeholder="2-3 sentence summary with quantified strengths." rows={5} />
      </>
    );
  }

  if (step === "experience") {
    return (
      <ListEditor
        title="Experience"
        items={data.experience}
        empty={{ role: "", company: "", period: "", bullets: "" }}
        onChange={(v) => update("experience", v)}
        render={(it, set) => (
          <>
            <Field label="Role" value={it.role} onChange={(v) => set({ ...it, role: v })} placeholder="Finance Intern" />
            <Field label="Company" value={it.company} onChange={(v) => set({ ...it, company: v })} placeholder="Deloitte" />
            <Field label="Period" value={it.period} onChange={(v) => set({ ...it, period: v })} placeholder="May 2025 – Jul 2025" />
            <Area label="Bullets (one per line)" value={it.bullets} onChange={(v) => set({ ...it, bullets: v })} rows={4} placeholder={"Automated 12 reconciliation reports, saving 18 hrs/week\nLed a 4-person audit sprint covering ₹4.2 Cr in transactions"} />
          </>
        )}
      />
    );
  }

  if (step === "education") {
    return (
      <ListEditor
        title="Education"
        items={data.education}
        empty={{ school: "", degree: "", year: "", score: "" }}
        onChange={(v) => update("education", v)}
        render={(it, set) => (
          <>
            <Field label="Institution" value={it.school} onChange={(v) => set({ ...it, school: v })} placeholder="University of Madras" />
            <Field label="Degree" value={it.degree} onChange={(v) => set({ ...it, degree: v })} placeholder="B.Com (Hons), Finance" />
            <Field label="Year" value={it.year} onChange={(v) => set({ ...it, year: v })} placeholder="2023 – 2026" />
            <Field label="Score / CGPA" value={it.score} onChange={(v) => set({ ...it, score: v })} placeholder="CGPA 8.7 / 10" />
          </>
        )}
      />
    );
  }

  if (step === "projects") {
    return (
      <ListEditor
        title="Projects"
        items={data.projects}
        empty={{ name: "", tech: "", link: "", bullets: "" }}
        onChange={(v) => update("projects", v)}
        render={(it, set) => (
          <>
            <Field label="Project name" value={it.name} onChange={(v) => set({ ...it, name: v })} placeholder="MNC Hiring Funnel Dashboard" />
            <Field label="Tech / tools" value={it.tech} onChange={(v) => set({ ...it, tech: v })} placeholder="Excel, Power BI, SQL" />
            <Field label="Link" value={it.link} onChange={(v) => set({ ...it, link: v })} placeholder="https://github.com/you/project" />
            <Area label="Bullets" value={it.bullets} onChange={(v) => set({ ...it, bullets: v })} rows={3} placeholder="One bullet per line, start with a verb, end with metric." />
          </>
        )}
      />
    );
  }

  if (step === "skills") {
    return <Area label="Skills (comma separated)" value={data.skills} onChange={(v) => update("skills", v)} rows={4} placeholder="Excel, SQL, Power BI, Tally, Python, Financial Modelling" />;
  }

  if (step === "certifications") {
    return (
      <ListEditor
        title="Certifications"
        items={data.certifications}
        empty={{ name: "", issuer: "", year: "" }}
        onChange={(v) => update("certifications", v)}
        render={(it, set) => (
          <>
            <Field label="Certificate" value={it.name} onChange={(v) => set({ ...it, name: v })} placeholder="Google Data Analytics" />
            <Field label="Issuer" value={it.issuer} onChange={(v) => set({ ...it, issuer: v })} placeholder="Coursera · Google" />
            <Field label="Year" value={it.year} onChange={(v) => set({ ...it, year: v })} placeholder="2025" />
          </>
        )}
      />
    );
  }

  if (step === "achievements") {
    return <Area label="Achievements (one per line)" value={data.achievements} onChange={(v) => update("achievements", v)} rows={6} placeholder={"Winner — TCS CodeVita 2025\nMerit Scholarship — top 1% of cohort"} />;
  }

  return (
    <div className="text-xs text-muted-foreground space-y-2">
      <p>Everything looks ready. Review the live preview, then hit Download PDF (top-right) to export.</p>
      <p>Pro tip: keep it to one page. Use the AI assistant to tighten any section.</p>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">{label}</div>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-lg bg-input px-3 py-2 text-sm outline-none ring-1 ring-border focus:ring-cyber"
      />
    </label>
  );
}

function Area({
  label,
  value,
  onChange,
  placeholder,
  rows = 3,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  rows?: number;
}) {
  return (
    <label className="block">
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">{label}</div>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className="w-full rounded-lg bg-input px-3 py-2 text-sm outline-none ring-1 ring-border focus:ring-cyber resize-y"
      />
    </label>
  );
}

function ListEditor<T>({
  title,
  items,
  empty,
  render,
  onChange,
}: {
  title: string;
  items: T[];
  empty: T;
  render: (item: T, set: (next: T) => void) => React.ReactNode;
  onChange: (items: T[]) => void;
}) {
  return (
    <div className="space-y-3">
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{title}</div>
      {items.map((it, i) => (
        <div key={i} className="rounded-xl bg-card/50 p-3 ring-1 ring-border space-y-2 relative">
          <button
            onClick={() => onChange(items.filter((_, j) => j !== i))}
            className="absolute top-2 right-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-card/60 ring-1 ring-border hover:text-destructive"
            type="button"
            aria-label="Remove"
          >
            <Trash2 className="h-3 w-3" />
          </button>
          {render(it, (next) => onChange(items.map((x, j) => (j === i ? next : x))))}
        </div>
      ))}
      <button
        onClick={() => onChange([...items, empty])}
        className="w-full inline-flex items-center justify-center gap-1.5 rounded-xl bg-card/60 px-3 py-2 text-xs ring-1 ring-border hover:ring-cyber/40"
        type="button"
      >
        <Plus className="h-3.5 w-3.5" /> Add another
      </button>
    </div>
  );
}

/* ===================== Resume preview (ATS friendly) ===================== */

export function ResumePreview({ data, tpl }: { data: ResumeData; tpl: ResumeTemplate }) {
  const skills = data.skills.split(",").map((s) => s.trim()).filter(Boolean);
  const achievements = data.achievements.split("\n").map((s) => s.trim()).filter(Boolean);
  const L = tpl.layout;
  const isSide = L === "sidebar";
  const isBanner = L === "banner";
  const centered = L === "centered";

  const contacts = (
    <div className={`rx-contact ${centered ? "justify-center" : ""} ${isSide ? "flex-col !gap-y-1" : ""}`}>
      {data.email && <a href={`mailto:${data.email}`}>{data.email}</a>}
      {data.phone && <span>{data.phone}</span>}
      {data.location && <span>{data.location}</span>}
      {data.linkedin && <a href={data.linkedin} target="_blank" rel="noreferrer">LinkedIn</a>}
      {data.website && <a href={data.website} target="_blank" rel="noreferrer">Portfolio</a>}
      {data.links.map((l, i) => (l.url ? <a key={i} href={l.url} target="_blank" rel="noreferrer">{l.label || l.url}</a> : null))}
    </div>
  );

  const header = (
    <header className={`rx-header ${centered ? "text-center flex-col items-center" : ""} ${isBanner ? "rx-banner" : ""}`}>
      {data.photo && <img src={data.photo} alt={data.fullName} className="rx-photo" />}
      <div className="min-w-0 flex-1">
        <h1 className="rx-name">{data.fullName || "Your Name"}</h1>
        {data.headline && <p className="rx-headline">{data.headline}</p>}
        {!isSide && contacts}
      </div>
    </header>
  );

  const summary = data.summary && <Section title="Professional Summary"><p>{data.summary}</p></Section>;
  const experience = data.experience.some((e) => e.role || e.company) && (
    <Section title="Experience">
      {data.experience.filter((e) => e.role || e.company).map((e, i) => (
        <div key={i} className="rx-item">
          <div className="rx-row">
            <div className="rx-title">{e.role}{e.company && <span className="rx-sub"> · {e.company}</span>}</div>
            <div className="rx-date">{e.period}</div>
          </div>
          <Bullets text={e.bullets} />
        </div>
      ))}
    </Section>
  );
  const projects = data.projects.some((p) => p.name) && (
    <Section title="Projects">
      {data.projects.filter((p) => p.name).map((p, i) => (
        <div key={i} className="rx-item">
          <div className="rx-row">
            <div className="rx-title">{p.name}{p.tech && <span className="rx-sub"> · {p.tech}</span>}</div>
            {p.link && <a href={p.link} target="_blank" rel="noreferrer" className="rx-date">Link</a>}
          </div>
          <Bullets text={p.bullets} />
        </div>
      ))}
    </Section>
  );
  const education = data.education.some((e) => e.school || e.degree) && (
    <Section title="Education">
      {data.education.filter((e) => e.school || e.degree).map((e, i) => (
        <div key={i} className={`rx-item ${isSide ? "" : "rx-row"}`}>
          <div>
            <div className="rx-title">{e.degree}</div>
            <div className="rx-sub">{e.school}{e.score ? ` · ${e.score}` : ""}</div>
          </div>
          <div className="rx-date">{e.year}</div>
        </div>
      ))}
    </Section>
  );
  const skillsEl = skills.length > 0 && (
    <Section title="Skills">
      {isSide ? <ul className="rx-plain">{skills.map((s) => <li key={s}>{s}</li>)}</ul> : <p>{skills.join(" · ")}</p>}
    </Section>
  );
  const certs = data.certifications.some((c) => c.name) && (
    <Section title="Certifications">
      {data.certifications.filter((c) => c.name).map((c, i) => (
        <div key={i} className={`rx-item ${isSide ? "" : "rx-row"}`}>
          <span><span className="rx-title">{c.name}</span>{c.issuer && <span className="rx-sub"> · {c.issuer}</span>}</span>
          <span className="rx-date">{c.year}</span>
        </div>
      ))}
    </Section>
  );
  const ach = achievements.length > 0 && (
    <Section title="Achievements">
      <ul className="rx-bullets">{achievements.map((a, i) => <li key={i}>{a}</li>)}</ul>
    </Section>
  );

  return (
    <div
      className={`rx rx-${L}`}
      style={{ ["--rx-accent" as string]: tpl.accent, fontFamily: tpl.font } as React.CSSProperties}
    >
      {header}
      {isSide ? (
        <div className="rx-cols">
          <aside className="rx-side">
            <Section title="Contact">{contacts}</Section>
            {skillsEl}{education}{certs}
          </aside>
          <main>{summary}{experience}{projects}{ach}</main>
        </div>
      ) : (
        <>{summary}{experience}{projects}{education}{skillsEl}{certs}{ach}</>
      )}
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rx-section">
      <h2 className="rx-h2">{title}</h2>
      {children}
    </section>
  );
}

function Bullets({ text }: { text: string }) {
  const lines = text.split("\n").map((l) => l.replace(/^[-•*\s]+/, "").trim()).filter(Boolean);
  if (lines.length === 0) return null;
  return <ul className="rx-bullets">{lines.map((l, i) => <li key={i}>{l}</li>)}</ul>;
}

export const RESUME_CSS = `
.resume-page { width: 210mm; min-height: 297mm; padding: 15mm 16mm; box-sizing: border-box; background: #fff; color: #1a1a1a; }
.rx { font-size: 10.5pt; line-height: 1.42; color: #1a1a1a; }
.rx a { color: var(--rx-accent); text-decoration: none; }
.rx-header { display: flex; gap: 14pt; align-items: flex-start; padding-bottom: 10pt; margin-bottom: 4pt; border-bottom: 2px solid var(--rx-accent); }
.rx-photo { width: 80pt; height: 80pt; border-radius: 9999px; object-fit: cover; flex-shrink: 0; }
.rx-name { font-size: 22pt; font-weight: 700; line-height: 1.1; color: var(--rx-accent); letter-spacing: -0.01em; margin: 0; }
.rx-headline { margin: 4pt 0 0; font-size: 11pt; font-weight: 500; color: #333; }
.rx-contact { display: flex; flex-wrap: wrap; gap: 2pt 12pt; margin-top: 6pt; font-size: 9.3pt; color: #444; }
.rx-section { margin-top: 11pt; }
.rx-h2 { font-size: 10.5pt; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: var(--rx-accent); border-bottom: 1px solid color-mix(in srgb, var(--rx-accent) 25%, #fff); padding-bottom: 3pt; margin: 0 0 6pt; }
.rx-section p { margin: 0; }
.rx-item { margin-bottom: 7pt; break-inside: avoid; page-break-inside: avoid; }
.rx-item:last-child { margin-bottom: 0; }
.rx-row { display: flex; justify-content: space-between; align-items: baseline; gap: 10pt; }
.rx-title { font-weight: 600; color: #111; }
.rx-sub { font-weight: 400; color: #4a4a4a; }
.rx-date { font-size: 9pt; color: #666; white-space: nowrap; flex-shrink: 0; }
.rx-bullets { list-style: disc; padding-left: 14pt; margin: 3pt 0 0; }
.rx-bullets li { margin: 1.5pt 0; padding-left: 1pt; }
.rx-plain { list-style: none; padding: 0; margin: 0; }
.rx-plain li { margin: 1.5pt 0; }
.rx-centered .rx-header { text-align: center; }
.rx-centered .rx-h2 { text-align: center; }
.rx-banner .rx-header { background: var(--rx-accent); margin: -15mm -16mm 6pt; padding: 12mm 16mm 9mm; border: 0; }
.rx-banner .rx-name, .rx-banner .rx-headline, .rx-banner .rx-contact, .rx-banner .rx-contact a { color: #fff; }
.rx-minimal .rx-header { border-bottom: 0; }
.rx-minimal .rx-h2 { border: 0; letter-spacing: 0.18em; font-size: 9.5pt; }
.rx-compact { font-size: 9.6pt; line-height: 1.33; }
.rx-compact .rx-name { font-size: 18pt; }
.rx-compact .rx-section { margin-top: 8pt; }
.rx-cols { display: grid; grid-template-columns: 58mm 1fr; gap: 8mm; }
.rx-side { border-right: 1px solid color-mix(in srgb, var(--rx-accent) 20%, #fff); padding-right: 6mm; font-size: 9.5pt; }
.rx-side .rx-section:first-child, .rx-cols main > .rx-section:first-child { margin-top: 8pt; }
@media print {
  @page { size: A4; margin: 0; }
  html, body { background: #fff !important; }
  body * { visibility: hidden !important; }
  .resume-page, .resume-page * { visibility: visible !important; }
  .resume-page { position: absolute !important; left: 0; top: 0; margin: 0 !important; box-shadow: none !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
}
`;
