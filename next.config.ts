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
  ...(preview
    ? { output: "export" as const, images: { unoptimized: true }, trailingSlash: true }
    : {}),
};

export default nextConfig;
