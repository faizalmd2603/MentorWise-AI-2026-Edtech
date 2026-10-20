// Splits resume text into paragraphs and bullet lists without merging them.

export type Block = { type: "p"; text: string } | { type: "ul"; items: string[] };

const BULLET = /^\s*(?:[-•*▪●◦‣–]|\d+[.)])\s+/;

export function parseBlocks(text: string): Block[] {
  const blocks: Block[] = [];
  for (const raw of text.replace(/\r\n?/g, "\n").split("\n")) {
    const line = raw.trim();
    if (!line) {
      blocks.push({ type: "p", text: "" }); // paragraph break marker
      continue;
    }
    if (BULLET.test(line)) {
      const item = line.replace(BULLET, "").trim();
      const last = blocks[blocks.length - 1];
      if (last?.type === "ul") last.items.push(item);
      else blocks.push({ type: "ul", items: [item] });
    } else {
      blocks.push({ type: "p", text: line });
    }
  }
  return blocks.filter((b) => b.type === "ul" || b.text);
}

/** Lines for an always-bulleted field (experience/projects). */
export function bulletLines(text: string): string[] {
  return text
    .replace(/\r\n?/g, "\n")
    .split("\n")
    .map((l) => l.replace(BULLET, "").trim())
    .filter(Boolean);
}
