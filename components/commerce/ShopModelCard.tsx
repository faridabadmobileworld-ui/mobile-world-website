'use client';

import Image from 'next/image';
import { useState } from 'react';
import { AddSelection } from './ShoppingControls';
import { exactPrice, lineKey, rupees, type Choice, type Listing } from '@/lib/commerce/core';
import { choicePicture, coloursFor, modelHref } from '@/lib/commerce/discovery';
import { IconArrow } from '../Icons';

type Props = { item: Listing; initial: Choice; saved: boolean; compared?: boolean; onSave: () => void; onCompare?: () => void; onOpen: () => void };

export function ShopModelCard({ item, initial, saved, compared, onSave, onCompare, onOpen }: Props) {
  const [choice,setChoice] = useState(initial);
  const variant = item.variants.find(v => v.key === choice.variant);
  const colours = coloursFor(item,variant);
  const photo = choicePicture(item,choice);
  const price = exactPrice(item,choice);
  const href = modelHref(item,choice);
  function selectMemory(key: string) {
    const next = item.variants.find(v => v.key === key);
    if (!next) return;
    const colour = next.colour || (coloursFor(item,next).includes(choice.colour) ? choice.colour : '');
    setChoice({productId:item.id, variant:key, colour});
  }
  return <article className="mw-model-card ec-model-card">
    <div className="mw-model-media">
      <button type="button" className="mw-save" onClick={onSave} aria-label={item.name + (saved ? ' को Favourites से हटाएँ' : ' को Favourites में रखें')} aria-pressed={saved}>{saved ? '♥' : '♡'}</button>
      <a className="mw-image-button" href={href} onClick={onOpen} aria-label={item.name + ' की पूरी specifications'}>
        <Image src={photo.src} alt={photo.alt} width={480} height={380} sizes="(max-width:670px) 90vw, (max-width:1000px) 45vw, 320px"/>
      </a>
    </div>
    <div className="mw-model-body">
      <p className="ec-card-brand">{item.group}</p>
      <h3><a href={href} onClick={onOpen}>{item.name}</a></h3>
      <div className="ec-card-options">
        {variant && <label>Memory<select value={variant.key} aria-label={item.name + ' का memory option'} onChange={e => selectMemory(e.target.value)}>
          {item.variants.map(v => <option key={v.key} value={v.key}>{[v.ram && v.ram + ' RAM',v.storage && v.storage + ' storage',v.colour].filter(Boolean).join(' · ')}</option>)}
        </select></label>}
        {colours.length > 0 && <label>Colour preference<select value={choice.colour} aria-label={item.name + ' का colour'} onChange={e => setChoice({...choice, colour:e.target.value})}>
          {!variant?.colour && <option value="">Colour चुनिए</option>}
          {colours.map(colour => <option key={colour}>{colour}</option>)}
        </select></label>}
      </div>
      <div className="ec-card-price" aria-live="polite">{price ? <><strong>{rupees(price.amount)}</strong><small>Official India reference · <time dateTime={price.checkedAt}>{new Intl.DateTimeFormat('hi-IN',{day:'numeric',month:'short',year:'numeric',timeZone:'Asia/Kolkata'}).format(new Date(price.checkedAt+'T12:00:00+05:30'))}</time></small></> : <span>इस पसंद का दाम दुकान से पूछिए</span>}</div>
      <AddSelection key={lineKey(choice)} choice={choice} name={item.name} quick/>
      <div className="mw-model-actions"><a className="mw-text-link" href={href} onClick={onOpen}>Specifications <IconArrow/></a>
        {onCompare && <label className="mw-compare-check"><input type="checkbox" checked={compared} onChange={onCompare}/>Compare</label>}</div>
    </div>
  </article>;
}
