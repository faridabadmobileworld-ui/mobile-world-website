import 'server-only';
import { list } from '@vercel/blob';
import { readPrivate, transactPrivate } from '@/app/spin-store';
import { summarize, type Visit } from './core';
export type DailyArchive = { version: 1; finalized?: boolean; day: string; savedAt: number; pageViews: number; sessions: number; visitors: number; active: number; engagedSessions: number; totals: Record<string, number>; pages: { label: string; views: number; active: number }[] };
const prefix = 'analytics/archive/v1/';
export async function archiveDay(day: string, visits: Visit[], finalize = false) {
  const report = summarize(visits, [day]);
  const value: DailyArchive = { version: 1, finalized: finalize, day, savedAt: Date.now(), pageViews: report.pageViews, sessions: report.sessions, visitors: report.visitors, active: report.active, engagedSessions: report.engagedSessions, totals: report.totals, pages: report.pages.map(p => ({ label: p.label, views: p.views, active: p.active })) };
  await transactPrivate<DailyArchive, boolean>(`${prefix}${day}.json`, () => ({ ...value, finalized: false }), state => { if (state.finalized) return { value: true, changed: false }; Object.assign(state, value); return { value: true, changed: true }; });
  return value;
}
export async function archives(from: string, to: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(from) || !/^\d{4}-\d{2}-\d{2}$/.test(to) || from > to || Date.parse(to) - Date.parse(from) > 366 * 86400000) throw new Error('अधिकतम एक वर्ष की सही अवधि चुनिए।');
  const paths: string[] = []; let cursor: string | undefined;
  do { const batch = await list({ prefix, limit: 1000, cursor }); paths.push(...batch.blobs.map(b => b.pathname).filter(p => p.slice(prefix.length, -5) >= from && p.slice(prefix.length, -5) <= to)); cursor = batch.hasMore ? batch.cursor : undefined; } while (cursor);
  const rows: DailyArchive[] = [];
  for (let i = 0; i < paths.length; i += 8) { const batch = await Promise.all(paths.slice(i, i + 8).map(p => readPrivate<DailyArchive>(p))); rows.push(...batch.flatMap(b => b ? [b.value] : [])); }
  return rows.sort((a, b) => b.day.localeCompare(a.day));
}
