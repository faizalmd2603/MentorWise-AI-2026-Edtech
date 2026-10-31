import { extractTokenUsage } from "./api-monitoring";

type ApiCall = { provider: string; model: string; operation: string };

/** Records metadata only: no keys, URLs, prompts, responses, emails or user identifiers. */
export async function trackedApiFetch(call: ApiCall, input: string, init?: RequestInit): Promise<Response> {
  const started = Date.now();
  let response: Response | undefined;
  try {
    response = await fetch(input, init);
    return response;
  } finally {
    try {
      let body: unknown;
      // Never consume the caller's response or store its content.
      if (response?.ok && response.headers.get("content-type")?.includes("application/json")) {
        body = await response.clone().json();
      }
      const numericHeader = (name: string) => {
        const value = response?.headers.get(name);
        if (!value || !/^\d+$/.test(value)) return null;
        const parsed = Number(value);
        return Number.isSafeInteger(parsed) ? parsed : null;
      };
      const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
      const { error } = await supabaseAdmin.from("api_usage_events").insert({
        ...call,
        status: response?.status ?? 0,
        duration_ms: Math.min(Date.now() - started, 2_147_483_647),
        ...extractTokenUsage(body),
        remaining_tokens: numericHeader("x-ratelimit-remaining-tokens"),
        remaining_requests: numericHeader("x-ratelimit-remaining-requests"),
        quota_reset: response?.headers.get("x-ratelimit-reset-tokens")?.slice(0, 80) ?? null,
      });
      if (error) console.error("API usage recording failed");
    } catch {
      // Monitoring cannot interrupt the user's original request.
      console.error("API usage recording unavailable");
    }
  }
}