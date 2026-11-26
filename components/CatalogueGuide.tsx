'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { modelDisplayName, modelEnquiry, shortlistStorageKey, validModelIds, type PhoneModel } from '@/data/catalog';
import { MotionHeading } from './MotionHeading';
import { IconArrow, IconWhatsApp } from './Icons';
import { trackAction } from './WebsiteAnalytics';

type Props = { model: PhoneModel; isSeries: boolean; source: string; related: { name: string; href: string }[] };

export function CatalogueGuide({ model, isSeries, source, related }: Props) {
  const [imageIndex, setImageIndex] = useState(0);
  const [saved, setSaved] = useState(false);
  const [notice, setNotice] = useState('');
  const gallery = model.gallery?.length ? model.gallery : [{ src: model.image, alt: model.imageAlt }];
  const image = gallery[imageIndex] ?? gallery[0];
  const name = modelDisplayName(model);
  const brandPath = '/products?brand=' + model.brandSlug;

  useEffect(() => {
    function sync() {
      try { setSaved(validModelIds(localStorage.getItem(shortlistStorageKey)).includes(model.id)); }
      catch { /* The catalogue also works with browser storage disabled. */ }
    }
    const frame = requestAnimationFrame(sync);
    window.addEventListener('storage', sync);
    return () => { cancelAnimationFrame(frame); window.removeEventListener('storage', sync); };
  }, [model.id]);

  function toggleSaved() {
    try {
      const ids = new Set(validModelIds(localStorage.getItem(shortlistStorageKey)));
      const add = !ids.has(model.id);
      if (add) ids.add(model.id); else ids.delete(model.id);
      localStorage.setItem(shortlistStorageKey, [...ids].join(','));
      setSaved(add);
      trackAction('shortlist', (add ? 'add: ' : 'remove: ') + model.id);
    } catch { setNotice('इस browser में shortlist save नहीं हो सकी।'); }
  }

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
          <button className="btn btn-o" type="button" onClick={toggleSaved} aria-pressed={saved}>{saved ? '✓ Shortlist में है' : 'Shortlist में रखिए'}</button></div>
        {notice && <p role="status">{notice}</p>}
      </div>
      <Link className="mw-text-link" href={brandPath}>{model.brand} का catalogue देखिए <IconArrow /></Link>
    </div>
  </section>;
}
