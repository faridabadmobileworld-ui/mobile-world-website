import type { Metadata } from 'next';
import Link from 'next/link';
import { ownerAccess } from '@/app/spin-admin-actions';
import { readCampaigns } from '@/lib/campaigns/store';
import { CampaignEditor } from './CampaignEditor';
import '../analytics/analytics.css';
export const metadata: Metadata = { title: 'Campaigns · Owner Dashboard', robots: { index: false, follow: false }, referrer: 'no-referrer' };
export const dynamic = 'force-dynamic';
export default async function Page() {
  const access = await ownerAccess();
  return <div className="mw-analytics"><header className="ma-heading"><h1>Offers और campaigns</h1><Link href="/admin/analytics">← Analytics</Link></header>{access !== 'ready' ? <section className="ma-card"><h2>Owner login ज़रूरी है।</h2><p>Analytics, offers और rewards का एक ही private login है।</p><Link className="btn btn-d" href="/admin/analytics">Owner dashboard खोलिए</Link></section> : <CampaignEditor initial={await readCampaigns()}/>}</div>;
}
