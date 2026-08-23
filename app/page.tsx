import type { Metadata } from "next";
import Link from "next/link";
import { shop, categories, fullAddress } from "@/data/shop";
import { formatTime } from "@/data/hours";
import { galleryPhotos, interiorPhotos } from "@/data/photos";
import Experience from "@/components/Experience";
import LocalBusinessSchema from "@/components/LocalBusinessSchema";
import SectionHead from "@/components/SectionHead";
import Reveal from "@/components/Reveal";
import TiltCard from "@/components/TiltCard";
import BrandMarquee from "@/components/BrandMarquee";
import ServicesSection from "@/components/ServicesSection";
import PhotoFrame from "@/components/PhotoFrame";
import PhotoGallery from "@/components/PhotoGallery";
import OpenStatus from "@/components/OpenStatus";
import CallButton from "@/components/CallButton";
import WhatsAppButton from "@/components/WhatsAppButton";

export const metadata: Metadata = {
  title: {
    absolute: `${shop.name} — Mobile, Laptop aur Home Appliances, NIT Faridabad`,
  },
  description:
    `${shop.name}, ${shop.address.locality}, ${shop.address.city} में smartphones, ` +
    `laptops, televisions और home appliances मिलते हैं। Repair, EMI और exchange ` +
    `की सुविधा भी। दुकान रोज़ ${formatTime("09:00")} से ${formatTime("23:00")} तक ` +
    `खुली रहती है। Call या WhatsApp कीजिए।`,
  alternates: { canonical: "/" },
};

const dailyHours = shop.openingHours[0];

export default function Home() {
  return (
    <>
      <LocalBusinessSchema />

      {/*
        Page का असली शीर्षक। दिखता नहीं, पर Google और screen reader इसे
        पढ़ते हैं। दिखने वाला hero एक 3D scene है जिसकी लिखाई scroll पर बदलती
        रहती है — वो <h1> के लायक़ नहीं, क्योंकि शीर्षक स्थिर होना चाहिए।
      */}
      <h1 className="sr-only">
        {shop.name} — {shop.address.locality}, {shop.address.city} में
        smartphones, laptops, televisions और home appliances
      </h1>

      {/* ─── 3D परिचय: गिरते फ़ोन → खुलता फ़ोन → बनते-बिगड़ते कण ─── */}
      <Experience />

      {/* ─── बाक़ी page — reel के ऊपर आता है ─── */}
      <main className="relative z-20 bg-ink">
        <div className="mx-auto max-w-5xl px-5">
          {/* क्या-क्या मिलता है */}
          <section className="py-20 sm:py-28">
            <SectionHead
              eyebrow="दुकान पर मौजूद सामान"
              title="क्या-क्या"
              accent="मिलता है"
              from="from-brand"
              to="to-electric"
            >
              <Link
                href="/products"
                className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-electric hover:underline"
              >
                पूरी list देखें <span aria-hidden="true">→</span>
              </Link>
            </SectionHead>

            <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3">
              {categories.map((category, i) => (
                <Reveal key={category.slug} delay={i * 55}>
                  <TiltCard>
                    <div className="glow-ring h-full rounded-2xl bg-gradient-to-br from-surface to-ink-2 p-5 transition-shadow duration-300 hover:shadow-[0_0_40px_-10px] hover:shadow-electric/40">
                      <span className="float-slow mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-brand/25 to-electric/10 font-[family-name:var(--font-head)] text-sm font-extrabold text-electric">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <p className="text-sm leading-snug font-semibold text-cream sm:text-base">
                        {category.name}
                      </p>
                    </div>
                  </TiltCard>
                </Reveal>
              ))}
            </div>
          </section>

          {/* Repair · EMI · Exchange */}
          <section className="border-t border-line py-20 sm:py-28">
            <ServicesSection heading="Repair, EMI" accent="और Exchange" />
          </section>

          {/* Brands */}
          <section className="border-t border-line py-20 sm:py-28">
            <SectionHead
              eyebrow="जो brands दुकान पर मिलते हैं"
              title=""
              accent="Brands"
              from="from-violet"
              to="to-electric"
            />
            <Reveal delay={120}>
              <div className="-mx-5 mt-10">
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

          {/* दुकान की झलक */}
          <section className="border-t border-line py-20 sm:py-28">
            <SectionHead
              eyebrow="showroom, display और हमारे ग्राहक"
              title="दुकान की"
              accent="झलक"
              from="from-electric"
              to="to-violet"
            />
            <div className="mt-10">
              <PhotoGallery photos={galleryPhotos} />
            </div>
          </section>

          {/* दुकान कहाँ है */}
          <section className="border-t border-line py-20 sm:py-28">
            <Reveal>
              <PhotoFrame
                photo={interiorPhotos[0]}
                sizes="(min-width: 1024px) 960px, 100vw"
                className="mb-12 aspect-[16/10] sm:aspect-[21/9]"
              />
            </Reveal>

            <div className="grid gap-10 sm:grid-cols-2">
              <Reveal>
                <SectionHead
                  title="दुकान"
                  accent="कहाँ है"
                  from="from-brand"
                  to="to-electric"
                />
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
                  <p className="mt-3 font-[family-name:var(--font-head)] text-3xl font-extrabold">
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

          {/* हमारा सफ़र */}
          <section className="border-t border-line py-20 sm:py-28">
            <SectionHead
              title="हमारा"
              accent="सफ़र"
              from="from-violet"
              to="to-brand"
            />
            <ol className="mt-10 space-y-4">
              {shop.milestones.map((milestone, i) => (
                <Reveal key={milestone.year} delay={i * 120}>
                  <li className="glow-ring flex items-center gap-5 rounded-2xl bg-gradient-to-r from-surface to-ink-2 px-6 py-5">
                    <span className="bg-gradient-to-br from-brand to-electric bg-clip-text font-[family-name:var(--font-display)] text-3xl text-transparent sm:text-4xl">
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
                {shop.name} की शुरुआत {shop.milestones[2].year} में हुई, ताकि
                mobiles और electronics की range और बढ़ाई जा सके।
              </p>
            </Reveal>
          </section>

          {/* आख़िरी बुलावा */}
          <section className="border-t border-line py-20 sm:py-28">
            <Reveal>
              <div className="glow-ring relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand/15 via-surface to-violet/10 px-7 py-14 text-center">
                <div
                  aria-hidden="true"
                  className="absolute -top-24 left-1/2 h-48 w-48 -translate-x-1/2 rounded-full bg-electric/20 blur-3xl"
                />
                <h2 className="relative font-[family-name:var(--font-head)] text-3xl font-extrabold tracking-tight sm:text-4xl">
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
                  <a
                    href={shop.phone.tel}
                    className="font-semibold text-electric hover:underline"
                  >
                    {shop.phone.display}
                  </a>
                </p>
              </div>
            </Reveal>
          </section>
        </div>
      </main>
    </>
  );
}
