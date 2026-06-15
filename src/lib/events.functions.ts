import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { z } from "zod";
import { AccessToken } from "livekit-server-sdk";

const CreateEvent = z.object({
  title: z.string().min(3).max(120),
  description: z.string().max(2000).optional().default(""),
  scheduled_at: z.string().min(8),
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
      })
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
    .select("*")
    .order("scheduled_at", { ascending: false })
    .limit(50);
  if (error) throw new Error(error.message);
  return { events: data ?? [] };
});

const TokenInput = z.object({ event_id: z.string().uuid() });

export const getLiveKitToken = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => TokenInput.parse(d))
  .handler(async ({ data, context }) => {
    const apiKey = process.env.LIVEKIT_API_KEY;
    const apiSecret = process.env.LIVEKIT_API_SECRET;
    const wsUrl = process.env.LIVEKIT_URL;
    if (!apiKey || !apiSecret || !wsUrl) throw new Error("LiveKit not configured");

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: event, error } = await supabaseAdmin
      .from("live_events")
      .select("id, room_name, host_id")
      .eq("id", data.event_id)
      .maybeSingle();
    if (error || !event) throw new Error("Event not found");

    const { data: isAdmin } = await context.supabase.rpc("has_role", {
      _user_id: context.userId,
      _role: "admin",
    });
    const isHost = event.host_id === context.userId || !!isAdmin;

    const { data: prof } = await context.supabase
      .from("profiles")
      .select("full_name, display_name, email")
      .eq("id", context.userId)
      .maybeSingle();
    const name = prof?.display_name || prof?.full_name || prof?.email || "Guest";

    const at = new AccessToken(apiKey, apiSecret, {
      identity: context.userId,
      name,
      ttl: 60 * 60 * 4,
    });
    at.addGrant({
      room: event.room_name,
      roomJoin: true,
      canPublish: isHost,
      canPublishData: true,
      canSubscribe: true,
    });
    const token = await at.toJwt();
    return { token, wsUrl, isHost, roomName: event.room_name };
  });
