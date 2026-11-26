import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { CatalogueGuide } from '@/components/CatalogueGuide';
import { catalogueGuidePath, catalogueGuideReference, modelDisplayName, phoneModels } from '@/data/catalog';
import { publicPhoneGuides } from '@/lib/catalog/guides';
import { publicProducts } from '@/lib/catalog/sanity';
import '../../../product-detail.css';

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const model = phoneModels.find(item => item.id === id);
  if (!model) return { title: 'Guide नहीं मिली', robots: { index: false, follow: false } };
  return { title: modelDisplayName(model) + ' · Catalogue guide', alternates: { canonical: catalogueGuidePath(id) }, robots: { index: false, follow: true } };
}

export default async function GuidePage({ params }: Props) {
  const { id } = await params;
  const model = phoneModels.find(item => item.id === id);
  if (!model) notFound();
  const published = (await publicProducts()).find(product => product.id === id);
  if (published) redirect('/catalog/' + published.slug);
  const guides = publicPhoneGuides();
  const exact = guides.find(product => product.id === id);
  if (exact) redirect('/phones/' + exact.slug);
  const { isSeries, source } = catalogueGuideReference(model);
  const seriesNames: Record<string, string> = { 'vivo-vivo-v-series-2026': 'V Series', 'oppo-oppo-f-series': 'F Series' };
  const related = guides.filter(product => product.brand.toLowerCase() === model.brand.toLowerCase() && product.series === seriesNames[id])
    .map(product => ({ name: product.name, href: '/phones/' + product.slug }));
  return <div className="wrap mp-page">
    <nav aria-label="Breadcrumb" className="mp-breadcrumb"><Link href="/">Home</Link><span>/</span><Link href="/products">Products</Link><span>/</span><span>{modelDisplayName(model)}</span></nav>
    <CatalogueGuide model={model} isSeries={isSeries} source={source} related={related} />
  </div>;
}
