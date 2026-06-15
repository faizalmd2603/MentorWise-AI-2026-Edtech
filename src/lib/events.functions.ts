import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { z } from "zod";

const MeetUrl = z
  .string()
  .trim()
  .url()
  .refine(
    (u) => /^(https:\/\/)?(meet\.google\.com|meet\.jit\.si|zoom\.us|.*\.zoom\.us|teams\.microsoft\.com|teams\.live\.com)\//i.test(u),
    "Must be a Google Meet (or Zoom/Teams) link",
  );

const CreateEvent = z.object({
  title: z.string().min(3).max(120),
  description: z.string().max(2000).optional().default(""),
  scheduled_at: z.string().min(8),
  meeting_url: MeetUrl,
});

export const createEvent = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => CreateEvent.parse(d))
  .handler(async ({ data, context }) => {
    const { data: isAdmin } = await context.supabase.rpc("has_role", {
      _user_id: context.userId,
      _role: "admin",
    });
    if (!isAdmin) throw new Error("Forbidden");

    const { data: prof } = await context.supabase
      .from("profiles")
      .select("full_name, display_name, email")
      .eq("id", context.userId)
      .maybeSingle();
    const host_name =
      prof?.display_name || prof?.full_name || prof?.email || "Host";

    const room_name = `evt-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: event, error } = await supabaseAdmin
      .from("live_events")
      .insert({
        host_id: context.userId,
        host_name,
        title: data.title,
        description: data.description,
        scheduled_at: data.scheduled_at,
        room_name,
        status: "scheduled",
        meeting_url: data.meeting_url,
      } as never)
      .select()
      .single();
    if (error) throw new Error(error.message);
    return { event };
  });

const StatusInput = z.object({
  event_id: z.string().uuid(),
  status: z.enum(["scheduled", "live", "ended"]),
});

export const setEventStatus = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => StatusInput.parse(d))
  .handler(async ({ data, context }) => {
    const { data: isAdmin } = await context.supabase.rpc("has_role", {
      _user_id: context.userId,
      _role: "admin",
    });
    if (!isAdmin) throw new Error("Forbidden");
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin
      .from("live_events")
      .update({ status: data.status })
      .eq("id", data.event_id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const deleteEvent = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({ event_id: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    const { data: isAdmin } = await context.supabase.rpc("has_role", {
      _user_id: context.userId,
      _role: "admin",
    });
    if (!isAdmin) throw new Error("Forbidden");
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("live_events").delete().eq("id", data.event_id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const listEvents = createServerFn({ method: "GET" }).handler(async () => {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data, error } = await supabaseAdmin
    .from("live_events")
    .select("id, host_id, host_name, title, description, scheduled_at, status, created_at, updated_at")
    .order("scheduled_at", { ascending: false })
    .limit(50);
  if (error) throw new Error(error.message);
  return { events: data ?? [] };
});

const JoinInput = z.object({ event_id: z.string().uuid() });

/** Returns the Google Meet (or Zoom/Teams) link for an event to authenticated users. */
export const getMeetingLink = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => JoinInput.parse(d))
  .handler(async ({ data, context }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: event, error } = await supabaseAdmin
      .from("live_events")
      .select("id, host_id, meeting_url, status")
      .eq("id", data.event_id)
      .maybeSingle();
    if (error || !event) throw new Error("Event not found");

    const { data: isAdmin } = await context.supabase.rpc("has_role", {
      _user_id: context.userId,
      _role: "admin",
    });
    const isHost = (event as { host_id: string }).host_id === context.userId || !!isAdmin;
    return {
      meetingUrl: (event as { meeting_url: string | null }).meeting_url ?? null,
      isHost,
      status: (event as { status: string }).status,
    };
  });
