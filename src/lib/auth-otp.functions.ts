import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { createHash, randomInt, timingSafeEqual } from "crypto";

const EmailSchema = z
  .string()
  .trim()
  .toLowerCase()
  .email()
  .max(254);

function hashOtp(email: string, otp: string): string {
  // Salt with email so OTPs aren't interchangeable across accounts
  return createHash("sha256").update(`${email}:${otp}`).digest("hex");
}

export const requestEmailOtp = createServerFn({ method: "POST" })
  .inputValidator((d: { email: string }) =>
    z.object({ email: EmailSchema }).parse(d),
  )
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { sendGmail, otpEmailTemplate } = await import("./gmail.server");

    // Rate limit: max 3 OTPs per email in the last 5 minutes
    const fiveMinAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();
    const { count } = await supabaseAdmin
      .from("email_otps")
      .select("id", { count: "exact", head: true })
      .eq("email", data.email)
      .gte("created_at", fiveMinAgo);
    if ((count ?? 0) >= 3) {
      throw new Error("Too many codes requested. Please wait a few minutes.");
    }

    const otp = String(randomInt(0, 1_000_000)).padStart(6, "0");
    const otp_hash = hashOtp(data.email, otp);
    const expires_at = new Date(Date.now() + 10 * 60 * 1000).toISOString();

    const { error: insErr } = await supabaseAdmin.from("email_otps").insert({
      email: data.email,
      otp_hash,
      expires_at,
    });
    if (insErr) throw new Error("Could not create code. Try again.");

    const tpl = otpEmailTemplate(otp);
    const send = await sendGmail({ to: data.email, subject: tpl.subject, html: tpl.html });
    if (!send.ok) {
      console.error("Gmail send failed", send.error);
      throw new Error("We could not send the email right now. Try again shortly.");
    }
    return { ok: true };
  });

export const verifyEmailOtp = createServerFn({ method: "POST" })
  .inputValidator((d: { email: string; otp: string }) =>
    z
      .object({
        email: EmailSchema,
        otp: z.string().trim().regex(/^\d{6}$/, "Enter the 6-digit code"),
      })
      .parse(d),
  )
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    // Latest unused OTP for this email
    const { data: row, error } = await supabaseAdmin
      .from("email_otps")
      .select("id, otp_hash, expires_at, used_at, attempts")
      .eq("email", data.email)
      .is("used_at", null)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    if (error) throw new Error("Could not verify the code. Try again.");
    if (!row) throw new Error("No active code. Request a new one.");

    if (new Date(row.expires_at).getTime() < Date.now()) {
      throw new Error("Code expired. Request a new one.");
    }
    if (row.attempts >= 5) {
      throw new Error("Too many attempts. Request a new code.");
    }

    const expected = hashOtp(data.email, data.otp);
    const a = Buffer.from(row.otp_hash, "hex");
    const b = Buffer.from(expected, "hex");
    const matches = a.length === b.length && timingSafeEqual(a, b);

    if (!matches) {
      await supabaseAdmin
        .from("email_otps")
        .update({ attempts: row.attempts + 1 })
        .eq("id", row.id);
      throw new Error("Incorrect code.");
    }

    // Mark used
    await supabaseAdmin
      .from("email_otps")
      .update({ used_at: new Date().toISOString() })
      .eq("id", row.id);

    // Ensure user exists (creates profile + role via DB trigger)
    const { data: existingUsers } = await supabaseAdmin.auth.admin.listUsers();
    const existing = existingUsers.users.find(
      (u) => u.email?.toLowerCase() === data.email,
    );
    if (!existing) {
      const { error: createErr } = await supabaseAdmin.auth.admin.createUser({
        email: data.email,
        email_confirm: true,
      });
      if (createErr && !/already/i.test(createErr.message)) {
        throw new Error("Could not create account.");
      }
    }

    // Mint a magic-link token the client can exchange for a session
    const { data: link, error: linkErr } =
      await supabaseAdmin.auth.admin.generateLink({
        type: "magiclink",
        email: data.email,
      });
    if (linkErr || !link.properties?.hashed_token) {
      throw new Error("Could not create session.");
    }

    return {
      email: data.email,
      token_hash: link.properties.hashed_token,
    };
  });
