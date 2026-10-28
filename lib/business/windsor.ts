import 'server-only';
import { createCipheriv, createDecipheriv, createHash, randomBytes } from 'node:crypto';
import { readPrivate, spinSecret, transactPrivate } from '@/app/spin-store';
import { istDay } from '@/lib/analytics/core';
import { normalizeGoogle, type GoogleReport } from './core';
import { saveGoogle } from './store';
type Settings = { encryptedKey: string; savedAt: number };
const settingsPath = 'business/windsor-settings-v1.json';
const cipherKey = () => createHash('sha256').update('mw-windsor-v1:' + spinSecret()).digest();
function encrypt(value: string) { const iv = randomBytes(12), cipher = createCipheriv('aes-256-gcm', cipherKey(), iv); const data = Buffer.concat([cipher.update(value, 'utf8'), cipher.final()]); return Buffer.concat([iv, cipher.getAuthTag(), data]).toString('base64'); }
function decrypt(value: string) { const bytes = Buffer.from(value, 'base64'), cipher = createDecipheriv('aes-256-gcm', cipherKey(), bytes.subarray(0, 12)); cipher.setAuthTag(bytes.subarray(12, 28)); return Buffer.concat([cipher.update(bytes.subarray(28)), cipher.final()]).toString('utf8'); }
export async function windsorConfigured() { return Boolean((await readPrivate<Settings>(settingsPath))?.value.encryptedKey); }
async function pull(key: string): Promise<GoogleReport> {
  const to = istDay(Date.now() - 3 * 86400000), from = istDay(Date.now() - 30 * 86400000);
  async function query(connector: string, account: string, fields: string) {
    // Fixed origin; never accept a URL from a settings form. Do not log URLs/errors containing the API key.
    const url = new URL(`https://connectors.windsor.ai/${connector}`);
    url.search = new URLSearchParams({ api_key: key, select_accounts: account, fields, date_from: from, date_to: to }).toString();
    const response = await fetch(url, { cache: 'no-store', redirect: 'error', signal: AbortSignal.timeout(45000) });
    if (!response.ok) throw new Error('Google sync unavailable');
    const result = await response.json();
    if (!Array.isArray(result.data) || result.error || result.status === 'pending') throw new Error('Google data is not ready');
    return result.data;
  }
  const site = 'sc-domain:mobileworldfaridabad.com';
  const [search, pages, queries, business] = await Promise.all([
    query('searchconsole', site, 'date,clicks,impressions,position'),
    query('searchconsole', site, 'page,clicks,impressions,position'),
    query('searchconsole', site, 'query,clicks,impressions,position'),
    query('google_my_business', 'locations/3321499816072261375', 'date,impressions,call_clicks,website_clicks,direction_requests'),
  ]);
  return normalizeGoogle({ version: 1, from, to, fetchedAt: Date.now(), search, pages, queries, business });
}
export async function connectWindsor(key: string) {
  if (typeof key !== 'string' || key.length < 12 || key.length > 300 || /\s/.test(key)) throw new Error('सही Windsor API key private form में भरिए।');
  try {
    const report = await pull(key); // Never replace a working credential until both sources pass.
    await saveGoogle(report);
    const encryptedKey = encrypt(key);
    await transactPrivate<Settings, boolean>(settingsPath, () => ({ encryptedKey: '', savedAt: 0 }), state => { state.encryptedKey = encryptedKey; state.savedAt = Date.now(); return { value: true, changed: true }; });
  } catch { throw new Error('Windsor ने पूरी report नहीं लौटाई। API access, account selection और plan जाँचिए; पुरानी report सुरक्षित है।'); }
}
export async function refreshGoogle() {
  const settings = (await readPrivate<Settings>(settingsPath))?.value;
  if (!settings?.encryptedKey) return { synced: false, reason: 'key-required' as const };
  try { await saveGoogle(await pull(decrypt(settings.encryptedKey))); return { synced: true }; }
  catch { return { synced: false, reason: 'provider-unavailable' as const }; }
}
