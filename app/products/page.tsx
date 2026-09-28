import type { Metadata } from "next";
import { Suspense } from "react";
import { TableOfContents, type TocItem } from "@/components/TableOfContents";
import { PageFoot, Byline } from "@/components/PageFoot";
import { shop } from "@/data/shop";
import { items, navCategories, artForCategory } from "@/data/content";
import { ProductCard } from "@/components/ProductCard";
import { Art } from "@/components/ArtSprite";
import { ProductFilter } from "@/components/ProductFilter";
import { FollowUs } from "@/components/FollowUs";
import { MoreLinks } from "@/components/MoreLinks";

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
    <div className="wrap shopping-catalog">
      <section className="sec">
        <h1 className="catalog-heading">Products — अपनी category चुनिए</h1>
        <p style={{ color: "var(--ink-2)", maxWidth: "60ch", margin: "0 0 16px" }}>
          सब कुछ, एक ही छत के नीचे — {shop.tagline} का सभी सामान।
        </p>
        <Suspense fallback={<p>जो product चाहिए, उसका नाम WhatsApp पर भेज दीजिए।</p>}><ProductFilter /></Suspense>
        <TableOfContents items={toc} heading="Category से चुनिए" />
      </section>

      {navCategories.map((c) => {
        const list = items.filter((i) => i.category === c.slug);
        if (!list.length) return null;
        return (
          <section className="sec" id={c.slug} key={c.slug}>
            <div className="shead">
              <i className="cpic" aria-hidden="true"><Art id={artForCategory(c.slug)} /></i>
              <h2>{c.label}</h2>
            </div>
            <div className="pgrid">
              {list.map((it) => <ProductCard key={it.title} item={it} />)}
            </div>
          </section>
        );
      })}

      <Byline />

      <MoreLinks current="/products" />
      <PageFoot />
      <FollowUs />
    </div>
  );
}

