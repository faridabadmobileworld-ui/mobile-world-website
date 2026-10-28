import 'server-only';
import { readPrivate, transactPrivate } from '@/app/spin-store';
import { istDay } from '@/lib/analytics/core';
import { normalizeEnquiry, normalizeGoogle, type Enquiry, type EnquiryLedger, type GoogleReport } from './core';
const ledgerPath = 'business/enquiries-v1.json';
const googlePath = 'business/google-report-v1.json';
export async function enquiries() { return Object.values((await readPrivate<EnquiryLedger>(ledgerPath))?.value.entries ?? {}).sort((a, b) => b.day.localeCompare(a.day) || b.createdAt - a.createdAt); }
export async function saveEnquiry(id: string, input: unknown, revision: number) {
  if (!/^[a-f0-9-]{36}$/.test(id)) throw new Error('Enquiry reference गलत है।');
  const row = normalizeEnquiry(input, istDay());
  return transactPrivate<EnquiryLedger, Enquiry>(ledgerPath, () => ({ entries: {} }), state => {
    const previous = state.entries[id];
    if ((previous?.revision ?? 0) !== revision) throw new Error('दूसरे tab में entry बदली है। Refresh करके फिर कोशिश कीजिए।');
    if (!previous && Object.keys(state.entries).length >= 10000) throw new Error('Register की capacity पूरी है। Export लेकर support से संपर्क कीजिए।');
    const entry = { ...row, id, revision: revision + 1, createdAt: previous?.createdAt ?? Date.now(), updatedAt: Date.now() };
    state.entries[id] = entry; return { value: entry, changed: true };
  });
}
export async function saveGoogle(input: unknown) {
  const report = normalizeGoogle(input);
  return transactPrivate<{ report: GoogleReport | null }, GoogleReport>(googlePath, () => ({ report: null }), state => {
    if (state.report && state.report.fetchedAt > report.fetchedAt) return { value: state.report, changed: false };
    state.report = report; return { value: report, changed: true };
  });
}
export async function googleReport() {
  const saved = (await readPrivate<{ report: GoogleReport | null }>(googlePath))?.value.report;
  const seed = process.env.GOOGLE_REPORT_SEED ? normalizeGoogle(JSON.parse(process.env.GOOGLE_REPORT_SEED)) : null;
  if (seed && (!saved || seed.fetchedAt > saved.fetchedAt)) return saveGoogle(seed);
  return saved ?? null;
}
