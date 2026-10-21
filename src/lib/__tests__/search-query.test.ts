import { describe, expect, it } from "vitest";
import { cleanQuery, filterRelevant, heuristicQuery } from "../search-query";

describe("web search query", () => {
  it("turns a chatty question into keywords", () => {
    expect(heuristicQuery("Can you suggest some internships for a final year MBA HR student in Chennai?", "internship"))
      .toBe("internships final year mba hr student chennai");
  });

  it("short follow-ups borrow the previous question's topic", () => {
    const q = heuristicQuery("what about Bangalore?", "internship", "MBA HR internships in Chennai");
    expect(q).toContain("mba");
    expect(q).toContain("bangalore");
  });

  it("cleans labels and quotes from AI-written queries", () => {
    expect(cleanQuery('Query: "MBA HR internship Chennai 2026"\nextra')).toBe("MBA HR internship Chennai 2026");
  });

  it("drops results unrelated to the query", () => {
    const rows = [
      { title: "MBA HR internship jobs in Chennai", link: "https://in.indeed.com/x" },
      { title: "Prevalence of Text Neck Syndrome", link: "https://pubmed.ncbi.nlm.nih.gov/1" },
    ];
    expect(filterRelevant(rows, "MBA HR internship 2026").map((r) => r.title)).toEqual(["MBA HR internship jobs in Chennai"]);
  });
});
