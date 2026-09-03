// Multi-provider LLM router. Server-only.
// Primary: OpenRouter -> Groq. Fallbacks: Gemini -> Cerebras -> Lovable AI.

export type LlmMessage = {
  role: "system" | "user" | "assistant";
  content: unknown; // string or OpenAI-style content parts
};

export type LlmOptions = {
  maxTokens?: number;
  temperature?: number;
  /** Set when any message carries image/file parts. Text-only providers are skipped. */
  multimodal?: boolean;
};

type Provider = {
  name: string;
  url: string;
  model: string;
  keyEnv: string;
  multimodal: boolean;
  /** Extra headers besides auth. */
  headers?: Record<string, string>;
};

const PROVIDERS: Provider[] = [
  {
    name: "openrouter",
    url: "https://openrouter.ai/api/v1/chat/completions",
    model: "google/gemini-3.7-flash",
    keyEnv: "OPENROUTER_API_KEY",
    multimodal: true,
    headers: {
      "HTTP-Referer": "https://mentorwiseaiedtechservice.lovable.app",
      "X-Title": "MentorWise AI",
    },
  },
  {
    name: "groq",
    url: "https://api.groq.com/openai/v1/chat/completions",
    model: "openai/gpt-oss-120b",
    keyEnv: "GROQ_API_KEY",
    multimodal: false,
  },
  {
    name: "gemini",
    url: "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions",
    model: "gemini-3.6-flash",
    keyEnv: "GOOGLE_API_KEY",
    multimodal: true,
  },
  {
    name: "cerebras",
    url: "https://api.cerebras.ai/v1/chat/completions",
    model: "gpt-oss-120b",
    keyEnv: "OPENAI_API_KEY",
    multimodal: false,
  },
  {
    name: "lovable",
    url: "https://ai.gateway.lovable.dev/v1/chat/completions",
    model: "google/gemini-3.7-flash",
    keyEnv: "LOVABLE_API_KEY",
    multimodal: true,
  },
];

/** Collapses OpenAI-style content parts into a plain string (text parts only). */
function flattenContent(m: LlmMessage): LlmMessage {
  if (typeof m.content === "string" || !Array.isArray(m.content)) return m;
  const text = (m.content as Array<{ type?: string; text?: string }>)
    .filter((p) => p?.type === "text" && typeof p.text === "string")
    .map((p) => p.text as string)
    .join("\n\n");
  return { ...m, content: text };
}

export type LlmResult = { text: string; provider: string };

export class LlmUnavailableError extends Error {
  constructor(public readonly statuses: number[]) {
    super("All AI providers are unavailable.");
    this.name = "LlmUnavailableError";
  }
  /** True when every failure was auth/credit/quota — a billing problem, not transient load. */
  get isQuotaExhausted(): boolean {
    return this.statuses.length > 0 && this.statuses.every((s) => [401, 402, 403].includes(s));
  }
}

/**
 * Calls the provider chain in order until one returns usable text.
 * Retryable/credit errors (401/402/403/429/5xx) fall through to the next provider.
 */
export async function llmChat(messages: LlmMessage[], opts: LlmOptions = {}): Promise<LlmResult> {
  const { maxTokens = 1600, temperature = 0.7, multimodal = false } = opts;
  const statuses: number[] = [];

  for (const p of PROVIDERS) {
    if (multimodal && !p.multimodal) continue;
    // Text-only providers reject array content; flatten text parts to a string.
    const payloadMessages = p.multimodal ? messages : messages.map(flattenContent);
    const key = process.env[p.keyEnv];
    if (!key) continue;

    try {
      const res = await fetch(p.url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${key}`,
          "Content-Type": "application/json",
          ...(p.headers ?? {}),
        },
        body: JSON.stringify({
          model: p.model,
          max_tokens: maxTokens,
          temperature,
          messages: payloadMessages,
        }),
      });

      if (!res.ok) {
        statuses.push(res.status);
        const body = await res.text();
        console.error(`[llm] ${p.name} failed`, res.status, body.slice(0, 400));
        continue;
      }

      const json = (await res.json()) as {
        choices?: Array<{ message?: { content?: string } }>;
      };
      const text = (json.choices?.[0]?.message?.content ?? "").trim();
      if (!text) {
        console.error(`[llm] ${p.name} returned empty content`);
        continue;
      }
      return { text, provider: p.name };
    } catch (err) {
      console.error(`[llm] ${p.name} threw`, err);
      continue;
    }
  }

  throw new LlmUnavailableError(statuses);
}
