'use server';
import { requireOwnerAccess } from '@/app/spin-admin-actions';
import { enquiries, googleReport, saveEnquiry } from '@/lib/business/store';
import { archives } from '@/lib/analytics/archive';
import { istDay } from '@/lib/analytics/core';
import { connectWindsor, refreshGoogle, windsorConfigured } from '@/lib/business/windsor';
export async function businessReport() {
  await requireOwnerAccess();
  const [entries, google, configured, history] = await Promise.all([enquiries(), googleReport(), windsorConfigured(), archives(istDay(Date.now() - 364 * 86400000), istDay())]);
  return { entries, google, configured, history };
}
export async function updateEnquiry(id: string, input: unknown, revision: number) { await requireOwnerAccess(); return saveEnquiry(id, input, revision); }
export async function configureWindsor(key: string) { await requireOwnerAccess(); await connectWindsor(key); return { ok: true }; }
export async function refreshGoogleReport() { await requireOwnerAccess(); return refreshGoogle(); }
