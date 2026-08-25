import type { MetadataRoute } from "next";
import { shop } from "@/data/shop";

/**
 * `/robots.txt` अपने आप बन जाती है।
 * Site का पूरा URL `shop.siteUrl` से आता है — यहाँ दोबारा मत लिखो।
 */
/** दोनों पूरी तरह static हैं — इससे `output: export` भी बन जाता है। */
export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${shop.siteUrl}/sitemap.xml`,
    host: shop.siteUrl,
  };
}
