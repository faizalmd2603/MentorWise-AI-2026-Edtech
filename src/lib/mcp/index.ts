import { auth, defineMcp } from "@lovable.dev/mcp-js";
import listAgentsTool from "./tools/list-agents";
import getAgentPromptsTool from "./tools/get-agent-prompts";

// OAuth issuer MUST be the direct Supabase host, not the .lovable.cloud proxy.
// VITE_SUPABASE_PROJECT_ID is inlined by Vite at build time.
const projectRef = import.meta.env.VITE_SUPABASE_PROJECT_ID ?? "project-ref-unset";

export default defineMcp({
  name: "mentorwise-ai-mcp",
  title: "MentorWise AI",
  version: "0.1.0",
  instructions:
    "Tools for MentorWise AI, a premium career platform for students. Use `list_agents` to discover the available AI career agents, and `get_agent_prompts` to fetch a specific agent's starter prompts and persona.",
  auth: auth.oauth.issuer({
    issuer: `https://${projectRef}.supabase.co/auth/v1`,
    acceptedAudiences: "authenticated",
  }),
  tools: [listAgentsTool, getAgentPromptsTool],
});
