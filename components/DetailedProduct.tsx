'use client';
import Image from 'next/image';
import { useRef, useState } from 'react';
import { shop } from '@/data/shop';
import { visibleSections, type PublicProduct } from '@/lib/catalog/core';
import { IconWhatsApp } from './Icons';

export function DetailedProduct({ product }: { product: PublicProduct }) {
  const [variantKey, setVariantKey] = useState(product.variants[0]?._key ?? '');
  const [galleryImage, setGalleryImage] = useState('');
  const dialog = useRef<HTMLDialogElement>(null);
  const variant = product.variants.find(item => item._key === variantKey);
  const selectedImage = galleryImage || variant?.image || product.image;
  const gallery = [...new Set([product.image, ...product.variants.filter(v => v.imageVerified).map(v => v.image)].filter(Boolean))];
  const sections = visibleSections(product, variant);
  const preference = variant ? [variant.ram && 'RAM: ' + variant.ram, variant.storage && 'Storage: ' + variant.storage, variant.colour && 'Colour: ' + variant.colour].filter(Boolean).join(' · ') : '';
  const enquiry = shop.phone.whatsapp + '?text=' + encodeURIComponent('नमस्ते Mobile World! मुझे ' + product.brand + ' ' + product.name + (preference ? ' (' + preference + ')' : '') + ' के दाम और उपलब्धता की जानकारी चाहिए। ' + shop.siteUrl + '/catalog/' + product.slug);
  function select(field: 'ram' | 'storage' | 'colour', value: string) {
    const match = product.variants.find(v => v[field] === value &&
      (field === 'ram' || v.ram === variant?.ram) &&
      (field !== 'colour' || v.storage === variant?.storage));
    if (match) { setVariantKey(match._key); setGalleryImage(''); }
  }
  return <>
    <section className="mp-hero">
      <div className="mp-gallery">
        <button type="button" className="mp-main-image" onClick={() => dialog.current?.showModal()} aria-label={product.name + ' की image बड़ी देखिए'}>
          <Image src={selectedImage} alt={product.imageAlt + (variant?.image === selectedImage && variant.colour ? ' · ' + variant.colour : '')} width={900} height={1000} sizes="(max-width:760px) 90vw, 48vw" priority />
          <span>Image बड़ी देखिए ↗</span>
        </button>
        {gallery.length > 1 && <div className="mp-thumbnails" role="group" aria-label="Product images">{gallery.map((src, index) => <button type="button" key={src} aria-label={'Image ' + (index + 1)} aria-pressed={selectedImage === src} onClick={() => setGalleryImage(src)}><Image src={src} alt="" width={80} height={90} /></button>)}</div>}
        {variant?.colour && !variant.image && <p className="mw-small">Model की reference image है। चुने हुए colour की अलग image अभी उपलब्ध नहीं है।</p>}
      </div>
      <div className="mp-intro"><p className="shopping-overline">{product.brand}{product.series ? ' · ' + product.series : ''}</p><h1>{product.name}</h1>{product.description && <p className="mp-description">{product.description}</p>}
        {variant && <fieldset className="mp-variants"><legend>अपना variant चुनिए</legend>{(['ram', 'storage', 'colour'] as const).map(field => {
          const candidates = product.variants.filter(v => (field === 'ram' || v.ram === variant.ram) && (field !== 'colour' || v.storage === variant.storage));
          const options = [...new Set(candidates.map(v => v[field]))];
          if (!options.some(Boolean)) return null;
          return <label key={field}>{field === 'ram' ? 'RAM' : field === 'storage' ? 'Storage' : 'Colour'}<select value={variant[field]} onChange={event => select(field, event.target.value)}>{options.map(value => <option value={value} key={value}>{value || 'दर्ज नहीं'}</option>)}</select></label>;
        })}<p className="mw-small" role="status">{preference}</p></fieldset>}
        <div className="mp-enquiry"><h2>दाम और उपलब्धता पूछिए</h2><p>अपना चुना हुआ variant सीधे दुकान को भेजिए।</p><div className="btns"><a className="btn btn-w" href={enquiry} target="_blank" rel="noopener noreferrer"><IconWhatsApp /> WhatsApp पर पूछिए</a><a className="btn btn-o" href={shop.phone.tel}>दुकान पर call कीजिए</a></div></div>
      </div>
    </section>
    {sections.length > 0 && <section className="mp-specifications" aria-labelledby="product-specifications"><div className="shopping-section-heading"><div><p className="shopping-overline">DETAILS · खूबियाँ जानिए</p><h2 id="product-specifications">Specifications</h2></div></div>{sections.map(section => <section className="mp-spec-section" key={section.id}><h3>{section.title}</h3><dl>{section.fields.map(field => <div key={field.key}><dt>{field.label}</dt><dd>{field.value}</dd></div>)}</dl></section>)}</section>}
    <dialog ref={dialog} className="mp-zoom" aria-label={product.name + ' product image'} onClick={event => { if (event.target === event.currentTarget) dialog.current?.close(); }}><button type="button" className="mp-close" onClick={() => dialog.current?.close()} autoFocus aria-label="Image बंद कीजिए">×</button><Image src={selectedImage} alt={product.imageAlt} width={1400} height={1600} sizes="90vw" /></dialog>
  </>;
}
