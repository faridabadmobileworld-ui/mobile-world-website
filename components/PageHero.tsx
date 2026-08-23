import type { ReactNode } from "react";
import Reveal from "@/components/Reveal";

/**
 * भीतरी pages का ऊपरी हिस्सा।
 *
 * हर page को अपना रंग मिलता है (`wash`, `glowA`, `glowB`) और पीछे अपनी
 * विशाल लिखाई। इससे हर page अलग लगता है, पर परिवार एक ही रहता है।
 *
 * Home page पर इसकी जगह 3D वाला Experience है — वहाँ फ़ोन ख़ुद hero हैं।
 */
export default function PageHero({
  eyebrow,
  title,
  accent,
  bigType,
  wash,
  glowA,
  glowB,
  children,
}: {
  eyebrow?: string;
  /** सफ़ेद हिस्सा */
  title: string;
  /** रंगीन हिस्सा */
  accent?: string;
  /** पीछे की विशाल लिखाई — \n से टूटती है */
  bigType: string;
  wash: string;
  glowA: string;
  glowB: string;
  children?: ReactNode;
}) {
  return (
    <section className="relative overflow-hidden">
      <div aria-hidden="true" className="absolute inset-0" style={{ background: wash }} />
      <div
        aria-hidden="true"
        className="absolute -left-[12vmin] top-0 h-[46vmin] w-[46vmin] rounded-full opacity-50 blur-[70px]"
        style={{ background: glowA }}
      />
      <div
        aria-hidden="true"
        className="absolute -right-[10vmin] bottom-0 h-[40vmin] w-[40vmin] rounded-full opacity-50 blur-[70px]"
        style={{ background: glowB }}
      />

      {/* पीछे की विशाल लिखाई */}
      <div aria-hidden="true" className="absolute inset-0 grid place-items-center px-2">
        <p className="bigtype text-center text-[clamp(56px,17vw,190px)] text-cream/[0.07]">
          {bigType}
        </p>
      </div>

      {/* लिखाई हमेशा पढ़ी जानी चाहिए — इसलिए ऊपर से दो अँधेरी परतें */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-r from-ink/85 via-ink/45 to-transparent"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-t from-ink via-ink/35 to-transparent"
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
          <h1 className="font-[family-name:var(--font-head)] text-4xl leading-[1.05] font-extrabold tracking-tight sm:text-6xl">
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
