import Image from 'next/image';
import Link from 'next/link';
import { productDisplayName, type PublicProduct } from '@/lib/catalog/core';
import { MotionHeading } from './MotionHeading';

type Entry = {product: PublicProduct; href: string};
export function RelatedPhones({ current, options }: {current:PublicProduct; options:Entry[]}) {
  const family = current.id.split('-')[0];
  const rank = (p: PublicProduct) => p.series && p.series === current.series ? 0 : p.brand === current.brand ? 1 : 2;
  const related = options.filter(({product:p}) => p.id !== current.id && (p.brand === current.brand || p.id.split('-')[0] === family))
    .sort((a,b) => rank(a.product) - rank(b.product)).slice(0,4);
  if (!related.length) return null;
  return <section className="mp-related" aria-labelledby="related-phones">
    <div className="shopping-section-heading"><MotionHeading as="h2" id="related-phones">इसी brand के और phones</MotionHeading><Link className="mw-text-link" href="/products">सभी models →</Link></div>
    <div className="mp-related-grid">{related.map(({product:p,href}) => <a href={href} key={p.id}>
      <div className="mp-related-photo"><Image src={p.image} alt={p.imageAlt} width={260} height={230} sizes="(max-width:700px) 44vw, 230px"/></div>
      <strong>{productDisplayName(p)}</strong>
      {p.values.spec_046 && <span>Battery · {p.values.spec_046}</span>}
      <small>Specifications देखिए →</small>
    </a>)}</div>
  </section>;
}
