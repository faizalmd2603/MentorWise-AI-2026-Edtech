import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const ADMIN_EMAILS = new Set([
  "mentorwiseaiedtech@gmail.com",
  "saifahmedmentorwise@gmail.com",
]);

export const listAnnouncements = createServerFn({ method: "GET" }).handler(
  async () => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data, error } = await supabaseAdmin
      .from("announcements")
      .select("id, title, body, author_name, created_at")
      .order("created_at", { ascending: false })
      .limit(50);
    if (error) throw new Error("Could not load announcements");
    return { announcements: data ?? [] };
  },
);

export const createAnnouncement = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { title: string; body: string }) =>
    z
      .object({
        title: z.string().trim().min(3).max(160),
        body: z.string().trim().min(3).max(8000),
      })
      .parse(d),
  )
  .handler(async ({ data, context }) => {
    const email = context.claims.email?.toLowerCase();
    if (!email || !ADMIN_EMAILS.has(email)) {
      throw new Error("Forbidden: admin only");
    }

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const authorName =
      email === "mentorwiseaiedtech@gmail.com"
        ? "Mohammed Faizal. M (Founder & CEO)"
        : "Saif Ahmed. Z (Co-Founder)";

    const { data: ins, error: insErr } = await supabaseAdmin
      .from("announcements")
      .insert({
        author_id: context.userId,
        author_name: authorName,
        title: data.title,
        body: data.body,
      })
      .select("id, title, body, author_name, created_at")
      .single();
    if (insErr || !ins) throw new Error("Could not save announcement");

    // Fan-out emails to all registered members (don't block the response on it)
    void broadcastAnnouncement(ins.id, ins.title, ins.body, authorName);

    return { announcement: ins };
  });

async function broadcastAnnouncement(
  announcementId: string,
  title: string,
  body: string,
  authorName: string,
) {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { sendGmail, announcementEmailTemplate } = await import("./gmail.server");

  const { data: members } = await supabaseAdmin
    .from("profiles")
    .select("email");
  if (!members || members.length === 0) return;

  const tpl = announcementEmailTemplate({ title, body, authorName });

  // Sequential with tiny delay to stay well below Gmail's per-second limits
  for (const m of members) {
    const recipient = m.email;
    if (!recipient) continue;
    const result = await sendGmail({
      to: recipient,
      subject: tpl.subject,
      html: tpl.html,
    });
    await supabaseAdmin.from("announcement_email_log").insert({
      announcement_id: announcementId,
      recipient_email: recipient,
      status: result.ok ? "sent" : "failed",
      error_message: result.ok ? null : result.error?.slice(0, 500),
    });
    await new Promise((r) => setTimeout(r, 120));
  }
}

export const deleteAnnouncement = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { id: string }) =>
    z.object({ id: z.string().uuid() }).parse(d),
  )
  .handler(async ({ data, context }) => {
    const email = context.claims.email?.toLowerCase();
    if (!email || !ADMIN_EMAILS.has(email)) throw new Error("Forbidden");
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin
      .from("announcements")
      .delete()
      .eq("id", data.id);
    if (error) throw new Error("Could not delete");
    return { ok: true };
  });

export const getMe = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const email = context.claims.email?.toLowerCase() ?? null;
    return {
      userId: context.userId,
      email,
      isAdmin: !!email && ADMIN_EMAILS.has(email),
    };
  });
