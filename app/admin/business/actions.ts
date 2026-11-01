'use server';
import { requireOwnerAccess } from '@/app/spin-admin-actions';
import { enquiries, googleReport, saveEnquiry, setEnquiryArchived } from '@/lib/business/store';
import { archives } from '@/lib/analytics/archive';
import { istDay } from '@/lib/analytics/core';
import { connectWindsor, refreshGoogle, windsorConfigured } from '@/lib/business/windsor';
import { archiveBackup, inspectArchiveBackup, restoreArchiveBackup } from '@/lib/analytics/backup';
import { BusinessInputError, type BusinessResult } from '@/lib/business/result';
async function ownerChange<T>(work: () => Promise<T>): Promise<BusinessResult<T>> {
  await requireOwnerAccess();
  try { return { ok: true, data: await work() }; }
  catch (error) { return { ok: false, error: error instanceof BusinessInputError ? error.message : 'Storage अभी उपलब्ध नहीं है। Saved data सुरक्षित है; थोड़ी देर बाद retry कीजिए।' }; }
}
export async function businessReport() {
  await requireOwnerAccess();
  const [entries, google, configured, history] = await Promise.all([enquiries(), googleReport(), windsorConfigured(), archives(istDay(Date.now() - 364 * 86400000), istDay())]);
  return { entries, google, configured, history };
}
export async function updateEnquiry(id: string, input: unknown, revision: number) { return ownerChange(() => saveEnquiry(id, input, revision)); }
export async function archiveEnquiry(id: string, revision: number, archived: boolean) { return ownerChange(() => setEnquiryArchived(id, revision, archived)); }
export async function configureWindsor(key: string) { await requireOwnerAccess(); await connectWindsor(key); return { ok: true }; }
export async function refreshGoogleReport() { await requireOwnerAccess(); return refreshGoogle(); }
export async function downloadArchiveBackup(from: string, to: string) { return ownerChange(() => archiveBackup(from, to)); }
export async function previewArchiveRestore(text: string) { return ownerChange(() => inspectArchiveBackup(text)); }
export async function restoreDailyArchive(text: string) { return ownerChange(() => restoreArchiveBackup(text)); }
