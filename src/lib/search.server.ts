// Real Google search via SerpAPI. Server-only.
import { trackedApiFetch } from "./api-usage.server";

export type SearchSource = {
  n: number;
  title: string;
  link: string;
  snippet: string;
  date?: string;
  source?: string;
};

const CURRENT_YEAR = new Date().getUTCFullYear();

function isFreshEnough(raw?: string): boolean {
  if (!raw) return true; // undated results are kept, model is told to verify
  const m = raw.match(/(19|20)\d{2}/);
  if (!m) return true;
  const year = Number(m[0]);
  return year >= 2020 && year <= CURRENT_YEAR + 1;
}

/**
 * Runs a real Google search restricted to results published from 2020 onwards.
 */
export async function googleSearch(query: string, limit = 8): Promise<SearchSource[]> {
  const key = process.env.GOOGLE_SEARCH_API_KEY;
  if (!key || !query.trim()) return [];

  const params = new URLSearchParams({
    engine: "google",
    q: query,
    api_key: key,
    num: String(Math.min(limit + 4, 20)),
    hl: "en",
    google_domain: "google.com",
    safe: "active",
    // Custom date range: only pages Google dates from 1 Jan 2020 onwards.
    tbs: `cdr:1,cd_min:1/1/2020,cd_max:12/31/${CURRENT_YEAR + 1}`,
  });

  let json: {
    organic_results?: Array<{
      title?: string;
      link?: string;
      snippet?: string;
      date?: string;
      source?: string;
    }>;
    top_stories?: Array<{ title?: string; link?: string; date?: string; source?: string }>;
    error?: string;
  };

  try {
    const res = await trackedApiFetch({ provider: "serpapi", model: "google", operation: "search" }, `https://serpapi.com/search.json?${params.toString()}`);
    if (!res.ok) {
      console.error("SerpAPI error", res.status, await res.text());
      return [];
    }
    json = await res.json();
  } catch (err) {
    console.error("SerpAPI request failed", err);
    return [];
  }

  if (json.error) {
    console.error("SerpAPI returned error", json.error);
    return [];
  }

  const rows: SearchSource[] = [];
  const seen = new Set<string>();

  const push = (title?: string, link?: string, snippet?: string, date?: string, source?: string) => {
    if (!title || !link || !/^https?:\/\//i.test(link)) return;
    if (seen.has(link)) return;
    if (!isFreshEnough(date)) return;
    seen.add(link);
    rows.push({
      n: rows.length + 1,
      title: title.trim(),
      link,
      snippet: (snippet ?? "").trim(),
      date,
      source,
    });
  };

  for (const r of json.organic_results ?? []) push(r.title, r.link, r.snippet, r.date, r.source);
  for (const r of json.top_stories ?? []) push(r.title, r.link, undefined, r.date, r.source);

  const { filterRelevant } = await import("./search-query");
  return filterRelevant(rows, query)
    .slice(0, limit)
    .map((r, i) => ({ ...r, n: i + 1 }));
}

export function formatSourcesForPrompt(sources: SearchSource[]): string {
  return sources
    .map(
      (s) =>
        `[${s.n}] ${s.title}\nURL: ${s.link}${s.date ? `\nPublished: ${s.date}` : ""}${
          s.snippet ? `\nSummary: ${s.snippet}` : ""
        }`,
    )
    .join("\n\n");
}
