'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { lineKey, type Choice, type Listing } from '@/lib/commerce/core';
import { coloursFor, defaultChoice } from '@/lib/commerce/discovery';
import { comparisonHref } from '@/lib/commerce/comparison';

export function ComparePicker({ items, initial, different }: {items:Listing[]; initial:Choice[]; different:boolean}) {
  const router = useRouter();
  const [slots,setSlots] = useState<(Choice | null)[]>(() => Array.from({length:3},(_,i) => initial[i] ?? null));
  const selected = slots.filter((s): s is Choice => s !== null);
  function set(index:number, choice:Choice | null) { setSlots(current => current.map((old,i) => i === index ? choice : old)); }
  return <form className="cm-picker" onSubmit={event => {event.preventDefault(); router.push(comparisonHref(selected,different),{scroll:false});}}>
    <div className="cm-slots">{slots.map((choice,index) => {
      const item = items.find(v => v.id === choice?.productId);
      const variant = item?.variants.find(v => v.key === choice?.variant);
      const colours = item ? coloursFor(item,variant) : [];
      return <fieldset key={index}><legend>Phone {index+1}{index === 2 ? ' · वैकल्पिक' : ''}</legend>
        <label>Model<select value={item?.id ?? ''} onChange={e => { const next = items.find(v => v.id === e.target.value); set(index,next ? defaultChoice(next) : null); }}>
          <option value="">Model चुनिए</option>{items.map(v => <option key={v.id} value={v.id}>{v.name}</option>)}</select></label>
        {item && variant && <label>Memory<select value={variant.key} onChange={e => {
          const next = item.variants.find(v => v.key === e.target.value);
          if (next && choice) set(index,{...choice,variant:next.key,colour:next.colour || (coloursFor(item,next).includes(choice.colour) ? choice.colour : '')});
        }}>{item.variants.map(v => <option key={v.key} value={v.key}>{[v.ram && v.ram+' RAM',v.storage && v.storage+' storage',v.colour].filter(Boolean).join(' · ')}</option>)}</select></label>}
        {choice && colours.length > 0 && <label>Colour preference<select value={choice.colour} onChange={e => set(index,{...choice,colour:e.target.value})}>
          {!variant?.colour && <option value="">बाद में चुनें</option>}{colours.map(c => <option key={c}>{c}</option>)}</select></label>}
      </fieldset>;
    })}</div>
    <button className="ec-button" disabled={new Set(selected.map(lineKey)).size < 2}>इनकी तुलना देखिए →</button>
  </form>;
}
