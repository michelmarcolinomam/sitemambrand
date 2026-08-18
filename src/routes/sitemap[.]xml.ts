import { createFileRoute } from "@tanstack/react-router";

import { supabase } from "@/integrations/supabase/client";
import { SITE_URL } from "@/lib/seo";

interface SitemapEntry {
  path: string;
  changefreq?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority?: string;
  lastmod?: string;
}

// Rotas fixas — as páginas de intenção que trabalhamos em SEO/Ads têm prioridade alta.
const STATIC_ENTRIES: SitemapEntry[] = [
  { path: "/", changefreq: "weekly", priority: "1.0" },
  { path: "/branding", changefreq: "monthly", priority: "0.9" },
  { path: "/rebranding", changefreq: "monthly", priority: "0.9" },
  { path: "/ciclo-de-marca", changefreq: "monthly", priority: "0.8" },
  { path: "/audiovisual", changefreq: "monthly", priority: "0.8" },
  { path: "/rotulos-e-embalagens", changefreq: "monthly", priority: "0.8" },
  { path: "/diario", changefreq: "weekly", priority: "0.7" },
  { path: "/estudio", changefreq: "monthly", priority: "0.6" },
  { path: "/sobre", changefreq: "monthly", priority: "0.6" },
];

function xmlEscape(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

// Cases publicados do banco viram URLs /cases/<slug>. Falha silenciosa: se o banco
// não responder, o sitemap ainda sai com as rotas fixas (não derruba a rota).
async function loadCaseEntries(): Promise<SitemapEntry[]> {
  try {
    const { data, error } = await supabase
      .from("cases")
      .select("slug, updated_at")
      .eq("published", true);

    if (error || !data) return [];

    return data.map((c) => ({
      path: `/cases/${c.slug}`,
      changefreq: "monthly" as const,
      priority: "0.7",
      lastmod: c.updated_at ? new Date(c.updated_at).toISOString().slice(0, 10) : undefined,
    }));
  } catch {
    return [];
  }
}

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const entries: SitemapEntry[] = [...STATIC_ENTRIES, ...(await loadCaseEntries())];

        const urls = entries.map((e) =>
          [
            `  <url>`,
            `    <loc>${xmlEscape(SITE_URL + e.path)}</loc>`,
            e.lastmod ? `    <lastmod>${e.lastmod}</lastmod>` : null,
            e.changefreq ? `    <changefreq>${e.changefreq}</changefreq>` : null,
            e.priority ? `    <priority>${e.priority}</priority>` : null,
            `  </url>`,
          ]
            .filter(Boolean)
            .join("\n")
        );

        const xml = [
          `<?xml version="1.0" encoding="UTF-8"?>`,
          `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
          ...urls,
          `</urlset>`,
        ].join("\n");

        return new Response(xml, {
          headers: {
            "Content-Type": "application/xml",
            "Cache-Control": "public, max-age=3600",
          },
        });
      },
    },
  },
});
