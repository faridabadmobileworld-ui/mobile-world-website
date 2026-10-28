import 'server-only';
import { createHmac } from 'node:crypto';
import { list, del } from '@vercel/blob';
import { unstable_cache } from 'next/cache';
import { archiveDay } from './archive';
import { readPrivate, spinSecret, transactPrivate } from '@/app/spin-store';
import { emptyDay, istDay, rangeDays, mergeVisit, summarize, SHARDS, RETENTION_DAYS, type Visit, type DayStore } from './core';

const root = 'analytics/v1/';
const hash = (kind: string, value: string) => createHmac('sha256', spinSecret()).update(`analytics:${kind}:${value}`).digest('hex');
export async function saveVisit(visit: Visit, ip: string) {
  const now = Date.now();
  const day = istDay(visit.started);
  const visitor = hash('visitor', visit.visitor), session = hash('session', visit.session), id = hash('view', visit.id);
  const ipKey = hash('rate', `${istDay(now)}:${ip}`);
  const shard = parseInt(ipKey.slice(0, 4), 16) % SHARDS;
  const path = `${root}${day}/${shard}.json`;
  return transactPrivate<DayStore, boolean>(path, emptyDay, state => {
    for (const [key, value] of Object.entries(state.limits)) if (value.until <= now) delete state.limits[key];
    const rate = state.limits[ipKey] ?? { count: 0, until: now + 60_000 };
    if (rate.count >= 120 || Object.keys(state.limits).length > 2000) return { value: false, changed: false };
    const old = state.visits[id];
    if (!old && Object.keys(state.visits).length >= 1000) throw new Error('analytics_capacity');
    state.limits[ipKey] = { ...rate, count: rate.count + 1 };
    state.visits[id] = mergeVisit(old, { ...visit, id, visitor, session, events: visit.events.map(e => ({ ...e, id: hash('event', e.id).slice(0, 24) })) });
    return { value: true, changed: true };
  });
}
async function readDay(day: string) {
  const shards = await Promise.all(Array.from({ length: SHARDS }, (_, i) => readPrivate<DayStore>(`${root}${day}/${i}.json`)));
  return shards.flatMap(s => Object.values(s?.value?.visits ?? {}));
}
const readHistoricalDay = unstable_cache(readDay, ['mw-analytics-history-v1'], { revalidate: 3600 });
export async function report(from: string, to: string) {
  const days = rangeDays(from, to), now = Date.now();
  const visits: Visit[] = [];
  // Bound storage concurrency. Today/yesterday remain uncached for late beacons.
  for (let i = 0; i < days.length; i += 3) {
    const records = await Promise.all(days.slice(i, i + 3).map(d => d >= istDay(now - 86400_000) ? readDay(d) : readHistoricalDay(d)));
    visits.push(...records.flat());
  }
  return summarize(visits, days, now);
}
/** Save aggregate-only history first. A failed archive must never delete raw data. */
export async function pruneAnalytics() {
  const cutoff = istDay(Date.now() - (RETENTION_DAYS - 1) * 86400_000);
  let cursor: string | undefined;
  const expired = new Map<string, string[]>();
  do {
    const batch = await list({ prefix: root, limit: 1000, cursor });
    for (const blob of batch.blobs) {
      const suffix = blob.pathname.slice(root.length), day = suffix.slice(0, 10);
      if (/^\d{4}-\d{2}-\d{2}\/\d+\.json$/.test(suffix) && day < cutoff) expired.set(day, [...(expired.get(day) ?? []), blob.url]);
    }
    cursor = batch.hasMore ? batch.cursor : undefined;
  } while (cursor);
  for (const [day, urls] of expired) {
    await archiveDay(day, await readDay(day), true);
    await del(urls);
  }
}
export async function maintainAnalytics() {
  // The seven closed days are refreshed to include late updates to sessions.
  for (let offset = 1; offset <= 7; offset++) {
    const day = istDay(Date.now() - offset * 86400_000);
    const visits = await readDay(day);
    if (visits.length) await archiveDay(day, visits);
  }
  await pruneAnalytics();
}
