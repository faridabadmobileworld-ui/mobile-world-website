import type { ReactNode } from "react";
import AuroraCanvas from "@/components/AuroraCanvas";
import Reveal from "@/components/Reveal";

/**
 * भीतरी pages का ऊपरी हिस्सा — Home से छोटा, पर वही चलती हुई रोशनी।
 * इससे सारे pages एक ही परिवार के लगते हैं।
 */
export default function PageHero({
  eyebrow,
  title,
  accent,
  children,
}: {
  /** ऊपर छोटा सा label */
  eyebrow?: string;
  /** सफ़ेद हिस्सा */
  title: string;
  /** रंगीन हिस्सा */
  accent?: string;
  children?: ReactNode;
}) {
  return (
    <section className="relative overflow-hidden">
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_60%_0%,#1e3a8a_0%,#0a0f1e_50%,#05070f_100%)]"
      />
      <AuroraCanvas />
      {/* लिखाई पढ़ी जानी चाहिए — रंग कितने भी अच्छे हों */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-r from-ink/85 via-ink/50 to-transparent"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-transparent"
      />

      <div className="relative z-10 mx-auto max-w-5xl px-5 pt-32 pb-16 sm:pt-40 sm:pb-20">
        {eyebrow && (
          <Reveal>
            <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-electric/30 bg-electric/5 px-4 py-1.5 text-xs font-medium tracking-wide text-electric backdrop-blur-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-electric" />
              {eyebrow}
            </p>
          </Reveal>
        )}
        <Reveal delay={80}>
          <h1 className="text-4xl leading-[1.1] font-black tracking-tight sm:text-6xl">
            <span className="bg-gradient-to-br from-white to-cream bg-clip-text text-transparent">
              {title}
            </span>
            {accent && (
              <>
                {" "}
                <span className="bg-gradient-to-br from-brand via-electric to-violet bg-clip-text text-transparent">
                  {accent}
                </span>
              </>
            )}
          </h1>
        </Reveal>
        {children && <Reveal delay={160}>{children}</Reveal>}
      </div>
    </section>
  );
}
