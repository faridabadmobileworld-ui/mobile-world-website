import Link from 'next/link';
import { notFound } from 'next/navigation';
import { categoryGuides, type GuideCategory } from '@/data/category-guides';
import { shop } from '@/data/shop';
import { items, ask } from '@/data/content';
import { phoneBrands } from '@/data/catalog';
import { ProductCard } from '@/components/ProductCard';
import { withSocialMetadata } from '@/lib/page-metadata';
import { jsonLdScript } from '@/data/schema';

export const dynamicParams = false;
export function generateStaticParams() { return Object.keys(categoryGuides).map(category => ({ category })); }
export async function generateMetadata({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;
  const guide = categoryGuides[category as GuideCategory];
  if (!guide) notFound();
  return withSocialMetadata({ title: guide.title, description: guide.description, alternates: { canonical: `/products/${category}` } });
}
export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;
  const guide = categoryGuides[category as GuideCategory];
  if (!guide) notFound();
  const schema = { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Home', item: shop.siteUrl }, { '@type': 'ListItem', position: 2, name: 'Products', item: `${shop.siteUrl}/products` }, { '@type': 'ListItem', position: 3, name: guide.title, item: `${shop.siteUrl}/products/${category}` }] };
  return <div className="wrap mw-catalog">
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript(schema) }}/>
    <nav aria-label="Breadcrumb"><Link href="/">Home</Link> / <Link href="/products">Products</Link></nav>
    <header className="mw-page-heading"><p className="shopping-overline">MOBILE WORLD · JAWAHAR COLONY, NIT FARIDABAD</p><h1>{guide.heading}</h1><p>{guide.intro}</p><div className="btns"><Link className="shopping-primary" href={`/products#${category}`}>इस category के products देखिए →</Link><a className="shopping-secondary" href={ask(guide.title)} target="_blank" rel="noopener noreferrer">WhatsApp पर पूछिए</a></div></header>
    <section className="mw-section prose" id="buying-checklist"><h2>खरीदने से पहले ये बातें देखिए।</h2><ul>{guide.points.map(p => <li key={p}>{p}</li>)}</ul></section>
    <section className="mw-section" id="category-products"><h2>Website पर अपनी पसंद देखिए।</h2>{category === 'smartphones' ? <div className="mw-service-grid">{phoneBrands.map(b => <article className="mw-service-card" key={b.slug}><h3>{b.name}</h3><p>{b.models.slice(0, 3).map(m => m.name).join(' · ')}</p><Link href={`/products?brand=${b.slug}#smartphones`}>{b.name} के models देखिए →</Link></article>)}</div> : <div className="shopping-category-grid">{items.filter(p => p.category === category).map(p => <ProductCard key={p.title} item={p}/>)}</div>}</section>
    <section className="mw-section prose" id="category-questions"><h2>आपके काम के सवाल।</h2>{guide.faq.map(([q,a]) => <details key={q}><summary>{q}</summary><p>{a}</p></details>)}</section>
    <section className="mw-section prose" id="local-store"><h2>Mobile World पर मिलिए।</h2><p>{shop.address.street}, {shop.address.landmark}, {shop.address.locality}, {shop.address.city}। दुकान रोज़ 10 AM–10 PM खुलती है; महीने की आख़िरी तारीख़ को बंद रहती है।</p><p>अपनी जरूरत, पसंद और उपलब्ध options पर बात कीजिए। Warranty संबंधित brand की शर्तों के अनुसार होती है।</p><div className="btns"><Link className="shopping-primary" href="/visit">रास्ता और दुकान की जानकारी</Link><Link className="shopping-secondary" href="/finance">EMI की जानकारी</Link><a className="shopping-secondary" href={shop.phone.tel}>Call कीजिए</a></div></section>
  </div>;
}
