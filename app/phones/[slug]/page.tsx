import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { publicPhoneGuides } from '@/lib/catalog/guides';
import { productDisplayName } from '@/lib/catalog/core';
import { DetailedProduct } from '@/components/DetailedProduct';
import { withSocialMetadata } from '@/lib/page-metadata';
import { shop } from '@/data/shop';
import '../../product-detail.css';

type Props = { params: Promise<{ slug: string }> };
export function generateStaticParams() {
  return publicPhoneGuides().map(product => ({ slug: product.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = publicPhoneGuides().find(item => item.slug === slug);
  if (!product) return { title: 'Phone नहीं मिला', robots: { index: false, follow: false } };
  const name = productDisplayName(product);
  const metadata = withSocialMetadata({
    title: name + ' · Specifications और variants',
    description: name + ' की India specifications, display, camera, battery, RAM और storage options देखिए। Mobile World, Faridabad।',
    alternates: { canonical: '/phones/' + product.slug },
  });
  return { ...metadata, openGraph: { ...metadata.openGraph, images: [{ url: product.image, alt: product.imageAlt }] }, twitter: { ...metadata.twitter, images: [product.image] } };
}

export default async function PhonePage({ params }: Props) {
  const { slug } = await params;
  const products = publicPhoneGuides();
  const product = products.find(item => item.slug === slug);
  if (!product) notFound();
  const name = productDisplayName(product);
  const productPath = '/phones/' + product.slug;
  const schema = { '@context': 'https://schema.org', '@type': 'Product', name,
    description: product.description || undefined, image: new URL(product.image, shop.siteUrl).href,
    brand: { '@type': 'Brand', name: product.brand }, url: shop.siteUrl + productPath };
  const related = products.filter(item => item.brand === product.brand && item.id !== product.id).slice(0, 3);
  return <div className="wrap mp-page">
    <nav aria-label="Breadcrumb" className="mp-breadcrumb"><Link href="/">Home</Link><span>/</span><Link href="/products">Products</Link><span>/</span><span>{name}</span></nav>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, '\\u003c') }} />
    <DetailedProduct product={product} productPath={productPath} />
    {related.length > 0 && <section className="mp-published" aria-labelledby="related-phones"><h2 id="related-phones">इसी brand के और models</h2><div className="mp-published-list">{related.map(item => <Link href={'/phones/' + item.slug} key={item.id}><strong>{productDisplayName(item)}</strong><span>Specifications देखिए →</span></Link>)}</div></section>}
    <Link className="mw-text-link" href="/products">← सभी products देखिए</Link>
  </div>;
}
