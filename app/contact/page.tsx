import type { Metadata } from "next";
import Link from "next/link";
import { shop, fullAddress } from "@/data/shop";
import { formatTime } from "@/data/hours";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";
import OpenStatus from "@/components/OpenStatus";
import CallButton from "@/components/CallButton";
import WhatsAppButton from "@/components/WhatsAppButton";

export const metadata: Metadata = {
  title: "Contact — Call ya WhatsApp",
  description:
    `${shop.name}, ${shop.address.locality}, ${shop.address.city} से संपर्क करें। ` +
    `Phone और WhatsApp: ${shop.phone.display}. रोज़ ${formatTime("09:00")} से ` +
    `${formatTime("23:00")} तक।`,
  alternates: { canonical: "/contact" },
};

export default function Contact() {
  return (
    <>
      <PageHero eyebrow="संपर्क" title="Contact" accent="कीजिए">
        <p className="mt-6 max-w-lg text-lg leading-relaxed text-muted">
          जो पूछना हो सीधे पूछ लीजिए — model, availability, colour, variant।
        </p>
        <div className="mt-6">
          <OpenStatus />
        </div>
      </PageHero>

      <main className="relative z-10 mx-auto max-w-5xl px-5">
        {/* ─────────── दोनों बड़े रास्ते ─────────── */}
        <section className="pb-20 sm:pb-28">
          <div className="grid gap-5 sm:grid-cols-2">
            <Reveal>
              <div className="glow-ring flex h-full flex-col rounded-2xl bg-gradient-to-br from-surface to-ink-2 p-7">
                <p className="text-xs tracking-widest text-muted uppercase">
                  फ़ोन पर
                </p>
                <a
                  href={shop.phone.tel}
                  className="mt-3 text-2xl font-bold text-cream transition-colors hover:text-electric sm:text-3xl"
                >
                  {shop.phone.display}
                </a>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-muted">
                  सीधे बात करनी हो तो call कर लीजिए। रोज़{" "}
                  {formatTime("09:00")} से {formatTime("23:00")} तक।
                </p>
                <CallButton className="mt-6 w-full" />
              </div>
            </Reveal>

            <Reveal delay={120}>
              <div className="glow-ring flex h-full flex-col rounded-2xl bg-gradient-to-br from-surface to-ink-2 p-7">
                <p className="text-xs tracking-widest text-muted uppercase">
                  WhatsApp पर
                </p>
                <p className="mt-3 text-2xl font-bold text-cream sm:text-3xl">
                  {shop.phone.display}
                </p>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-muted">
                  जिस model के बारे में जानना है, उसका नाम भेज दीजिए —
                  availability और details बता देंगे।
                </p>
                <WhatsAppButton className="mt-6 w-full" />
              </div>
            </Reveal>
          </div>
        </section>

        {/* ─────────── दुकान का पता ─────────── */}
        <section className="border-t border-line py-20 sm:py-28">
          <div className="grid gap-10 sm:grid-cols-2">
            <Reveal>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                दुकान पर{" "}
                <span className="bg-gradient-to-r from-brand to-electric bg-clip-text text-transparent">
                  आइए
                </span>
              </h2>
              <address className="mt-6 leading-relaxed text-muted not-italic">
                {fullAddress}
              </address>
              <Link
                href="/visit-us"
                className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-electric hover:underline"
              >
                पूरा समय और रास्ता देखें
                <span aria-hidden="true">→</span>
              </Link>
            </Reveal>

            <Reveal delay={140}>
              <div className="glow-ring rounded-2xl bg-gradient-to-br from-surface to-ink-2 p-7">
                <p className="text-xs tracking-widest text-muted uppercase">
                  हमें follow कीजिए
                </p>
                <ul className="mt-5 space-y-3">
                  {[
                    { name: "YouTube", url: shop.social.youtube },
                    { name: "Instagram", url: shop.social.instagram },
                    { name: "Facebook", url: shop.social.facebook },
                  ].map((link) => (
                    <li key={link.name}>
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between rounded-xl border border-line px-4 py-3 text-sm font-medium text-cream/90 transition-colors hover:border-electric/50 hover:text-electric"
                      >
                        {link.name}
                        <span aria-hidden="true">↗</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>
        </section>
      </main>
    </>
  );
}
