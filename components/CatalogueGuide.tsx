'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { modelDisplayName, modelEnquiry, type PhoneModel } from '@/data/catalog';
import { MotionHeading } from './MotionHeading';
import { IconArrow, IconWhatsApp } from './Icons';
import { FavouriteButton } from './commerce/ShoppingControls';

type Props = { model: PhoneModel; isSeries: boolean; source: string; related: { name: string; href: string }[] };

export function CatalogueGuide({ model, isSeries, source, related }: Props) {
  const [imageIndex, setImageIndex] = useState(0);
  const gallery = model.gallery?.length ? model.gallery : [{ src: model.image, alt: model.imageAlt }];
  const image = gallery[imageIndex] ?? gallery[0];
  const name = modelDisplayName(model);
  const brandPath = '/products?brand=' + model.brandSlug;

  return <section className="mp-hero mp-catalogue-guide">
    <header className="mp-heading">
      <p className="shopping-overline">{model.brand} · {isSeries ? 'Series guide' : 'Model guide'}</p>
      <MotionHeading as="h1">{name}</MotionHeading>
    </header>
    <figure className="mp-gallery mp-guide-media">
      <Image src={image.src} alt={image.alt} width={850} height={850} sizes="(max-width:760px) 92vw, 46vw" priority />
      {gallery.length > 1 && <div className="mp-thumbnails" role="group" aria-label="Catalogue images">{gallery.map((item, index) => <button type="button" key={item.src} aria-label={'Image ' + (index + 1)} aria-pressed={imageIndex === index} onClick={() => setImageIndex(index)}><Image src={item.src} alt="" width={75} height={80} /></button>)}</div>}
      <figcaption>{model.imageCaption || (isSeries ? 'इस range की catalogue image।' : 'Catalogue में इस model की तस्वीर।')}</figcaption>
    </figure>
    <div className="mp-intro">
      {related.length > 0 && <section className="mp-published">
        <MotionHeading as="h2">अपना model चुनिए</MotionHeading>
        <div className="mp-published-list">{related.map(item => <a key={item.href} href={item.href}><strong>{item.name}</strong><span>पूरी specifications <IconArrow /></span></a>)}</div>
      </section>}
      <p>{isSeries ? 'इस range में specifications, RAM, storage और colours चुने हुए model पर निर्भर हैं।' : 'इस model की India specifications की जाँच जारी है। RAM, storage और colours की जानकारी दुकान से लीजिए।'}</p>
      {source && <a className="mw-text-link" href={source} rel="noopener noreferrer" target="_blank">{model.brand} की product जानकारी देखिए ↗</a>}
      <div className="mp-enquiry"><MotionHeading as="h2">{isSeries ? 'इस series के models पूछिए' : 'इस model के बारे में पूछिए'}</MotionHeading>
        <div className="btns"><a className="btn btn-w" href={modelEnquiry([model])} target="_blank" rel="noopener noreferrer"><IconWhatsApp /> WhatsApp पर पूछिए</a>
          <FavouriteButton productId={model.id} name={name}/></div>
      </div>
      <Link className="mw-text-link" href={brandPath}>{model.brand} का catalogue देखिए <IconArrow /></Link>
    </div>
  </section>;
}
