import type { ReferencePrice } from '@/lib/catalog/preferences';

export type Choice = { productId: string; variant: string; colour: string };
export type Line = Choice & { quantity: number };
export type List = 'cart' | 'saved';
export type Receipt = { id: string; token: string };
export type Basket = { version: 1; cart: Line[]; saved: Line[]; favourites: string[]; receipts: Receipt[] };
export type Listing = {
  id: string; name: string; group: string; kind: 'model' | 'guide' | 'category'; href: string;
  image: string; imageAlt: string; colours: string[];
  variants: { key: string; ram: string; storage: string; colour: string }[]; prices: ReferencePrice[];
};
export const emptyBasket = (): Basket => ({ version: 1, cart: [], saved: [], favourites: [], receipts: [] });
export const maxUnits = 99;
export const maxLines = 50;
export const lineKey = (line: Choice) => JSON.stringify([line.productId, line.variant, line.colour]);
export const rupees = (value: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(value);
const text = (v: unknown, max: number) => typeof v === 'string' && v.length <= max;
export const validId = (v: unknown): v is string => typeof v === 'string' && /^[a-z0-9][a-z0-9-]{0,119}$/.test(v);
export function validLine(value: unknown): value is Line {
  if (!value || typeof value !== 'object') return false;
  const l = value as Line;
  return validId(l.productId) && text(l.variant, 100) && text(l.colour, 120) && Number.isSafeInteger(l.quantity) && l.quantity >= 1 && l.quantity <= maxUnits;
}
export function isReceipt(value: unknown): value is Receipt {
  if (!value || typeof value !== 'object') return false;
  const r = value as Receipt;
  return /^MW-\d{6}-[A-F0-9]{16}$/.test(String(r.id)) && /^[a-f0-9]{64}$/.test(String(r.token));
}
export function basketFrom(raw: string | null, oldFavourites: string | null = null): Basket {
  const state = emptyBasket();
  let data: Partial<Basket> = {};
  try { data = raw ? JSON.parse(raw) ?? {} : {}; } catch { /* Corrupt browser data can be rebuilt. */ }
  function lines(value: unknown): Line[] {
    if (!Array.isArray(value)) return [];
    const byKey = new Map<string, Line>();
    for (const line of value.filter(validLine).slice(0, maxLines)) {
      const { productId, variant, colour, quantity } = line;
      const old = byKey.get(lineKey(line));
      byKey.set(lineKey(line), { productId, variant, colour, quantity: Math.min(maxUnits, (old?.quantity ?? 0) + quantity) });
    }
    return [...byKey.values()];
  }
  state.cart = lines(data.cart); state.saved = lines(data.saved);
  state.favourites = [...new Set((Array.isArray(data.favourites) ? data.favourites : (oldFavourites ?? '').split(',')).filter(validId))];
  state.receipts = Array.isArray(data.receipts) ? data.receipts.filter(isReceipt).slice(0, 40) : [];
  return state;
}

export function addLine(state: Basket, list: List, line: Line): Basket {
  if (!validLine(line)) throw Error('सही model और quantity चुनिए।');
  const key = lineKey(line);
  const previous = state[list].find(l => lineKey(l) === key);
  if (!previous && state[list].length >= maxLines) throw Error('एक list में अधिकतम 50 अलग selections रख सकते हैं।');
  if (previous && previous.quantity + line.quantity > maxUnits) throw Error('एक selection की अधिकतम quantity 99 है।');
  return { ...state, [list]: previous ? state[list].map(l => lineKey(l) === key ? { ...l, quantity: l.quantity + line.quantity } : l) : [...state[list], { ...line }] };
}
export function changeQuantity(state: Basket, list: List, choice: Choice, quantity: number): Basket {
  if (!Number.isSafeInteger(quantity) || quantity < 0 || quantity > maxUnits) throw Error('Quantity 1 से 99 के बीच रखिए।');
  const key = lineKey(choice);
  return { ...state, [list]: state[list].flatMap(l => lineKey(l) !== key ? [l] : quantity ? [{ ...l, quantity }] : []) };
}
export function moveLine(state: Basket, from: List, choice: Choice): Basket {
  const line = state[from].find(l => lineKey(l) === lineKey(choice));
  if (!line) return state;
  return addLine(changeQuantity(state, from, choice, 0), from === 'cart' ? 'saved' : 'cart', line);
}
export function finishRequest(state: Basket, submitted: Line[], receipt: Receipt): Basket {
  if (state.receipts.some(r => r.id === receipt.id)) return state;
  const amounts = new Map(submitted.map(l => [lineKey(l), l.quantity]));
  return { ...state, receipts: [receipt, ...state.receipts].slice(0, 40), cart: state.cart.flatMap(l => {
    const quantity = l.quantity - (amounts.get(lineKey(l)) ?? 0);
    return quantity > 0 ? [{ ...l, quantity }] : [];
  }) };
}
export function validChoice(item: Listing, choice: Choice) {
  if (choice.productId !== item.id) return false;
  if (item.kind !== 'model') return !choice.variant && !choice.colour;
  const v = item.variants.find(v => v.key === choice.variant);
  if (item.variants.length ? !v : !!choice.variant) return false;
  return v?.colour ? v.colour === choice.colour : !choice.colour || item.colours.includes(choice.colour);
}
export function choiceText(item: Listing, line: Choice) {
  const v = item.variants.find(v => v.key === line.variant);
  return [v?.ram && v.ram + ' RAM', v?.storage && v.storage + ' storage', line.colour].filter(Boolean).join(' · ');
}
export function exactPrice(item: Listing, line: Choice) {
  const v = item.variants.find(v => v.key === line.variant);
  return item.prices.find(p => p.ram === (v?.ram ?? '') && p.storage === (v?.storage ?? '') && p.colour === line.colour);
}
export type Contact = { name: string; phone: string; fulfilment: 'pickup' | 'delivery'; pin: string; address: string };
export function cleanContact(raw: unknown): Contact | null {
  if (!raw || typeof raw !== 'object') return null;
  const c = raw as Record<string, unknown>;
  const name = typeof c.name === 'string' ? c.name.trim() : '';
  const input = typeof c.phone === 'string' ? c.phone.replace(/[\s()-]/g, '') : '';
  const phone = input.replace(/^\+91/, '');
  const pin = typeof c.pin === 'string' ? c.pin.trim() : '';
  const address = typeof c.address === 'string' ? c.address.trim() : '';
  if (!name || name.length > 100 || !/^[6-9]\d{9}$/.test(phone) || (c.fulfilment !== 'pickup' && c.fulfilment !== 'delivery')) return null;
  if (c.fulfilment === 'delivery' && (!/^[1-9]\d{5}$/.test(pin) || !address || address.length > 350)) return null;
  return { name, phone, fulfilment: c.fulfilment, address: c.fulfilment === 'delivery' ? address : '', pin: c.fulfilment === 'delivery' ? pin : '' };
}
export const statusLabels = { received: 'दुकान तक पहुँची', quoted: 'दुकान का दाम तैयार है', accepted: 'आपने दाम मंज़ूर किया', ready: 'सामान तैयार है', completed: 'सामान दे दिया गया', cancelled: 'रद्द हुई' } as const;
export type RequestStatus = keyof typeof statusLabels;
export type OrderItem = { productId: string; name: string; choice: string; quantity: number; kind: Listing['kind'] };
export type Quote = { descriptions: string[]; unitPrices: number[]; fee: number; total: number; version: string };
export type PublicOrder = { id: string; created: string; status: RequestStatus; fulfilment: Contact['fulfilment']; items: OrderItem[]; quote: Quote | null };
