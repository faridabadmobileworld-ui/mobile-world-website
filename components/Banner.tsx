/**
 * चौड़ा brand graphic — owner के बनवाए हुए poster website पर लगाने के लिए।
 *
 * ⚠️ ये graphics अभी **sample** हैं (owner ने 26 Aug 2026 को बताया)।
 * असली photos owner ख़ुद खींचकर देंगे। तब सिर्फ़ `src` बदलना है।
 *
 * इनके अंदर का text तस्वीर में छपा हुआ है — phone पर छोटा पड़ता है और
 * Google उसे पढ़ नहीं सकता। इसीलिए हर graphic के आस-पास वही बात असली
 * HTML text में भी लिखी है। दोनों साथ रहने चाहिए।
 */

import Image from "next/image";

export function Banner({
  src, alt, w = 1400, h = 933,
}: { src: string; alt: string; w?: number; h?: number }) {
  return (
    <figure className="banner rv in">
      <Image src={src} alt={alt} width={w} height={h}
        sizes="(max-width:1000px) 100vw, 1200px" />
    </figure>
  );
}
