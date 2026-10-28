import type { Metadata } from 'next';
import { ownerAccess } from '@/app/spin-admin-actions';
import Link from 'next/link';
import { BusinessDashboard } from './BusinessDashboard';
import '../analytics/analytics.css';
export const metadata: Metadata = { title: 'Google & Sales · Private Business Desk', robots: { index: false, follow: false }, referrer: 'no-referrer' };
export const dynamic = 'force-dynamic';
export default async function Page() {
  if (await ownerAccess() !== 'ready') return <main className="mw-analytics"><section className="ma-card ma-login"><h1>Private Business Desk</h1><p>Google reports, enquiries और archives देखने के लिए owner login कीजिए। Analytics वाला ही password है।</p><Link href="/admin/analytics">Owner login →</Link><p>Login के बाद ऊपर Google · Enquiries · Archives खोलिए।</p></section></main>;
  return <BusinessDashboard />;
}
