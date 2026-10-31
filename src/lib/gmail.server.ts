// Gmail send helper via Lovable connector gateway.
// All text is UTF-8 safe (base64url over UTF-8 bytes + MIME encoded-word subjects)
// so emojis / accented chars never render as "Ã°ÂŸÂ" mojibake.
import { trackedApiFetch } from "./api-usage.server";

const GATEWAY_URL = "https://connector-gateway.lovable.dev/google_mail/gmail/v1";

function toBase64Url(input: string): string {
  // UTF-8 safe base64 → base64url
  const b64 = Buffer.from(input, "utf-8").toString("base64");
  return b64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function encodeSubject(subject: string): string {
  // MIME encoded-word so non-ASCII subjects render cleanly in every client
  const b64 = Buffer.from(subject, "utf-8").toString("base64");
  return `=?UTF-8?B?${b64}?=`;
}

function buildRawEmail(opts: {
  from: string;
  to: string;
  subject: string;
  html: string;
}): string {
  const headers = [
    `From: ${opts.from}`,
    `To: ${opts.to}`,
    `Subject: ${encodeSubject(opts.subject)}`,
    `MIME-Version: 1.0`,
    `Content-Type: text/html; charset="UTF-8"`,
    `Content-Transfer-Encoding: base64`,
  ].join("\r\n");

  // Body must also be base64 (matches Content-Transfer-Encoding header)
  const bodyB64 = Buffer.from(opts.html, "utf-8").toString("base64");
  // Wrap base64 body at 76 chars per RFC
  const wrapped = bodyB64.match(/.{1,76}/g)?.join("\r\n") ?? bodyB64;

  const rfc2822 = `${headers}\r\n\r\n${wrapped}`;
  return toBase64Url(rfc2822);
}

const FROM_ADDRESS = "MentorWise AI <mentorwiseaiedtech@gmail.com>";

export async function sendGmail(opts: {
  to: string;
  subject: string;
  html: string;
}): Promise<{ ok: boolean; error?: string; id?: string }> {
  const lovableKey = process.env.LOVABLE_API_KEY;
  const connKey = process.env.GOOGLE_MAIL_API_KEY;
  if (!lovableKey || !connKey) {
    return { ok: false, error: "Gmail connector not configured" };
  }

  const raw = buildRawEmail({
    from: FROM_ADDRESS,
    to: opts.to,
    subject: opts.subject,
    html: opts.html,
  });

  try {
    const res = await trackedApiFetch({ provider: "gmail", model: "mail", operation: "send" }, `${GATEWAY_URL}/users/me/messages/send`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${lovableKey}`,
        "X-Connection-Api-Key": connKey,
      },
      body: JSON.stringify({ raw }),
    });
    if (!res.ok) {
      const text = await res.text();
      return { ok: false, error: `Gmail ${res.status}: ${text.slice(0, 300)}` };
    }
    const json = (await res.json()) as { id?: string };
    return { ok: true, id: json.id };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : String(e) };
  }
}

// High-contrast email templates: white background + near-black text.
// Brand accent only on small chips/buttons. Never light text on light bg.
function shell(inner: string): string {
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f4f6fb;font-family:-apple-system,Segoe UI,Roboto,Inter,Helvetica,Arial,sans-serif;color:#0b1220;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4f6fb;padding:32px 12px;">
    <tr><td align="center">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;background:#ffffff;border-radius:14px;border:1px solid #e2e8f0;overflow:hidden;">
        <tr><td style="background:#0b1220;padding:18px 24px;">
          <div style="color:#ffffff;font-size:18px;font-weight:700;letter-spacing:.2px;">MentorWise AI</div>
          <div style="color:#9ca3af;font-size:12px;margin-top:2px;">Free 12-Agent AI Career Arsenal</div>
        </td></tr>
        <tr><td style="padding:28px 28px 8px 28px;color:#0b1220;font-size:15px;line-height:1.6;">${inner}</td></tr>
        <tr><td style="padding:18px 28px 28px 28px;color:#6b7280;font-size:12px;line-height:1.5;">
          You receive this email because you signed up at <a href="https://mentorwiseai.store" style="color:#0b5fff;text-decoration:none;">mentorwiseai.store</a>.<br>
          MentorWise AI · Chennai, India · 100% free forever.
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`;
}

export function otpEmailTemplate(otp: string): { subject: string; html: string } {
  return {
    subject: `${otp} is your MentorWise AI verification code`,
    html: shell(`
      <p style="margin:0 0 14px 0;font-size:16px;font-weight:600;color:#0b1220;">Your verification code</p>
      <p style="margin:0 0 18px 0;color:#374151;">Enter this 6-digit code in the MentorWise AI app to sign in. It expires in 10 minutes.</p>
      <div style="margin:8px 0 22px 0;display:inline-block;padding:14px 22px;background:#0b1220;color:#ffffff;font-size:30px;font-weight:700;letter-spacing:10px;border-radius:10px;font-family:Menlo,Consolas,monospace;">${otp}</div>
      <p style="margin:0;color:#6b7280;font-size:13px;">If you didn't request this code, you can safely ignore this email.</p>
    `),
  };
}

export function announcementEmailTemplate(opts: {
  title: string;
  bodyHtml: string;
  authorName: string;
}): { subject: string; html: string } {
  const esc = (s: string) =>
    s
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  // bodyHtml is sanitized server-side before reaching this template.
  return {
    subject: `${opts.title} — MentorWise AI announcement`,
    html: shell(`
      <div style="display:inline-block;padding:4px 10px;background:#eef2ff;color:#1e3a8a;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.8px;border-radius:999px;margin-bottom:14px;">Founder announcement</div>
      <h1 style="margin:0 0 10px 0;font-size:22px;line-height:1.3;color:#0b1220;">${esc(opts.title)}</h1>
      <p style="margin:0 0 18px 0;color:#374151;font-size:14px;">From <strong>${esc(opts.authorName)}</strong></p>
      <div style="margin:0 0 22px 0;color:#0b1220;font-size:15px;line-height:1.65;">${opts.bodyHtml}</div>
      <a href="https://mentorwiseai.store/feed" style="display:inline-block;padding:11px 20px;background:#0b1220;color:#ffffff;text-decoration:none;border-radius:10px;font-weight:600;font-size:14px;">Open the feed</a>
    `),
  };
}

