import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { canViewApiMonitoring, type ApiUsageReport } from "./api-monitoring";

export const getApiMonitoring = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    // Read the server-verified account, never a client email or editable metadata.
    const { data: { user }, error } = await context.supabase.auth.getUser();
    if (error || !user || user.id !== context.userId) throw new Error("Unauthorized");
    const { data: isAdmin, error: roleError } = await context.supabase.rpc("has_role", {
      _user_id: context.userId, _role: "admin",
    });
    if (roleError) throw new Error("Unable to verify access");
    if (!canViewApiMonitoring(user.email, Boolean(user.email_confirmed_at), isAdmin === true)) {
      return { allowed: false as const, report: null, checkedAt: null, configured: [] as string[] };
    }
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data, error: reportError } = await supabaseAdmin.rpc("api_usage_report");
    if (reportError) throw new Error("Usage report unavailable");
    const providers = [
      ["openrouter", "OPENROUTER_API_KEY"], ["groq", "GROQ_API_KEY"],
      ["gemini", "GOOGLE_API_KEY"], ["cerebras", "OPENAI_API_KEY"],
      ["lovable", "LOVABLE_API_KEY"], ["serpapi", "GOOGLE_SEARCH_API_KEY"],
      ["gmail", "GOOGLE_MAIL_API_KEY"], ["elevenlabs", "ELEVENLABS_API_KEY"],
    ];
    return {
      allowed: true as const, report: data as unknown as ApiUsageReport,
      checkedAt: new Date().toISOString(),
      configured: providers.filter(([, name]) => name && Boolean(process.env[name])).map(([name]) => name ?? ""),
    };
  });