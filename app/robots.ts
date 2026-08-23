import type { MetadataRoute } from "next";
import { shop } from "@/data/shop";

/**
 * robots.txt — search engines को इजाज़त देता है और sitemap का पता बताता है।
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: new URL("/sitemap.xml", shop.siteUrl).toString(),
  };
}
