import { timingSafeEqual } from 'node:crypto';
import { maintainAnalytics } from '@/lib/analytics/store';
import { googleReport } from '@/lib/business/store';
import { refreshGoogle } from '@/lib/business/windsor';
export const dynamic = 'force-dynamic';
export const maxDuration = 60;
export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  const received = Buffer.from(request.headers.get('authorization') ?? '');
  const expected = Buffer.from('Bearer ' + (secret ?? ''));
  if (!secret || secret.length < 32 || received.length !== expected.length || !timingSafeEqual(received, expected)) return new Response('Unauthorized', { status: 401 });
  try {
    const [, google] = await Promise.all([maintainAnalytics(), (async () => { await googleReport(); return refreshGoogle(); })()]);
    return Response.json({ archived: true, google }, { headers: { 'Cache-Control': 'no-store' } });
  } catch { return Response.json({ archived: false, error: 'Maintenance failed; retained records will be retried.' }, { status: 503 }); }
}
