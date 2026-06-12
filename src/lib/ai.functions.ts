import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
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
});

const SHARED_STYLE_RULES =
  "Style rules: write like a real conversational AI assistant. Never use markdown headings (no #, ##, ###), never use asterisks for bold or italics, never use bullet symbols like - or *. Use plain prose, short paragraphs, and where lists are essential use numbered lines like 1. 2. 3. Keep tone professional, warm, and globally polished. Keep replies concise to respect free-tier limits but maintain MNC-level quality. If the user is sharing an image, photo, document or file, analyse it carefully and reference what you actually see in it. If the user asks for something outside your scope, redirect them to the correct MentorWise AI agent.";

type Part =
  | { type: "text"; text: string }
  | { type: "image_url"; image_url: { url: string } }
  | { type: "file"; file: { filename: string; file_data: string } };

function buildContent(text: string, attachments?: z.infer<typeof Attachment>[]): string | Part[] {
  if (!attachments || attachments.length === 0) return text;
  const parts: Part[] = [];
  if (text.trim()) parts.push({ type: "text", text });
  for (const a of attachments) {
    if (a.kind === "image" || a.mime.startsWith("image/")) {
      parts.push({ type: "image_url", image_url: { url: a.dataUrl } });
    } else {
      parts.push({ type: "file", file: { filename: a.name, file_data: a.dataUrl } });
    }
  }
  return parts;
}

export const chatWithAgent = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => ChatInput.parse(input))
  .handler(async ({ data }) => {
    const key = process.env.LOVABLE_API_KEY;
    if (!key) throw new Error("AI service is not configured.");

    const agent = AGENTS.find((a) => a.id === data.agentId);
    if (!agent) throw new Error("Unknown agent.");

    const systemPrompt = `${agent.system}\n\n${SHARED_STYLE_RULES}`;

    const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        max_tokens: 900,
        messages: [
          { role: "system", content: systemPrompt },
          ...data.messages.map((m) => ({
            role: m.role,
            content: buildContent(m.content, m.attachments),
          })),
        ],
      }),
    });

    if (res.status === 429) {
      return { reply: "I'm receiving a lot of requests right now. Please try again in a moment." };
    }
    if (res.status === 402) {
      return { reply: "The free AI quota for this workspace is exhausted. Please contact the MentorWise AI team." };
    }
    if (!res.ok) {
      const text = await res.text();
      console.error("AI gateway error", res.status, text);
      throw new Error("AI service error");
    }

    const json = (await res.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };
    const raw = json.choices?.[0]?.message?.content ?? "";
    const clean = raw
      .replace(/^#{1,6}\s+/gm, "")
      .replace(/\*\*(.*?)\*\*/g, "$1")
      .replace(/(^|\s)\*(?!\s)([^*]+)\*/g, "$1$2")
      .replace(/^\s*[-*•]\s+/gm, "")
      .trim();

    return { reply: clean || "Sorry, I couldn't generate a response. Please try again." };
  });

const ImageInput = z.object({
  prompt: z.string().min(3).max(500),
});

export const generateImage = createServerFn({ method: "POST" })
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
