'use server';
import { cookies, headers } from 'next/headers';
import { createHash, createHmac, randomBytes, scrypt as scryptCallback } from 'node:crypto';
import { promisify } from 'node:util';
import { normalizeSpinPhone, verifySpinCoupon } from './spin-core';
import { decryptPhone, emptyLedger, privateKey, redeemEntry, safeEqual, type Sale } from './spin-ledger-core';
import { adminRateLimit, getLedger, LEDGER_PATH, readPrivate, spinSecret, transactPrivate } from './spin-store';
import { getSpinReward } from './spin-rewards';

const scrypt = promisify(scryptCallback);
const COOKIE = 'mw_spin_admin';
const ADMIN_PATH = 'spin/admin-owner.json';
type Admin = { salt: string; hash: string; version: string; createdAt: string };
type Result = { ok: boolean; message: string };
async function owner() { return (await readPrivate<{ account: Admin }>(ADMIN_PATH))?.value.account; }
async function session() {
  const raw = (await cookies()).get(COOKIE)?.value;
  if (!raw || raw.length > 300) return false;
  const [expires, version, signature] = raw.split('.');
  if (!expires || !version || !signature || Number(expires) < Date.now()) return false;
  const expected = createHmac('sha256', spinSecret()).update(`admin-session:${expires}:${version}`).digest('hex');
  if (!safeEqual(signature, expected)) return false;
  return (await owner())?.version === version;
}
async function requireOwner() { if (!(await session())) throw new Error('पहले owner login कीजिए।'); }
async function setSession(admin: Admin) {
  const expires = String(Date.now() + 8 * 60 * 60 * 1000);
  const body = `${expires}:${admin.version}`;
  const signature = createHmac('sha256', spinSecret()).update(`admin-session:${body}`).digest('hex');
  (await cookies()).set(COOKIE, `${expires}.${admin.version}.${signature}`, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict', path: '/', maxAge: 8 * 60 * 60 });
}
async function authLimit() {
  const h = await headers();
  return adminRateLimit(h.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown');
}
export async function adminLogin(password: string): Promise<Result> {
  try {
    if (typeof password !== 'string' || password.length > 200 || !(await authLimit())) return { ok: false, message: 'Login अभी पूरा नहीं हुआ। कुछ देर बाद कोशिश कीजिए।' };
    const admin = await owner();
    const hash = await scrypt(password, admin?.salt ?? 'no-owner-configured', 64) as Buffer;
    if (!admin || !safeEqual(hash.toString('hex'), admin.hash)) return { ok: false, message: 'Password सही नहीं है।' };
    await setSession(admin);
    return { ok: true, message: 'Login पूरा हुआ।' };
  } catch { return { ok: false, message: 'Login service अभी उपलब्ध नहीं है।' }; }
}
export async function setupAdmin(key: string, password: string): Promise<Result> {
  try {
    const configuredHash = process.env.SPIN_ADMIN_SETUP_HASH;
    if (typeof key !== 'string' || key.length > 100 || !configuredHash || !safeEqual(createHash('sha256').update(key).digest('hex'), configuredHash)) return { ok: false, message: 'Owner setup link सही नहीं है।' };
    if (typeof password !== 'string' || password.length < 14 || password.length > 200) return { ok: false, message: 'कम से कम 14 characters का नया password रखिए।' };
    if (await owner()) return { ok: false, message: 'Owner account बन चुका है। अपना password डालकर login कीजिए।' };
    const salt = randomBytes(24).toString('hex');
    const hash = (await scrypt(password, salt, 64) as Buffer).toString('hex');
    const admin = { salt, hash, version: randomBytes(16).toString('hex'), createdAt: new Date().toISOString() };
    await transactPrivate<{ account?: Admin }, boolean>(ADMIN_PATH, () => ({}), state => {
      if (state.account) throw new Error('Owner already configured');
      state.account = admin;
      return { value: true, changed: true };
    });
    await setSession(admin);
    return { ok: true, message: 'आपका private dashboard तैयार है।' };
  } catch { return { ok: false, message: 'Setup पूरा नहीं हुआ। Account बना हो तो Login चुनिए।' }; }
}
export async function adminLogout() { (await cookies()).delete(COOKIE); }
export async function adminSnapshot() {
  const configured = Boolean(process.env.BLOB_READ_WRITE_TOKEN || process.env.BLOB_STORE_ID) && Boolean(process.env.SPIN_WHEEL_SECRET);
  if (!configured) return { state: 'unavailable' as const };
  try {
    if (!(await session())) return { state: (await owner()) ? 'login' as const : 'setup' as const };
    const ledger = await getLedger();
    const secret = spinSecret();
    const entries = Object.values(ledger.entries).map(entry => ({ id: entry.id, phone: decryptPhone(entry.phone, secret), code: entry.coupon.code, reward: getSpinReward(entry.coupon.rewardId)?.label ?? entry.coupon.rewardId, createdAt: entry.createdAt, redeemedAt: entry.redeemed?.at ?? null, sale: entry.redeemed?.sale ?? null })).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    return { state: 'ready' as const, entries };
  } catch { return { state: 'unavailable' as const }; }
}
export async function inspectAdminCoupon(rawCode: string, rawPhone: string) {
  try {
    await requireOwner();
    const phone = normalizeSpinPhone(rawPhone);
    if (!phone) return { ok: false as const, message: 'सही mobile number लिखिए।' };
    const secret = spinSecret();
    const coupon = verifySpinCoupon(rawCode, phone, secret);
    if (!coupon) return { ok: false as const, message: 'Number और code मेल नहीं खाते।' };
    const entry = (await getLedger()).entries[privateKey(secret, 'phone', phone)];
    return { ok: true as const, coupon, label: getSpinReward(coupon.rewardId)?.label, redeemed: Boolean(entry?.redeemed), redeemedAt: entry?.redeemed?.at ?? null };
  } catch { return { ok: false as const, message: 'Verification नहीं हो पाया। Login जाँचिए।' }; }
}
export async function redeemAdminCoupon(rawCode: string, rawPhone: string, sale: Sale): Promise<Result> {
  try {
    await requireOwner();
    const phone = normalizeSpinPhone(rawPhone);
    if (!phone) return { ok: false, message: 'सही mobile number लिखिए।' };
    const secret = spinSecret();
    const coupon = verifySpinCoupon(rawCode, phone, secret);
    if (!coupon) return { ok: false, message: 'Code और number मेल नहीं खाते।' };
    await transactPrivate(LEDGER_PATH, emptyLedger, ledger => ({ value: redeemEntry(ledger, phone, coupon, sale, secret), changed: true }));
    return { ok: true, message: 'Reward इस्तेमाल हुआ। इस number और bill line पर दूसरा code नहीं लगेगा।' };
  } catch (error) {
    const message = error instanceof Error ? error.message : '';
    return { ok: false, message: /^(इस |Bill |सही |पहले |Campaign )/.test(message) ? message : 'Record save नहीं हुआ। Reward देने से पहले फिर जाँचिए।' };
  }
}
