'use client';
import { MotionHeading } from "@/components/MotionHeading";
import Image from 'next/image';
import { useEffect, useMemo, useRef, useState } from 'react';
import { shop } from '@/data/shop';
import { visibleSections, productDisplayName, selectProductVariant, type PublicProduct } from '@/lib/catalog/core';
import { sectionNames, selectedPreference, type ReferencePrice } from '@/lib/catalog/preferences';
import { IconWhatsApp } from './Icons';

import { colourPhotos } from '@/data/phone-colour-images';
import { choiceFromHash, choicePicture, defaultChoice, modelHref } from '@/lib/commerce/discovery';
import { exactPrice, lineKey, rupees } from '@/lib/commerce/core';
import { modelListing } from '@/lib/commerce/model';
import { comparisonHref } from '@/lib/commerce/comparison';
import { ShareChoice } from './commerce/ShareChoice';
import { AddSelection } from './commerce/ShoppingControls';

const noPrices: ReferencePrice[] = [];
const mainFeatures = ['spec_016','spec_022','spec_032','spec_046','spec_049'];
const featureLabels: Record<string,string> = {spec_016:'Display का आकार',spec_022:'Processor',spec_032:'मुख्य camera',spec_046:'Battery capacity',spec_049:'Wired charging'};

function Options({ label, values, active, onChoose }: {label:string; values:string[]; active:string; onChoose:(value:string) => void}) {
  return <fieldset className="mp-option-group"><legend>{label}</legend><div>{values.map(value =>
    <label key={value} className="mp-option"><input type="radio" name={'phone-' + label} checked={value === active} onChange={() => onChoose(value)}/>
      <span>{value || 'बाद में चुनें'}</span></label>)}</div></fieldset>;
}

export function DetailedProduct({ product, productPath = '/catalog/' + product.slug, referencePrices = noPrices }: {
  product: PublicProduct; productPath?: string; referencePrices?: ReferencePrice[];
}) {
  const item = useMemo(() => modelListing(product,productPath,referencePrices),[product,productPath,referencePrices]);
  const [choice,setChoice] = useState(() => defaultChoice(item));
  const [galleryImage,setGalleryImage] = useState('');
  const [specSearch,setSpecSearch] = useState('');
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const openSelection = () => {
      const linked = choiceFromHash(item,window.location.hash);
      if (linked) { setChoice(linked); setGalleryImage(''); }
    };
    const frame = requestAnimationFrame(openSelection);
    window.addEventListener('hashchange',openSelection);
    return () => { cancelAnimationFrame(frame); window.removeEventListener('hashchange',openSelection); };
  }, [item]);
  const variant = product.variants.find(v => v._key === choice.variant);
  const variantColours = product.variants.filter(v => v.ram === variant?.ram && v.storage === variant?.storage).map(v => v.colour).filter(Boolean);
  const colours = variantColours.length ? [...new Set(variantColours)] : item.colours;
  const photo = choicePicture(item,choice);
  const photos = [{src:item.image,alt:item.imageAlt}, ...colourPhotos(item.id),
    ...item.variants.filter(v => v.image).map(v => ({src:v.image!,alt:[item.name,v.colour].filter(Boolean).join(' · ')}))];
  const gallery = [...new Map(photos.map(p => [p.src,p])).values()];
  const shown = gallery.find(p => p.src === galleryImage) ?? photo;
  const sections = visibleSections(product,variant);
  const fields = sections.flatMap(s => s.fields);
  const highlights = mainFeatures.flatMap(key => fields.filter(f => f.key === key));
  const term = specSearch.trim().toLowerCase();
  const displayed = !term ? sections : sections.map(s => ({...s,fields:s.fields.filter(f =>
    [sectionNames[s.id],f.label,featureLabels[f.key],f.value].join(' ').toLowerCase().includes(term)
  )})).filter(s => s.fields.length);
  const price = exactPrice(item,choice);
  const preference = selectedPreference(variant,choice.colour);
  const name = productDisplayName(product);
  const href = modelHref(item,choice);
  const enquiry = shop.phone.whatsapp + '?text=' + encodeURIComponent('नमस्ते Mobile World! मुझे ' + name + (preference ? ' (' + preference + ')' : '') + ' के बारे में जानकारी चाहिए। ' + shop.siteUrl + href);
  function select(field: 'ram' | 'storage' | 'colour', value: string) {
    let nextChoice;
    if (field === 'colour' && !variantColours.length) {
      nextChoice = {...choice,colour:value};
    } else {
      const next = selectProductVariant(product.variants,variant,field,value);
      if (!next) return;
      nextChoice = {productId:item.id,variant:next._key,colour:next.colour || choice.colour};
    }
    setChoice(nextChoice);
    const target = new URL(modelHref(item,nextChoice),window.location.origin);
    const url = new URL(window.location.href);
    url.hash = target.hash;
    window.history.replaceState(window.history.state,'',url);
    setGalleryImage('');
  }
  return <>
    <section className="mp-hero">
      <header className="mp-heading">
        <p className="shopping-overline">{product.brand}{product.series ? ' · ' + product.series : ''}</p>
        <MotionHeading as="h1">{name}</MotionHeading>
        <nav className="mp-shortcuts" aria-label="इस model को समझिए"><a className="mw-text-link" href="#product-specifications">पूरी specifications</a>
          <a className="mw-text-link" href={comparisonHref([choice])}>दूसरे phone से तुलना करें</a></nav>
      </header>
      <div className="mp-gallery">
        <button type="button" className="mp-main-image" onClick={() => dialog.current?.showModal()} aria-label={name + ' की image बड़ी देखिए'}>
          <Image src={shown.src} alt={shown.alt} width={900} height={1000} sizes="(max-width:760px) 90vw, 48vw" priority />
          <span>Image बड़ी देखिए</span>
        </button>
        {gallery.length > 1 && <div className="mp-thumbnails" role="group" aria-label="Product photos">{gallery.map(p => <button type="button" key={p.src} aria-label={p.alt + ' की photo देखिए'} aria-pressed={shown.src === p.src} onClick={() => setGalleryImage(p.src)}><Image src={p.src} alt="" width={80} height={90}/></button>)}</div>}
        {galleryImage && shown.src !== photo.src ? <p className="mw-small">Photo में {shown.alt}। आपकी चुनी हुई पसंद नीचे है।</p> : choice.colour && photo.src === item.image && !variant?.image && <p className="mw-small">यह model की reference photo है। चुना हुआ colour नीचे दिया है।</p>}
      </div>
      <div className="mp-intro">
        <div className="mp-variants mp-picker">
          {variant && (['ram','storage'] as const).map(field => {
            const values = [...new Set(product.variants.filter(v => field === 'ram' || v.ram === variant.ram).map(v => v[field]).filter(Boolean))];
            return values.length > 0 && <Options key={field} label={field === 'ram' ? 'RAM' : 'Storage'} values={values} active={variant[field]} onChoose={v => select(field,v)}/>;
          })}
          {colours.length > 0 && <Options label="Colour preference" values={variantColours.length ? colours : [...colours,'']} active={choice.colour} onChoose={v => select('colour',v)}/>}
        </div>
        <section className="mp-prices mp-buy-panel" aria-label="Official India price reference">
          <h2>Official India price reference</h2>
          {price ? <><strong className="mp-price-amount">{rupees(price.amount)}</strong>
            <p>{preference} · <time dateTime={price.checkedAt}>{new Intl.DateTimeFormat('hi-IN',{day:'numeric',month:'long',year:'numeric',timeZone:'Asia/Kolkata'}).format(new Date(price.checkedAt+'T12:00:00+05:30'))}</time> को जाँचा गया।</p></> :
            <p>इस पसंद का official India price अभी उपलब्ध नहीं है।</p>}
          <p>Mobile World दुकान का दाम और stock आपकी request पर confirm करेगा।</p>
          <AddSelection key={lineKey(choice)} name={name} choice={choice}/>
          <ShareChoice key={href} href={href} name={name}/>
        </section>
        <div className="mp-enquiry"><MotionHeading as="h2">इस model के बारे में पूछिए</MotionHeading><p>अपनी पसंद दुकान को भेजिए। Colour और stock की पुष्टि हमारी team से होगी।</p><div className="btns"><a className="btn btn-w" href={enquiry} target="_blank" rel="noopener noreferrer"><IconWhatsApp /> WhatsApp पर पूछिए</a><a className="btn btn-o" href={shop.phone.tel}>दुकान पर call कीजिए</a></div></div>
      </div>
    </section>
    {highlights.length > 0 && <section className="mp-highlights" aria-labelledby="model-highlights"><MotionHeading as="h2" id="model-highlights">एक नज़र में</MotionHeading>
      <dl>{highlights.map(f => <div key={f.key}><dt>{featureLabels[f.key]}</dt><dd><a href={'#phone-' + f.key} onClick={() => setSpecSearch('')}>{f.value}</a></dd></div>)}</dl></section>}
    {sections.length > 0 && <section className="mp-specifications" aria-labelledby="product-specifications">
      <div className="shopping-section-heading"><div><p className="shopping-overline">DETAILS · एक-एक ख़ूबी जानिए</p><MotionHeading as="h2" id="product-specifications">पूरी specifications</MotionHeading><p>{fields.length} specifications · हर ख़ूबी अलग देखिए।</p></div></div>
      <div className="mp-spec-search"><label>Specification ढूँढ़िए<input type="search" value={specSearch} placeholder="जैसे battery, charging या camera" onChange={e => setSpecSearch(e.target.value)}/></label>
        {term && <span role="status">{displayed.reduce((sum,s) => sum+s.fields.length,0)} नतीजे <button type="button" className="ec-text" onClick={() => setSpecSearch('')}>सभी दिखाएँ</button></span>}</div>
      <nav className="mp-section-links" aria-label="Specifications के sections">{displayed.map(section => <a key={section.id} href={'#phone-section-' + section.id}>{sectionNames[section.id]}</a>)}</nav>
      {displayed.map(section => <section className="mp-spec-section" key={section.id} aria-labelledby={'phone-section-' + section.id}>
        <h3 id={'phone-section-' + section.id}>{sectionNames[section.id]}</h3>
        <dl>{section.fields.map(field => <div key={field.key} id={'phone-' + field.key} data-spec={field.key}><dt>{field.label}</dt><dd>{field.key === 'spec_006' && field.value.includes(' · ') ? <ul className="mp-value-list">{field.value.split(' · ').map(value => <li key={value}>{value}</li>)}</ul> : field.value}</dd></div>)}</dl>
      </section>)}
    </section>}
    <dialog ref={dialog} className="mp-zoom" aria-label={name + ' product image'} onClick={event => { if (event.target === event.currentTarget) dialog.current?.close(); }}><button type="button" className="mp-close" onClick={() => dialog.current?.close()} autoFocus aria-label="Image बंद कीजिए">×</button><Image src={shown.src} alt={shown.alt} width={1400} height={1600} sizes="90vw" /></dialog>
  </>;
}
