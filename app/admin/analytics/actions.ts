'use server';
import { after } from 'next/server';
import { requireOwnerAccess } from '@/app/spin-admin-actions';
import { report, maintainAnalytics } from '@/lib/analytics/store';
import { readPrivate, transactPrivate } from '@/app/spin-store';
import { istDay } from '@/lib/analytics/core';

export async function analyticsReport(from: string, to: string) {
  await requireOwnerAccess();
  const data = await report(from, to);
  after(async () => {
    try {
      const path = 'analytics-maintenance.json';
      if ((await readPrivate<{ day: string }>(path))?.value.day === istDay()) return;
      await maintainAnalytics();
      await transactPrivate(path, () => ({ day: '' }), s => { s.day = istDay(); return { value: true, changed: true }; });
    } catch { /* Failed cleanup is retried on a later authenticated refresh. */ }
  });
  return data;
}
