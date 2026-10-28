import { withSocialMetadata } from "@/lib/page-metadata";
import { categoryGuides } from "@/data/category-guides";
import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { items, navCategories } from "@/data/content";
import { ProductExplorer } from "@/components/ProductExplorer";
import { IconArrow } from "@/components/Icons";

export const metadata: Metadata = withSocialMetadata({
  title: "Products देखिए, compare कीजिए और अपनी shortlist बनाइए",
  description: "Mobile World पर phone models की specifications compare कीजिए। Laptop, TV, AC और Home Appliances देखिए और WhatsApp पर दुकान से जानकारी लीजिए।",
  alternates: { canonical: "/products" },
});

export default function Products() {
  return <div className="wrap mw-catalog">
    <header className="mw-page-heading"><p className="shopping-overline">MOBILE WORLD · आपकी पसंद का सामान</p><h1>आपकी ज़रूरत।<br /><span>आपकी अगली पसंद।</span></h1><p>Models को समझिए, compare कीजिए और पसंद की list बनाइए। दाम और उपलब्धता के लिए सीधे दुकान से बात कीजिए।</p><Link className="mw-text-link" href="/#phone-finder">चुनने में मदद चाहिए? Phone Finder खोलिए <IconArrow /></Link></header>
    <section className="mw-section" aria-label="Category guides"><h2>खरीदारी से पहले category समझिए।</h2><div className="mw-service-grid">{Object.entries(categoryGuides).map(([slug, guide]) => <Link className="mw-service-card" href={`/products/${slug}`} key={slug}><h3>{guide.heading}</h3><p>{guide.description}</p><b>Category guide खोलिए →</b></Link>)}</div></section>
    <Suspense fallback={<p className="mw-loading">आपके लिए product guide खुल रही है…</p>}><ProductExplorer categories={navCategories} items={items} /></Suspense>
  </div>;
}
