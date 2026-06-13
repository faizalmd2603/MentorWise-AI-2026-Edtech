import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { z } from "zod";

const ContactInput = z.object({
  fullName: z.string().trim().min(1).max(120),
  email: z.string().trim().email().max(254),
  occupation: z.string().trim().min(1).max(120),
  query: z.string().trim().min(5).max(10000),
});

function b64url(s: string) {
  return Buffer.from(s, "utf8").toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

// Strip CR/LF (and other control chars) from anything placed in an RFC-2822 header
function safeHeader(v: string) {
  return v.replace(/[\r\n\u0000-\u001F\u007F]+/g, " ").trim();
}

// Escape user-supplied values before embedding in HTML email bodies
function esc(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function buildRfc2822({ to, subject, html, replyTo }: { to: string; subject: string; html: string; replyTo?: string }) {
  const headers = [
    `From: MentorWise AI <mentorwiseaiedtech@gmail.com>`,
    `To: ${safeHeader(to)}`,
    `Subject: ${safeHeader(subject)}`,
    `MIME-Version: 1.0`,
    `Content-Type: text/html; charset="UTF-8"`,
  ];
  if (replyTo) headers.push(`Reply-To: ${safeHeader(replyTo)}`);
  return `${headers.join("\r\n")}\r\n\r\n${html}`;
}


async function sendGmail(raw: string) {
  const lovable = process.env.LOVABLE_API_KEY;
  const gmail = process.env.GOOGLE_MAIL_API_KEY;
  if (!lovable || !gmail) throw new Error("Email service is not configured.");

  const res = await fetch("https://connector-gateway.lovable.dev/google_mail/gmail/v1/users/me/messages/send", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${lovable}`,
      "X-Connection-Api-Key": gmail,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ raw: b64url(raw) }),
  });
  if (!res.ok) {
    const text = await res.text();
    console.error("Gmail send error", res.status, text);
    throw new Error("Failed to send email.");
  }
  return res.json();
}

async function aiQueryAnswer(occupation: string, query: string): Promise<string | null> {
  const key = process.env.LOVABLE_API_KEY;
  if (!key) return null;
  try {
    const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        max_tokens: 450,
        messages: [
          {
            role: "system",
            content:
              "You are MentorWise AI, a premium career assistant. Read the user's query and reply in clean conversational prose (no markdown, no asterisks, no bullets). If you can confidently help, provide a concise, useful answer in 2-4 short paragraphs. If the query is unclear, vague, or requires the founders to handle personally (partnerships, account issues, escalations), reply only with the exact token: ESCALATE.",
          },
          { role: "user", content: `Occupation: ${occupation}\n\nQuery:\n${query}` },
        ],
      }),
    });
    if (!res.ok) return null;
    const json = (await res.json()) as { choices?: Array<{ message?: { content?: string } }> };
    const raw = (json.choices?.[0]?.message?.content ?? "").trim();
    if (!raw || raw.includes("ESCALATE")) return null;
    return raw
      .replace(/^#{1,6}\s+/gm, "")
      .replace(/\*\*(.*?)\*\*/g, "$1")
      .replace(/^\s*[-*•]\s+/gm, "")
      .trim();
  } catch (e) {
    console.error("AI ack failed", e);
    return null;
  }
}

const contactsBlock = `
<table cellpadding="0" cellspacing="0" style="margin-top:20px;border-collapse:collapse;font-family:Inter,Arial,sans-serif;font-size:14px;color:#0b0b1a;">
  <tr><td colspan="2" style="padding:6px 0;font-weight:600;">Reach our founders directly</td></tr>
  <tr><td style="padding:4px 12px 4px 0;color:#555;">Founder · Mohammed Faizal M</td><td style="padding:4px 0;">
    <a href="mailto:mentorwiseaiedtech@gmail.com" style="color:#0066cc;text-decoration:none;">mentorwiseaiedtech@gmail.com</a> ·
    <a href="https://wa.me/916383969289" style="color:#0066cc;text-decoration:none;">WhatsApp +91 63839 69289</a>
  </td></tr>
  <tr><td style="padding:4px 12px 4px 0;color:#555;">Co-founder · Saif Ahmed Z</td><td style="padding:4px 0;">
    <a href="mailto:saifahmedmentorwise@gmail.com" style="color:#0066cc;text-decoration:none;">saifahmedmentorwise@gmail.com</a> ·
    <a href="https://wa.me/918668032758" style="color:#0066cc;text-decoration:none;">WhatsApp +91 86680 32758</a>
  </td></tr>
</table>`;

function userEmailHtml(name: string, aiAnswer: string | null) {
  const safeName = esc(name);
  const intro = aiAnswer
    ? `<p style="margin:0 0 12px;">Hi ${safeName},</p><p style="margin:0 0 12px;">Thank you for reaching out to MentorWise AI. Our AI assistant has reviewed your query and prepared an initial response below. Our founders will follow up personally if you need anything deeper.</p><div style="padding:14px 16px;border-left:3px solid #00c8ff;background:#f5fbff;white-space:pre-wrap;border-radius:6px;">${esc(aiAnswer)}</div>`
    : `<p style="margin:0 0 12px;">Hi ${safeName},</p><p style="margin:0 0 12px;">Thank you for reaching out to MentorWise AI. We've received your query and one of our founders will personally respond shortly. In the meantime you can reach us directly using the contact details below.</p>`;

  return `<!doctype html><html><body style="margin:0;padding:24px;background:#f7f7fb;font-family:Inter,Arial,sans-serif;color:#0b0b1a;">
  <div style="max-width:620px;margin:0 auto;background:#ffffff;border-radius:14px;padding:28px;border:1px solid #ececf3;">
    <div style="font-family:'Space Grotesk',Arial,sans-serif;font-size:22px;font-weight:700;background:linear-gradient(90deg,#00c8ff,#a855f7);-webkit-background-clip:text;background-clip:text;color:transparent;">MentorWise AI</div>
    <div style="font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#888;margin-bottom:18px;">Acknowledgement</div>
    ${intro}
    ${contactsBlock}
    <p style="margin-top:22px;font-size:12px;color:#888;">This is an automated acknowledgement from MentorWise AI · Chennai, Tamil Nadu, India.</p>
  </div>
  </body></html>`;
}

function teamEmailHtml(payload: z.infer<typeof ContactInput>, aiAnswer: string | null) {
  return `<!doctype html><html><body style="font-family:Inter,Arial,sans-serif;padding:20px;color:#0b0b1a;">
    <h2 style="margin:0 0 12px;">New MentorWise AI contact query</h2>
    <p><b>Name:</b> ${esc(payload.fullName)}</p>
    <p><b>Email:</b> <a href="mailto:${esc(payload.email)}">${esc(payload.email)}</a></p>
    <p><b>Occupation:</b> ${esc(payload.occupation)}</p>
    <p><b>Query:</b></p>
    <div style="padding:12px;background:#f5f5fa;border-radius:8px;white-space:pre-wrap;">${esc(payload.query)}</div>
    <p style="margin-top:16px;"><b>AI auto-answer sent to user:</b></p>
    <div style="padding:12px;background:#f0fbff;border-radius:8px;white-space:pre-wrap;">${esc(aiAnswer ?? "(escalated to founders — no AI auto-answer was sent)")}</div>
  </body></html>`;
}


// Per-IP rate limit: max 5 contact submissions per hour
async function enforceContactRateLimit(): Promise<void> {
  const req = getRequest();
  const ip =
    req?.headers.get("cf-connecting-ip") ??
    req?.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req?.headers.get("x-real-ip") ??
    "unknown";
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data: row } = await supabaseAdmin
    .from("contact_rate_limit")
    .select("count, window_start")
    .eq("ip", ip)
    .maybeSingle();
  const now = new Date();
  const WINDOW_MS = 60 * 60 * 1000;
  const LIMIT = 5;
  if (row) {
    const started = new Date(row.window_start).getTime();
    if (now.getTime() - started < WINDOW_MS) {
      if (row.count >= LIMIT) {
        throw new Error("Too many requests. Please try again later.");
      }
      await supabaseAdmin
        .from("contact_rate_limit")
        .update({ count: row.count + 1 })
        .eq("ip", ip);
    } else {
      await supabaseAdmin
        .from("contact_rate_limit")
        .update({ count: 1, window_start: now.toISOString() })
        .eq("ip", ip);
    }
  } else {
    await supabaseAdmin
      .from("contact_rate_limit")
      .insert({ ip, count: 1, window_start: now.toISOString() });
  }
}

export const submitContactForm = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => ContactInput.parse(input))
  .handler(async ({ data }) => {
    await enforceContactRateLimit();
    const aiAnswer = await aiQueryAnswer(data.occupation, data.query);

    const userRaw = buildRfc2822({
      to: data.email,
      subject: "We received your query — MentorWise AI",
      html: userEmailHtml(data.fullName, aiAnswer),
    });
    const teamRaw = buildRfc2822({
      to: "mentorwiseaiedtech@gmail.com",
      subject: `New query from ${data.fullName} (${data.occupation})`,
      html: teamEmailHtml(data, aiAnswer),
      replyTo: data.email,
    });

    await sendGmail(userRaw);
    try { await sendGmail(teamRaw); } catch (e) { console.error("Team notify failed", e); }

    return { ok: true as const, aiResolved: !!aiAnswer };
  });
