import type { Metadata } from "next";
import { shop } from "@/data/shop";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";
import CallButton from "@/components/CallButton";
import WhatsAppButton from "@/components/WhatsAppButton";
import PhotoFrame from "@/components/PhotoFrame";
import PhotoGallery from "@/components/PhotoGallery";
import { legacyBanner, customerPhotos, exteriorPhotos } from "@/data/photos";

export const metadata: Metadata = {
  // template इसके आगे "| Mobile World" अपने आप जोड़ देता है
  title: "About — Jawahar Colony से 1973 से",
  description:
    `${shop.name} की कहानी। परिवार का business ${shop.milestones[0].year} से ` +
    `${shop.address.locality}, ${shop.address.city} में। ${shop.name} की शुरुआत ` +
    `${shop.milestones[2].year} में हुई।`,
  alternates: { canonical: "/about" },
};

export default function About() {
  return (
    <>
      <PageHero
        eyebrow={`${shop.milestones[0].year} से ${shop.address.locality} में`}
        title="हमारा"
        accent="सफ़र"
      >
        <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted">
          एक किराना दुकान से शुरू होकर आज mobiles और electronics तक — यह सफ़र
          तीन पीढ़ियों के भरोसे पर टिका है।
        </p>
      </PageHero>

      <main className="relative z-10 mx-auto max-w-5xl px-5">
        {/* ─────────── सफ़र वाला banner ─────────── */}
        <section className="pb-16">
          <Reveal>
            <PhotoFrame
              photo={legacyBanner}
              priority
              sizes="(min-width: 1024px) 960px, 100vw"
            />
          </Reveal>
        </section>

        {/* ─────────── समयरेखा ─────────── */}
        <section className="pb-20 sm:pb-28">
          <ol className="relative space-y-4">
            {shop.milestones.map((milestone, i) => (
              <Reveal key={milestone.year} delay={i * 140}>
                <li className="glow-ring flex items-center gap-6 rounded-2xl bg-gradient-to-r from-surface to-ink-2 px-6 py-6">
                  <span className="bg-gradient-to-br from-brand to-electric bg-clip-text text-3xl font-black text-transparent sm:text-4xl">
                    {milestone.year}
                  </span>
                  <span className="text-base text-cream sm:text-lg">
                    {milestone.event}
                  </span>
                </li>
              </Reveal>
            ))}
          </ol>

          <Reveal delay={480}>
            <div className="mt-10 max-w-2xl space-y-4 leading-relaxed text-muted">
              <p>
                परिवार का business {shop.milestones[0].year} में{" "}
                <span className="text-cream">{shop.milestones[0].event}</span> के
                रूप में शुरू हुआ। {shop.milestones[1].year} में यह{" "}
                <span className="text-cream">{shop.milestones[1].event}</span> बना।
              </p>
              <p>
                {shop.milestones[2].year} में हमने{" "}
                <span className="text-cream">{shop.name}</span> की शुरुआत की, ताकि
                अपने ग्राहकों के लिए mobiles और electronics की range और बढ़ाई जा
                सके।
              </p>
              <p>
                हमारा प्रयास यही रहता है कि हर customer को अपनी ज़रूरत के हिसाब से
                सही product चुनने में आसान और साफ़ जानकारी मिले।
              </p>
            </div>
          </Reveal>
        </section>

        {/* ─────────── दुकान की जानकारी ─────────── */}
        <section className="border-t border-line py-20 sm:py-28">
          <Reveal>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              दुकान की{" "}
              <span className="bg-gradient-to-r from-brand to-electric bg-clip-text text-transparent">
                जानकारी
              </span>
            </h2>
          </Reveal>

          <dl className="mt-10 grid gap-4 sm:grid-cols-2">
            {[
              { label: "दुकान का नाम", value: shop.name },
              { label: "Registered नाम", value: shop.registeredName },
              { label: "Proprietor", value: shop.owner },
              {
                label: "जगह",
                value: `${shop.address.locality}, ${shop.address.city}`,
              },
            ].map((row, i) => (
              <Reveal key={row.label} delay={i * 80}>
                <div className="glow-ring rounded-2xl bg-gradient-to-br from-surface to-ink-2 p-6">
                  <dt className="text-xs tracking-widest text-muted uppercase">
                    {row.label}
                  </dt>
                  <dd className="mt-2 text-lg font-semibold text-cream">
                    {row.value}
                  </dd>
                </div>
              </Reveal>
            ))}
          </dl>

          <Reveal delay={360}>
            <p className="mt-8 max-w-xl text-sm leading-relaxed text-muted">
              एक ही दुकान है, कोई branch नहीं। {shop.address.locality},{" "}
              {shop.address.city} में Gurudwara Road पर, Bada Gurudwara और
              Disposal Chowk के पास।
            </p>
          </Reveal>
        </section>

        {/* ─────────── हमारे ग्राहक ─────────── */}
        <section className="border-t border-line py-20 sm:py-28">
          <Reveal>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              हमारे{" "}
              <span className="bg-gradient-to-r from-electric to-violet bg-clip-text text-transparent">
                ग्राहक
              </span>
            </h2>
            <p className="mt-3 max-w-lg text-muted">
              दुकान पर आने वाले कुछ ग्राहक, अपना सामान लेते हुए।
            </p>
          </Reveal>

          <div className="mt-10">
            <PhotoGallery photos={[...customerPhotos, exteriorPhotos[1]]} />
          </div>
        </section>

        {/* ─────────── बुलावा ─────────── */}
        <section className="border-t border-line py-20 sm:py-28">
          <Reveal>
            <div className="glow-ring relative overflow-hidden rounded-3xl bg-gradient-to-br from-violet/15 via-surface to-brand/10 px-7 py-12 text-center">
              <div
                aria-hidden="true"
                className="absolute -top-24 left-1/2 h-48 w-48 -translate-x-1/2 rounded-full bg-violet/20 blur-3xl"
              />
              <h2 className="relative text-2xl font-bold tracking-tight sm:text-3xl">
                दुकान पर आइए
              </h2>
              <p className="relative mx-auto mt-4 max-w-md text-muted">
                या पहले फ़ोन पर बात कर लीजिए — जो पूछना हो, पूछ लीजिए।
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
