import type { NextConfig } from "next";
import { readdirSync } from "node:fs";
import { join } from "node:path";

/**
 * `EXPORT_PREVIEW=1 npm run build` चलाने पर पूरी site `out/` में static
 * HTML बन जाती है — बिना server के देखने के लिए।
 *
 * असली Vercel वाली build में यह flag नहीं होता, इसलिए वहाँ next/image
 * का optimisation चालू रहता है।
 */
const preview = process.env.EXPORT_PREVIEW === "1";
// Only completed, checked-in images enter the catalogue. Each image upload
// triggers a deployment and switches its own model without waiting for a batch.
const studioImageIds = readdirSync(join(process.cwd(), "public/images"))
  .filter((file) => /^mw-studio-[a-z0-9-]+\.webp$/.test(file))
  .map((file) => file.slice("mw-studio-".length, -".webp".length))
  .sort();
const productImageIds = readdirSync(join(process.cwd(), "public/images"))
  .filter((file) => /^mw-product-[a-z0-9-]+\.webp$/.test(file))
  .map((file) => file.slice("mw-product-".length, -".webp".length))
  .sort();

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_STUDIO_IMAGE_IDS: JSON.stringify(studioImageIds),
    NEXT_PUBLIC_PRODUCT_IMAGE_IDS: JSON.stringify(productImageIds),
  },
  /**
   * Instagram की तस्वीरें उनके अपने server (CDN) से आती हैं। हम उन्हें
   * `unoptimized` रखते हैं — Instagram हर घंटे नया पता देता है, इसलिए उन्हें
   * दोबारा बनवाने का कोई फ़ायदा नहीं। यह list सिर्फ़ इसलिए है कि Next.js
   * इन पतों को पहचान ले।
   */
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**.cdninstagram.com" },
      { protocol: "https", hostname: "**.fbcdn.net" },
    ],
  },
  /**
   * `/showcase` अब एक असली Next.js route है (`app/showcase/page.tsx`) —
   * वही home page, बस ऊपर scroll वाला video hero और पूरे page पर 3D चाल।
   * पहले वो `public/showcase/index.html` की सादी HTML file थी और यहाँ एक
   * rewrite से चलती थी; अब उसकी ज़रूरत नहीं। Video और तस्वीरें अब भी
   * `public/showcase/assets/` में ही हैं, इसलिए उनके पते नहीं बदले।
   */
  ...(preview
    ? { output: "export" as const, images: { unoptimized: true }, trailingSlash: true }
    : {}),
};

export default nextConfig;
