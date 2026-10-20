// Pure helpers that turn a chat question into a focused Google query and
// drop results that have nothing to do with it. Shared by the server and tests.

const STOP = new Set(
  "a an and are as at be but by can could do does for from give get have hello help hey hi how i i'm im in into is it its just let list me my need of on or please show some suggest tell than that the their them then there these this to us want was we what when where which who why will with would you your find looking any about best good also more give".split(
    " ",
  ),
);

/** Extra words that keep a vague question on-topic for each agent. */
export const AGENT_TOPICS: Record<string, string> = {
  internship: "internship",
  courses: "free course certificate",
  interview: "interview questions",
  linkedin: "LinkedIn profile",
  resume: "resume",
  projects: "project ideas",
  exam: "exam preparation",
  email: "email",
};

export function keywords(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9+#.\s-]/g, " ")
    .split(/\s+/)
    .map((w) => w.replace(/^[.-]+|[.-]+$/g, ""))
    .filter((w) => w.length > 1 && !STOP.has(w));
}

/** Fallback query when the AI rewrite is unavailable: keywords + agent topic, max 10 words. */
export function heuristicQuery(question: string, agentId: string, previousUser?: string): string {
  let words = keywords(question);
  // Short follow-ups ("what about Bangalore?") borrow keywords from the previous question.
  if (words.length < 3 && previousUser) words = [...keywords(previousUser), ...words];
  const topic = AGENT_TOPICS[agentId];
  if (topic && !words.some((w) => topic.toLowerCase().includes(w))) words.push(...topic.split(" "));
  return Array.from(new Set(words)).slice(0, 10).join(" ");
}

/** Cleans an AI-written query: single line, no quotes/labels, max 12 words. */
export function cleanQuery(raw: string): string {
  const line = raw.split("\n").map((l) => l.trim()).find(Boolean) ?? "";
  return line
    .replace(/^(search\s*query|query)\s*:\s*/i, "")
    .replace(/^["'`]+|["'`]+$/g, "")
    .split(/\s+/)
    .slice(0, 12)
    .join(" ")
    .trim();
}

/** Keeps only results that mention at least one meaningful query word. */
export function filterRelevant<T extends { title: string; snippet?: string; link: string }>(
  rows: T[],
  query: string,
): T[] {
  const words = keywords(query).filter((w) => !/^20\d\d$/.test(w));
  if (words.length === 0) return rows;
  return rows.filter((r) => {
    const hay = `${r.title} ${r.snippet ?? ""} ${r.link}`.toLowerCase();
    return words.some((w) => hay.includes(w));
  });
}
