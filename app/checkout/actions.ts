'use server';
import { headers } from 'next/headers';
import { customerDecision, customerOrders, placeRequest, ShoppingError } from '@/lib/commerce/orders';
import type { Contact, Line, Receipt } from '@/lib/commerce/core';

async function result<T>(work: () => Promise<T>) {
  try { return { ok: true as const, value: await work() }; }
  catch (e) { return { ok: false as const, message: e instanceof ShoppingError ? e.message : 'दुकान से connection नहीं बन सका। कुछ देर बाद फिर कोशिश कीजिए।' }; }
}
export async function sendOrder(nonce: string, lines: Line[], contact: Contact) {
  return result(async () => {
    const h = await headers();
    return placeRequest(nonce, lines, contact, h.get('x-vercel-forwarded-for')?.split(',')[0]?.trim() ?? '');
  });
}
export async function readOrders(receipts: Receipt[]) { return result(() => customerOrders(receipts)); }
export async function decideOrder(receipt: Receipt, action: 'accept' | 'cancel', version: string) {
  return result(() => customerDecision(receipt, action, version));
}
