import type { Metadata } from "next";
import { shop } from "@/data/shop";
import { items, navCategories } from "@/data/content";
import { ProductCard } from "@/components/ProductCard";
import { ProductFilter } from "@/components/ProductFilter";
import { Banner } from "@/components/Banner";

export const metadata: Metadata = {
  title: "क्या-क्या मिलता है",
  description:
    `${shop.tagline} का सभी सामान — Smartphone, Laptop, TV, AC, Refrigerator, ` +
    `Washing Machine, Inverter और Kitchen Appliances। ${shop.name}, ` +
    `${shop.address.locality}, ${shop.address.city}। क्या-क्या मौजूद है, WhatsApp पर पूछ लीजिए।`,
  alternates: { canonical: "/products" },
};

export default function Products() {
  return (
    <div className="wrap">
      <section className="sec">
        <h1 style={{ fontSize: "clamp(1.4rem,4vw,2rem)", fontWeight: 800,
                     letterSpacing: "-.03em", margin: "0 0 6px" }}>क्या-क्या मिलता है</h1>
        <p style={{ color: "var(--ink-2)", maxWidth: "60ch", margin: "0 0 16px" }}>
          सब कुछ, एक ही छत के नीचे — {shop.tagline} का सभी सामान।
        </p>
        <ProductFilter />
      </section>

      <section className="sec">
        <Banner src="/images/everything-under-one-roof-mobile-world-4a8926d5.webp"
          alt={`सब कुछ एक ही छत के नीचे — ${shop.name}, ${shop.tagline}`} />
      </section>

      {navCategories.map((c) => {
        const list = items.filter((i) => i.category === c.slug);
        if (!list.length) return null;
        return (
          <section className="sec" id={c.slug} key={c.slug}>
            <div className="shead"><h2>{c.label}</h2></div>
            <div className="pgrid">
              {list.map((it) => <ProductCard key={it.title} item={it} />)}
            </div>
          </section>
        );
      })}
    </div>
  );
}
