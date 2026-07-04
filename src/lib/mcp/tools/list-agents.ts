import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { AGENTS } from "@/lib/agents";

export default defineTool({
  name: "list_agents",
  title: "List MentorWise AI agents",
  description:
    "List all MentorWise AI career agents with their id, name, short tagline, description, and availability status.",
  inputSchema: {
    includeComingSoon: z
      .boolean()
      .optional()
      .describe("Include agents that are coming soon. Defaults to true."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: ({ includeComingSoon }) => {
    const include = includeComingSoon ?? true;
    const agents = AGENTS.filter((a) => include || !a.comingSoon).map((a) => ({
      id: a.id,
      name: a.name,
      short: a.short,
      description: a.description,
      comingSoon: !!a.comingSoon,
    }));
    return {
      content: [{ type: "text", text: JSON.stringify(agents, null, 2) }],
      structuredContent: { agents },
    };
  },
});
