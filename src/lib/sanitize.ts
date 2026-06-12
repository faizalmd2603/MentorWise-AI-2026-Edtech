import { FilterXSS } from "xss";

// Worker-compatible HTML sanitizer (pure JS — no jsdom).
const filter = new FilterXSS({
  whiteList: {
    p: ["style", "class"],
    br: [],
    strong: [], b: [], em: [], i: [], u: [], s: [], strike: [],
    h1: ["style"], h2: ["style"], h3: ["style"],
    ul: ["style"], ol: ["style"], li: ["style"],
    blockquote: ["style"], code: [], pre: [],
    a: ["href", "target", "rel", "style"],
    img: ["src", "alt", "style", "width", "height"],
    span: ["style", "class"],
    div: ["style", "class"],
    hr: [],
  },
  stripIgnoreTag: true,
  stripIgnoreTagBody: ["script", "style"],
  css: {
    whiteList: {
      color: true,
      "background-color": true,
      "font-size": true,
      "font-family": true,
      "font-weight": true,
      "font-style": true,
      "text-align": true,
      "text-decoration": true,
      "list-style-type": true,
      width: true,
      height: true,
      margin: true,
      padding: true,
    },
  },
  safeAttrValue: (tag, name, value) => {
    if ((tag === "a" || tag === "img") && (name === "href" || name === "src")) {
      if (/^(https?:|data:image\/)/i.test(value)) return value;
      return "";
    }
    return value;
  },
});

export function sanitizeAnnouncementHtml(html: string): string {
  return filter.process(html);
}

export function htmlToPlainText(html: string): string {
  return html
    .replace(/<br\s*\/?>(\s*)/gi, "\n")
    .replace(/<\/(p|li|h1|h2|h3|blockquote|div)>/gi, "\n")
    .replace(/<li[^>]*>/gi, "• ")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}
