import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/elevenlabs/mentor-token")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        // Require a valid Supabase session — token is a billable, abuseable resource.
        const authHeader = request.headers.get("authorization") ?? "";
        if (!authHeader.startsWith("Bearer ")) {
          return Response.json({ error: "Unauthorized" }, { status: 401 });
        }
        const userJwt = authHeader.slice(7).trim();
        if (!userJwt) {
          return Response.json({ error: "Unauthorized" }, { status: 401 });
        }

        const SUPABASE_URL = process.env.SUPABASE_URL;
        const SUPABASE_PUBLISHABLE_KEY = process.env.SUPABASE_PUBLISHABLE_KEY;
        if (!SUPABASE_URL || !SUPABASE_PUBLISHABLE_KEY) {
          return Response.json({ error: "Auth not configured" }, { status: 500 });
        }
        const { createClient } = await import("@supabase/supabase-js");
        const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
          auth: { persistSession: false, autoRefreshToken: false },
        });
        const { data: claimsData, error: claimsErr } = await supabase.auth.getClaims(userJwt);
        if (claimsErr || !claimsData?.claims?.sub) {
          return Response.json({ error: "Unauthorized" }, { status: 401 });
        }

        const apiKey = process.env.ELEVENLABS_API_KEY;
        const agentId = process.env.ELEVENLABS_MENTOR_AGENT_ID;
        if (!apiKey) {
          return Response.json({ error: "ElevenLabs is not connected." }, { status: 500 });
        }
        if (!agentId) {
          return Response.json(
            { error: "ELEVENLABS_MENTOR_AGENT_ID is not configured." },
            { status: 500 },
          );
        }

        const res = await fetch(
          `https://api.elevenlabs.io/v1/convai/conversation/token?agent_id=${encodeURIComponent(agentId)}`,
          { headers: { "xi-api-key": apiKey } },
        );
        if (!res.ok) {
          const text = await res.text();
          return Response.json(
            { error: text || `Token request failed (${res.status})` },
            { status: res.status },
          );
        }
        const data = (await res.json()) as { token?: string };
        if (!data.token) {
          return Response.json({ error: "No token returned" }, { status: 502 });
        }
        return Response.json({ token: data.token });
      },
    },
  },
});
