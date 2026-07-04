import { defineMcp } from "@lovable.dev/mcp-js";
import listAgentsTool from "./tools/list-agents";
import getAgentPromptsTool from "./tools/get-agent-prompts";

export default defineMcp({
  name: "mentorwise-ai-mcp",
  title: "MentorWise AI",
  version: "0.1.0",
  instructions:
    "Tools for MentorWise AI, a premium career platform for students. Use `list_agents` to discover the available AI career agents, and `get_agent_prompts` to fetch a specific agent's starter prompts and persona.",
  tools: [listAgentsTool, getAgentPromptsTool],
});
