import type { ReactNode } from "react";
import Reveal from "@/components/Reveal";

/**
 * हर section का शीर्षक — एक सफ़ेद हिस्सा, एक रंगीन हिस्सा।
 *
 * सब pages पर एक ही component इस्तेमाल होता है, इसलिए पूरी website में
 * शीर्षक एक जैसे दिखते हैं।
 */
export default function SectionHead({
  eyebrow,
  title,
  accent,
  from = "from-brand",
  to = "to-electric",
  children,
}: {
  /** ऊपर छोटी सी लाइन */
  eyebrow?: string;
  /** सफ़ेद हिस्सा */
  title: string;
  /** रंगीन हिस्सा */
  accent?: string;
  /** Tailwind की gradient शुरुआत, जैसे "from-violet" */
  from?: string;
  /** Tailwind की gradient समाप्ति, जैसे "to-electric" */
  to?: string;
  children?: ReactNode;
}) {
  return (
    <Reveal>
      <h2 className="font-[family-name:var(--font-head)] text-3xl font-extrabold tracking-tight sm:text-4xl">
        {title}
        {accent && (
          <>
            {title && " "}
            <span className={`bg-gradient-to-r ${from} ${to} bg-clip-text text-transparent`}>
              {accent}
            </span>
          </>
        )}
      </h2>
      {eyebrow && <p className="mt-3 text-muted">{eyebrow}</p>}
      {children}
    </Reveal>
  );
}
