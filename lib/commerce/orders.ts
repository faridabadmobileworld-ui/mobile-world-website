import 'server-only';
import { privateKey, encryptPhone, decryptPhone, safeEqual } from '@/app/spin-ledger-core';
import { readPrivate, spinSecret, transactPrivate } from '@/app/spin-store';
import { shoppingCatalogue } from './catalogue';
import { choiceText, cleanContact, isReceipt, lineKey, maxLines, validChoice, validLine, type Contact, type Line, type OrderItem, type PublicOrder, type Quote, type Receipt, type RequestStatus } from './core';

export class ShoppingError extends Error {}
type StoredOrder = PublicOrder & { sealedContact: string; phoneKey: string; ipKey: string; fingerprint: string };
type Ledger = { orders: Record<string, StoredOrder> };
const initial = (): Ledger => ({ orders: {} });
const path = (month: string) => 'commerce/requests/' + month + '.json';
const idPattern = /^MW-(20\d{2}(?:0[1-9]|1[0-2]))-[0-9A-F]{16}$/;
const noncePattern = /^(20\d{2}(?:0[1-9]|1[0-2]))-[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;
export const orderMonth = (date: Date) => new Date(date.getTime() + 19800000).toISOString().slice(0, 7).replace('-', '');
const contactSecret = (secret: string) => privateKey(secret, 'shopping-contact-encryption', 'v1');
const tokenFor = (secret: string, id: string) => privateKey(secret, 'shopping-receipt', id);
function validToken(receipt: Receipt, secret: string) {
  return isReceipt(receipt) && idPattern.test(receipt.id) && safeEqual(receipt.token, tokenFor(secret, receipt.id));
}
function publicOrder(o: StoredOrder): PublicOrder {
  return { id: o.id, created: o.created, status: o.status, fulfilment: o.fulfilment, items: o.items, quote: o.quote };
}
function repeat(existing: StoredOrder, fingerprint: string, receipt: Receipt) {
  if (!safeEqual(existing.fingerprint, fingerprint)) throw new ShoppingError('Cart या contact बदल गया है। Checkout दोबारा खोलिए।');
  return { receipt, order: publicOrder(existing) };
}

export async function placeRequest(nonce: string, rawLines: unknown, rawContact: unknown, ip: string) {
  const now = new Date();
  const month = typeof nonce === 'string' && nonce.match(noncePattern)?.[1];
  if (!month || ![orderMonth(now), orderMonth(new Date(now.getTime() - 86400000))].includes(month)) throw new ShoppingError('Checkout दोबारा खोलकर request भेजिए।');
  const contact = cleanContact(rawContact);
  if (!contact) throw new ShoppingError('नाम, सही mobile number और delivery का पूरा पता जाँचिए।');
  if (!Array.isArray(rawLines) || !rawLines.length || rawLines.length > maxLines || !rawLines.every(validLine)) throw new ShoppingError('Cart में सही सामान और quantity चुनिए।');
  const lines: Line[] = rawLines.map(({ productId, variant, colour, quantity }) => ({ productId, variant, colour, quantity }));
  if (new Set(lines.map(lineKey)).size !== lines.length) throw new ShoppingError('Cart में एक selection दो बार है। Quantity मिलाकर भेजिए।');
  const secret = spinSecret();
  const id = 'MW-' + month + '-' + privateKey(secret, 'shopping-id', nonce).slice(0, 16).toUpperCase();
  const receipt = { id, token: tokenFor(secret, id) };
  const fingerprint = privateKey(secret, 'shopping-content', JSON.stringify([contact, lines]));
  const existing = (await readPrivate<Ledger>(path(month)))?.value.orders[id];
  if (existing) return repeat(existing, fingerprint, receipt);
  const catalogue = new Map((await shoppingCatalogue()).map(item => [item.id, item]));
  const items: OrderItem[] = lines.map(line => {
    const item = catalogue.get(line.productId);
    if (!item || item.kind === 'guide' || !validChoice(item, line)) throw new ShoppingError('एक selection बदल गया है। Cart में उसकी जगह मौजूदा option चुनिए।');
    return { productId: item.id, name: item.name, choice: choiceText(item, line), quantity: line.quantity, kind: item.kind };
  });
  const phoneKey = privateKey(secret, 'shopping-phone', contact.phone);
  const ipKey = ip ? privateKey(secret, 'shopping-ip', ip) : '';
  const record: StoredOrder = { id, created: now.toISOString(), status: 'received', fulfilment: contact.fulfilment, items, quote: null,
    sealedContact: encryptPhone(JSON.stringify(contact), contactSecret(secret)), phoneKey, ipKey, fingerprint };
  return transactPrivate(path(month), initial, state => {
    if (state.orders[id]) return { value: repeat(state.orders[id], fingerprint, receipt), changed: false };
    const recent = Object.values(state.orders).filter(o => Date.parse(o.created) > now.getTime() - 600000);
    if (recent.filter(o => o.phoneKey === phoneKey).length >= 4 || (ipKey && recent.filter(o => o.ipKey === ipKey).length >= 20)) throw new ShoppingError('कुछ requests पहले ही पहुँची हैं। दस मिनट बाद फिर कोशिश कीजिए।');
    state.orders[id] = record;
    return { value: { receipt, order: publicOrder(record) }, changed: true };
  });
}

export async function customerOrders(receipts: unknown): Promise<PublicOrder[]> {
  if (!Array.isArray(receipts) || receipts.length > 40) throw new ShoppingError('इस device की requests दोबारा खोलिए।');
  if (!receipts.length) return [];
  const secret = spinSecret();
  const ids = [...new Set(receipts.filter((r): r is Receipt => isReceipt(r) && validToken(r, secret)).map(r => r.id))];
  const months = [...new Set(ids.map(id => id.slice(3, 9)))];
  const ledgers = new Map(await Promise.all(months.map(async month => [month, (await readPrivate<Ledger>(path(month)))?.value] as const)));
  return ids.flatMap(id => { const order = ledgers.get(id.slice(3, 9))?.orders[id]; return order ? [publicOrder(order)] : []; });
}
export async function ownerOrders(month: string) {
  if (!/^20\d{2}(0[1-9]|1[0-2])$/.test(month)) throw new ShoppingError('सही महीना चुनिए।');
  const ledger = (await readPrivate<Ledger>(path(month)))?.value ?? initial();
  const key = contactSecret(spinSecret());
  return Object.values(ledger.orders).sort((a,b) => b.created.localeCompare(a.created)).map(o => ({
    ...publicOrder(o), contact: JSON.parse(decryptPhone(o.sealedContact, key)) as Contact,
  }));
}
function changeOrder(id: string, edit: (order: StoredOrder) => void) {
  const month = typeof id === 'string' && id.match(idPattern)?.[1];
  if (!month) throw new ShoppingError('Order number जाँचिए।');
  return transactPrivate(path(month), initial, state => {
    const order = state.orders[id];
    if (!order) throw new ShoppingError('Order request उपलब्ध नहीं है।');
    edit(order);
    return { value: publicOrder(order), changed: true };
  });
}
export async function customerDecision(receipt: Receipt, action: 'accept' | 'cancel', version: string) {
  if (!validToken(receipt, spinSecret())) throw new ShoppingError('अपनी request उसी browser में खोलिए जहाँ से भेजी थी।');
  return changeOrder(receipt.id, o => {
    if (action === 'accept' && o.status === 'quoted' && o.quote?.version === version) o.status = 'accepted';
    else if (action === 'cancel' && ['received','quoted'].includes(o.status)) o.status = 'cancelled';
    else throw new ShoppingError('इस request का status बदल गया है। ताज़ा जानकारी देखिए।');
  });
}
export async function setQuote(id: string, expectedStatus: string, expectedVersion: string, amounts: number[], fee: number, descriptions: string[]) {
  return changeOrder(id, o => {
    if (!['received','quoted'].includes(o.status) || o.status !== expectedStatus || (o.quote?.version ?? '') !== expectedVersion) throw new ShoppingError('Request बदल गई है। Page refresh कीजिए।');
    const money = (n: number) => Number.isSafeInteger(n) && n >= 0 && n <= 10000000;
    if (!Array.isArray(amounts) || amounts.length !== o.items.length || amounts.some(n => !money(n) || n === 0) || !money(fee) || (o.fulfilment === 'pickup' && fee !== 0)) throw new ShoppingError('हर item का सही unit price और लागू delivery charge भरिए।');
    if (!Array.isArray(descriptions) || descriptions.length !== o.items.length || descriptions.some((v,i) => typeof v !== 'string' || v.length > 180 || (o.items[i].kind === 'category' && !v.trim()))) throw new ShoppingError('Category request के लिए exact brand और model लिखिए।');
    const total = amounts.reduce((sum, value, i) => sum + value * o.items[i].quantity, fee);
    const quote: Quote = { descriptions: descriptions.map(v => v.trim()), unitPrices: amounts, fee, total, version: crypto.randomUUID() };
    o.quote = quote; o.status = 'quoted';
  });
}
export async function ownerDecision(id: string, from: RequestStatus, to: RequestStatus) {
  return changeOrder(id, o => {
    const next: Partial<Record<RequestStatus, RequestStatus[]>> = { received: ['cancelled'], quoted: ['cancelled'], accepted: ['ready','cancelled'], ready: ['completed','cancelled'] };
    if (o.status !== from || !next[from]?.includes(to)) throw new ShoppingError('इस request का नया status जाँचिए।');
    o.status = to;
  });
}
