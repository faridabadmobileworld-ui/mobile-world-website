/** Public analytics uses anonymous browser IDs, never customer/contact records. */
export const RETENTION_DAYS = 90;
export const SHARDS = 8;
export const EVENT_TYPES = ['call', 'whatsapp', 'directions', 'product', 'shortlist', 'compare', 'brand', 'category', 'search', 'navigation', 'video', 'finder', 'click'] as const;
export type EventType = typeof EVENT_TYPES[number];
export type Activity = { id: string; at: number; type: EventType; label: string };
export type Visit = {
  id: string; visitor: string; session: string; started: number; updated: number;
  path: string; source: string; medium: string; campaign: string; device: string;
  country: string; active: number; depth: number; sections: Record<string, number>;
  counts: Record<string, number>; events: Activity[];
};
export type DayStore = { version: 1; visits: Record<string, Visit>; limits: Record<string, { count: number; until: number }> };
export const emptyDay = (): DayStore => ({ version: 1, visits: {}, limits: {} });
export const istDay = (time = Date.now()) => new Date(time + 19_800_000).toISOString().slice(0, 10);
export const dayStart = (day: string) => Date.parse(`${day}T00:00:00+05:30`);
const idPattern = /^[a-zA-Z0-9_-]{16,64}$/;
const numeric = (v: unknown, max: number) => typeof v === 'number' && Number.isFinite(v) ? Math.max(0, Math.min(max, v)) : 0;
export function publicPath(value: unknown) {
  if (typeof value !== 'string') return '/';
  const path = value.split(/[?#]/)[0];
  return /^\/(?:products(?:\/[a-z0-9-]{1,90})?|posts(?:\/[a-z0-9-]{1,100})?|about|team|visit|contact|finance|repairing|returns|after-sales-support|privacy|terms|showcase)?\/?$/.test(path) ? path : '/other';
}
export function safeLabel(value: unknown, fallback = 'other') {
  if (typeof value !== 'string') return fallback;
  return value.replace(/[\w.+-]+@[\w.-]+\.[a-z]{2,}/gi, '[private]')
    .replace(/(?:\+?\d[\s().-]*){7,}/g, '[private]')
    .replace(/https?:\/\/\S+/gi, '[link]').replace(/[^\p{L}\p{M}\p{N}\s_:/+.–—-]/gu, '')
    .trim().slice(0, 90) || fallback;
}
/** Search reports contain recognised shopping terms, not arbitrary form text. */
export function searchTopic(value: string) {
  const words = value.toLowerCase().replace(/[^\p{L}\p{M}\p{N}\s+]/gu, ' ').split(/\s+/);
  const allowed = /^(apple|iphone|ipad|samsung|galaxy|xiaomi|redmi|google|pixel|vivo|oppo|motorola|moto|realme|nothing|tecno|oneplus|poco|iqoo|cmf|phone|mobile|smartphone|laptop|tablet|computer|tv|television|ac|fridge|refrigerator|washing|machine|inverter|battery|earbuds|neckband|headphone|speaker|watch|smartwatch|charger|cable|cover|case|kitchen|microwave|mixer|air|fryer|repair|repairing|exchange|emi|finance|camera|gaming|pro|max|ultra|plus|note|fold|flip|ram|storage|gb|tb|5g|4g|[1-9]\d{0,2}(gb|tb|c|t)?|मोबाइल|फ़ोन|फोन|लैपटॉप|टीवी|फ्रिज|चार्जर|बैटरी|वाशिंग|मशीन|एसी|मरम्मत)$/u;
  return [...new Set(words.filter(w => allowed.test(w)))].slice(0, 8).join(' ') || 'अन्य search';
}
// Match known old labels whose combining marks were lost, without guessing at
// unknown text or changing the stored events. New Hindi keeps its vowel marks.
const sectionKey = (value: string) => value.toLowerCase().replace(/\p{M}/gu, '').replace(/[^\p{L}\p{N}]/gu, '');
const sectionTitles = Object.fromEntries([
  ['mobile-world-video', 'Products का video'], ['mobile-world-rap', 'Mobile World Rap'],
  ['selected-models', 'Brands और selected models'], ['services', 'EMI, exchange और services'],
  ['current-offers', 'Current offers'], ['spin-wheel', 'Spin rewards'], ['phone-finder', 'Phone Finder'],
  ['category-products', 'Category के products'], ['buying-checklist', 'खरीदने से पहले checklist'],
  ['visit', 'दुकान की जानकारी'], ['festival-highlights', 'Festival highlights'],
  ['इस Diwali, ख़ुशियाँ घर लाइए।', 'Diwali slide'],
  ['Phone से पूरे घर तक. पसंद सबकी, जगह एक।', 'सभी Products slide'],
  ['देखिए, समझिए, फिर चुनिए।', 'Product catalogue'],
  ['खरीदारी से पहले category समझिए।', 'Category guides'],
  ['आपको क्या चाहिए?', 'Product categories'],
  ['सिर्फ़ ख़रीदारी नहीं, एक पहचान भी।', 'Customers और community'],
  ['Featured Post', 'Featured article'],
  ['आस्था का सफ़र।ख़ुशियों की उड़ान।', 'Diwali यात्रा'],
  ['थोड़ी जानकारी। बेहतर फ़ैसला।', 'ख़रीदारी की guides'],
].map(([key, title]) => [sectionKey(key), title]));
const sectionTitle = (name: string) => sectionTitles[sectionKey(name)] ?? name;
const actionTitles = Object.fromEntries([
  'ढूँढ़िए', 'पूरी जानकारी', 'इस model के बारे में पूछिए',
  'Festival animations रोकिए', 'Festival animations चलाइए', '02 सभी Products',
  'WhatsApp पर message कीजिए', 'अगला slide', 'पिछला slide', 'Video की आवाज़',
  'पूरी शर्तें जानिए', 'जानकारी बंद कीजिए',
].map(title => [sectionKey(title), title]));
const actionTitle = (label: string) => actionTitles[sectionKey(label)] ?? label.replace(/ क जनकर$/u, ' की जानकारी').replace(/ shortlist म रखए$/u, ' shortlist में रखिए').replace(/ shortlist स हटइए$/u, ' shortlist से हटाइए');
export function normalizeVisit(input: unknown, now = Date.now()): Visit | null {
  if (!input || typeof input !== 'object') return null;
  const r = input as Record<string, unknown>;
  if (![r.id, r.visitor, r.session].every(v => typeof v === 'string' && idPattern.test(v))) return null;
  if (typeof r.path !== 'string' || /^\/(admin|api)(\/|$)/.test(r.path)) return null;
  const started = typeof r.started === 'number' && r.started >= now - 12 * 3600_000 && r.started <= now + 30_000 ? Math.min(now, r.started) : now;
  const active = Math.round(numeric(r.active, Math.min(12 * 3600, Math.max(0, (now - started) / 1000 + 2))));
  const sections: Record<string, number> = {};
  if (r.sections && typeof r.sections === 'object') for (const [key, value] of Object.entries(r.sections).slice(0, 40)) sections[safeLabel(key)] = Math.round(numeric(value, active));
  const counts: Record<string, number> = {};
  if (r.counts && typeof r.counts === 'object') for (const [key, value] of Object.entries(r.counts).slice(0, 100)) {
    const [type, ...parts] = key.split('|');
    if (EVENT_TYPES.includes(type as EventType)) counts[`${type}|${type === 'search' ? searchTopic(parts.join('|')) : safeLabel(parts.join('|'))}`] = Math.round(numeric(value, 500));
  }
  const events: Activity[] = [];
  if (Array.isArray(r.events)) for (const raw of r.events.slice(-40)) {
    if (!raw || typeof raw !== 'object') continue;
    const e = raw as Record<string, unknown>;
    if (typeof e.id !== 'string' || !idPattern.test(e.id) || !EVENT_TYPES.includes(e.type as EventType)) continue;
    events.push({ id: e.id, at: Math.max(started, Math.min(now, typeof e.at === 'number' ? e.at : now)), type: e.type as EventType, label: e.type === 'search' ? searchTopic(String(e.label ?? '')) : safeLabel(e.label) });
  }
  return { id: String(r.id), visitor: String(r.visitor), session: String(r.session), started, updated: now,
    path: publicPath(r.path), source: safeLabel(r.source, 'direct'), medium: safeLabel(r.medium, 'none'), campaign: safeLabel(r.campaign, 'none'),
    device: ['mobile', 'tablet', 'desktop'].includes(String(r.device)) ? String(r.device) : 'unknown', country: '', active, depth: Math.round(numeric(r.depth, 100)), sections, counts, events };
}
export function mergeVisit(previous: Visit | undefined, incoming: Visit): Visit {
  if (!previous) return incoming;
  const maximums = (a: Record<string, number>, b: Record<string, number>) => Object.fromEntries([...new Set([...Object.keys(a), ...Object.keys(b)])].slice(0, 100).map(key => [key, Math.max(a[key] ?? 0, b[key] ?? 0)]));
  return { ...previous, updated: Math.max(previous.updated, incoming.updated), active: Math.max(previous.active, incoming.active), depth: Math.max(previous.depth, incoming.depth),
    sections: maximums(previous.sections, incoming.sections), counts: maximums(previous.counts, incoming.counts),
    events: [...new Map([...previous.events, ...incoming.events].map(e => [e.id, e])).values()].sort((a, b) => a.at - b.at).slice(-40) };
}
export function rangeDays(from: string, to: string, now = Date.now()) {
  if (![from, to].every(x => /^\d{4}-\d{2}-\d{2}$/.test(x) && Number.isFinite(dayStart(x)) && istDay(dayStart(x)) === x)) throw new Error('सही date range चुनिए।');
  const today = dayStart(istDay(now));
  if (dayStart(from) > dayStart(to) || dayStart(to) > today || dayStart(from) < today - (RETENTION_DAYS - 1) * 86400_000) throw new Error(`पिछले ${RETENTION_DAYS} दिनों के भीतर date range चुनिए।`);
  const result: string[] = [];
  for (let time = dayStart(from); time <= dayStart(to); time += 86400_000) result.push(istDay(time));
  return result;
}
export function summarize(visits: Visit[], days: string[], now = Date.now()) {
  // Explicit release checks are persisted for verification, never counted as customers.
  const rows = [...visits.filter(v => v.source !== 'internal-verification').reduce((m, v) => m.set(v.id, mergeVisit(m.get(v.id), v)), new Map<string, Visit>()).values()];
  const sessions = new Map<string, Visit[]>();
  for (const v of rows) sessions.set(v.session, [...(sessions.get(v.session) ?? []), v]);
  const totals: Record<string, number> = {};
  const topics = new Map<string, number>();
  for (const v of rows) for (const [rawKey, count] of Object.entries(v.counts)) { const [type, ...label] = rawKey.split('|'); const key = `${type}|${actionTitle(label.join('|'))}`; totals[type] = (totals[type] ?? 0) + count; topics.set(key, (topics.get(key) ?? 0) + count); }
  const grouped = (fn: (v: Visit) => string) => {
    const map = new Map<string, Visit[]>(); for (const v of rows) { const key = fn(v); map.set(key, [...(map.get(key) ?? []), v]); }
    return [...map].map(([label, entries]) => ({ label, views: entries.length, visitors: new Set(entries.map(v => v.visitor)).size, sessions: new Set(entries.map(v => v.session)).size, active: entries.reduce((a, v) => a + v.active, 0), depth: Math.round(entries.reduce((a, v) => a + v.depth, 0) / entries.length) })).sort((a, b) => b.views - a.views);
  };
  const sections = new Map<string, { active: number; views: number }>();
  for (const v of rows) {
    const pageSections = new Map<string, number>();
    for (const [name, active] of Object.entries(v.sections)) {
      if (active <= 0) continue;
      const title = sectionTitle(name);
      pageSections.set(title, Math.max(pageSections.get(title) ?? 0, active));
    }
    for (const [name, active] of pageSections) { const key = `${v.path} · ${name}`; const old = sections.get(key) ?? { active: 0, views: 0 }; sections.set(key, { active: old.active + active, views: old.views + 1 }); }
  }
  return { generatedAt: now, pageViews: rows.length, visitors: new Set(rows.map(v => v.visitor)).size, sessions: sessions.size,
    live: new Set(rows.filter(v => now - v.updated < 90_000 && v.active > 0).map(v => v.session)).size,
    active: rows.reduce((a, v) => a + v.active, 0), engagedSessions: [...sessions.values()].filter(v => v.length > 1 || v.reduce((a, x) => a + x.active, 0) >= 10 || v.some(x => ['call', 'whatsapp', 'directions'].some(t => Object.keys(x.counts).some(k => k.startsWith(t + '|') && x.counts[k] > 0)))).length,
    totals, pages: grouped(v => v.path), sources: grouped(v => `${v.source} / ${v.medium}`), campaigns: grouped(v => v.campaign), devices: grouped(v => v.device), countries: grouped(v => v.country || 'unknown'),
    sections: [...sections].map(([label, v]) => ({ label, ...v })).sort((a, b) => b.active - a.active),
    topics: [...topics].map(([key, count]) => ({ type: key.split('|')[0], label: key.split('|').slice(1).join('|'), count })).sort((a, b) => b.count - a.count),
    daily: days.map(day => { const entries = rows.filter(v => istDay(v.started) === day); return { day, views: entries.length, visitors: new Set(entries.map(v => v.visitor)).size, sessions: new Set(entries.map(v => v.session)).size, active: entries.reduce((a, v) => a + v.active, 0), contacts: entries.reduce((sum, v) => sum + Object.entries(v.counts).filter(([key]) => /^(call|whatsapp|directions)\|/.test(key)).reduce((a, [, count]) => a + count, 0), 0) }; }),
    hourly: Array.from({ length: 24 }, (_, hour) => ({ hour, views: rows.filter(v => new Date(v.started + 19_800_000).getUTCHours() === hour).length })),
    journeys: [...sessions].map(([id, entries]) => ({ id: id.slice(0, 10), started: Math.min(...entries.map(v => v.started)), updated: Math.max(...entries.map(v => v.updated)), active: entries.reduce((a, v) => a + v.active, 0), device: entries[0].device, source: entries[0].source, pages: entries.sort((a, b) => a.started - b.started).map(v => ({ path: v.path, active: v.active, depth: v.depth })), events: entries.flatMap(v => v.events.map(e => ({ ...e, label: actionTitle(e.label), path: v.path }))).sort((a, b) => a.at - b.at).slice(-40) })).sort((a, b) => b.updated - a.updated).slice(0, 100),
  };
}
export type AnalyticsReport = ReturnType<typeof summarize>;
