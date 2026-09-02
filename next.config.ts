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
  /**
   * `/showcase` — scroll वाला cinematic page। वो सादा HTML है और
   * `public/showcase/` में रहता है, इसलिए उसे उसकी अपनी file तक पहुँचाना पड़ता है।
   */
  /**
   * `/showcase` — scroll वाला cinematic page, सादा HTML, `public/showcase/` में।
   * ⚠️ उसके अंदर assets के पते **जड़ से** लिखे हैं (`/showcase/assets/...`),
   * relative नहीं — क्योंकि यह पता बिना slash के चलता है और relative पते
   * तब site की जड़ से ढूँढ़े जाते हैं (एक बार सब 404 हो चुका है)।
   * उसी folder के README में लिखा है कि कहीं और deploy करते वक़्त क्या बदलना है।
   */
  async rewrites() {
    return [{ source: "/showcase", destination: "/showcase/index.html" }];
  },
  ...(preview
    ? { output: "export" as const, images: { unoptimized: true }, trailingSlash: true }
    : {}),
};

export default nextConfig;
