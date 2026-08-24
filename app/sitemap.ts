import type { MetadataRoute } from "next";
import { shop } from "@/data/shop";

/**
 * `/sitemap.xml` अपने आप बन जाती है।
 *
 * अभी सिर्फ़ home page है। Phase 1 के बाक़ी pages (Products, About,
 * Contact, Visit Us) बनते ही यहाँ जोड़ने हैं — वरना Google उन्हें
 * ढूँढ़ नहीं पाएगा।
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: `${shop.siteUrl}/`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
  ];
}
