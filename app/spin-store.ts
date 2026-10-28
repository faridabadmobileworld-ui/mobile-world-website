import 'server-only';
import { BlobError, BlobPreconditionFailedError, get, put } from '@vercel/blob';
import { addEntry, emptyLedger, privateKey, type Ledger } from './spin-ledger-core';
import type { SpinCoupon } from './spin-rewards';

export function spinSecret() {
  const secret = process.env.SPIN_WHEEL_SECRET;
  if (!secret || secret.length < 32) throw new Error('Spin service अभी उपलब्ध नहीं है।');
  return secret;
}
export async function readPrivate<T>(path: string): Promise<{ value: T; etag: string } | null> {
  // A compressed response can carry a weak ETag, which cannot guard a write.
  const result = await get(path, { access: 'private', useCache: false, headers: { 'accept-encoding': 'identity' } });
  if (!result || result.statusCode !== 200) return null;
  return { value: await new Response(result.stream).json() as T, etag: result.blob.etag };
}
export async function transactPrivate<T, R>(path: string, initial: () => T, update: (state: T) => { value: R; changed: boolean }): Promise<R> {
  for (let attempt = 0; attempt < 7; attempt++) {
    const previous = await readPrivate<T>(path);
    const state = previous?.value ?? initial();
    const result = update(state);
    if (!result.changed) return result.value;
    try {
      await put(path, JSON.stringify(state), { access: 'private', contentType: 'application/json', addRandomSuffix: false, cacheControlMaxAge: 60, ...(previous ? { allowOverwrite: true, ifMatch: previous.etag } : { allowOverwrite: false }) });
      return result.value;
    } catch (error) {
      // SDK subclasses inherit name="Error"; use the exported class, not name.
      const conflict = error instanceof BlobPreconditionFailedError || (!previous && error instanceof BlobError && /already exists/i.test(error.message));
      if (!conflict) throw error;
      if (attempt === 6) throw new Error(`Private storage conflict after retries (weak ETag: ${previous?.etag.startsWith('W/') ?? false}).`);
      await new Promise(resolve => setTimeout(resolve, 40 * (attempt + 1) + Math.random() * 60));
    }
  }
  throw new Error('एक साथ कई requests हैं। उसी number से फिर कोशिश कीजिए।');
}
export const LEDGER_PATH = 'spin/ledger-v2.json';
export async function saveSpin(phone: string, coupon: SpinCoupon) {
  return transactPrivate(LEDGER_PATH, emptyLedger, state => {
    const { entry, changed } = addEntry(state, phone, coupon, spinSecret());
    return { value: entry.coupon, changed };
  });
}
export async function getLedger() { return (await readPrivate<Ledger>(LEDGER_PATH))?.value ?? emptyLedger(); }
export async function adminRateLimit(ip: string) {
  const key = privateKey(spinSecret(), 'admin-ip', ip);
  return transactPrivate<Record<string, { count: number; until: number }>, boolean>('spin/admin-rate.json', () => ({}), state => {
    const now = Date.now();
    for (const k of Object.keys(state)) if (state[k].until < now) delete state[k];
    const entry = state[key] ?? { count: 0, until: now + 15 * 60 * 1000 };
    if (entry.count >= 8 || Object.keys(state).length >= 5000) return { value: false, changed: false };
    state[key] = { count: entry.count + 1, until: entry.until };
    return { value: true, changed: true };
  });
}
