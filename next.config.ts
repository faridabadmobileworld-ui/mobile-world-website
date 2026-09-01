import type { NextConfig } from "next";

/**
 * `EXPORT_PREVIEW=1 npm run build` चलाने पर पूरी site `out/` में static
 * HTML बन जाती है — बिना server के देखने के लिए।
 *
 * असली Vercel वाली build में यह flag नहीं होता, इसलिए वहाँ next/image
 * का optimisation चालू रहता है।
 */
const preview = process.env.EXPORT_PREVIEW === "1";

const nextConfig: NextConfig = {
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
  ...(preview
    ? { output: "export" as const, images: { unoptimized: true }, trailingSlash: true }
    : {}),
};

export default nextConfig;
