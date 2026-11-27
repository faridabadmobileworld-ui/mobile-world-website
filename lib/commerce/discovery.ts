import { colourPhotos } from '@/data/phone-colour-images';
import { validChoice, type Choice, type Listing } from './core';

type Memory = Listing['variants'][number];

export function coloursFor(item: Listing, variant?: Memory) {
  return variant?.colour ? [variant.colour] : item.colours;
}

export function modelHref(item: Listing, choice: Choice) {
  if (item.kind !== 'model' || !validChoice(item,choice) || (!choice.variant && !choice.colour)) return item.href;
  return item.href + '#' + new URLSearchParams({ variant: choice.variant, colour: choice.colour });
}

export function choiceFromHash(item: Listing, hash: string) {
  const params = new URLSearchParams(hash.replace(/^#/,''));
  if (!params.has('variant')) return null;
  const choice = {productId:item.id, variant:params.get('variant') ?? '', colour:params.get('colour') ?? ''};
  return validChoice(item,choice) ? choice : null;
}

export function choicePicture(item: Listing, choice?: Choice) {
  const variant = item.variants.find(v => v.key === choice?.variant);
  if (variant?.image && variant.colour === choice?.colour) return { src:variant.image, alt:[item.name,variant.colour].filter(Boolean).join(' · ') };
  const photo = colourPhotos(item.id).find(p => p.colour === choice?.colour);
  return photo ?? { src:item.image, alt:item.imageAlt };
}

export function defaultChoice(item: Listing): Choice {
  for (const price of item.prices) {
    const variant = item.variants.find(v => v.ram === price.ram && v.storage === price.storage && (!v.colour || v.colour === price.colour));
    const choice = { productId:item.id, variant:variant?.key ?? '', colour:price.colour };
    if (validChoice(item,choice)) return choice;
  }
  const variant = item.variants[0];
  return { productId:item.id, variant:variant?.key ?? '', colour:variant?.colour ?? '' };
}

function words(value: string) {
  return value.toLowerCase().normalize('NFKC').replace(/(\d)\s*(gb|tb)\b/g,'$1$2')
    .replace(/[^\p{L}\p{M}\p{N}]+/gu,' ').trim().split(/\s+/).filter(Boolean);
}

// A result may combine a published memory configuration with a customer's
// colour preference. Never combine RAM from one memory option with storage from another.
export function findChoice(item: Listing, query: string): Choice | null {
  const tokens = words(query);
  const base = words(item.group + ' ' + item.name + ' phone mobile smartphone मोबाइल फ़ोन फोन');
  const remaining = tokens.filter(token => !base.includes(token));
  const initial = defaultChoice(item);
  if (!remaining.length) return initial;
  const variants = item.variants.length ? item.variants : [undefined];
  const ordered = [...variants].sort((a,b) => Number(b?.key === initial.variant) - Number(a?.key === initial.variant));
  for (const variant of ordered) {
    const memory = words([variant?.ram && variant.ram + ' RAM', variant?.storage && variant.storage + ' storage ROM'].filter(Boolean).join(' '));
    const colourTerms = remaining.filter(token => !memory.includes(token));
    const colours = coloursFor(item,variant);
    const colour = colourTerms.length ? colours.find(c => colourTerms.every(token => words(c).includes(token))) :
      variant?.colour || (variant?.key === initial.variant ? initial.colour : '');
    if (colourTerms.length && !colour) continue;
    return { productId:item.id, variant:variant?.key ?? '', colour:colour ?? '' };
  }
  return null;
}
