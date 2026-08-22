import type { Metadata } from "next";
import { shop, categories, fullAddress } from "@/data/shop";
import { formatTime } from "@/data/hours";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import CallButton from "@/components/CallButton";
import WhatsAppButton from "@/components/WhatsAppButton";
import StickyContactBar from "@/components/StickyContactBar";
import OpenStatus from "@/components/OpenStatus";
import LocalBusinessSchema from "@/components/LocalBusinessSchema";
import AuroraCanvas from "@/components/AuroraCanvas";
import Reveal from "@/components/Reveal";
import TiltCard from "@/components/TiltCard";
import BrandMarquee from "@/components/BrandMarquee";

export const metadata: Metadata = {
  title: {
    absolute: `${shop.name} — Mobile, Laptop aur Home Appliances, NIT Faridabad`,
  },
  description:
    `${shop.name}, ${shop.address.locality}, ${shop.address.city} में smartphones, ` +
    `laptops, televisions और home appliances मिलते हैं। दुकान रोज़ ` +
    `${formatTime("09:00")} से ${formatTime("23:00")} तक खुली रहती है। ` +
    `Call या WhatsApp कीजिए।`,
  alternates: { canonical: "/" },
};

const dailyHours = shop.openingHours[0];

export default function Home() {
  return (
    <div className="grain relative">
      <LocalBusinessSchema />
      <SiteHeader />

      {/* ─────────── Hero — पीछे चलती हुई रोशनी ─────────── */}
      <section className="relative flex min-h-[92svh] items-center overflow-hidden">
        {/* WebGL न चले तो यह gradient दिखेगा */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,#1e3a8a_0%,#0a0f1e_45%,#05070f_100%)]"
        />
        <AuroraCanvas />
        {/*
          लिखाई के पीछे अँधेरी परतें। रंग कितने भी चमकें, लिखाई हमेशा
          पढ़ी जानी चाहिए — यह सुंदरता से ज़्यादा ज़रूरी है।
        */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-r from-ink/85 via-ink/45 to-transparent"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-ink via-ink/35 to-transparent"
        />

        <div className="relative z-10 mx-auto w-full max-w-5xl px-5 pt-24 pb-16">
          <Reveal>
            <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-electric/30 bg-electric/5 px-4 py-1.5 text-xs font-medium tracking-wide text-electric backdrop-blur-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-electric" />
              {shop.address.locality} · {shop.address.city}
            </p>
          </Reveal>

          <Reveal delay={80}>
            <h1 className="text-5xl leading-[1.05] font-black tracking-tight sm:text-7xl">
              <span className="bg-gradient-to-br from-white via-cream to-electric bg-clip-text text-transparent">
                Mobile
              </span>
              <br />
              <span className="bg-gradient-to-br from-brand via-electric to-violet bg-clip-text text-transparent">
                World
              </span>
            </h1>
          </Reveal>

          <Reveal delay={160}>
            <p className="mt-6 max-w-lg text-lg leading-relaxed text-muted sm:text-xl">
              Smartphones, laptops, televisions और home appliances — सब एक ही
              दुकान पर। जो चाहिए, बस पूछ लीजिए।
            </p>
          </Reveal>

          <Reveal delay={240}>
            <div className="mt-7">
              <OpenStatus />
            </div>
          </Reveal>

          <Reveal delay={320}>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <CallButton className="w-full sm:w-auto" />
              <WhatsAppButton className="w-full sm:w-auto" />
            </div>
          </Reveal>
        </div>
      </section>

      <main className="relative z-10 mx-auto max-w-5xl px-5">
        {/* ─────────── क्या-क्या मिलता है ─────────── */}
        <section className="py-20 sm:py-28">
          <Reveal>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              क्या-क्या{" "}
              <span className="bg-gradient-to-r from-brand to-electric bg-clip-text text-transparent">
                मिलता है
              </span>
            </h2>
            <p className="mt-3 text-muted">दुकान पर मौजूद सामान की categories</p>
          </Reveal>

          <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3">
            {categories.map((category, i) => (
              <Reveal key={category.slug} delay={i * 60}>
                <TiltCard>
                  <div className="glow-ring group h-full rounded-2xl bg-gradient-to-br from-surface to-ink-2 p-5 transition-shadow duration-300 hover:shadow-[0_0_40px_-10px] hover:shadow-electric/40">
                    <div className="float-slow mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-brand/25 to-electric/10 text-electric">
                      <span className="text-sm font-bold">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                    </div>
                    <p className="text-sm leading-snug font-semibold text-cream sm:text-base">
                      {category.name}
                    </p>
                  </div>
                </TiltCard>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ─────────── Brands ─────────── */}
        <section className="border-t border-line py-20 sm:py-28">
          <Reveal>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              <span className="bg-gradient-to-r from-violet to-electric bg-clip-text text-transparent">
                Brands
              </span>
            </h2>
            <p className="mt-3 text-muted">जो brands दुकान पर मिलते हैं</p>
          </Reveal>

          <Reveal delay={120}>
            <div className="mt-10 -mx-5">
              <BrandMarquee />
            </div>
          </Reveal>

          <Reveal delay={200}>
            <p className="mt-8 max-w-lg text-sm leading-relaxed text-muted">
              Stock हर समय बदलता रहता है। जो model चाहिए, उसका नाम WhatsApp पर
              भेज दीजिए — availability बता देंगे।
            </p>
          </Reveal>
        </section>

        {/* ─────────── दुकान कहाँ है ─────────── */}
        <section className="border-t border-line py-20 sm:py-28">
          <div className="grid gap-10 sm:grid-cols-2">
            <Reveal>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                दुकान{" "}
                <span className="bg-gradient-to-r from-brand to-electric bg-clip-text text-transparent">
                  कहाँ है
                </span>
              </h2>
              <address className="mt-6 leading-relaxed text-muted not-italic">
                {fullAddress}
              </address>

              {shop.social.googleMaps && (
                <a
                  href={shop.social.googleMaps}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 inline-flex rounded-xl border border-electric/40 px-5 py-3 text-sm font-semibold text-electric transition-colors hover:bg-electric hover:text-ink"
                >
                  Google Maps पर रास्ता देखें
                </a>
              )}
            </Reveal>

            <Reveal delay={140}>
              <div className="glow-ring rounded-2xl bg-gradient-to-br from-surface to-ink-2 p-7">
                <p className="text-xs tracking-widest text-muted uppercase">
                  खुलने का समय
                </p>
                <p className="mt-3 text-3xl font-bold">
                  <span className="bg-gradient-to-r from-cream to-electric bg-clip-text text-transparent">
                    {formatTime(dailyHours.opens)} – {formatTime(dailyHours.closes)}
                  </span>
                </p>
                <p className="mt-2 text-sm text-muted">सातों दिन</p>

                <div className="mt-6 border-t border-line pt-5">
                  <p className="text-xs tracking-widest text-muted uppercase">छुट्टी</p>
                  <p className="mt-2 text-cream">हर महीने की आख़िरी तारीख़ को बंद</p>
                </div>

                <div className="mt-6">
                  <OpenStatus />
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ─────────── हमारा सफ़र ─────────── */}
        <section className="border-t border-line py-20 sm:py-28">
          <Reveal>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              हमारा{" "}
              <span className="bg-gradient-to-r from-violet to-brand bg-clip-text text-transparent">
                सफ़र
              </span>
            </h2>
          </Reveal>

          <ol className="mt-10 space-y-4">
            {shop.milestones.map((milestone, i) => (
              <Reveal key={milestone.year} delay={i * 120}>
                <li className="glow-ring flex items-center gap-5 rounded-2xl bg-gradient-to-r from-surface to-ink-2 px-6 py-5">
                  <span className="bg-gradient-to-br from-brand to-electric bg-clip-text text-2xl font-black text-transparent sm:text-3xl">
                    {milestone.year}
                  </span>
                  <span className="text-sm text-cream sm:text-base">
                    {milestone.event}
                  </span>
                </li>
              </Reveal>
            ))}
          </ol>

          <Reveal delay={400}>
            <p className="mt-8 max-w-xl text-sm leading-relaxed text-muted">
              परिवार का business {shop.milestones[0].year} से चला आ रहा है।{" "}
              {shop.name} की शुरुआत {shop.milestones[2].year} में हुई, ताकि mobiles
              और electronics की range और बढ़ाई जा सके।
            </p>
          </Reveal>
        </section>

        {/* ─────────── आख़िरी बुलावा ─────────── */}
        <section className="border-t border-line py-20 sm:py-28">
          <Reveal>
            <div className="glow-ring relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand/15 via-surface to-violet/10 px-7 py-14 text-center">
              <div
                aria-hidden="true"
                className="absolute -top-24 left-1/2 h-48 w-48 -translate-x-1/2 rounded-full bg-electric/20 blur-3xl"
              />
              <h2 className="relative text-3xl font-bold tracking-tight sm:text-4xl">
                कोई भी model पूछ लीजिए
              </h2>
              <p className="relative mx-auto mt-4 max-w-md text-muted">
                Availability, colour, variant — जो जानना हो, सीधे message कर
                दीजिए या call कर लीजिए।
              </p>
              <div className="relative mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                <CallButton />
                <WhatsAppButton />
              </div>
              <p className="relative mt-6 text-sm text-muted">
                <a href={shop.phone.tel} className="font-semibold text-electric hover:underline">
                  {shop.phone.display}
                </a>
              </p>
            </div>
          </Reveal>
        </section>

        {/* ─────────── Social ─────────── */}
        <section className="border-t border-line py-16">
          <Reveal>
            <h2 className="text-xl font-bold">हमें follow कीजिए</h2>
            <ul className="mt-5 flex flex-wrap gap-3">
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
                    className="glow-ring inline-flex rounded-xl bg-surface/70 px-5 py-2.5 text-sm font-medium text-cream/90 transition-colors hover:text-electric"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </Reveal>
        </section>
      </main>

      <SiteFooter />
      <StickyContactBar />
    </div>
  );
}
