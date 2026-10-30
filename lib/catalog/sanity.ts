import 'server-only';
import { cache } from 'react';
import { createCipheriv, createDecipheriv, createHash, randomBytes } from 'node:crypto';
import { readPrivate, spinSecret, transactPrivate } from '@/app/spin-store';
import { normalizeProduct, productId, publicProduct, revision, validatePublication, imageUrl,
  type EditorRecord, type ProductDraft, type PublicProduct } from './core';

type Connection = { projectId: string; dataset: string; token: string };
type SavedConnection = { projectId: string; dataset: string; encryptedToken: string; checkedAt: string };
type Document = ProductDraft & { _id: string; _rev: string; _updatedAt: string };
const SETTINGS = 'cms/sanity-connection-v1.json';
const VERSION = 'v2025-02-19';
const docId = (id: string) => 'mw-product.' + productId(id);
const draftId = (id: string) => 'drafts.' + docId(id);
const message = 'Sanity connection अभी उपलब्ध नहीं है। Existing website सुरक्षित है; connection जाँचकर फिर कोशिश कीजिए।';
const key = () => createHash('sha256').update('mw-sanity-token-v1:' + spinSecret()).digest();
function encrypt(value: string) {
  const iv = randomBytes(12), cipher = createCipheriv('aes-256-gcm', key(), iv);
  const bytes = Buffer.concat([cipher.update(value, 'utf8'), cipher.final()]);
  return Buffer.concat([iv, cipher.getAuthTag(), bytes]).toString('base64');
}
function decrypt(value: string) {
  const bytes = Buffer.from(value, 'base64'), cipher = createDecipheriv('aes-256-gcm', key(), bytes.subarray(0, 12));
  cipher.setAuthTag(bytes.subarray(12, 28));
  return Buffer.concat([cipher.update(bytes.subarray(28)), cipher.final()]).toString('utf8');
}
function validateConnection(input: Connection): Connection {
  if (!/^[a-z0-9]{4,16}$/.test(input.projectId) || !/^[a-z0-9][a-z0-9_-]{0,63}$/.test(input.dataset) ||
      !/^[a-zA-Z0-9._-]{20,3000}$/.test(input.token)) throw new Error('Project ID, dataset और project-scoped API token सही भरिए।');
  return input;
}
async function settings(): Promise<Connection | null> {
  if (process.env.SANITY_PROJECT_ID && process.env.SANITY_DATASET && process.env.SANITY_API_TOKEN)
    return validateConnection({ projectId: process.env.SANITY_PROJECT_ID, dataset: process.env.SANITY_DATASET, token: process.env.SANITY_API_TOKEN });
  if (!process.env.BLOB_READ_WRITE_TOKEN && !process.env.BLOB_STORE_ID) return null;
  const saved = (await readPrivate<SavedConnection>(SETTINGS))?.value;
  return saved ? validateConnection({ projectId: saved.projectId, dataset: saved.dataset, token: decrypt(saved.encryptedToken) }) : null;
}
async function requireSettings() {
  const config = await settings(); if (!config) throw new Error('पहले existing Sanity project connect कीजिए।'); return config;
}
async function request<T>(config: Connection, path: string, init?: RequestInit): Promise<T> {
  const response = await fetch('https://' + config.projectId + '.api.sanity.io/' + VERSION + path, {
    ...init, headers: { 'Content-Type': 'application/json', ...init?.headers, Authorization: 'Bearer ' + config.token },
    cache: 'no-store', redirect: 'error', signal: AbortSignal.timeout(20000),
  });
  if (response.status === 409) throw new Error('दूसरे tab में record बदला है। Refresh करके नया version खोलिए।');
  if (!response.ok) throw new Error(message);
  return await response.json() as T;
}
async function query<T>(config: Connection, groq: string, params: Record<string, string> = {}, published = false): Promise<T> {
  const search = new URLSearchParams({ query: groq, perspective: published ? 'published' : 'raw' });
  for (const [name, value] of Object.entries(params)) search.set('$' + name, JSON.stringify(value));
  return (await request<{ result: T }>(config, '/data/query/' + config.dataset + '?' + search)).result;
}
async function mutate(config: Connection, mutations: unknown[], dryRun = false) {
  return request(config, '/data/mutate/' + config.dataset + '?visibility=sync&dryRun=' + String(dryRun),
    { method: 'POST', body: JSON.stringify({ mutations }) });
}
export async function connectionStatus() {
  try {
    const config = await settings();
    return config ? { configured: true, projectId: config.projectId, dataset: config.dataset, message: '' } :
      { configured: false, projectId: '', dataset: '', message: 'Existing Sanity project की connection अभी बाकी है।' };
  } catch { return { configured: false, projectId: '', dataset: '', message }; }
}
export async function connectSanity(input: Connection) {
  const config = validateConnection(input);
  const existing = await settings();
  if (existing && (existing.projectId !== config.projectId || existing.dataset !== config.dataset))
    throw new Error('Connected project बदलने से पहले content migration ज़रूरी है। मौजूदा project ही इस्तेमाल कीजिए।');
  await query(config, 'count(*[_type == "mwProduct"])');
  // Validate document-write permission without creating a live or draft test record.
  await mutate(config, [{ create: { _id: 'drafts.mw-connection-check-' + randomBytes(8).toString('hex'), _type: 'mwProduct', connectionCheck: true } }], true);
  const saved = { projectId: config.projectId, dataset: config.dataset, encryptedToken: encrypt(config.token), checkedAt: new Date().toISOString() };
  await transactPrivate<SavedConnection, boolean>(SETTINGS, () => saved, state => { Object.assign(state, saved); return { value: true, changed: true }; });
}
export async function editorRecords(): Promise<EditorRecord[]> {
  const config = await requireSettings();
  const documents = await query<Document[]>(config, '*[_type == "mwProduct" && (_id in path("mw-product.*") || _id in path("drafts.mw-product.*"))][0...1000]');
  const ids = [...new Set(documents.map(doc => doc.id))];
  return ids.map(id => {
    const published = documents.find(doc => doc._id === docId(id));
    const draft = documents.find(doc => doc._id === draftId(id));
    const product = normalizeProduct({ ...(draft ?? published), sources: (draft ?? published)?.sources ?? [] });
    return { ...product, draftRevision: draft?._rev ?? '', publishedRevision: published?._rev ?? '', publishedSlug: published?.slug ?? '' };
  }).sort((a, b) => a.brand.localeCompare(b.brand) || a.name.localeCompare(b.name));
}
export async function saveDraft(input: unknown, expectedRevision: string) {
  const product = normalizeProduct(input), expected = revision(expectedRevision), config = await requireSettings();
  const document = { ...product, _type: 'mwProduct' };
  const mutation = expected ? { patch: { id: draftId(product.id), ifRevisionID: expected, set: product } } :
    { create: { _id: draftId(product.id), ...document } };
  await mutate(config, [mutation]);
}
export async function publishProduct(id: string, draftRevision: string, publishedRevision: string) {
  const config = await requireSettings(), expectedDraft = revision(draftRevision), expectedPublished = revision(publishedRevision);
  if (!expectedDraft) throw new Error('पहले draft save कीजिए।');
  const documents = await query<Document[]>(config, '*[_id in [$draft, $published]]', { draft: draftId(id), published: docId(id) });
  const draft = documents.find(doc => doc._id === draftId(id)), published = documents.find(doc => doc._id === docId(id));
  if (!draft || draft._rev !== expectedDraft || (published?._rev ?? '') !== expectedPublished)
    throw new Error('दूसरे tab में record बदला है। Refresh करके नया version खोलिए।');
  const product = normalizeProduct(draft); validatePublication(product);
  if (published && product.slug !== published.slug) throw new Error('Published URL सुरक्षित रखने के लिए उसका slug न बदलें।');
  const slugId = 'mw-product-slug.' + product.slug;
  const slugOwner = await query<{ productId: string } | null>(config, '*[_id == $id][0]{productId}', { id: slugId });
  if (slugOwner && slugOwner.productId !== product.id) throw new Error('यह URL किसी दूसरे model का है। अलग slug चुनिए।');
  const now = new Date().toISOString(), dto = publicProduct(product, now);
  const mutations: unknown[] = [{ patch: { id: draftId(id), ifRevisionID: expectedDraft, set: { lastPublishedAt: now } } }];
  if (!slugOwner) mutations.push({ create: { _id: slugId, _type: 'mwProductSlug', productId: product.id } });
  mutations.push(published ? { patch: { id: docId(id), ifRevisionID: expectedPublished, set: dto, unset: ['sources', 'values.spec_007'] } } :
    { create: { _id: docId(id), _type: 'mwProduct', ...dto } });
  const generation = await invalidateCatalogSnapshot(config);
  await mutate(config, mutations);
  return refreshCatalogSnapshot(config, generation);
}
export async function unpublishProduct(id: string, expectedRevision: string) {
  const expected = revision(expectedRevision);
  if (!expected) throw new Error('Published version नहीं मिला।');
  const config = await requireSettings();
  const draft = await query<{ _id: string } | null>(config, '*[_id == $id][0]{_id}', { id: draftId(id) });
  if (!draft) throw new Error('पहले draft save कीजिए, ताकि content सुरक्षित रहे।');
  const generation = await invalidateCatalogSnapshot(config);
  await mutate(config, [{ delete: { id: docId(id), ifRevisionID: expected } }]);
  return refreshCatalogSnapshot(config, generation);
}
const projection = '{id,slug,brand,series,name,description,image,imageAlt,imageVerified,verified,verifiedAt,values,variants,updatedAt}';
function sanitize(products: unknown[]): PublicProduct[] {
  return products.flatMap(input => {
    try {
      const raw = input as PublicProduct, product = normalizeProduct({ ...raw, sources: [] });
      if (!product.verified || !product.imageVerified || !product.image || !product.imageAlt || !product.name || !product.brand ||
          !product.verifiedAt || product.verifiedAt > new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' }) ||
          product.variants.some(variant => variant.image && !variant.imageVerified)) return [];
      return [publicProduct(product, typeof raw.updatedAt === 'string' ? raw.updatedAt : '')];
    } catch { return []; }
  });
}
const snapshotPath = (config: Connection) => 'cms/catalog-' + config.projectId + '-' + config.dataset + '.json';
async function fetchPublished(config: Connection) {
  const values = await query<unknown[]>(config, '*[_type == "mwProduct" && _id in path("mw-product.*") && verified == true && imageVerified == true][0...500]' + projection, {}, true);
  return sanitize(values);
}
type CatalogSnapshot = { products: PublicProduct[]; at: string; generation: string };
async function invalidateCatalogSnapshot(config: Connection) {
  const generation = randomBytes(16).toString('hex');
  // A failed refresh must never resurrect an unpublished product during an outage.
  await transactPrivate<CatalogSnapshot, boolean>(snapshotPath(config), () => ({ products: [], at: '', generation }), state => {
    state.products = []; state.at = ''; state.generation = generation; return { value: true, changed: true };
  });
  return generation;
}
async function refreshCatalogSnapshot(config: Connection, generation: string) {
  try {
    const products = await fetchPublished(config);
    const saved = await transactPrivate<CatalogSnapshot, boolean>(snapshotPath(config), () => ({ products: [], at: '', generation }), state => {
      if (state.generation !== generation) return { value: false, changed: false };
      state.products = products; state.at = new Date().toISOString(); return { value: true, changed: true };
    });
    return { backupSaved: saved };
  } catch { return { backupSaved: false }; }
}
export const publicProducts = cache(async (): Promise<PublicProduct[]> => {
  let config: Connection | null = null;
  try { config = await settings(); if (!config) return []; return await fetchPublished(config); }
  catch {
    if (!config) return [];
    try { return sanitize((await readPrivate<{ products: PublicProduct[] }>(snapshotPath(config)))?.value.products ?? []); }
    catch { return []; }
  }
});
export async function uploadProductImage(file: File) {
  if (!(file instanceof File) || file.size < 12 || file.size > 4 * 1024 * 1024) throw new Error('PNG, JPEG या WebP image चुनिए; maximum 4 MB।');
  const bytes = Buffer.from(await file.arrayBuffer());
  const mime = bytes.subarray(0, 8).equals(Buffer.from([137,80,78,71,13,10,26,10])) ? 'image/png' :
    bytes[0] === 255 && bytes[1] === 216 && bytes[2] === 255 ? 'image/jpeg' :
    bytes.toString('ascii', 0, 4) === 'RIFF' && bytes.toString('ascii', 8, 12) === 'WEBP' ? 'image/webp' : '';
  if (!mime) throw new Error('सही PNG, JPEG या WebP image ही upload कीजिए।');
  const config = await requireSettings();
  const result = await request<{ document: { url: string } }>(config, '/assets/images/' + config.dataset,
    { method: 'POST', headers: { 'Content-Type': mime }, body: bytes });
  return imageUrl(result.document.url);
}
