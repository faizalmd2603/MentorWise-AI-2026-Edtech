import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { AGENTS } from "@/lib/agents";

export default defineTool({
  name: "get_agent_prompts",
  title: "Get MentorWise agent starter prompts",
  description:
    "Return the starter prompts and system persona for a specific MentorWise AI agent by id.",
  inputSchema: {
    agentId: z.string().min(1).describe("Agent id, e.g. 'resume', 'interview', 'linkedin'."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: ({ agentId }) => {
    const agent = AGENTS.find((a) => a.id === agentId);
    if (!agent) {
      return {
        content: [{ type: "text", text: `Unknown agent: ${agentId}` }],
        isError: true,
      };
    }
    const payload = {
      id: agent.id,
      name: agent.name,
      system: agent.system,
      prompts: agent.prompts,
    };
    return {
      content: [{ type: "text", text: JSON.stringify(payload, null, 2) }],
      structuredContent: payload,
    };
  },
});
