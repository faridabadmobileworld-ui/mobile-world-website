import master from '@/data/mobile-specification-master.json';

export const specificationSections = master.sections;
export const specificationFields = specificationSections.flatMap(section => section.fields);
export type Variant = { _key: string; ram: string; storage: string; colour: string; image: string; imageVerified: boolean };
export type ProductDraft = {
  id: string; slug: string; brand: string; series: string; name: string; description: string;
  image: string; imageAlt: string; imageVerified: boolean; verified: boolean; verifiedAt: string;
  values: Record<string, string>; variants: Variant[]; sources: string[];
};
export type PublicProduct = Omit<ProductDraft, 'sources'> & { updatedAt: string };
export type EditorRecord = ProductDraft & { draftRevision: string; publishedRevision: string; publishedSlug: string };

function record(value: unknown): Record<string, unknown> {
  return value && typeof value === 'object' && !Array.isArray(value) ? value as Record<string, unknown> : {};
}
function text(value: unknown, max = 300) {
  const result = typeof value === 'string' ? value.trim() : '';
  if (result.length > max) throw new Error('Text की length कम कीजिए।');
  return result;
}
export function productId(value: unknown) {
  const id = text(value, 100);
  if (!/^[a-z0-9][a-z0-9-]{1,99}$/.test(id)) throw new Error('Model ID में छोटे English अक्षर, numbers और hyphen रखिए।');
  return id;
}
export function revision(value: unknown) {
  const result = text(value, 128);
  if (result && !/^[a-zA-Z0-9_-]+$/.test(result)) throw new Error('Revision सही नहीं है। Refresh कीजिए।');
  return result;
}
export function imageUrl(value: unknown) {
  const url = text(value, 1000);
  if (!url) return '';
  if (/^\/images\/[a-zA-Z0-9._/-]+\.(webp|png|jpe?g|avif)$/i.test(url) && !url.includes('..')) return url;
  try {
    const parsed = new URL(url);
    if (parsed.protocol === 'https:' && parsed.hostname === 'cdn.sanity.io' &&
        /^\/images\/[a-z0-9]+\/[a-z0-9_-]+\/[a-zA-Z0-9._-]+$/.test(parsed.pathname) &&
        !parsed.username && !parsed.password && !parsed.search && !parsed.hash) return parsed.href;
  } catch { /* Invalid URLs never become image sources. */ }
  throw new Error('Image upload कीजिए या existing /images/ file चुनिए।');
}
export function sourceUrl(value: unknown) {
  const result = text(value, 1000);
  try { const url = new URL(result); if (url.protocol === 'https:' && !url.username && !url.password) return url.href; } catch {}
  throw new Error('Official source का पूरा HTTPS link भरिए।');
}
export function blankProduct(id: string): ProductDraft {
  return { id: productId(id), slug: productId(id), brand: '', series: '', name: '', description: '',
    image: '', imageAlt: '', imageVerified: false, verified: false, verifiedAt: '',
    values: Object.fromEntries(specificationFields.map(field => [field.key, ''])), variants: [], sources: [] };
}
export function normalizeProduct(input: unknown): ProductDraft {
  const raw = record(input), original = record(raw.values), values: Record<string, string> = {};
  for (const field of specificationFields) {
    const value = original[field.key];
    const result = typeof value === 'boolean' ? (value ? 'Yes' : 'No') :
      typeof value === 'number' && Number.isFinite(value) ? String(value) : text(value, 500);
    if (/^(n\/?a|unknown|coming soon|contact store|[-—])$/i.test(result)) throw new Error(field.label + ': जानकारी नहीं है तो field बिल्कुल खाली रखें।');
    values[field.key] = result;
  }
  const brand = text(raw.brand, 80), name = text(raw.name, 120);
  values.spec_001 = brand; values.spec_002 = name;
  if (!Array.isArray(raw.variants) || raw.variants.length > 100) throw new Error('अधिकतम 100 actual variants जोड़िए।');
  const combinations = new Set<string>(), keys = new Set<string>();
  const variants = raw.variants.map((value): Variant => {
    const v = record(value), key = productId(v._key);
    const variant = { _key: key, ram: text(v.ram, 60), storage: text(v.storage, 60), colour: text(v.colour, 60),
      image: imageUrl(v.image), imageVerified: v.imageVerified === true };
    const combination = [variant.ram, variant.storage, variant.colour].join('|').toLowerCase();
    if (!variant.ram && !variant.storage && !variant.colour) throw new Error('खाली variant हटाइए या उसकी जानकारी भरिए।');
    if (combinations.has(combination) || keys.has(key)) throw new Error('Duplicate variant है। हर combination एक बार रखें।');
    combinations.add(combination); keys.add(key); return variant;
  });
  if (!Array.isArray(raw.sources) || raw.sources.length > 30) throw new Error('अधिकतम 30 verification sources रखें।');
  const sources = [...new Set(raw.sources.filter(Boolean).map(sourceUrl))];
  const verifiedAt = text(raw.verifiedAt, 10);
  if (verifiedAt && (!/^\d{4}-\d{2}-\d{2}$/.test(verifiedAt) || new Date(verifiedAt).toISOString().slice(0, 10) !== verifiedAt)) throw new Error('Verification date सही भरिए।');
  return { id: productId(raw.id), slug: productId(raw.slug), brand, series: text(raw.series, 100), name,
    description: text(raw.description, 2000), image: imageUrl(raw.image), imageAlt: text(raw.imageAlt, 200),
    imageVerified: raw.imageVerified === true, verified: raw.verified === true, verifiedAt, values, variants, sources };
}
export function validatePublication(product: ProductDraft) {
  if (!product.brand || !product.name || !product.image || !product.imageAlt) throw new Error('Brand, model name, verified image और alt text भरिए।');
  if (!product.verified || !product.imageVerified || !product.verifiedAt || !product.sources.length) throw new Error('India specifications, source, date और image verification पूरा करके Publish कीजिए।');
  if (product.verifiedAt > new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' })) throw new Error('Verification date भविष्य की नहीं हो सकती।');
  if (product.variants.some(v => v.image && !v.imageVerified)) throw new Error('हर variant image का model और colour verify कीजिए।');
}
export function publicProduct(product: ProductDraft, updatedAt: string): PublicProduct {
  // Explicit allowlist: neither internal prices nor source/admin metadata crosses this boundary.
  const values = Object.fromEntries(specificationFields.filter(field => field.id !== 7)
    .filter(field => product.values[field.key] !== '').map(field => [field.key, product.values[field.key]]));
  return { id: product.id, slug: product.slug, brand: product.brand, series: product.series, name: product.name,
    description: product.description, image: product.image, imageAlt: product.imageAlt, imageVerified: product.imageVerified,
    verified: product.verified, verifiedAt: product.verifiedAt, values,
    variants: product.variants.map(v => ({ _key: v._key, ram: v.ram, storage: v.storage, colour: v.colour,
      image: v.image, imageVerified: v.imageVerified })), updatedAt };
}
export function visibleSections(product: PublicProduct, variant?: Variant) {
  const values = { ...product.values };
  if (variant?.ram) values.spec_026 = variant.ram;
  if (variant?.storage) values.spec_028 = variant.storage;
  if (variant?.colour) values.spec_006 = variant.colour;
  return specificationSections.map(section => ({ ...section, fields: section.fields
    .filter(field => field.id !== 7 && values[field.key] !== undefined && values[field.key] !== '')
    .map(field => ({ ...field, value: values[field.key] })) })).filter(section => section.fields.length);
}
