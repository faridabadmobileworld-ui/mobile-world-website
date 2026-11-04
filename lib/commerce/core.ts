import type { Address, CartLine, CustomerData, DemoOrder, ShoppingState, ShopProduct, Totals } from './types';

export const MAX_QUANTITY = 5;
export const emptyCustomer = (): CustomerData => ({ cart: [], favourites: [], addresses: [], orders: [] });
export const emptyState = (): ShoppingState => ({ version: 1, activeProfile: null, profiles: [], guest: emptyCustomer(), recent: [], storageAvailable: true });
export const lineKey = (line: Pick<CartLine, 'productId' | 'variant' | 'colour'>) => JSON.stringify([line.productId, line.variant, line.colour]);
export const money = (paise: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(paise / 100);
export const currentCustomer = (state: ShoppingState) => state.profiles.find(p => p.id === state.activeProfile)?.data ?? state.guest;
export function editCustomer(state: ShoppingState, edit: (data: CustomerData) => CustomerData): ShoppingState {
  if (!state.profiles.some(p => p.id === state.activeProfile)) return { ...state, guest: edit(state.guest) };
  return { ...state, profiles: state.profiles.map(p => p.id === state.activeProfile ? { ...p, data: edit(p.data) } : p) };
}
export function cleanCart(value: unknown, products: ShopProduct[]): CartLine[] {
  if (!Array.isArray(value)) return [];
  const lines = new Map<string, CartLine>();
  for (const row of value.slice(0, 100)) {
    if (!row || typeof row !== 'object') continue;
    const p = products.find(p => p.id === row.productId);
    if (!p || !p.variants.some(v => v.name === row.variant) || !p.colours.some(c => c.name === row.colour)) continue;
    const qty = Number(row.quantity);
    if (!Number.isFinite(qty) || qty < 1) continue;
    const line = { productId: p.id, variant: row.variant as string, colour: row.colour as string, quantity: Math.min(MAX_QUANTITY, Math.floor(qty)) };
    const key = lineKey(line);
    lines.set(key, { ...line, quantity: Math.min(MAX_QUANTITY, line.quantity + (lines.get(key)?.quantity ?? 0)) });
  }
  return [...lines.values()].slice(0, 50);
}
export function cartTotals(cart: CartLine[], products: ShopProduct[], fulfilment: 'pickup' | 'delivery' = 'pickup', coupon = ''): Totals {
  const clean = cleanCart(cart, products);
  const subtotal = clean.reduce((sum, line) => sum + products.find(p => p.id === line.productId)!.variants.find(v => v.name === line.variant)!.price * line.quantity, 0);
  const discount = coupon.trim().toUpperCase() === 'DEMO10' ? Math.min(100000, Math.floor(subtotal / 10)) : 0;
  const delivery = subtotal > 0 && fulfilment === 'delivery' ? 9900 : 0;
  return { subtotal, discount, delivery, total: subtotal - discount + delivery, count: clean.reduce((n, l) => n + l.quantity, 0) };
}
const text = (value: unknown, max = 160) => typeof value === 'string' ? value.trim().slice(0, max) : '';
export function cleanAddress(value: unknown): Address | null {
  if (!value || typeof value !== 'object') return null;
  const a = value as Record<string, unknown>;
  if (!text(a.name) || !text(a.street) || !text(a.city) || !text(a.state) || !/^[1-9]\d{5}$/.test(text(a.pin)) || !/^[6-9]\d{9}$/.test(text(a.phone))) return null;
  return { id: text(a.id, 80), label: text(a.label, 30) || 'Home', name: text(a.name, 80), phone: text(a.phone, 10), street: text(a.street, 240), city: text(a.city, 80), state: text(a.state, 80), pin: text(a.pin, 6), isDefault: a.isDefault === true };
}
function cleanOrder(value: unknown, products: ShopProduct[]): DemoOrder | null {
  if (!value || typeof value !== 'object') return null;
  const o = value as DemoOrder;
  if (!/^MW-DEMO-[A-Z0-9-]{4,60}$/.test(text(o.id)) || !Number.isFinite(Date.parse(o.createdAt))) return null;
  const lines = cleanCart(o.lines, products);
  if (!lines.length) return null;
  const fulfilment = o.fulfilment === 'delivery' ? 'delivery' : 'pickup';
  const address = cleanAddress(o.address);
  if (fulfilment === 'delivery' && !address) return null;
  const coupon = o.coupon === 'DEMO10' ? 'DEMO10' : '';
  return { id: o.id, createdAt: o.createdAt, status: o.status === 'cancelled' ? 'cancelled' : 'placed', fulfilment, address, coupon, payment: 'demo', note: text(o.note, 240), totals: cartTotals(lines, products, fulfilment, coupon), lines: lines.map(l => { const p = products.find(p => p.id === l.productId)!; return { ...l, name: p.name, image: p.image, unitPrice: p.variants.find(v => v.name === l.variant)!.price }; }) };
}
function cleanCustomer(value: unknown, products: ShopProduct[]): CustomerData {
  if (!value || typeof value !== 'object') return emptyCustomer();
  const d = value as CustomerData;
  const addresses = (Array.isArray(d.addresses) ? d.addresses : []).slice(0, 10).map(cleanAddress).filter((a): a is Address => !!a);
  const unique = addresses.filter((a, i) => addresses.findIndex(b => b.id === a.id) === i);
  const defaultId = unique.find(a => a.isDefault)?.id ?? unique[0]?.id;
  return { cart: cleanCart(d.cart, products), favourites: [...new Set(Array.isArray(d.favourites) ? d.favourites : [])].filter(id => products.some(p => p.id === id)).slice(0, 50), addresses: unique.map(a => ({ ...a, isDefault: a.id === defaultId })), orders: (Array.isArray(d.orders) ? d.orders : []).slice(0, 50).map(o => cleanOrder(o, products)).filter((o): o is DemoOrder => !!o) };
}
export function restoreState(value: unknown, products: ShopProduct[]): ShoppingState {
  if (!value || typeof value !== 'object' || (value as ShoppingState).version !== 1) return emptyState();
  const s = value as ShoppingState;
  const profiles = (Array.isArray(s.profiles) ? s.profiles : []).slice(0, 6).filter(p => p && typeof p.id === 'string' && text(p.name)).map(p => ({ id: text(p.id, 80), name: text(p.name, 80), email: text(p.email, 160), phone: text(p.phone, 10), data: cleanCustomer(p.data, products) })).filter((p, i, all) => all.findIndex(a => a.id === p.id) === i);
  return { version: 1, activeProfile: profiles.some(p => p.id === s.activeProfile) ? s.activeProfile : null, profiles, guest: cleanCustomer(s.guest, products), recent: [...new Set(Array.isArray(s.recent) ? s.recent : [])].filter(id => products.some(p => p.id === id)).slice(0, 8), storageAvailable: true };
}
export function enterProfile(state: ShoppingState, id: string, products: ShopProduct[]): ShoppingState {
  if (!state.profiles.some(p => p.id === id)) return state;
  return { ...state, activeProfile: id, guest: emptyCustomer(), profiles: state.profiles.map(p => p.id === id ? { ...p, data: { ...p.data, cart: cleanCart([...p.data.cart, ...state.guest.cart], products), favourites: [...new Set([...p.data.favourites, ...state.guest.favourites])] } } : p) };
}
export function placeDemoOrder(state: ShoppingState, products: ShopProduct[], details: { id: string; createdAt: string; fulfilment: 'pickup' | 'delivery'; addressId: string; coupon: string; note: string }): ShoppingState {
  const profile = state.profiles.find(p => p.id === state.activeProfile);
  if (!profile || profile.data.orders.some(o => o.id === details.id)) return state;
  const lines = cleanCart(profile.data.cart, products);
  const address = profile.data.addresses.find(a => a.id === details.addressId) ?? null;
  if (!lines.length || (details.fulfilment === 'delivery' && !cleanAddress(address))) return state;
  const coupon = details.coupon === 'DEMO10' ? 'DEMO10' : '';
  const order: DemoOrder = { id: details.id, createdAt: details.createdAt, status: 'placed', payment: 'demo', fulfilment: details.fulfilment, address: details.fulfilment === 'delivery' ? address : null, coupon, note: text(details.note, 240), totals: cartTotals(lines, products, details.fulfilment, coupon), lines: lines.map(l => { const p = products.find(p => p.id === l.productId)!; return { ...l, name: p.name, image: p.image, unitPrice: p.variants.find(v => v.name === l.variant)!.price }; }) };
  return editCustomer(state, d => ({ ...d, cart: [], orders: [order, ...d.orders].slice(0, 50) }));
}
