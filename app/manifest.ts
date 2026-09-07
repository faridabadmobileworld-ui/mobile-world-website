import type { MetadataRoute } from "next";
import { shop } from "@/data/shop";

/**
 * Phone की home screen पर लगने वाली पहचान।
 *
 * इससे ग्राहक Chrome के menu में "Add to Home screen" दबाकर website को
 * app की तरह लगा सकता है — icon दबाते ही पूरी screen पर खुलती है, ऊपर
 * browser की पट्टी नहीं दिखती।
 *
 * ⚠️ यहाँ कोई नई जानकारी मत लिखिए — नाम, tagline और रंग `data/shop.ts`
 * और `globals.css` से ही आते हैं, ताकि एक जगह बदलने पर सब बदल जाए।
 *
 * `id` को कभी मत बदलिए — बदलते ही जिन ग्राहकों ने icon लगा रखा है, उनके
 * लिए यह नई website बन जाएगी और पुराना icon मरा हुआ रह जाएगा।
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/",
    name: `${shop.name} — ${shop.address.locality}, ${shop.address.city}`,
    short_name: shop.name,
    description:
      `${shop.tagline} — ${shop.address.road}, ${shop.address.locality}, ` +
      `${shop.address.city}। रोज़ सुबह 10 से रात 10 बजे तक।`,
    lang: "hi",
    dir: "ltr",
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    // Header सफ़ेद है, इसलिए ऊपर की पट्टी भी सफ़ेद — वरना खुलते ही
    // बैंगनी पट्टी और सफ़ेद header के बीच एक भद्दी लकीर दिखती है।
    background_color: "#F3F3F7",
    theme_color: "#FFFFFF",
    categories: ["shopping", "business"],
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/logo.png", sizes: "512x512", type: "image/png", purpose: "any" },
      // Android icon को गोल या चौकोर, जैसा चाहे काटता है — इसलिए एक अलग
      // version जिसमें चारों तरफ़ जगह छोड़ी हुई है, ताकि logo कटे नहीं।
      { src: "/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
    // Icon को देर तक दबाने पर सीधे यही दो काम सामने आते हैं — वही दो काम
    // जिनके लिए ग्राहक website खोलता है।
    shortcuts: [
      {
        name: "WhatsApp पर पूछिए",
        short_name: "WhatsApp",
        url: "/contact",
        description: "दुकान को सीधे message कीजिए",
      },
      {
        name: "दुकान पर आइए",
        short_name: "रास्ता",
        url: "/visit",
        description: "पता, नक़्शा और दुकान का समय",
      },
    ],
  };
}
