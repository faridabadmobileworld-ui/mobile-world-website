import type { Metadata } from 'next';
import Link from 'next/link';
import { ownerAccess } from '@/app/spin-admin-actions';
import { productEditorState } from './actions';
import { ProductEditor } from './ProductEditor';
import '../analytics/analytics.css';
import './editor.css';
export const metadata: Metadata = { title: 'Product Editor · Mobile World', robots: { index: false, follow: false }, referrer: 'no-referrer' };
export const dynamic = 'force-dynamic';
export default async function Page() {
  if (await ownerAccess() !== 'ready') return <main className="mw-analytics"><section className="ma-card ma-login"><h1>Private Product Editor</h1><p>Products और specifications बदलने के लिए अपने existing owner password से login कीजिए।</p><Link href="/admin/analytics">Owner login →</Link><p>Login के बाद Product Editor खोलिए।</p></section></main>;
  let initial: Awaited<ReturnType<typeof productEditorState>> | null = null;
  try { initial = await productEditorState(); } catch { /* Render the recoverable error outside the data boundary. */ }
  if (!initial) return <main className="mw-analytics"><section className="ma-card"><h1>Product Editor</h1><p>Saved products अभी load नहीं हुए। Connection जाँचकर page refresh कीजिए। Existing website content सुरक्षित है।</p><Link href="/admin/analytics">Owner dashboard →</Link></section></main>;
  return <ProductEditor initial={initial} />;
}
