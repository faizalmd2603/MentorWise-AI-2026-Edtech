import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const ADMIN_EMAILS = new Set([
  "mentorwiseaiedtech@gmail.com",
  "saifahmedmentorwise@gmail.com",
]);

// Admin-only: upload an image (base64 data URL) to the private bucket and
// return a long-lived signed URL the public feed can render.
export const uploadAnnouncementImage = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { dataUrl: string; filename: string }) =>
    z
      .object({
        dataUrl: z
          .string()
          .regex(
            /^data:image\/(png|jpeg|jpg|webp|gif);base64,[A-Za-z0-9+/=]+$/,
            "Only PNG/JPEG/WEBP/GIF images are allowed",
          )
          .max(8 * 1024 * 1024, "Image must be under 6 MB"),
        filename: z.string().trim().min(1).max(120),
      })
      .parse(d),
  )
  .handler(async ({ data, context }) => {
    const email = context.claims.email?.toLowerCase();
    if (!email || !ADMIN_EMAILS.has(email)) {
      throw new Error("Forbidden: admin only");
    }

    const match = data.dataUrl.match(/^data:(image\/[a-z]+);base64,(.+)$/i);
    if (!match) throw new Error("Invalid image data");
    const [, mime, b64] = match;
    const ext = mime.split("/")[1].replace("jpeg", "jpg");
    const safeName = data.filename
      .replace(/[^a-z0-9._-]/gi, "-")
      .replace(/\.[^.]+$/, "");
    const path = `${context.userId}/${Date.now()}-${safeName}.${ext}`;
    const buffer = Buffer.from(b64, "base64");

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error: upErr } = await supabaseAdmin.storage
      .from("announcement-images")
      .upload(path, buffer, { contentType: mime, upsert: false });
    if (upErr) throw new Error(`Upload failed: ${upErr.message}`);

    // 10-year signed URL — bucket is private, but the URL is shareable in the
    // public feed and embedded emails.
    const { data: signed, error: signErr } = await supabaseAdmin.storage
      .from("announcement-images")
      .createSignedUrl(path, 60 * 60 * 24 * 365 * 10);
    if (signErr || !signed?.signedUrl) {
      throw new Error("Could not create image URL");
    }

    return { url: signed.signedUrl, path };
  });
