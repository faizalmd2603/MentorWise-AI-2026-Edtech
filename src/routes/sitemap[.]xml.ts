import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { AGENTS } from "@/lib/agents";

const BASE_URL = "https://mentorwiseaiedtechservice.lovable.app";

interface SitemapEntry {
  path: string;
  lastmod?: string;
  changefreq?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority?: string;
}

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const today = new Date().toISOString().slice(0, 10);

        const entries: SitemapEntry[] = [
          { path: "/", changefreq: "daily", priority: "1.0", lastmod: today },
          { path: "/agents", changefreq: "daily", priority: "0.95", lastmod: today },
          { path: "/resume", changefreq: "weekly", priority: "0.9", lastmod: today },
          { path: "/interview", changefreq: "weekly", priority: "0.9", lastmod: today },
          { path: "/internships", changefreq: "weekly", priority: "0.9", lastmod: today },
          { path: "/mentorlink", changefreq: "weekly", priority: "0.9", lastmod: today },
          { path: "/about", changefreq: "monthly", priority: "0.75", lastmod: today },
          { path: "/founders", changefreq: "monthly", priority: "0.75", lastmod: today },
          { path: "/contact", changefreq: "monthly", priority: "0.6", lastmod: today },
          { path: "/resources/job-search-sites", changefreq: "monthly", priority: "0.7", lastmod: today },

          ...AGENTS.map((a) => ({
            path: `/agents/${a.id}`,
            changefreq: "weekly" as const,
            priority: "0.85",
            lastmod: today,
          })),
        ];

        const urls = entries.map((e) =>
          [
            `  <url>`,
            `    <loc>${BASE_URL}${e.path}</loc>`,
            e.lastmod ? `    <lastmod>${e.lastmod}</lastmod>` : null,
            e.changefreq ? `    <changefreq>${e.changefreq}</changefreq>` : null,
            e.priority ? `    <priority>${e.priority}</priority>` : null,
            `  </url>`,
          ]
            .filter(Boolean)
            .join("\n"),
        );

        const xml = [
          `<?xml version="1.0" encoding="UTF-8"?>`,
          `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
          ...urls,
          `</urlset>`,
        ].join("\n");

        return new Response(xml, {
          headers: {
            "Content-Type": "application/xml; charset=utf-8",
            "Cache-Control": "public, max-age=600, s-maxage=3600",
            "X-Robots-Tag": "noindex",
          },
        });
      },
    },
  },
});
