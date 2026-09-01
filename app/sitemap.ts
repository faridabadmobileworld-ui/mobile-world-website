import type { MetadataRoute } from "next";
import { shop } from "@/data/shop";
import { posts } from "@/data/content";

/**
 * `/sitemap.xml` अपने आप बन जाती है।
 *
 * **नया page बनाओ तो यहाँ उसका URL जोड़ना मत भूलो** — वरना Google उसे
 * ढूँढ़ नहीं पाएगा। Posts अपने आप जुड़ जाती हैं।
 */
/** दोनों पूरी तरह static हैं — इससे `output: export` भी बन जाता है। */
export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const pages: MetadataRoute.Sitemap = ([
    { url: `${shop.siteUrl}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${shop.siteUrl}/products`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${shop.siteUrl}/visit`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${shop.siteUrl}/contact`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${shop.siteUrl}/about`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${shop.siteUrl}/repairing`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${shop.siteUrl}/after-sales-support`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${shop.siteUrl}/team`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${shop.siteUrl}/posts`, changeFrequency: "weekly", priority: 0.6 },
    { url: `${shop.siteUrl}/privacy`, changeFrequency: "yearly", priority: 0.2 },
    { url: `${shop.siteUrl}/terms`, changeFrequency: "yearly", priority: 0.2 },
  ] as const).map((p) => ({ ...p, lastModified: now }));

  const articles: MetadataRoute.Sitemap = posts.map((p) => ({
    url: `${shop.siteUrl}/posts/${p.slug}`,
    lastModified: new Date(p.dateISO),
    changeFrequency: "yearly",
    priority: 0.5,
  }));

  return [...pages, ...articles];
}
