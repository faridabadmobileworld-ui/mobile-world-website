import type { Metadata } from 'next';
import { ownerAccess } from '@/app/spin-admin-actions';
import { AnalyticsDashboard } from './AnalyticsDashboard';
import './analytics.css';
export const metadata: Metadata = { title: 'Website Analytics · Owner Dashboard', robots: { index: false, follow: false }, referrer: 'no-referrer' };
export const dynamic = 'force-dynamic';
export default async function Page() { return <AnalyticsDashboard access={await ownerAccess()} />; }
