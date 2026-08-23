import type { Metadata } from "next";
import { shop, categories } from "@/data/shop";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";
import TiltCard from "@/components/TiltCard";
import BrandMarquee from "@/components/BrandMarquee";
import CallButton from "@/components/CallButton";
import WhatsAppButton from "@/components/WhatsAppButton";

export const metadata: Metadata = {
  title: "Products — Mobiles, Laptops, TV aur Home Appliances",
  description:
    `${shop.name}, ${shop.address.city} पर mobiles, laptops, televisions, air ` +
    `conditioners, washing machines, inverters और दूसरे home appliances के options। ` +
    `Availability WhatsApp या call पर पूछ लीजिए।`,
  alternates: { canonical: "/products" },
};

export default function Products() {
  return (
    <>
      <PageHero eyebrow="क्या-क्या मिलता है" title="Products" accent="और Brands">
        <p className="mt-6 max-w-lg text-lg leading-relaxed text-muted">
          दुकान पर मौजूद सामान की categories। किसी भी model की availability
          जाननी हो तो सीधे पूछ लीजिए।
        </p>
      </PageHero>

      <main className="relative z-10 mx-auto max-w-5xl px-5">
        {/* ─────────── categories ─────────── */}
        <section className="pb-20 sm:pb-28">
          <div className="grid gap-4 sm:grid-cols-2">
            {categories.map((category, i) => (
              <Reveal key={category.slug} delay={(i % 2) * 80}>
                <TiltCard>
                  <div className="glow-ring flex h-full flex-col rounded-2xl bg-gradient-to-br from-surface to-ink-2 p-6 transition-shadow duration-300 hover:shadow-[0_0_40px_-10px] hover:shadow-electric/40">
                    <span className="float-slow mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-brand/25 to-electric/10 text-sm font-bold text-electric">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <h2 className="text-lg font-bold text-cream">{category.name}</h2>
                    <p className="mt-2 text-sm leading-relaxed text-muted">
                      {category.description}
                    </p>
                  </div>
                </TiltCard>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ─────────── brands ─────────── */}
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
        </section>

        {/* ─────────── स्टॉक के बारे में साफ़ बात ─────────── */}
        <section className="border-t border-line py-20 sm:py-28">
          <Reveal>
            <div className="glow-ring relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand/15 via-surface to-violet/10 px-7 py-12 text-center">
              <div
                aria-hidden="true"
                className="absolute -top-24 left-1/2 h-48 w-48 -translate-x-1/2 rounded-full bg-electric/20 blur-3xl"
              />
              <h2 className="relative text-2xl font-bold tracking-tight sm:text-3xl">
                कौन सा model चाहिए?
              </h2>
              <p className="relative mx-auto mt-4 max-w-md leading-relaxed text-muted">
                Stock हर समय बदलता रहता है, इसलिए यहाँ हर model की list नहीं
                रखी। जिस model के बारे में जानना है, उसका नाम WhatsApp पर भेज
                दीजिए — availability, colour और variant बता देंगे।
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
