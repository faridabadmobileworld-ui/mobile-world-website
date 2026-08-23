import type { MetadataRoute } from "next";
import { shop } from "@/data/shop";
import { navItems } from "@/data/nav";

/**
 * sitemap.xml — Google को बताता है कि website पर कौन-कौन से page हैं।
 * data/nav.ts से अपने आप बनता है, इसलिए नया page जोड़ने पर यह भी अपडेट हो जाता है।
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return navItems.map((item) => ({
    url: new URL(item.href, shop.siteUrl).toString(),
    lastModified: now,
    changeFrequency: "monthly",
    priority: item.priority,
  }));
}
