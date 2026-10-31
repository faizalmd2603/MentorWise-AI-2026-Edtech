export const API_MONITOR_EMAIL = "mentorwiseaiedtech@gmail.com";
export const API_MONITOR_REFRESH_MS = 30_000;

export function canViewApiMonitoring(email: string | undefined, confirmed: boolean, isAdmin: boolean) {
  return confirmed && isAdmin && email?.toLowerCase() === API_MONITOR_EMAIL;
}

export function tokenCount(value: unknown): number | null {
  return typeof value === "number" && Number.isSafeInteger(value) && value >= 0 ? value : null;
}

export function extractTokenUsage(body: unknown) {
  const object = body && typeof body === "object" ? body as Record<string, unknown> : {};
  const raw = object.usage ?? object.usageMetadata;
  const usage = raw && typeof raw === "object" ? raw as Record<string, unknown> : {};
  return {
    input_tokens: tokenCount(usage.prompt_tokens ?? usage.input_tokens ?? usage.promptTokenCount),
    output_tokens: tokenCount(usage.completion_tokens ?? usage.output_tokens ?? usage.candidatesTokenCount),
    total_tokens: tokenCount(usage.total_tokens ?? usage.totalTokenCount),
  };
}

export type ApiUsageReport = {
  startedAt: string | null;
  providers: Array<{
    provider: string; requests: number; errors: number; input_tokens: number | null;
    output_tokens: number | null; total_tokens: number | null; metered_requests: number;
    latest: { recorded_at: string; status: number; model: string; remaining_tokens: number | null; remaining_requests: number | null; quota_reset: string | null };
  }>;
  recent: Array<{ provider: string; model: string; operation: string; status: number; duration_ms: number; total_tokens: number | null; recorded_at: string }>;
};