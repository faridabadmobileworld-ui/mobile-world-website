"use client";

import { useRef, type ReactNode } from "react";

/**
 * Mouse या उँगली के हिसाब से हल्का सा 3D झुकने वाला card।
 *
 * CSS के transform से बना है — कोई 3D library नहीं। इसलिए हल्का है
 * और हर फ़ोन पर चलता है।
 */
export default function TiltCard({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const move = (clientX: number, clientY: number) => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const r = el.getBoundingClientRect();
    // card के बीच से कितनी दूर हैं — -0.5 से 0.5 के बीच
    const x = (clientX - r.left) / r.width - 0.5;
    const y = (clientY - r.top) / r.height - 0.5;
    el.style.transform = `rotateY(${x * 12}deg) rotateX(${-y * 12}deg) translateZ(10px)`;
  };

  const reset = () => {
    const el = ref.current;
    if (el) el.style.transform = "";
  };

  return (
    <div className={`tilt-scene ${className}`}>
      <div
        ref={ref}
        className="tilt-card h-full"
        onMouseMove={(e) => move(e.clientX, e.clientY)}
        onMouseLeave={reset}
        onTouchMove={(e) => {
          const t = e.touches[0];
          if (t) move(t.clientX, t.clientY);
        }}
        onTouchEnd={reset}
      >
        {children}
      </div>
    </div>
  );
}
