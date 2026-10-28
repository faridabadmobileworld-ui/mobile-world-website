import { normalizeVisit } from '@/lib/analytics/core';
import { saveVisit } from '@/lib/analytics/store';
import { shop } from '@/data/shop';
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
const response = (status: number) => new Response(null, { status, headers: { 'Cache-Control': 'no-store' } });
export async function POST(request: Request) {
  const origin = request.headers.get('origin');
  const expected = process.env.NODE_ENV === 'production' ? new URL(shop.siteUrl).origin : new URL(request.url).origin;
  if (origin !== expected || request.headers.get('sec-fetch-site') === 'cross-site') return response(403);
  if (request.headers.get('dnt') === '1' || request.headers.get('sec-gpc') === '1' || /bot|crawl|spider|headless|lighthouse|pagespeed|monitor/i.test(request.headers.get('user-agent') ?? '')) return response(204);
  if (Number(request.headers.get('content-length') ?? 0) > 32_768) return response(413);
  try {
    const reader = request.body?.getReader();
    if (!reader) return response(400);
    let length = 0; const chunks: Uint8Array[] = [];
    while (true) { const chunk = await reader.read(); if (chunk.done) break; length += chunk.value.length; if (length > 32_768) { await reader.cancel(); return response(413); } chunks.push(chunk.value); }
    const raw = Buffer.concat(chunks).toString('utf8');
    let body: unknown; try { body = JSON.parse(raw); } catch { return response(400); }
    const visit = normalizeVisit(body);
    if (!visit) return response(400);
    visit.country = /^[A-Z]{2}$/.test(request.headers.get('x-vercel-ip-country') ?? '') ? request.headers.get('x-vercel-ip-country')! : '';
    const ok = await saveVisit(visit, request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown');
    return response(ok ? 204 : 429);
  } catch (error) {
    // Provider failures must be observable without logging visits, IDs or secrets.
    const name = error instanceof Error ? error.name : 'UnknownError';
    const message = error instanceof Error ? error.message.replace(/vercel_blob_rw_\S+|[A-Za-z0-9_-]{32,}|[\w.+-]+@[\w.-]+\.[a-z]{2,}/gi, '[redacted]').slice(0, 240) : 'No provider details';
    console.error('analytics_collect_failed', name, message);
    return response(503);
  }
}
