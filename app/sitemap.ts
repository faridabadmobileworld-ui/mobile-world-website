import { categoryGuides } from "@/data/category-guides";
import type { MetadataRoute } from "next";
import { shop } from "@/data/shop";
import { livePosts } from "@/data/content";
import { publicProducts } from '@/lib/catalog/sanity';

/**
 * `/sitemap.xml` अपने आप बन जाती है।
 *
 * **नया page बनाओ तो यहाँ उसका URL जोड़ना मत भूलो** — वरना Google उसे
 * ढूँढ़ नहीं पाएगा। Posts अपने आप जुड़ जाती हैं।
 */
export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const pages: MetadataRoute.Sitemap = ([
    { url: `${shop.siteUrl}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${shop.siteUrl}/products`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${shop.siteUrl}/visit`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${shop.siteUrl}/contact`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${shop.siteUrl}/about`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${shop.siteUrl}/repairing`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${shop.siteUrl}/after-sales-support`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${shop.siteUrl}/finance`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${shop.siteUrl}/team`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${shop.siteUrl}/posts`, changeFrequency: "weekly", priority: 0.6 },
    { url: `${shop.siteUrl}/privacy`, changeFrequency: "yearly", priority: 0.2 },
    { url: `${shop.siteUrl}/terms`, changeFrequency: "yearly", priority: 0.2 },
    { url: `${shop.siteUrl}/returns`, changeFrequency: "yearly", priority: 0.3 },
  ] as const).map((p) => ({ ...p, lastModified: now }));

  // जिस post का वक़्त नहीं आया वो sitemap में भी नहीं जाती — वरना Google
  // ऐसा पता माँगने आता जो अभी बना ही नहीं है।
  const articles: MetadataRoute.Sitemap = livePosts().map((p) => ({
    url: `${shop.siteUrl}/posts/${p.slug}`,
    lastModified: new Date(p.dateISO),
    changeFrequency: "yearly",
    priority: 0.5,
  }));

  const products: MetadataRoute.Sitemap = (await publicProducts()).map(product => ({
    url: shop.siteUrl + '/catalog/' + product.slug,
    ...(Number.isFinite(Date.parse(product.updatedAt)) ? { lastModified: new Date(product.updatedAt) } : {}),
    changeFrequency: 'weekly', priority: 0.7,
  }));
  return [...pages, ...Object.keys(categoryGuides).map(category => ({ url: `${shop.siteUrl}/products/${category}`, lastModified: new Date("2026-10-24T00:00:00+05:30"), changeFrequency: "monthly" as const, priority: 0.8 })), ...articles, ...products];
}
