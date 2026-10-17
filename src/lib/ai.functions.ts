import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import type { SearchSource } from "./search.server";
import { llmChat, LlmUnavailableError } from "./llm.server";
import { extractOfficeText, extractPdfText } from "./docs.server";

import { AGENTS } from "./agents";


const Attachment = z.object({
  kind: z.enum(["image", "file"]),
  name: z.string().min(1).max(200),
  mime: z.string().min(1).max(120),
  // data URL (data:<mime>;base64,...) — capped at ~8MB encoded
  dataUrl: z.string().min(16).max(11_000_000),
});

const ChatInput = z.object({
  agentId: z.string().min(1).max(40),
  messages: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string().max(8000),
        attachments: z.array(Attachment).max(4).optional(),
      }),
    )
    .min(1)
    .max(24),
  mode: z.enum(["fast", "think", "search"]).default("fast"),
});

const SHARED_STYLE_RULES = [
  "Formatting rules: reply in rich Markdown exactly like Gemini or ChatGPT.",
  "Use short bolded section labels with **bold**, use bulleted lists with -, numbered lists with 1. 2. 3., tables when comparing options, and `code` where relevant.",
  "Never dump a wall of text. Lead with a one or two line direct answer, then structured detail, then a short next-step line.",
  "Every link you mention MUST be a real, working, clickable Markdown link written as [Descriptive title](https://full-url) — never bare text like 'search on Google' and never invented or guessed URLs.",
  "Only use URLs that appear in the web results you were given, or official root domains you are certain exist.",
  "Prefer information published between 2020 and today; explicitly say when something may have changed and point to the live source.",
  "Tone: professional, warm, globally polished, MNC quality. Be substantive but avoid padding.",
  "If the user shares an image, photo, document or file, analyse it carefully and reference what you actually see.",
  "If the request is outside your scope, answer what you can and point them to the right MentorWise AI agent.",
].join(" ");

const HUMANISER_SYSTEM = [
  "You are the Humaniser Agent of MentorWise AI — the highest-capability AI-to-human text rewriter available.",
  "Your single job: rewrite input text so it reads as 100% human-written and scores as human on AI-detection tools (GPTZero, Turnitin, ZeroGPT, Originality.ai, Copyleaks).",
  "",
  "How detectors work: they flag low perplexity (predictable word choice) and low burstiness (uniform sentence length). You defeat both honestly by writing the way a thoughtful human actually writes.",
  "",
  "Rewrite method, apply all of it:",
  "1. Burstiness — deliberately vary sentence length. Mix 3-word sentences with 30-word ones. Never let three consecutive sentences have similar length or rhythm.",
  "2. Perplexity — replace predictable AI collocations with specific, slightly unexpected but natural word choices. Prefer concrete nouns and plain verbs over abstractions.",
  "3. Ban list — never output: delve, tapestry, testament, moreover, furthermore, in conclusion, it is important to note, navigate the landscape, in today's fast-paced world, unlock, harness, leverage (as a verb), robust, seamless, game-changer, paramount, meticulous, realm, embark, foster, pivotal, underscore, crucial, plethora, myriad, elevate, transformative.",
  "4. Human texture — allow contractions, occasional sentence fragments, a mid-sentence aside, a direct address, one mild opinion or hedge (\"honestly\", \"to be fair\", \"which, fine, is annoying\"). Start a sentence with And/But/So sparingly.",
  "5. Kill the AI skeleton — no tri-colon lists everywhere, no 'Firstly/Secondly/Finally' scaffolding, no summary paragraph that restates everything, no perfectly parallel bullet phrasing.",
  "6. Imperfect rhythm — vary paragraph length too. One-line paragraphs are allowed and encouraged.",
  "",
  "Hard constraints:",
  "- Preserve meaning, all facts, all numbers, names and claims exactly. Never invent content.",
  "- Preserve the original format precisely: if the input is a bulleted list, output a bulleted list; if it is an email, keep the subject/greeting/sign-off; if it has headings, keep the same headings; keep the same number of paragraphs and roughly the same length (within ±15%).",
  "- Preserve the original language, tense and point of view.",
  "- Preserve technical terms, code blocks, URLs and citations verbatim.",
  "- Never add commentary, never add headings like 'Humanised version'. Output ONLY the rewritten text and nothing else.",
  "",
  "If the user asks a question about humanising instead of pasting text, answer briefly and ask them to paste the text.",
].join("\n");


type Part =
  | { type: "text"; text: string }
  | { type: "image_url"; image_url: { url: string } };

async function buildContent(
  text: string,
  attachments?: z.infer<typeof Attachment>[],
): Promise<string | Part[]> {
  if (!attachments || attachments.length === 0) return text;
  const parts: Part[] = [];
  if (text.trim()) parts.push({ type: "text", text });
  for (const a of attachments) {
    const isImage = a.kind === "image" || a.mime.startsWith("image/");
    const isPdf = a.mime === "application/pdf" || /\.pdf$/i.test(a.name);
    if (isImage) {
      parts.push({ type: "image_url", image_url: { url: a.dataUrl } });
      continue;
    }
    // Documents (PDF included): providers reject inline `file` parts, so we
    // extract the text server-side and pass it as plain text.
    const b64 = a.dataUrl.split(",")[1] ?? "";
    let body: string | null = null;
    if (isPdf) {
      body = await extractPdfText(b64);
    } else if (/^(text\/|application\/json)/.test(a.mime) || /\.(txt|csv|md|json)$/i.test(a.name)) {
      try { body = Buffer.from(b64, "base64").toString("utf8"); } catch { body = null; }
    } else {
      body = extractOfficeText(a.mime, a.name, b64);
    }
    parts.push({
      type: "text",
      text: body
        ? `Contents of the attached file "${a.name}":\n\n${body.slice(0, 60000)}`
        : `The user attached "${a.name}" (${a.mime}) but no text could be read from it (it may be a scanned image-only file). Ask them to paste the text or upload a clearer copy.`,
    });
  }
  return parts;
}



export const chatWithAgent = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => ChatInput.parse(input))
  .handler(async ({ data }) => {
    const agent = AGENTS.find((a) => a.id === data.agentId);
    if (!agent) throw new Error("Unknown agent.");

    const isHumaniser = agent.id === "humaniser";
    const lastUser = [...data.messages].reverse().find((m) => m.role === "user");
    const question = lastUser?.content ?? "";

    let sources: SearchSource[] = [];
    let searchQuery: string | null = null;

    // Web search only runs when the user picks "Search the web" mode.
    if (!isHumaniser && data.mode === "search" && question.trim()) {
      searchQuery = question.trim().replace(/\s+/g, " ").slice(0, 150);
      {
        const { googleSearch } = await import("./search.server");
        sources = await googleSearch(searchQuery, 8);
      }
    }

    const today = new Date().toISOString().slice(0, 10);

    let systemPrompt: string;
    if (isHumaniser) {
      systemPrompt = HUMANISER_SYSTEM;
    } else {
      systemPrompt = `${agent.system}\n\n${SHARED_STYLE_RULES}\n\nToday's date is ${today}.`;
      if (data.mode === "fast") {
        systemPrompt += "\n\nFast mode: for greetings or small talk reply in one or two friendly lines. Otherwise answer directly and completely, but keep it tight.";
      } else if (data.mode === "think") {
        systemPrompt += "\n\nThink mode: reason carefully before answering, consider trade-offs, and give a thorough, well-structured, complete answer.";
      }
      if (sources.length) {
        const { formatSourcesForPrompt } = await import("./search.server");
        systemPrompt +=
          `\n\nLIVE GOOGLE SEARCH RESULTS for "${searchQuery}" (restricted to pages published from 2020 onwards). Ground your answer in these, prefer the most recent items, and cite them inline as clickable Markdown links using their exact URLs. Never cite a URL that is not listed here. If the results do not cover something, say so plainly instead of guessing.\n\n` +
          formatSourcesForPrompt(sources) +
          `\n\nEnd your reply with a short "**Sources**" list of the links you actually used, as Markdown links.`;
      } else if (searchQuery) {
        systemPrompt +=
          `\n\nA live web search was attempted but returned no usable recent results. Answer from your own knowledge, be explicit about what may have changed, and only link to official root domains you are certain exist.`;
      }
    }

    const hasAttachments = data.messages.some((m) =>
      (m.attachments ?? []).some(
        (a) => a.kind === "image" || a.mime.startsWith("image/"),
      ),
    );


    const builtMessages = await Promise.all(
      data.messages.map(async (m) => ({
        role: m.role,
        content: await buildContent(m.content, m.attachments),
      })),
    );

    let reply = "";
    try {
      const out = await llmChat(
        [
          { role: "system", content: systemPrompt },
          ...builtMessages,
        ],
        {
          maxTokens: data.mode === "think" ? 8192 : 4096,
          temperature: isHumaniser ? 1 : 0.7,
          reasoning: data.mode === "think" ? "high" : data.mode === "search" ? "medium" : "low",
          multimodal: hasAttachments,
        },
      );
      reply = out.text;
    } catch (err) {
      console.error("All AI providers failed", err);
      const isQuota =
        err instanceof LlmUnavailableError ? err.isQuotaExhausted : true;
      return {
        reply: isQuota
          ? "Our AI quota is temporarily exhausted, so I can't generate a reply right now. This is a billing limit on our side — not a problem with your message or attachment. Please try again later, and the MentorWise AI team has been notified."
          : "Our AI providers are temporarily busy. Please try again in a moment — your message was received, just not answered yet.",
        sources: [],
        searchQuery: null,
      };
    }

    return {
      reply: reply || "Sorry, I couldn't generate a response. Please try again.",
      sources: sources.map((s) => ({ title: s.title, link: s.link, date: s.date ?? null, source: s.source ?? null })),
      searchQuery,
    };
  });



const ImageInput = z.object({
  prompt: z.string().min(3).max(500),
});

export const generateImage = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => ImageInput.parse(input))
  .handler(async ({ data }) => {

    const key = process.env.LOVABLE_API_KEY;
    if (!key) throw new Error("AI service is not configured.");

    const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash-image",
        messages: [{ role: "user", content: data.prompt }],
        modalities: ["image", "text"],
      }),
    });

    if (!res.ok) {
      const text = await res.text();
      console.error("Image gateway error", res.status, text);
      if (res.status === 429) throw new Error("Rate limited. Try again in a moment.");
      if (res.status === 402) throw new Error("Image quota exhausted.");
      throw new Error("Image generation failed.");
    }

    const json = (await res.json()) as {
      choices?: Array<{ message?: { images?: Array<{ image_url?: { url?: string } }> } }>;
    };
    const url = json.choices?.[0]?.message?.images?.[0]?.image_url?.url;
    if (!url) throw new Error("No image returned.");
    return { url };
  });


const AssistInput = z.object({
  instruction: z.string().min(2).max(600),
  text: z.string().max(9000),
  json: z.boolean().optional(),
});

/** Resume builder helper: rewrites a field or extracts resume data. Returns plain text only. */
export const resumeAssist = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => AssistInput.parse(input))
  .handler(async ({ data }) => {
    const system = data.json
      ? "You extract resume data. Reply with ONLY a valid JSON object, no markdown fences, no commentary."
      : "You are an expert ATS resume writer. Apply the instruction to the text and reply with ONLY the final text that should go directly into the resume field. No preface, no quotes, no markdown headings. Keep facts and numbers; never invent employers, dates or metrics. For bullet lists put one bullet per line without bullet symbols.";
    try {
      const out = await llmChat(
        [
          { role: "system", content: system },
          { role: "user", content: `Instruction: ${data.instruction}\n\nText:\n${data.text}` },
        ],
        { maxTokens: 3000, temperature: 0.4, reasoning: "low" },
      );
      return { text: out.text.trim(), error: null as string | null };
    } catch (err) {
      console.error("resumeAssist failed", err);
      return { text: "", error: "AI is busy right now. Please try again in a moment." };
    }
  });
