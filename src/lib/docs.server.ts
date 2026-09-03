import { unzipSync, strFromU8 } from "fflate";

/** Extract readable plain text from a DOCX or XLSX file (server-only). */
export function extractOfficeText(mime: string, filename: string, base64: string): string | null {
  try {
    const bytes = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));
    const zip = unzipSync(bytes);
    const isSheet =
      mime.includes("spreadsheet") || mime.includes("ms-excel") || /\.xlsx?$/i.test(filename);

    if (isSheet) {
      const shared = zip["xl/sharedStrings.xml"]
        ? [...strFromU8(zip["xl/sharedStrings.xml"]).matchAll(/<t[^>]*>([\s\S]*?)<\/t>/g)].map((m) =>
            decode(m[1]),
          )
        : [];
      const rows: string[] = [];
      for (const path of Object.keys(zip).filter((p) => /^xl\/worksheets\/sheet\d+\.xml$/.test(p))) {
        const xml = strFromU8(zip[path]);
        for (const row of xml.match(/<row[\s\S]*?<\/row>/g) ?? []) {
          const cells: string[] = [];
          for (const c of row.match(/<c[\s\S]*?(?:\/>|<\/c>)/g) ?? []) {
            const v = c.match(/<v>([\s\S]*?)<\/v>/)?.[1];
            if (v == null) { cells.push(""); continue; }
            cells.push(/t="s"/.test(c) ? (shared[Number(v)] ?? "") : decode(v));
          }
          if (cells.some((x) => x !== "")) rows.push(cells.join(" | "));
        }
      }
      return rows.length ? rows.slice(0, 400).join("\n") : null;
    }

    // DOCX
    const doc = zip["word/document.xml"];
    if (!doc) return null;
    const xml = strFromU8(doc)
      .replace(/<\/w:p>/g, "\n")
      .replace(/<w:tab[^>]*\/>/g, "\t");
    const text = [...xml.matchAll(/<w:t[^>]*>([\s\S]*?)<\/w:t>|\n/g)]
      .map((m) => (m[1] != null ? decode(m[1]) : "\n"))
      .join("")
      .replace(/\n{3,}/g, "\n\n")
      .trim();
    return text || null;
  } catch {
    return null;
  }
}

function decode(s: string) {
  return s
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&amp;/g, "&");
}

/** Extract plain text from a PDF (server-only, pure JS — Worker safe). */
export async function extractPdfText(base64: string): Promise<string | null> {
  try {
    const { extractText, getDocumentProxy } = await import("unpdf");
    const bytes = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));
    const doc = await getDocumentProxy(bytes);
    const { text } = await extractText(doc, { mergePages: true });
    const out = (Array.isArray(text) ? text.join("\n") : text ?? "").replace(/\n{3,}/g, "\n\n").trim();
    return out.length > 20 ? out : null;
  } catch (err) {
    console.error("[docs] pdf extraction failed", err);
    return null;
  }
}
