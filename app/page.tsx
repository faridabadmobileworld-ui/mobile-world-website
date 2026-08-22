import type { Metadata } from "next";
import { shop, categories, brands, fullAddress } from "@/data/shop";
import { formatTime } from "@/data/hours";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import CallButton from "@/components/CallButton";
import WhatsAppButton from "@/components/WhatsAppButton";
import StickyContactBar from "@/components/StickyContactBar";
import OpenStatus from "@/components/OpenStatus";
import LocalBusinessSchema from "@/components/LocalBusinessSchema";

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

// सातों दिन एक ही time है, इसलिए एक ही लाइन में दिखा सकते हैं।
const dailyHours = shop.openingHours[0];

export default function Home() {
  return (
    <>
      <LocalBusinessSchema />
      <SiteHeader />

      <main className="mx-auto max-w-3xl px-5 pb-4">
        {/* ── परिचय और दोनों बड़े button ── */}
        <section className="py-8">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            {shop.name}
          </h1>
          <p className="mt-3 text-lg leading-relaxed text-gray-700">
            {shop.address.locality}, {shop.address.city} में smartphones, laptops,
            televisions और home appliances मिलते हैं।
          </p>

          <div className="mt-4">
            <OpenStatus />
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <CallButton className="w-full sm:w-auto" />
            <WhatsAppButton className="w-full sm:w-auto" />
          </div>

          <p className="mt-4 text-sm text-gray-600">
            किसी भी model की availability या जानकारी के लिए सीधे पूछ लीजिए —{" "}
            <a href={shop.phone.tel} className="font-medium text-brand hover:underline">
              {shop.phone.display}
            </a>
          </p>
        </section>

        {/* ── क्या-क्या मिलता है ── */}
        <section className="border-t border-gray-200 py-8">
          <h2 className="text-xl font-bold text-gray-900">क्या-क्या मिलता है</h2>
          <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {categories.map((category) => (
              <li
                key={category.slug}
                className="rounded-xl bg-brand-light px-4 py-3 text-sm font-medium text-brand-dark"
              >
                {category.name}
              </li>
            ))}
          </ul>
        </section>

        {/* ── Brands ── */}
        <section className="border-t border-gray-200 py-8">
          <h2 className="text-xl font-bold text-gray-900">Brands</h2>
          <ul className="mt-4 flex flex-wrap gap-2">
            {brands.map((brand) => (
              <li
                key={brand.slug}
                className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm text-gray-700"
              >
                {brand.name}
              </li>
            ))}
          </ul>
          <p className="mt-4 text-sm text-gray-600">
            Stock हर समय बदलता रहता है। जो model चाहिए, उसका नाम WhatsApp पर भेज
            दीजिए — availability बता देंगे।
          </p>
        </section>

        {/* ── दुकान कहाँ है ── */}
        <section className="border-t border-gray-200 py-8">
          <h2 className="text-xl font-bold text-gray-900">दुकान कहाँ है</h2>
          <address className="mt-4 not-italic leading-relaxed text-gray-700">
            {fullAddress}
          </address>

          <dl className="mt-5 space-y-2 text-sm">
            <div className="flex gap-2">
              <dt className="font-medium text-gray-900">समय:</dt>
              <dd className="text-gray-700">
                रोज़ {formatTime(dailyHours.opens)} – {formatTime(dailyHours.closes)}
              </dd>
            </div>
            <div className="flex gap-2">
              <dt className="font-medium text-gray-900">छुट्टी:</dt>
              <dd className="text-gray-700">हर महीने की आख़िरी तारीख़ को बंद</dd>
            </div>
          </dl>

          {/* Google Maps का link तभी दिखेगा जब owner उसे shop.ts में भर देगा */}
          {shop.social.googleMaps && (
            <a
              href={shop.social.googleMaps}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex rounded-xl border border-brand px-5 py-3 text-sm font-semibold text-brand hover:bg-brand-light"
            >
              Google Maps पर रास्ता देखें
            </a>
          )}
        </section>

        {/* ── दुकान का सफ़र ── */}
        <section className="border-t border-gray-200 py-8">
          <h2 className="text-xl font-bold text-gray-900">हमारा सफ़र</h2>
          <ul className="mt-4 space-y-3">
            {shop.milestones.map((milestone) => (
              <li key={milestone.year} className="flex gap-4">
                <span className="w-14 shrink-0 font-semibold text-brand">
                  {milestone.year}
                </span>
                <span className="text-gray-700">{milestone.event}</span>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-sm leading-relaxed text-gray-600">
            परिवार का business {shop.milestones[0].year} से चला आ रहा है।{" "}
            {shop.name} की शुरुआत {shop.milestones[2].year} में हुई, ताकि mobiles
            और electronics की range और बढ़ाई जा सके।
          </p>
        </section>

        {/* ── Social ── */}
        <section className="border-t border-gray-200 py-8">
          <h2 className="text-xl font-bold text-gray-900">हमें follow कीजिए</h2>
          <ul className="mt-4 flex flex-wrap gap-3">
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
                  className="inline-flex rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:border-brand hover:text-brand"
                >
                  {link.name}
                </a>
              </li>
            ))}
          </ul>
        </section>
      </main>

      <SiteFooter />
      <StickyContactBar />
    </>
  );
}
