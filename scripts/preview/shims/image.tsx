/**
 * next/image की जगह, सिर्फ़ preview file के लिए।
 *
 * असली website पर Next.js हर तस्वीर को visitor के फ़ोन के नाप में काटकर
 * भेजता है। एक ही file वाले preview में कोई server नहीं होता, इसलिए सारी
 * तस्वीरें पहले से file के अंदर घुसी होती हैं — यह shim बस उन्हें ढूँढ़कर
 * लगा देता है।
 */

import type { CSSProperties } from "react";

type Props = {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  style?: CSSProperties;
  /* नीचे वाले सिर्फ़ Next.js के अपने हैं — असली <img> पर नहीं जाने चाहिए */
  fill?: boolean;
  priority?: boolean;
  sizes?: string;
  quality?: number;
  loading?: "lazy" | "eager";
  unoptimized?: boolean;
  placeholder?: string;
};

declare global {
  interface Window {
    /** तस्वीर का पता → file के अंदर घुसी हुई तस्वीर */
    __MW_IMG?: Record<string, string>;
  }
}

function resolve(src: string) {
  if (typeof window === "undefined") return src;
  return window.__MW_IMG?.[src] ?? src;
}

export default function Image({
  src,
  alt,
  width,
  height,
  className,
  style,
  fill,
  priority,
  loading,
  // बाक़ी Next-only props जान-बूझकर छोड़ दिए
  sizes: _sizes,
  quality: _quality,
  unoptimized: _unoptimized,
  placeholder: _placeholder,
  ...rest
}: Props) {
  const fillStyle: CSSProperties = fill
    ? { position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }
    : {};

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={resolve(src)}
      alt={alt}
      width={fill ? undefined : width}
      height={fill ? undefined : height}
      className={className}
      style={{ ...fillStyle, ...style }}
      loading={priority ? "eager" : (loading ?? "lazy")}
      decoding="async"
      {...rest}
    />
  );
}
