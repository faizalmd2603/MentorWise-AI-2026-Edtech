import { describe, expect, it } from "vitest";
import { parseBlocks, bulletLines } from "../resume-format";

describe("resume summary formatting", () => {
  it("keeps a paragraph and its bullet points separate", () => {
    const blocks = parseBlocks("Detail-driven MBA HR graduate.\n\n• Led 3 hiring drives\n• Cut onboarding time by 20%");
    expect(blocks).toEqual([
      { type: "p", text: "Detail-driven MBA HR graduate." },
      { type: "ul", items: ["Led 3 hiring drives", "Cut onboarding time by 20%"] },
    ]);
  });

  it("does not merge separate lines into one paragraph", () => {
    expect(parseBlocks("First line.\nSecond line.")).toHaveLength(2);
  });

  it("recognises -, * and numbered bullets", () => {
    expect(parseBlocks("- a\n* b\n1. c")).toEqual([{ type: "ul", items: ["a", "b", "c"] }]);
  });

  it("strips bullet symbols in bullet fields", () => {
    expect(bulletLines("• Built X\n- Shipped Y\n\nWrote Z")).toEqual(["Built X", "Shipped Y", "Wrote Z"]);
  });
});
