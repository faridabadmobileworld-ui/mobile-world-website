import { MotionHeading } from "@/components/MotionHeading";
import { withSocialMetadata } from "@/lib/page-metadata";
import { categoryGuides } from "@/data/category-guides";
import type { Metadata } from "next";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import Link from "next/link";
import { items, navCategories } from "@/data/content";
import { ProductExplorer } from "@/components/ProductExplorer";
import { IconArrow } from "@/components/Icons";
import { publicProducts } from '@/lib/catalog/sanity';
import { phoneGuideLinks } from '@/lib/catalog/guides';
import { catalogueGuidePath, phoneModels } from '@/data/catalog';
import '../product-detail.css';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = withSocialMetadata({
  title: "Products देखिए, compare कीजिए और अपनी shortlist बनाइए",
  description: "Mobile World पर phone models की specifications compare कीजिए। Laptop, TV, AC और Home Appliances देखिए और WhatsApp पर दुकान से जानकारी लीजिए।",
  alternates: { canonical: "/products" },
});

export default async function Products({ searchParams }: { searchParams: Promise<{ model?: string | string[] }> }) {
  const published = await publicProducts();
  const productPages = { ...phoneGuideLinks(), ...Object.fromEntries(published.map(product => [product.id, '/catalog/' + product.slug])) };
  const { model } = await searchParams;
  if (typeof model === 'string') {
    if (Object.hasOwn(productPages, model)) redirect(productPages[model]);
    if (phoneModels.some(phone => phone.id === model)) redirect(catalogueGuidePath(model));
  }
  return <div className="wrap mw-catalog">
    <header className="mw-page-heading"><p className="shopping-overline">MOBILE WORLD · आपकी पसंद का सामान</p><MotionHeading as="h1">आपकी ज़रूरत।<br /><span>आपकी अगली पसंद।</span></MotionHeading><p>Models को समझिए, compare कीजिए और पसंद की list बनाइए। दाम और उपलब्धता के लिए सीधे दुकान से बात कीजिए।</p><Link className="mw-text-link" href="/#phone-finder">चुनने में मदद चाहिए? Phone Finder खोलिए <IconArrow /></Link></header>
    <section className="mw-section" aria-label="Category guides"><MotionHeading as="h2">खरीदारी से पहले category समझिए।</MotionHeading><div className="mw-service-grid">{Object.entries(categoryGuides).map(([slug, guide]) => <Link className="mw-service-card" href={`/products/${slug}`} key={slug}><h3>{guide.heading}</h3><p>{guide.description}</p><b>Category guide खोलिए →</b></Link>)}</div></section>
    {published.length > 0 && <section className="mp-published" aria-labelledby="published-models"><MotionHeading as="h2" id="published-models">Models की पूरी specifications</MotionHeading><div className="mp-published-list">{published.map(product => <Link href={'/catalog/' + product.slug} key={product.id}><span>{product.brand}{product.series ? ' · ' + product.series : ''}</span><strong>{product.name}</strong><span>Variants और specifications देखिए →</span></Link>)}</div></section>}
    <Suspense fallback={<p className="mw-loading">आपके लिए product guide खुल रही है…</p>}><ProductExplorer categories={navCategories} items={items} productPages={productPages} /></Suspense>
  </div>;
}
