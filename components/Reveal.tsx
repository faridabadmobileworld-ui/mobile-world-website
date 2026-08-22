"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * Scroll करने पर अंदर की चीज़ नीचे से उभरकर आती है।
 *
 * IntersectionObserver इस्तेमाल किया है — यह browser का अपना औज़ार है,
 * इसके लिए कोई library नहीं चाहिए। scroll पर लगातार गिनती नहीं होती,
 * इसलिए फ़ोन पर अटकता नहीं।
 */
export default function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: ReactNode;
  /** मिलीसेकंड में देरी — एक के बाद एक उभारने के लिए */
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.style.transitionDelay = `${delay}ms`;
          el.classList.add("is-visible");
          io.unobserve(el); // एक बार दिख गया, अब दोबारा नहीं देखना
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -60px 0px" },
    );

    io.observe(el);
    return () => io.disconnect();
  }, [delay]);

  return (
    <div ref={ref} className={`reveal ${className}`}>
      {children}
    </div>
  );
}
