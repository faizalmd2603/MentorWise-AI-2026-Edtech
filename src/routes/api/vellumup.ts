import { createFileRoute } from "@tanstack/react-router";
import { createHmac, timingSafeEqual } from "crypto";

export const Route = createFileRoute("/api/vellumup")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const secret = process.env.VELLUMUP_WEBHOOK_SECRET;
        if (!secret) {
          console.error("[vellumup] missing VELLUMUP_WEBHOOK_SECRET");
          return new Response("Server misconfigured", { status: 500 });
        }

        const rawBody = await request.text();
        const header = request.headers.get("x-vellumup-signature") ?? "";
        const parts = Object.fromEntries(
          header.split(",").map((p) => {
            const [k, v] = p.split("=");
            return [k?.trim(), v?.trim()];
          }),
        ) as { t?: string; v1?: string };

        if (!parts.t || !parts.v1) {
          return new Response("Invalid signature", { status: 401 });
        }
        const ts = Number(parts.t);
        if (!Number.isFinite(ts) || Math.abs(Date.now() / 1000 - ts) > 300) {
          return new Response("Stale signature", { status: 401 });
        }

        const expected = createHmac("sha256", secret)
          .update(`${parts.t}.${rawBody}`)
          .digest("hex");
        const a = Buffer.from(expected, "hex");
        const b = Buffer.from(parts.v1, "hex");
        if (a.length !== b.length || !timingSafeEqual(a, b)) {
          return new Response("Invalid signature", { status: 401 });
        }

        let payload: any;
        try {
          payload = JSON.parse(rawBody);
        } catch {
          return new Response("Invalid JSON", { status: 400 });
        }

        // Process asynchronously so we can respond fast
        processDelivery(payload).catch((err) => {
          console.error("[vellumup] process error", err);
        });

        return new Response(JSON.stringify({ ok: true }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      },

      GET: async () =>
        new Response(JSON.stringify({ ok: true, endpoint: "vellumup" }), {
          headers: { "Content-Type": "application/json" },
        }),
    },
  },
});

type Event =
  | "article.published"
  | "article.unpublished"
  | "article.updated"
  | "article.translated";

async function processDelivery(payload: {
  id?: string;
  type?: Event;
  event?: Event;
  data: any;
}) {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const eventType = (payload.type ?? payload.event) as Event | undefined;
  const d = payload.data ?? {};
  if (!d?.slug) {
    console.warn("[vellumup] missing slug in payload", payload.id);
    return;
  }

  const language_code = (d.language_code as string) || "en";
  const isUnpublish = eventType === "article.unpublished";

  const row = {
    slug: String(d.slug),
    language_code,
    language_name: d.language_name ?? null,
    title: String(d.title ?? d.slug),
    content: String(d.content ?? ""),
    excerpt: d.excerpt ?? null,
    cover_image: d.cover_image ?? d.cover_image_url ?? null,
    meta_description: d.meta_description ?? null,
    focus_keyword: d.focus_keyword ?? null,
    secondary_keywords: Array.isArray(d.secondary_keywords) ? d.secondary_keywords : [],
    key_takeaways: Array.isArray(d.key_takeaways) ? d.key_takeaways : [],
    word_count: Number.isFinite(d.word_count) ? Number(d.word_count) : 0,
    reading_time_minutes: Number.isFinite(d.reading_time_minutes)
      ? Number(d.reading_time_minutes)
      : 0,
    internal_link_slugs: Array.isArray(d.internal_link_slugs) ? d.internal_link_slugs : [],
    website_domain: d.website_domain ?? null,
    og_title: d.og_title ?? null,
    og_description: d.og_description ?? null,
    status: isUnpublish ? "draft" : d.status === "draft" ? "draft" : "published",
  };

  const { error } = await supabaseAdmin
    .from("articles")
    .upsert(row, { onConflict: "slug,language_code" });

  if (error) {
    console.error("[vellumup] upsert failed", payload.id, error.message);
  }
}
