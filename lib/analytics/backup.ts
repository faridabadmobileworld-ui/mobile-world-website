import 'server-only';
import { BusinessInputError } from '@/lib/business/result';
import { BlobError, BlobPreconditionFailedError, put } from '@vercel/blob';
import { readPrivate } from '@/app/spin-store';
import { calendarDay } from '@/lib/business/core';
import { EVENT_TYPES, istDay, publicPath } from './core';
import { archives, type DailyArchive } from './archive';

const kind = 'mobile-world-daily-archive';
const site = 'www.mobileworldfaridabad.com';
const maxBytes = 900_000;
type Backup = { version: 1; kind: typeof kind; site: typeof site; exportedAt: number; rows: DailyArchive[] };
const invalid = () => new BusinessInputError('यह valid Mobile World daily-summary backup नहीं है। Original JSON file चुनिए।');
function object(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw invalid();
  return value as Record<string, unknown>;
}
function number(value: unknown, integer = true): number {
  if (typeof value !== 'number' || !Number.isFinite(value) || value < 0 || value > Number.MAX_SAFE_INTEGER || (integer && !Number.isSafeInteger(value))) throw invalid();
  return value;
}
function onlyKeys(row: Record<string, unknown>, keys: string[]) {
  if (Object.keys(row).some(key => !keys.includes(key))) throw invalid();
}
export function parseArchiveBackup(text: string): Backup {
  if (typeof text !== 'string' || Buffer.byteLength(text, 'utf8') > maxBytes) throw invalid();
  let input: unknown;
  try { input = JSON.parse(text); } catch { throw invalid(); }
  const data = object(input);
  onlyKeys(data, ['version', 'kind', 'site', 'exportedAt', 'rows']);
  if (data.version !== 1 || data.kind !== kind || data.site !== site || !Array.isArray(data.rows) || !data.rows.length || data.rows.length > 366) throw invalid();
  const days = new Set<string>();
  const rows = data.rows.map(raw => {
    const row = object(raw);
    onlyKeys(row, ['version', 'finalized', 'day', 'savedAt', 'pageViews', 'sessions', 'visitors', 'active', 'engagedSessions', 'totals', 'pages']);
    if (row.version !== 1 || !calendarDay(row.day) || row.day < '2020-01-01' || row.day >= istDay() || days.has(row.day) || (row.finalized !== undefined && typeof row.finalized !== 'boolean')) throw invalid();
    days.add(row.day);
    const totals = Object.fromEntries(Object.entries(object(row.totals)).map(([key, value]) => {
      if (!EVENT_TYPES.includes(key as typeof EVENT_TYPES[number])) throw invalid();
      return [key, number(value)];
    }));
    if (!Array.isArray(row.pages) || row.pages.length > 1000) throw invalid();
    const labels = new Set<string>();
    const pages = row.pages.map(rawPage => {
      const page = object(rawPage);
      onlyKeys(page, ['label', 'views', 'active']);
      if (typeof page.label !== 'string' || (page.label !== '/other' && publicPath(page.label) !== page.label) || labels.has(page.label)) throw invalid();
      labels.add(page.label);
      return { label: page.label, views: number(page.views), active: number(page.active, false) };
    });
    const result: DailyArchive = { version: 1, finalized: row.finalized === true, day: row.day, savedAt: number(row.savedAt), pageViews: number(row.pageViews), sessions: number(row.sessions), visitors: number(row.visitors), active: number(row.active, false), engagedSessions: number(row.engagedSessions), totals, pages };
    if (result.sessions > result.pageViews || result.visitors > result.sessions || result.engagedSessions > result.sessions) throw invalid();
    return result;
  }).sort((a, b) => a.day.localeCompare(b.day));
  return { version: 1, kind, site, exportedAt: number(data.exportedAt), rows };
}
export async function archiveBackup(from: string, to: string) {
  if (!calendarDay(from) || !calendarDay(to) || from > to || to > istDay() || Date.parse(to) - Date.parse(from) > 366 * 86400000) throw new BusinessInputError('अधिकतम एक वर्ष की सही backup अवधि चुनिए।');
  const rows = (await archives(from, to)).filter(row => row.day < istDay());
  if (!rows.length) throw new BusinessInputError('इस अवधि में कोई closed-day archive उपलब्ध नहीं है।');
  return JSON.stringify(parseArchiveBackup(JSON.stringify({ version: 1, kind, site, exportedAt: Date.now(), rows })));
}
export async function inspectArchiveBackup(text: string) {
  const data = parseArchiveBackup(text);
  let existing = 0;
  for (let i = 0; i < data.rows.length; i += 8) {
    const batch = await Promise.all(data.rows.slice(i, i + 8).map(row => readPrivate<DailyArchive>(`analytics/archive/v1/${row.day}.json`)));
    existing += batch.filter(Boolean).length;
  }
  return { days: data.rows.length, from: data.rows[0].day, to: data.rows.at(-1)!.day, existing, missing: data.rows.length - existing };
}
export async function restoreArchiveBackup(text: string) {
  // Validate the complete file before making the first write. Existing days are
  // never overwritten, including when maintenance races this restore.
  const { rows } = parseArchiveBackup(text);
  let restored = 0, skipped = 0, failed = 0;
  for (let i = 0; i < rows.length; i += 4) {
    const results = await Promise.all(rows.slice(i, i + 4).map(async row => {
      const path = `analytics/archive/v1/${row.day}.json`;
      try {
        if (await readPrivate<DailyArchive>(path)) return 'skipped';
        await put(path, JSON.stringify({ ...row, finalized: true }), { access: 'private', contentType: 'application/json', addRandomSuffix: false, allowOverwrite: false, cacheControlMaxAge: 60 });
        return 'restored';
      } catch (error) {
        if (error instanceof BlobPreconditionFailedError || error instanceof BlobError && /already exists/i.test(error.message)) return 'skipped';
        return 'failed';
      }
    }));
    restored += results.filter(value => value === 'restored').length;
    skipped += results.filter(value => value === 'skipped').length;
    failed += results.filter(value => value === 'failed').length;
  }
  return { restored, skipped, failed };
}
