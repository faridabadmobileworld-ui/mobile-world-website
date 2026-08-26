/**
 * "Google पर हमें ढूँढ़िए" — QR code।
 *
 * Scan करते ही दुकान का Google listing खुलता है — पता, खुलने का समय,
 * और चाहें तो review। यह owner का अपना Google का बनाया हुआ QR है।
 *
 * नीचे लिखा link भी वही खोलता है, ताकि जो phone से पढ़ रहा है (और QR
 * scan नहीं कर सकता) उसे भी रास्ता मिल जाए।
 */

import Image from "next/image";
import { shop } from "@/data/shop";

export function GoogleQR() {
  if (!shop.social.googleMaps) return null;

  return (
    <a className="gqr" href={shop.social.googleMaps} target="_blank" rel="noopener">
      <Image src="/images/check-us-out-on-google-qr-47d95166.webp"
        alt={`${shop.name} को Google पर देखिए — QR code`}
        width={700} height={780} sizes="150px" />
      <span>Google पर हमें ढूँढ़िए</span>
    </a>
  );
}
