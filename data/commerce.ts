import 'server-only';
import { phoneModels } from './catalog';
import type { ShopProduct } from '@/lib/commerce/types';

// Presentation-only amounts, deliberately separate from verified manufacturer data.
// These are NOT Mobile World's selling prices, stock, offers or price quotations.
const samples: [string, number[], string][] = [
  ['samsung-galaxy-a57-5g', [42999, 46999], 'Everyday favourite'],
  ['apple-iphone-18-pro', [134900, 154900, 174900, 194900], 'Premium edit'],
  ['nothing-nothing-phone-3a', [24999, 27999], 'Distinct by design'],
  ['google-pixel-10-pro', [109999], 'Camera focus'],
  ['xiaomi-xiaomi-17t', [49999, 54999], 'Explore Xiaomi'],
  ['samsung-galaxy-a37-5g', [34999, 31999, 38999], 'Galaxy edit'],
  ['apple-iphone-18-pro-max', [149900, 169900, 189900, 209900], 'Premium edit'],
  ['nothing-nothing-phone-3', [79999, 89999], 'Distinct by design'],
  ['samsung-galaxy-a27-5g', [24999, 29999, 26999], 'Everyday edit'],
  ['samsung-galaxy-a17-5g', [18999, 22999, 20999], 'Everyday edit'],
  ['samsung-galaxy-a08-lte', [8999], 'Budget edit'],
  ['samsung-galaxy-a07-5g', [13999], 'Budget edit'],
  ['xiaomi-xiaomi-17-ultra', [129999], 'Premium edit'],
  ['xiaomi-xiaomi-17-17t', [89999], 'Explore Xiaomi'],
  ['xiaomi-redmi-note-17-pro-max', [37999, 41999], 'REDMI edit'],
  ['xiaomi-redmi-note-17-pro', [29999, 32999], 'REDMI edit'],
  ['xiaomi-redmi-note-17', [19999, 21999], 'Everyday edit'],
  ['xiaomi-redmi-17', [14999, 16999], 'Budget edit'],
  ['xiaomi-redmi-17c-5g', [9999, 11999], 'Budget edit'],
  ['google-pixel-10-pro-xl', [124999], 'Camera focus'],
];
export const shoppingProducts: ShopProduct[] = samples.map(([id, prices, tag]) => {
  const p = phoneModels.find(p => p.id === id);
  if (!p || prices.length !== p.variants.length || !p.colours.length) throw new Error(`Shopping preview product configuration: ${id}`);
  return { id, name: p.name, brand: p.brand === 'Xiaomi Redmi' ? 'Xiaomi' : p.brand, image: p.image, imageAlt: p.imageAlt || p.name, imageCaption: p.imageCaption || 'Official product image; चुना हुआ colour तस्वीर से अलग हो सकता है।', colours: p.colours, variants: p.variants.map((name, i) => ({ name, price: prices[i] * 100 })), tag, source: p.source.startsWith('https://') ? p.source : (p.imageSource || p.source), specs: [{ label: 'Display', value: p.display }, { label: 'Camera', value: p.camera }, { label: 'Processor', value: p.processor }, { label: 'Battery & charging', value: p.power }].filter(s => !!s.value) };
});
