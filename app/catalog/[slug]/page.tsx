import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { publicProducts } from '@/lib/catalog/sanity';
import { DetailedProduct } from '@/components/DetailedProduct';
import { withSocialMetadata } from '@/lib/page-metadata';
import { shop } from '@/data/shop';
import '../../product-detail.css';

export const dynamic = 'force-dynamic';
type Props = { params: Promise<{ slug: string }> };
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = (await publicProducts()).find(item => item.slug === slug);
  if (!product) return { title: 'Product नहीं मिला', robots: { index: false, follow: false } };
  const metadata = withSocialMetadata({ title: product.name + ' · Specifications और variants', description: product.description || product.brand + ' ' + product.name + ' की specifications और variants देखिए। दाम और उपलब्धता Mobile World से पूछिए।', alternates: { canonical: '/catalog/' + product.slug } });
  return { ...metadata, openGraph: { ...metadata.openGraph, images: [{ url: product.image, alt: product.imageAlt }] }, twitter: { ...metadata.twitter, images: [product.image] } };
}
export default async function Page({ params }: Props) {
  const { slug } = await params;
  const product = (await publicProducts()).find(item => item.slug === slug);
  if (!product) notFound();
  const schema = { '@context': 'https://schema.org', '@type': 'Product', name: product.name, description: product.description || undefined, image: new URL(product.image, shop.siteUrl).href, brand: { '@type': 'Brand', name: product.brand }, url: shop.siteUrl + '/catalog/' + product.slug };
  return <main className="wrap mp-page"><nav aria-label="Breadcrumb" className="mp-breadcrumb"><Link href="/">Home</Link><span>/</span><Link href="/products">Products</Link><span>/</span><span>{product.name}</span></nav><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, '\\u003c') }} /><DetailedProduct product={product} /><Link className="mw-text-link" href="/products">← बाकी products देखिए</Link></main>;
}
