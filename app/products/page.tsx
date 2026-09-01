import type { Metadata } from "next";
import { TableOfContents, type TocItem } from "@/components/TableOfContents";
import { PageFoot, Byline } from "@/components/PageFoot";
import { shop } from "@/data/shop";
import { items, navCategories } from "@/data/content";
import { ProductCard } from "@/components/ProductCard";
import { ProductFilter } from "@/components/ProductFilter";
import { Banner } from "@/components/Banner";
import { FollowUs } from "@/components/FollowUs";

export const metadata: Metadata = {
  title: "क्या-क्या मिलता है",
  description:
    `Smartphone, Laptop, TV, AC, Fridge, Washing Machine, Inverter और Kitchen ` +
    `Appliances — ${shop.name}, ${shop.address.locality}, ${shop.address.city}।`,
  alternates: { canonical: "/products" },
};

/** हर category की heading — TOC इसी list से बनती है। */
const toc: TocItem[] = navCategories.map((c) => ({ id: c.slug, label: c.label }));

export default function Products() {
  return (
    <div className="wrap">
      <section className="sec">
        <h1 style={{ fontSize: "clamp(1.4rem,4vw,2rem)", fontWeight: 800,
                     letterSpacing: "-.03em", margin: "0 0 6px" }}>क्या-क्या मिलता है</h1>
        <p style={{ color: "var(--ink-2)", maxWidth: "60ch", margin: "0 0 16px" }}>
          सब कुछ, एक ही छत के नीचे — {shop.tagline} का सभी सामान।
        </p>
        <Byline />
        <ProductFilter />
        <TableOfContents items={toc} heading="Category से चुनिए" />
      </section>

      <section className="sec">
        <Banner src="/images/inside-the-mobile-world-showroom-bright-4a8926d5.webp"
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

      <PageFoot />
      <FollowUs />
    </div>
  );
}
