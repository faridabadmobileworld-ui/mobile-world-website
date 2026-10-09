import { createCipheriv, createDecipheriv, createHash, createHmac, randomBytes, timingSafeEqual } from 'node:crypto';
import type { SpinCoupon } from './spin-rewards';
import { LEGACY_SPIN_CAMPAIGN } from './spin-rewards';

export type Sale = { bill: string; line: number; product: string; category: string; amount: number };
export type Entry = { id: string; phone: string; coupon: SpinCoupon; createdAt: string; redeemed?: { at: string; sale: Sale; coupon: SpinCoupon } };
export type Ledger = { version: 1; entries: Record<string, Entry>; products: Record<string, string> };
export const emptyLedger = (): Ledger => ({ version: 1, entries: {}, products: {} });
export function privateKey(secret: string, purpose: string, value: string) {
  return createHmac('sha256', secret).update(`mw-private:${purpose}:${value}`).digest('hex');
}
export function encryptPhone(phone: string, secret: string) {
  const iv = randomBytes(12);
  const cipher = createCipheriv('aes-256-gcm', Buffer.from(privateKey(secret, 'encryption', 'phone'), 'hex'), iv);
  const data = Buffer.concat([cipher.update(phone, 'utf8'), cipher.final()]);
  return Buffer.concat([iv, cipher.getAuthTag(), data]).toString('base64url');
}
export function decryptPhone(value: string, secret: string) {
  const data = Buffer.from(value, 'base64url');
  const cipher = createDecipheriv('aes-256-gcm', Buffer.from(privateKey(secret, 'encryption', 'phone'), 'hex'), data.subarray(0, 12));
  cipher.setAuthTag(data.subarray(12, 28));
  return Buffer.concat([cipher.update(data.subarray(28)), cipher.final()]).toString('utf8');
}
export function addEntry(state: Ledger, phone: string, coupon: SpinCoupon, secret: string) {
  const id = privateKey(secret, 'phone', phone);
  if (state.entries[id]) return { entry: state.entries[id], changed: false };
  if (Object.keys(state.entries).length >= 10000) throw new Error('Campaign entries अभी पूरी हो गई हैं। दुकान से संपर्क कीजिए।');
  const entry: Entry = { id, phone: encryptPhone(phone, secret), coupon, createdAt: new Date().toISOString() };
  state.entries[id] = entry;
  return { entry, changed: true };
}
export function redeemEntry(state: Ledger, phone: string, coupon: SpinCoupon, raw: Sale, secret: string) {
  const sale = { ...raw, bill: raw.bill?.trim(), product: raw.product?.trim() };
  if (!sale.bill || sale.bill.length > 80 || !sale.product || sale.product.length > 120 || !Number.isInteger(sale.line) || sale.line < 1 || sale.line > 999) throw new Error('Bill number, product और सही bill line लिखिए।');
  const legacyGift = coupon.campaign === LEGACY_SPIN_CAMPAIGN && coupon.rewardId === 'neckband';
  if (!Number.isFinite(sale.amount) || sale.amount < 0 || (!legacyGift && coupon.campaign !== LEGACY_SPIN_CAMPAIGN && sale.amount <= 5000)) throw new Error('इस नए code के लिए product की ख़रीदारी ₹5,000 से अधिक होनी चाहिए।');
  if (!['mobile', 'laptop', 'electronics', 'home-appliance', ...(legacyGift ? ['legacy-gift'] : [])].includes(sale.category)) throw new Error('सही product category चुनिए।');
  const id = privateKey(secret, 'phone', phone);
  if (state.entries[id]?.redeemed) throw new Error('इस number का reward पहले ही इस्तेमाल हो चुका है।');
  const productKey = privateKey(secret, 'bill-line', `${sale.bill.toUpperCase().replace(/\s+/g, '')}:${sale.line}`);
  if (state.products[productKey]) throw new Error('इस bill line पर एक code पहले ही लग चुका है।');
  const { entry } = addEntry(state, phone, coupon, secret);
  entry.redeemed = { at: new Date().toISOString(), sale, coupon };
  state.products[productKey] = id;
  return entry;
}
export function safeEqual(a: string, b: string) {
  return timingSafeEqual(createHash('sha256').update(a).digest(), createHash('sha256').update(b).digest());
}
