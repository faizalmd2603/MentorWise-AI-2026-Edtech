import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { AGENTS } from "@/lib/agents";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";

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
        // bumped: added LaunchBuff "Featured On" badge to homepage


        const entries: SitemapEntry[] = [
          { path: "/", changefreq: "daily", priority: "1.0", lastmod: today },
          { path: "/agents", changefreq: "daily", priority: "0.95", lastmod: today },
          { path: "/events", changefreq: "daily", priority: "0.95", lastmod: today },
          { path: "/feed", changefreq: "daily", priority: "0.9", lastmod: today },
          { path: "/auth", changefreq: "yearly", priority: "0.3", lastmod: today },
          { path: "/resume", changefreq: "weekly", priority: "0.9", lastmod: today },
          { path: "/interview", changefreq: "weekly", priority: "0.9", lastmod: today },
          { path: "/internships", changefreq: "weekly", priority: "0.9", lastmod: today },
          { path: "/mentorlink", changefreq: "weekly", priority: "0.9", lastmod: today },
          { path: "/about", changefreq: "monthly", priority: "0.75", lastmod: today },
          { path: "/founders", changefreq: "monthly", priority: "0.75", lastmod: today },
          { path: "/contact", changefreq: "monthly", priority: "0.6", lastmod: today },
          { path: "/resources/job-search-sites", changefreq: "monthly", priority: "0.7", lastmod: today },
          { path: "/blog", changefreq: "weekly", priority: "0.8", lastmod: today },

          ...AGENTS.map((a) => ({
            path: `/agents/${a.id}`,
            changefreq: "weekly" as const,
            priority: "0.85",
            lastmod: today,
          })),
        ];

        // Add published blog articles from the database
        try {
          const url = process.env.SUPABASE_URL;
          const key = process.env.SUPABASE_PUBLISHABLE_KEY;
          if (url && key) {
            const sb = createClient<Database>(url, key, {
              auth: { storage: undefined, persistSession: false, autoRefreshToken: false },
            });
            const { data } = await sb
              .from("articles")
              .select("slug,updated_at")
              .eq("status", "published")
              .eq("language_code", "en")
              .order("updated_at", { ascending: false })
              .limit(1000);
            for (const row of data ?? []) {
              entries.push({
                path: `/blog/${row.slug}`,
                changefreq: "monthly",
                priority: "0.9",
                lastmod: (row.updated_at ?? today).slice(0, 10),
              });
            }
          }
        } catch (err) {
          console.error("[sitemap] articles fetch failed", err);
        }

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
          },
        });
      },
    },
  },
});
