export const SOURCES = ['Website', 'Google Maps', 'WhatsApp', 'Call', 'Walk-in', 'Instagram', 'YouTube', 'Other'] as const;
export const STAGES = ['Enquiry', 'Quoted', 'Visited', 'Sold', 'Lost'] as const;
export type Enquiry = { id: string; day: string; source: typeof SOURCES[number]; topic: string; stage: typeof STAGES[number]; amount: number | null; createdAt: number; updatedAt: number; revision: number };
export type EnquiryLedger = { entries: Record<string, Enquiry> };
export function calendarDay(value: unknown): value is string {
  return typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value) && new Date(value + 'T00:00:00Z').toISOString().slice(0, 10) === value;
}
export function normalizeEnquiry(input: unknown, today: string): Pick<Enquiry, 'day' | 'source' | 'topic' | 'stage' | 'amount'> {
  if (!input || typeof input !== 'object') throw new Error('Enquiry की जानकारी भरिए।');
  const r = input as Record<string, unknown>;
  if (!calendarDay(r.day) || r.day > today || r.day < '2020-01-01') throw new Error('सही तारीख़ चुनिए।');
  if (!SOURCES.includes(r.source as Enquiry['source']) || !STAGES.includes(r.stage as Enquiry['stage'])) throw new Error('Source और status चुनिए।');
  const topic = typeof r.topic === 'string' ? r.topic.trim() : '';
  if (!topic || topic.length > 100 || /[\w.+-]+@[\w.-]+|(?:\+?\d[\s().-]*){7,}|[<>\u0000-\u001f]/.test(topic)) throw new Error('केवल product या enquiry का विषय लिखिए; नाम, phone, email या निजी details नहीं।');
  const amount = r.amount === '' || r.amount == null ? null : Number(r.amount);
  if (amount !== null && (!Number.isFinite(amount) || amount <= 0 || amount > 10000000 || !/^\d+(?:\.\d{1,2})?$/.test(String(r.amount)))) throw new Error('बिक्री की सही रकम भरिए या खाली छोड़िए।');
  if (r.stage !== 'Sold' && amount !== null) throw new Error('रकम केवल confirmed Sold entry में भरिए।');
  return { day: r.day, source: r.source as Enquiry['source'], topic, stage: r.stage as Enquiry['stage'], amount };
}
export type SearchRow = { date?: string; page?: string; query?: string; clicks: number; impressions: number; position: number };
export type BusinessRow = { date: string; impressions: number; call_clicks: number; website_clicks: number; direction_requests: number };
export type GoogleReport = { version: 1; fetchedAt: number; from: string; to: string; search: SearchRow[]; pages: SearchRow[]; queries: SearchRow[]; business: BusinessRow[] };
export function normalizeGoogle(input: unknown): GoogleReport {
  if (!input || typeof input !== 'object') throw new Error('Google report format unavailable');
  const r = input as GoogleReport;
  if (r.version !== 1 || !calendarDay(r.from) || !calendarDay(r.to) || r.from > r.to || !Number.isFinite(r.fetchedAt)) throw new Error('Invalid report range');
  const metric = (v: unknown) => { const n = Number(v); if (v == null || !Number.isFinite(n) || n < 0) throw new Error('Incomplete Google metrics'); return n; };
  function search(rows: SearchRow[], dimension: 'date' | 'page' | 'query'): SearchRow[] {
    if (!Array.isArray(rows) || rows.length > 10000) throw new Error('Invalid Google rows');
    return rows.map(v => { const label = v[dimension]; if (typeof label !== 'string' || label.length > 2000 || (dimension === 'date' && (!calendarDay(label) || label < r.from || label > r.to))) throw new Error('Invalid Google dimension'); return { [dimension]: label, clicks: metric(v.clicks), impressions: metric(v.impressions), position: metric(v.position) }; });
  }
  if (!Array.isArray(r.business) || r.business.length > 400) throw new Error('Invalid profile report');
  const business = r.business.map(v => { if (!calendarDay(v.date) || v.date < r.from || v.date > r.to) throw new Error('Invalid profile date'); return { date: v.date, impressions: metric(v.impressions), call_clicks: metric(v.call_clicks), website_clicks: metric(v.website_clicks), direction_requests: metric(v.direction_requests) }; });
  const result = { version: 1 as const, fetchedAt: r.fetchedAt, from: r.from, to: r.to, search: search(r.search, 'date'), pages: search(r.pages, 'page'), queries: search(r.queries, 'query'), business };
  if (!result.search.length || !result.business.length) throw new Error('Google report is not ready; previous report retained');
  return result;
}
