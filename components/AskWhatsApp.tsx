"use client";

import { usePathname } from "next/navigation";
import { shop } from "@/data/shop";
import { sitePages } from "@/data/pages";
import { IconWhatsApp } from "./Icons";

/**
 * WhatsApp का बटन, जिसका message उस page के हिसाब से पहले से भरा होता है।
 *
 * **क्यों:** पहले हर जगह एक ही line जाती थी — "मुझे एक product के बारे में
 * जानकारी चाहिए।" ग्राहक `/repairing` पढ़कर बटन दबाता था और दुकान को यह
 * पता ही नहीं चलता था कि वो repair के बारे में पूछ रहा है। अब message में
 * page का नाम अपने आप चला जाता है, इसलिए जवाब सीधे मतलब की बात से शुरू
 * होता है।
 *
 * ⚠️ Topic की कोई नई list नहीं बनाई — नाम `data/pages.ts` से ही उठता है।
 * वहाँ page का नाम बदलिए, यहाँ अपने आप बदल जाएगा।
 */
export function AskWhatsApp({
  className = "w",
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) {
  const path = usePathname() ?? "/";
  return (
    <a className={className} href={askFor(path)} target="_blank" rel="noopener">
      {children ?? (<><IconWhatsApp />WhatsApp</>)}
    </a>
  );
}

/** इस page के लिए पहले से भरा हुआ WhatsApp link। */
export function askFor(path: string): string {
  return `${shop.phone.whatsapp}?text=${encodeURIComponent(line(path))}`;
}

/** Message की असली line — हर हाल में एक भली, सीधी बात। */
function line(path: string): string {
  const hi = "Namaste Mobile World!";

  // Article पढ़ते हुए पूछा तो — कौन सी post, यह `/posts/slug` से नहीं
  // निकालना; slug अंग्रेज़ी में है और message में भद्दा लगता। Article के
  // अपने CTA में पूरा title पहले से जाता है, यहाँ सिर्फ़ इशारा काफ़ी है।
  if (path.startsWith("/posts")) {
    return `${hi} मैंने आपकी website पर एक article पढ़ा, उसी के बारे में पूछना है।`;
  }

  // ⚠️ कुछ page के नाम वाक्य में सीधे नहीं बैठते। "दुकान पर आइए" का नाम
  // जोड़ने पर line बनती थी — "मुझे दुकान पर आइए के बारे में जानना है।"
  // इन गिने-चुने के लिए पूरी line यहीं लिखी है। बाक़ी सब `pages.ts` से।
  const apna: Record<string, string> = {
    "/visit": `${hi} मुझे दुकान का पता और आने का समय पूछना है।`,
    "/contact": `${hi} मुझे दुकान से बात करनी है।`,
    "/about": `${hi} मुझे दुकान के बारे में जानना है।`,
    "/team": `${hi} मुझे दुकान के बारे में जानना है।`,
    "/posts": `${hi} मैंने आपकी website पर पढ़ा, उसी के बारे में पूछना है।`,
    "/products": `${hi} मुझे एक सामान के बारे में पूछना है।`,
  };
  if (apna[path]) return apna[path];

  // बाक़ी सब — page का अपना नाम message में चला जाता है।
  const page = sitePages.find((p) => p.href === path);
  if (!page || page.href === "/") {
    return `${hi} मुझे एक product के बारे में जानकारी चाहिए।`;
  }

  return `${hi} मुझे ${page.label} के बारे में जानना है।`;
}
