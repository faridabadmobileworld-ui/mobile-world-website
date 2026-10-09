'use client';
import { useState, useSyncExternalStore } from 'react';
import Link from 'next/link';
import { adminLogin, adminLogout, adminSnapshot, inspectAdminCoupon, redeemAdminCoupon, setupAdmin } from '../../spin-admin-actions';
import type { Sale } from '../../spin-ledger-core';

type Snapshot = Awaited<ReturnType<typeof adminSnapshot>>;
type Inspection = Awaited<ReturnType<typeof inspectAdminCoupon>>;
const subscribe = (cb: () => void) => { window.addEventListener('hashchange', cb); return () => window.removeEventListener('hashchange', cb); };
const hashKey = () => new URLSearchParams(window.location.hash.slice(1)).get('setup') ?? '';
const date = (value: string) => new Date(value).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
const csvCell = (v: unknown) => { let value = String(v ?? ''); if (/^[=+@\-\t\r]/.test(value)) value = "'" + value; return '"' + value.replace(/"/g, '""') + '"'; };

export function SpinAdmin({ initial }: { initial: Snapshot }) {
  const [data, setData] = useState(initial);
  const setupKey = useSyncExternalStore(subscribe, hashKey, () => '');
  const [manualKey, setManualKey] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(0);
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [inspection, setInspection] = useState<Inspection | null>(null);
  const [sale, setSale] = useState<Sale>({ bill: '', line: 1, product: '', category: 'mobile', amount: 0 });
  async function refresh() { setData(await adminSnapshot()); }
  async function run(action: () => Promise<void>) { if (busy) return; setBusy(true); setMessage(''); try { await action(); } catch { setMessage('Connection में दिक़्क़त है। फिर कोशिश कीजिए।'); } finally { setBusy(false); } }
  const entries = data.state === 'ready' ? data.entries : [];
  const filtered = entries.filter(e => `${e.phone} ${e.code} ${e.reward} ${e.sale?.bill ?? ''}`.toLowerCase().includes(query.toLowerCase()));
  const visible = filtered.slice(page * 50, (page + 1) * 50);
  const used = entries.filter(e => e.redeemedAt).length;
  function exportCsv() {
    const rows = [['Mobile number', 'Reward', 'Code', 'Created IST', 'Status', 'Redeemed IST', 'Bill', 'Bill line', 'Product', 'Amount'], ...filtered.map(e => [e.phone, e.reward, e.code, date(e.createdAt), e.redeemedAt ? 'Used' : 'Unused', e.redeemedAt ? date(e.redeemedAt) : '', e.sale?.bill, e.sale?.line, e.sale?.product, e.sale?.amount])];
    const url = URL.createObjectURL(new Blob(['\ufeff' + rows.map(row => row.map(csvCell).join(',')).join('\r\n')], { type: 'text/csv;charset=utf-8' }));
    const link = document.createElement('a'); link.href = url; link.download = `Mobile-World-Rewards-${new Date().toISOString().slice(0, 10)}.csv`; link.click(); URL.revokeObjectURL(url);
  }
  return <div className="spin-admin">
    <header className="admin-heading"><Link href="/" className="admin-brand">MW<span>MOBILE WORLD<small>PRIVATE REWARDS DESK</small></span></Link>{data.state === 'ready' && <button onClick={() => run(async () => { await adminLogout(); await refresh(); })} disabled={busy}>Log out</button>}</header>
    <div className="admin-content"><p className="admin-kicker">DIWALI 2026 · OWNER ACCESS</p><h1>आपके customers.<br/><span>हर reward का record।</span></h1>
      {data.state === 'unavailable' ? <div className="admin-card"><h2>Dashboard अभी जुड़ रहा है।</h2><p>Private storage की connection जाँचिए और page refresh कीजिए। Customer data इस page पर public नहीं है।</p><button onClick={() => run(refresh)}>फिर जाँचिए</button></div> : data.state !== 'ready' ? <form className="admin-card admin-login" onSubmit={event => { event.preventDefault(); run(async () => { const response = data.state === 'setup' ? await setupAdmin(setupKey || manualKey, password) : await adminLogin(password); setMessage(response.message); if (response.ok) { setPassword(''); window.history.replaceState(null, '', window.location.pathname); await refresh(); } }); }}>
        <span className="admin-lock" aria-hidden="true">✦</span><h2>{data.state === 'setup' ? 'अपना private dashboard खोलिए।' : 'Welcome back, Tarun जी।'}</h2><p>{data.state === 'setup' ? 'पहली बार अपना password तय कीजिए। आगे इसी से login होगा।' : 'Customers का record देखने के लिए owner password डालिए।'}</p>
        {data.state === 'setup' && !setupKey && <label>Owner setup key<input type="password" autoComplete="off" value={manualKey} onChange={e => setManualKey(e.target.value)} required/></label>}
        <label>{data.state === 'setup' ? 'नया password · कम से कम 14 characters' : 'Owner password'}<input type="password" autoComplete={data.state === 'setup' ? 'new-password' : 'current-password'} minLength={data.state === 'setup' ? 14 : undefined} maxLength={200} value={password} onChange={e => setPassword(e.target.value)} required/></label><button className="admin-primary" disabled={busy}>{busy ? 'कृपया रुकिए…' : data.state === 'setup' ? 'Dashboard शुरू कीजिए' : 'Login कीजिए'}</button>
      </form> : <>
        <div className="admin-stats"><article><span>कुल ENTRIES</span><strong>{entries.length}</strong></article><article><span>इस्तेमाल हुए</span><strong>{used}</strong></article><article><span>बाक़ी REWARDS</span><strong>{entries.length - used}</strong></article></div>
        <section className="admin-card admin-redeem"><div><p className="admin-kicker">COUNTER पर</p><h2>Code जाँचिए, फिर reward दीजिए।</h2></div><form className="admin-check" onSubmit={e => { e.preventDefault(); run(async () => { setInspection(await inspectAdminCoupon(code, phone)); }); }}><label>Mobile number<input type="tel" inputMode="tel" value={phone} onChange={e => { setPhone(e.target.value); setInspection(null); }} required maxLength={16}/></label><label>Reward code<input value={code} onChange={e => { setCode(e.target.value); setInspection(null); }} required maxLength={70}/></label><button disabled={busy}>Code जाँचिए</button></form>
        {inspection && <div className="admin-inspection" role="status">{!inspection.ok ? inspection.message : `${inspection.label} · ${inspection.redeemed ? 'पहले इस्तेमाल हुआ · ' + date(inspection.redeemedAt!) : 'Valid code · अभी इस्तेमाल नहीं हुआ'}`}</div>}
        {inspection?.ok && !inspection.redeemed && <form className="admin-sale" onSubmit={e => { e.preventDefault(); run(async () => { const response = await redeemAdminCoupon(code, phone, sale); setMessage(response.message); if (response.ok) { setInspection(null); setCode(''); setPhone(''); await refresh(); } }); }}><p>Customer के number का access जाँचिए। सही bill line चुनकर नीचे confirm कीजिए। {inspection.coupon.campaign.endsWith('v1') && 'यह पुराना code है; उसके मूल benefits लागू रहेंगे।'}</p><label>Bill number<input required maxLength={80} value={sale.bill} onChange={e => setSale({ ...sale, bill: e.target.value })}/></label><label>Bill में product की line<input type="number" min="1" max="999" required value={sale.line} onChange={e => setSale({ ...sale, line: Number(e.target.value) })}/></label><label>Product / model<input required maxLength={120} value={sale.product} onChange={e => setSale({ ...sale, product: e.target.value })}/></label><label>Category<select value={sale.category} onChange={e => setSale({ ...sale, category: e.target.value })}><option value="mobile">Mobile</option><option value="laptop">Laptop</option><option value="electronics">Electronics</option><option value="home-appliance">Home Appliance</option>{inspection.coupon.campaign.endsWith('v1') && inspection.coupon.rewardId === 'neckband' && <option value="legacy-gift">पुराना gift · no purchase</option>}</select></label><label>इस product का bill amount ₹<input type="number" min={inspection.coupon.campaign.endsWith('v1') ? '0' : '5000.01'} step="0.01" required value={sale.amount || ''} onChange={e => setSale({ ...sale, amount: Number(e.target.value) })}/></label><button className="admin-primary" disabled={busy}>{busy ? 'Record save हो रहा है…' : 'Confirm · Reward इस्तेमाल हुआ'}</button></form>}
        </section>
        <section className="admin-card"><div className="admin-table-heading"><div><p className="admin-kicker">PRIVATE CUSTOMER RECORD</p><h2>सभी entries</h2></div><div><button onClick={() => run(refresh)} disabled={busy}>Refresh</button><button onClick={exportCsv}>CSV download</button></div></div><label className="admin-search">Number, code या bill ढूँढ़िए<input type="search" value={query} onChange={e => { setQuery(e.target.value); setPage(0); }} placeholder="Search records"/></label>
        {entries.length === 0 ? <div className="admin-empty"><span>✦</span><h3>पहली entry का इंतज़ार है।</h3><p>Customer spin करते ही उसका number, reward और code यहाँ सुरक्षित दिखेगा।</p></div> : <><div className="admin-table-scroll"><table><thead><tr><th>Mobile / तारीख़</th><th>Reward / code</th><th>Status</th><th>Counter</th></tr></thead><tbody>{visible.map(e => <tr key={e.id}><td><strong>{e.phone}</strong><small>{date(e.createdAt)}</small></td><td>{e.reward}<code>{e.code}</code></td><td><span className={e.redeemedAt ? 'admin-used' : 'admin-unused'}>{e.redeemedAt ? 'Used' : 'Unused'}</span>{e.sale && <small>Bill {e.sale.bill} · Line {e.sale.line}</small>}</td><td><button disabled={Boolean(e.redeemedAt) || busy} onClick={() => run(async () => { setPhone(e.phone); setCode(e.code); setInspection(await inspectAdminCoupon(e.code, e.phone)); document.querySelector('.admin-redeem')?.scrollIntoView({ behavior: 'smooth', block: 'start' }); })}>जाँचिए</button></td></tr>)}</tbody></table></div><div className="admin-pages"><button disabled={page === 0} onClick={() => setPage(p => p - 1)}>पिछला page</button><span>{filtered.length} records · Page {page + 1}</span><button disabled={(page + 1) * 50 >= filtered.length} onClick={() => setPage(p => p + 1)}>अगला page</button></div></>}
        </section>
      </>}
      {message && <p className="admin-message" role="status">{message}</p>}
      <footer>Mobile World · Customer numbers केवल owner login के बाद उपलब्ध हैं।</footer>
    </div>
  </div>;
}
