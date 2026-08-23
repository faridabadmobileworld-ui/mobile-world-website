import type { Metadata } from "next";
import { shop, fullAddress } from "@/data/shop";
import { formatTime } from "@/data/hours";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";
import OpenStatus from "@/components/OpenStatus";
import CallButton from "@/components/CallButton";
import WhatsAppButton from "@/components/WhatsAppButton";

export const metadata: Metadata = {
  title: "Visit Us — Gurudwara Road, Jawahar Colony, NIT Faridabad",
  description:
    `${shop.name} का पता: ${fullAddress}. रोज़ ${formatTime("09:00")} से ` +
    `${formatTime("23:00")} तक खुली। हर महीने की आख़िरी तारीख़ को बंद।`,
  alternates: { canonical: "/visit-us" },
};

const dailyHours = shop.openingHours[0];

export default function VisitUs() {
  return (
    <>
      <PageHero eyebrow="दुकान कहाँ है" title="Visit" accent="Us">
        <p className="mt-6 max-w-lg text-lg leading-relaxed text-muted">
          Gurudwara Road पर, Bada Gurudwara और Disposal Chowk के पास।
        </p>
      </PageHero>

      <main className="relative z-10 mx-auto max-w-5xl px-5">
        <section className="pb-20 sm:pb-28">
          <div className="grid gap-5 sm:grid-cols-2">
            {/* पता */}
            <Reveal>
              <div className="glow-ring h-full rounded-2xl bg-gradient-to-br from-surface to-ink-2 p-7">
                <p className="text-xs tracking-widest text-muted uppercase">पता</p>
                <address className="mt-4 text-base leading-relaxed text-cream not-italic">
                  {shop.address.street}
                  <br />
                  {shop.address.landmark}
                  <br />
                  {shop.address.locality}, {shop.address.city}
                  <br />
                  {shop.address.state} – {shop.address.postalCode}
                </address>

                {shop.social.googleMaps ? (
                  <a
                    href={shop.social.googleMaps}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-6 inline-flex rounded-xl border border-electric/40 px-5 py-3 text-sm font-semibold text-electric transition-colors hover:bg-electric hover:text-ink"
                  >
                    Google Maps पर रास्ता देखें
                  </a>
                ) : (
                  <p className="mt-6 text-sm text-muted">
                    रास्ता पूछना हो तो call कर लीजिए — बता देंगे।
                  </p>
                )}
              </div>
            </Reveal>

            {/* समय */}
            <Reveal delay={120}>
              <div className="glow-ring h-full rounded-2xl bg-gradient-to-br from-surface to-ink-2 p-7">
                <p className="text-xs tracking-widest text-muted uppercase">
                  खुलने का समय
                </p>
                <p className="mt-4 text-3xl font-bold">
                  <span className="bg-gradient-to-r from-cream to-electric bg-clip-text text-transparent">
                    {formatTime(dailyHours.opens)} – {formatTime(dailyHours.closes)}
                  </span>
                </p>
                <p className="mt-2 text-sm text-muted">सोमवार से रविवार, सातों दिन</p>

                <div className="mt-6 border-t border-line pt-5">
                  <p className="text-xs tracking-widest text-muted uppercase">
                    छुट्टी
                  </p>
                  <p className="mt-2 text-cream">
                    हर महीने की आख़िरी तारीख़ को दुकान बंद रहती है
                  </p>
                  <p className="mt-1 text-sm text-muted">
                    यानी 31 तारीख़, या जिस महीने में जो आख़िरी दिन हो
                  </p>
                </div>

                <div className="mt-6">
                  <OpenStatus />
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ─────────── हफ़्ते का पूरा समय ─────────── */}
        <section className="border-t border-line py-20 sm:py-28">
          <Reveal>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              हफ़्ते का{" "}
              <span className="bg-gradient-to-r from-brand to-electric bg-clip-text text-transparent">
                समय
              </span>
            </h2>
          </Reveal>

          <Reveal delay={120}>
            <ul className="mt-8 divide-y divide-line overflow-hidden rounded-2xl border border-line bg-surface/40">
              {shop.openingHours.map((h) => (
                <li
                  key={h.day}
                  className="flex items-center justify-between px-6 py-4"
                >
                  <span className="text-cream">{h.day}</span>
                  <span className="font-medium text-muted">
                    {formatTime(h.opens)} – {formatTime(h.closes)}
                  </span>
                </li>
              ))}
            </ul>
          </Reveal>
        </section>

        {/* ─────────── बुलावा ─────────── */}
        <section className="border-t border-line py-20 sm:py-28">
          <Reveal>
            <div className="glow-ring relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand/15 via-surface to-violet/10 px-7 py-12 text-center">
              <div
                aria-hidden="true"
                className="absolute -top-24 left-1/2 h-48 w-48 -translate-x-1/2 rounded-full bg-electric/20 blur-3xl"
              />
              <h2 className="relative text-2xl font-bold tracking-tight sm:text-3xl">
                आने से पहले पूछ लीजिए
              </h2>
              <p className="relative mx-auto mt-4 max-w-md text-muted">
                जो model चाहिए उसकी availability पहले confirm कर लेंगे, तो चक्कर
                नहीं लगाना पड़ेगा।
              </p>
              <div className="relative mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                <CallButton />
                <WhatsAppButton />
              </div>
            </div>
          </Reveal>
        </section>
      </main>
    </>
  );
}
