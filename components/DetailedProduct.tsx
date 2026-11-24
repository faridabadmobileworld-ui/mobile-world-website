'use client';
import { MotionHeading } from "@/components/MotionHeading";
import Image from 'next/image';
import { useRef, useState } from 'react';
import { shop } from '@/data/shop';
import { visibleSections, productDisplayName, selectProductVariant, type PublicProduct } from '@/lib/catalog/core';
import { productColours, selectedPreference, type ReferencePrice } from '@/lib/catalog/preferences';
import { IconWhatsApp } from './Icons';

const sectionNames: Record<number, string> = {
  1: 'Model की जानकारी', 2: 'Design और बनावट', 3: 'Display', 4: 'Processor और memory',
  5: 'Camera और video', 6: 'Battery और charging', 7: 'Software', 8: 'Network और connectivity',
  9: 'Security और audio', 10: 'Warranty', 11: 'Box में क्या मिलता है',
};

export function DetailedProduct({ product, productPath = '/catalog/' + product.slug, referencePrices = [] }: {
  product: PublicProduct; productPath?: string; referencePrices?: ReferencePrice[];
}) {
  const [variantKey, setVariantKey] = useState(product.variants[0]?._key ?? '');
  const [preferredColour, setPreferredColour] = useState('');
  const [galleryImage, setGalleryImage] = useState('');
  const dialog = useRef<HTMLDialogElement>(null);
  const variant = product.variants.find(item => item._key === variantKey);
  const selectedImage = galleryImage || variant?.image || product.image;
  const gallery = [...new Set([product.image, ...product.variants.filter(v => v.imageVerified).map(v => v.image)].filter(Boolean))];
  const sections = visibleSections(product, variant);
  const modelColours = productColours(product);
  const variantColours = product.variants.filter(v => v.ram === variant?.ram && v.storage === variant?.storage).map(v => v.colour).filter(Boolean);
  const colours = variantColours.length ? [...new Set(variantColours)] : modelColours;
  const selectedColour = variant?.colour || preferredColour;
  const preference = selectedPreference(variant, selectedColour);
  const name = productDisplayName(product);
  const enquiry = shop.phone.whatsapp + '?text=' + encodeURIComponent('नमस्ते Mobile World! मुझे ' + name + (preference ? ' (' + preference + ')' : '') + ' के बारे में जानकारी चाहिए। ' + shop.siteUrl + productPath);
  function select(field: 'ram' | 'storage' | 'colour', value: string) {
    const match = selectProductVariant(product.variants, variant, field, value);
    if (match) { setVariantKey(match._key); setGalleryImage(''); }
  }
  return <>
    <section className="mp-hero">
      <header className="mp-heading">
        <p className="shopping-overline">{product.brand}{product.series ? ' · ' + product.series : ''}</p>
        <MotionHeading as="h1">{name}</MotionHeading>
        {product.description && <p className="mp-description">{product.description}</p>}
        <a className="mw-text-link" href="#product-specifications">पूरी specifications तक जाइए</a>
      </header>
      <div className="mp-gallery">
        <button type="button" className="mp-main-image" onClick={() => dialog.current?.showModal()} aria-label={name + ' की image बड़ी देखिए'}>
          <Image src={selectedImage} alt={product.imageAlt + (variant?.image === selectedImage && variant.colour ? ' · ' + variant.colour : '')} width={900} height={1000} sizes="(max-width:760px) 90vw, 48vw" priority />
          <span>Image बड़ी देखिए</span>
        </button>
        {gallery.length > 1 && <div className="mp-thumbnails" role="group" aria-label="Product images">{gallery.map((src, index) => <button type="button" key={src} aria-label={'Image ' + (index + 1)} aria-pressed={selectedImage === src} onClick={() => setGalleryImage(src)}><Image src={src} alt="" width={80} height={90} /></button>)}</div>}
        {selectedColour && !variant?.image && <p className="mw-small">यह model की reference image है। Colour preference बदलने से image नहीं बदलती।</p>}
      </div>
      <div className="mp-intro">
        <fieldset className="mp-variants"><legend>अपनी पसंद चुनिए</legend>
          {variant && (['ram', 'storage'] as const).map(field => {
            const options = [...new Set(product.variants.filter(v => field === 'ram' || v.ram === variant.ram).map(v => v[field]).filter(Boolean))];
            if (!options.length) return null;
            return <label key={field}>{field === 'ram' ? 'RAM' : 'Storage'}<select value={variant[field]} onChange={event => select(field, event.target.value)}>{options.map(value => <option value={value} key={value}>{value}</option>)}</select></label>;
          })}
          {colours.length > 0 && <label>Colour preference<select value={selectedColour} onChange={event => variantColours.length ? select('colour', event.target.value) : setPreferredColour(event.target.value)}>
            {!variantColours.length && <option value="">Colour चुनिए</option>}{colours.map(colour => <option key={colour} value={colour}>{colour}</option>)}
          </select></label>}
          <p className="mw-small" role="status">{preference}</p>
        </fieldset>
        {modelColours.length > 0 && <section className="mp-colours" aria-label="Official model colours"><MotionHeading as="h2">इस model के colours</MotionHeading><ul>{modelColours.map(colour => <li key={colour}>{colour}</li>)}</ul><p className="mw-small">चुने हुए RAM, storage और colour की उपलब्धता दुकान से confirm होगी।</p></section>}
        {referencePrices.length > 0 && <section className="mp-prices" aria-label="Official India price reference"><MotionHeading as="h2">Official India price reference</MotionHeading><p>नीचे दिए variant की Xiaomi India online listing। Mobile World का selling price अलग हो सकता है।</p>
          {referencePrices.map(price => <dl key={[price.ram, price.storage, price.colour].join('-')}>
            <div><dt>Listed price</dt><dd className="mp-price-amount">{new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(price.amount)}</dd></div>
            <div><dt>RAM</dt><dd>{price.ram}</dd></div><div><dt>Storage</dt><dd>{price.storage}</dd></div>
            {price.colour && <div><dt>Colour</dt><dd>{price.colour}</dd></div>}
            <div><dt>Price checked</dt><dd>{new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Asia/Kolkata' }).format(new Date(price.checkedAt + 'T12:00:00+05:30'))}</dd></div>
          </dl>)}
        </section>}
        <div className="mp-enquiry"><MotionHeading as="h2">इस model के बारे में पूछिए</MotionHeading><p>अपनी पसंद दुकान को भेजिए। Colour और stock की पुष्टि हमारी team से होगी।</p><div className="btns"><a className="btn btn-w" href={enquiry} target="_blank" rel="noopener noreferrer"><IconWhatsApp /> WhatsApp पर पूछिए</a><a className="btn btn-o" href={shop.phone.tel}>दुकान पर call कीजिए</a></div></div>
      </div>
    </section>
    {sections.length > 0 && <section className="mp-specifications" aria-labelledby="product-specifications">
      <div className="shopping-section-heading"><div><p className="shopping-overline">DETAILS · एक-एक ख़ूबी जानिए</p><MotionHeading as="h2" id="product-specifications">पूरी specifications</MotionHeading><p>नीचे scroll कीजिए या सीधे अपना section चुनिए।</p></div></div>
      <nav className="mp-section-links" aria-label="Specifications के sections">{sections.map(section => <a key={section.id} href={'#phone-section-' + section.id}>{sectionNames[section.id]}</a>)}</nav>
      {sections.map(section => <section className="mp-spec-section" key={section.id} aria-labelledby={'phone-section-' + section.id}>
        <h3 id={'phone-section-' + section.id}>{sectionNames[section.id]}</h3>
        <dl>{section.fields.map(field => <div key={field.key} data-spec={field.key}><dt>{field.label}</dt><dd>{field.key === 'spec_006' && field.value.includes(' · ') ? <ul className="mp-value-list">{field.value.split(' · ').map(value => <li key={value}>{value}</li>)}</ul> : field.value}</dd></div>)}</dl>
      </section>)}
    </section>}
    <dialog ref={dialog} className="mp-zoom" aria-label={name + ' product image'} onClick={event => { if (event.target === event.currentTarget) dialog.current?.close(); }}><button type="button" className="mp-close" onClick={() => dialog.current?.close()} autoFocus aria-label="Image बंद कीजिए">×</button><Image src={selectedImage} alt={product.imageAlt} width={1400} height={1600} sizes="90vw" /></dialog>
  </>;
}
