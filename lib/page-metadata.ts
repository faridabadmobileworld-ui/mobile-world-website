import type { Metadata } from 'next';
import { shop } from '@/data/shop';
export function withSocialMetadata(metadata: Metadata): Metadata {
  const title = typeof metadata.title === 'string' ? metadata.title : shop.name;
  const description = metadata.description ?? '';
  const canonical = metadata.alternates?.canonical;
  const url = typeof canonical === 'string' || canonical instanceof URL ? canonical : canonical?.url ?? '/';
  return { ...metadata, openGraph: { type: 'website', siteName: shop.name, locale: 'hi_IN', title, description, url, images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: shop.name }] }, twitter: { card: 'summary_large_image', title, description, images: ['/og-image.jpg'] } };
}
