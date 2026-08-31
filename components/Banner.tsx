/**
 * चौड़ी तस्वीर — page के बीच में एक बड़ा visual।
 *
 * ⚠️ यहाँ **सिर्फ़ वही तस्वीर लगेगी जिसमें कोई दावा न लिखा हो।**
 * 31 Aug 2026 को audit में पकड़ा गया कि sample graphics के अंदर छपा text
 * ("BEST PRICES GUARANTEED", "TRUSTED SINCE 1973", पुराना फ़ोन नंबर) website
 * के नियम तोड़ रहा था — और वो text HTML scan में पकड़ा नहीं जाता।
 * इसलिए अब नियम: तस्वीर के अंदर कोई दावा, कोई नंबर, कोई timing नहीं।
 * जो कहना है वो नीचे असली HTML text में लिखो — Google भी उसे ही पढ़ता है।
 *
 * `tall` उन photos के लिए है जो खड़ी (portrait) हैं — पूरी ऊँचाई देने पर
 * desktop पर screen भर जाती, इसलिए ऊपर से crop कर दी जाती है।
 */

import Image from "next/image";

export function Banner({
  src, alt, w = 1400, h = 933, tall = false,
}: { src: string; alt: string; w?: number; h?: number; tall?: boolean }) {
  return (
    <figure className={tall ? "banner tall rv in" : "banner rv in"}>
      <Image src={src} alt={alt} width={w} height={h}
        sizes="(max-width:1000px) 100vw, 1200px" />
    </figure>
  );
}
