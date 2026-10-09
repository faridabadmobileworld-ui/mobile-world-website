import type { Metadata } from 'next';
import { adminSnapshot } from '../../spin-admin-actions';
import { SpinAdmin } from './SpinAdmin';
import './admin.css';
export const metadata: Metadata = { title: 'Private Rewards Dashboard', robots: { index: false, follow: false }, referrer: 'no-referrer' };
export const dynamic = 'force-dynamic';
export default async function SpinAdminPage() { return <SpinAdmin initial={await adminSnapshot()}/>; }
