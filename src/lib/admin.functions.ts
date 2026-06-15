import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { z } from "zod";

async function assertAdmin(supabase: any, userId: string) {
  const { data: isAdmin } = await supabase.rpc("has_role", {
    _user_id: userId,
    _role: "admin",
  });
  if (!isAdmin) throw new Error("Forbidden");
}

export const listUsers = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context.supabase, context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { data: authList, error: authErr } = await supabaseAdmin.auth.admin.listUsers({
      page: 1,
      perPage: 200,
    });
    if (authErr) throw new Error(authErr.message);

    const ids = authList.users.map((u) => u.id);
    const { data: roles } = await supabaseAdmin
      .from("user_roles")
      .select("user_id, role")
      .in("user_id", ids.length ? ids : ["00000000-0000-0000-0000-000000000000"]);
    const { data: profiles } = await supabaseAdmin
      .from("profiles")
      .select("id, full_name, display_name, contact_number, institute")
      .in("id", ids.length ? ids : ["00000000-0000-0000-0000-000000000000"]);

    const profileById = new Map((profiles ?? []).map((p) => [p.id, p]));
    const rolesByUser = new Map<string, string[]>();
    for (const r of roles ?? []) {
      const arr = rolesByUser.get(r.user_id) ?? [];
      arr.push(r.role);
      rolesByUser.set(r.user_id, arr);
    }

    return {
      users: authList.users.map((u) => {
        const p = profileById.get(u.id);
        return {
          id: u.id,
          email: u.email ?? "",
          created_at: u.created_at,
          last_sign_in_at: u.last_sign_in_at ?? null,
          banned_until: (u as any).banned_until ?? null,
          full_name: p?.full_name ?? null,
          display_name: p?.display_name ?? null,
          institute: p?.institute ?? null,
          contact_number: p?.contact_number ?? null,
          roles: rolesByUser.get(u.id) ?? [],
        };
      }),
    };
  });

const InviteInput = z.object({
  email: z.string().email().max(254),
  full_name: z.string().min(1).max(120).optional(),
  role: z.enum(["admin", "member"]).default("member"),
});

export const inviteUser = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => InviteInput.parse(d))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { data: invite, error } = await supabaseAdmin.auth.admin.inviteUserByEmail(
      data.email,
      { data: data.full_name ? { full_name: data.full_name } : {} },
    );
    if (error) throw new Error(error.message);

    if (invite.user) {
      await supabaseAdmin
        .from("user_roles")
        .upsert({ user_id: invite.user.id, role: data.role }, { onConflict: "user_id,role" });
    }
    return { ok: true, user_id: invite.user?.id ?? null };
  });

const RoleInput = z.object({
  user_id: z.string().uuid(),
  role: z.enum(["admin", "member"]),
  action: z.enum(["add", "remove"]),
});

export const setUserRole = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => RoleInput.parse(d))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    if (data.action === "add") {
      const { error } = await supabaseAdmin
        .from("user_roles")
        .upsert({ user_id: data.user_id, role: data.role }, { onConflict: "user_id,role" });
      if (error) throw new Error(error.message);
    } else {
      const { error } = await supabaseAdmin
        .from("user_roles")
        .delete()
        .eq("user_id", data.user_id)
        .eq("role", data.role);
      if (error) throw new Error(error.message);
    }
    return { ok: true };
  });

const BanInput = z.object({
  user_id: z.string().uuid(),
  duration_hours: z.number().int().min(0).max(24 * 365),
});

export const banUser = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => BanInput.parse(d))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const ban_duration = data.duration_hours === 0 ? "none" : `${data.duration_hours}h`;
    const { error } = await supabaseAdmin.auth.admin.updateUserById(data.user_id, {
      ban_duration,
    } as any);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const deleteUser = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({ user_id: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);
    if (data.user_id === context.userId) throw new Error("Cannot delete your own account here.");
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.auth.admin.deleteUser(data.user_id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

const ReportInput = z.object({
  reported_user_id: z.string().uuid(),
  reason: z.string().min(3).max(120),
  details: z.string().max(2000).optional().default(""),
});

export const submitReport = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => ReportInput.parse(d))
  .handler(async ({ data, context }) => {
    if (data.reported_user_id === context.userId) throw new Error("You cannot report yourself.");
    const { error } = await context.supabase.from("user_reports").insert({
      reporter_id: context.userId,
      reported_user_id: data.reported_user_id,
      reason: data.reason,
      details: data.details || null,
    });
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const listReports = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context.supabase, context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: reports, error } = await supabaseAdmin
      .from("user_reports")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(200);
    if (error) throw new Error(error.message);

    const ids = Array.from(
      new Set((reports ?? []).flatMap((r) => [r.reporter_id, r.reported_user_id])),
    );
    const { data: authList } = await supabaseAdmin.auth.admin.listUsers({ page: 1, perPage: 200 });
    const emailById = new Map((authList?.users ?? []).map((u) => [u.id, u.email ?? ""]));
    return {
      reports: (reports ?? []).map((r) => ({
        ...r,
        reporter_email: emailById.get(r.reporter_id) ?? "",
        reported_email: emailById.get(r.reported_user_id) ?? "",
      })),
    };
  });

const ResolveInput = z.object({
  report_id: z.string().uuid(),
  status: z.enum(["open", "resolved", "dismissed"]),
});

export const resolveReport = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => ResolveInput.parse(d))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin
      .from("user_reports")
      .update({
        status: data.status,
        resolved_by: data.status === "open" ? null : context.userId,
        resolved_at: data.status === "open" ? null : new Date().toISOString(),
      })
      .eq("id", data.report_id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });
