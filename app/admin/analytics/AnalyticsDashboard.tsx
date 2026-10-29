'use client';
import { useEffect, useState, useSyncExternalStore } from 'react';
import Link from 'next/link';
import { adminLogin, adminLogout, setupAdmin } from '@/app/spin-admin-actions';
import { istDay, dayStart, RETENTION_DAYS, type AnalyticsReport } from '@/lib/analytics/core';
import { analyticsReport } from './actions';

type Access = 'ready' | 'login' | 'setup' | 'unavailable';
const number = (n: number) => new Intl.NumberFormat('en-IN').format(n);
const duration = (n: number) => n < 60 ? `${Math.round(n)} sec` : `${Math.floor(n / 60)} min ${Math.round(n % 60)} sec`;
const time = (n: number) => new Date(n).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
const subscribe = (fn: () => void) => { window.addEventListener('hashchange', fn); return () => window.removeEventListener('hashchange', fn); };
const getSetup = () => new URLSearchParams(location.hash.slice(1)).get('setup') ?? '';
const csvCell = (v: unknown) => `"${String(v ?? '').replace(/^[=+@\-\t\r]/, "'$&").replace(/"/g, '""')}"`;
function download(name: string, rows: unknown[][]) { const url = URL.createObjectURL(new Blob(['\ufeff' + rows.map(row => row.map(csvCell).join(',')).join('\r\n')], { type: 'text/csv;charset=utf-8' })); const a = document.createElement('a'); a.href = url; a.download = name; a.click(); URL.revokeObjectURL(url); }

export function AnalyticsDashboard({ access: initial }: { access: Access }) {
  const [access, setAccess] = useState(initial), [password, setPassword] = useState(''), [key, setKey] = useState('');
  const setupLink = useSyncExternalStore(subscribe, getSetup, () => '');
  const today = istDay(), [from, setFrom] = useState(today), [to, setTo] = useState(today);
  const [preset, setPreset] = useState('today'), [refresh, setRefresh] = useState(0), [auto, setAuto] = useState(true);
  const [data, setData] = useState<AnalyticsReport | null>(null), [error, setError] = useState(''), [busy, setBusy] = useState(false);
  const [tab, setTab] = useState('overview');
  useEffect(() => {
    if (access !== 'ready') return;
    let cancelled = false, pending = false;
    async function load() {
      if (pending || document.hidden) return; pending = true;
      try { const result = await analyticsReport(from, to); if (!cancelled) { setData(result); setError(''); } }
      catch { if (!cancelled) setError('Report नहीं मिली। Connection, date range या owner login जाँचकर Refresh कीजिए। पुराने आँकड़ों को live न मानें।'); }
      finally { pending = false; if (!cancelled) setBusy(false); }
    }
    void load(); const timer = auto ? setInterval(() => { void load(); }, 30_000) : undefined;
    const show = () => { if (!document.hidden) void load(); }; document.addEventListener('visibilitychange', show);
    return () => { cancelled = true; clearInterval(timer); document.removeEventListener('visibilitychange', show); };
  }, [access, from, to, refresh, auto]);
  function dates(value: string) {
    setPreset(value); setData(null);
    const end = istDay(); setTo(end);
    setFrom(value === 'today' ? end : value === 'yesterday' ? istDay(dayStart(end) - 86400_000) : value === 'month' ? end.slice(0, 8) + '01' : istDay(dayStart(end) - (value === '7' ? 6 : 29) * 86400_000));
    if (value === 'yesterday') setTo(istDay(dayStart(end) - 86400_000));
  }
  function applyDates(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const values = new FormData(event.currentTarget);
    const start = String(values.get('from') ?? ''), end = String(values.get('to') ?? '');
    const earliest = istDay(dayStart(today) - (RETENTION_DAYS - 1) * 86400_000);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(start) || !/^\d{4}-\d{2}-\d{2}$/.test(end) || start > end || start < earliest || end > today) {
      setError('पिछले 90 दिनों में शुरुआत और अंत की सही तारीख़ चुनिए। शुरुआत की तारीख़ अंत से आगे नहीं हो सकती।');
      return;
    }
    setError(''); setPreset('custom'); setData(null); setBusy(true);
    setFrom(start); setTo(end); setRefresh(value => value + 1);
  }
  async function login(event: React.FormEvent) {
    event.preventDefault(); setBusy(true); setError('');
    try { const r = access === 'setup' ? await setupAdmin(setupLink || key, password) : await adminLogin(password);
      if (!r.ok) setError(r.message); else { setPassword(''); setKey(''); history.replaceState(null, '', location.pathname); setAccess('ready'); }
    } catch { setError('Login नहीं हो पाया। फिर कोशिश कीजिए।'); } finally { setBusy(false); }
  }
  const stats = data ? [
    ['Visits / sessions', number(data.sessions), '30 मिनट की inactivity पर नया session'],
    ['Unique browsers', number(data.visitors), 'अलग browser IDs; लोगों की निश्चित गिनती नहीं'],
    ['Page views', number(data.pageViews), 'खुले हुए public pages'],
    ['Average active time', duration(data.sessions ? data.active / data.sessions : 0), 'प्रति session · background/idle समय अलग'],
    ['Call clicks', number(data.totals.call ?? 0), 'Call button दबा; actual call की पुष्टि नहीं'],
    ['WhatsApp clicks', number(data.totals.whatsapp ?? 0), 'WhatsApp खोला; message की पुष्टि नहीं'],
    ['Directions clicks', number(data.totals.directions ?? 0), 'Maps खोला; store visit की पुष्टि नहीं'],
    ['Engaged sessions', number(data.engagedSessions), '10 sec, दूसरा page या contact action'],
  ] : [];
  function exportReport() { if (!data) return; download(`Mobile-World-Analytics-${from}-${to}.csv`, [
    ['Report', 'From IST', 'To IST', 'Sessions', 'Unique browsers', 'Page views', 'Active seconds', 'Call clicks', 'WhatsApp clicks', 'Directions clicks'],
    ['TOTAL', from, to, data.sessions, data.visitors, data.pageViews, data.active, data.totals.call ?? 0, data.totals.whatsapp ?? 0, data.totals.directions ?? 0], [],
    ['Day IST', 'Sessions', 'Unique browsers', 'Page views', 'Active seconds', 'Contact clicks'], ...data.daily.map(d => [d.day, d.sessions, d.visitors, d.views, d.active, d.contacts]), [],
    ['Page', 'Views', 'Unique browsers', 'Active seconds', 'Average scroll percent'], ...data.pages.map(p => [p.label, p.views, p.visitors, p.active, p.depth]), [],
    ['Action', 'Topic', 'Count'], ...data.topics.map(t => [t.type, t.label, t.count]), [],
    ['Section', 'Viewed in centre', 'Active seconds'], ...data.sections.map(s => [s.label, s.views, s.active]),
  ]); }
  return <div className="mw-analytics">
    <header className="ma-heading"><Link href="/" className="ma-brand"><span>MW</span><div>Mobile World<small>PRIVATE BUSINESS DESK</small></div></Link><nav aria-label="Owner dashboard"><Link href="/admin/products">Product Editor</Link><Link href="/admin/business">Google · Enquiries · Archives</Link><Link href="/admin/campaigns">Offers</Link><Link href="/admin/spin">Rewards</Link>{access === 'ready' && <button onClick={async () => { await adminLogout(); setData(null); setAccess('login'); }}>Log out</button>}</nav></header>
    <div className="ma-intro"><div><p className="ma-eyebrow">WEBSITE ANALYTICS · INDIA TIME</p><h1>हर visit को समझिए।<br/><span>बेहतर अगला कदम चुनिए।</span></h1><p>कौन-से pages देखे गए, कहाँ समय बिताया और कहाँ से संपर्क करने की कोशिश हुई।</p></div>{access === 'ready' && data && <div className="ma-live"><i/>{to === today ? `${data.live} हाल में active sessions` : 'चुनी हुई अवधि की report'}<small>आख़िरी update: {time(data.generatedAt)}</small></div>}</div>
    {error && <p className="ma-error" role="alert">{error}</p>}
    {access !== 'ready' ? <form className="ma-card ma-login" onSubmit={login}><p className="ma-eyebrow">केवल OWNER के लिए</p><h2>{access === 'setup' ? 'अपना dashboard शुरू कीजिए।' : 'Welcome back, Tarun जी।'}</h2>{access === 'unavailable' ? <p>Private storage की connection अभी उपलब्ध नहीं है। Customer activity public नहीं दिखाई जाती।</p> : <><p>Analytics और rewards के लिए एक ही owner password है।</p>{access === 'setup' && !setupLink && <label>Owner setup key<input type="password" required autoComplete="off" value={key} onChange={e => setKey(e.target.value)}/></label>}<label>{access === 'setup' ? 'नया password · कम से कम 14 characters' : 'Owner password'}<input type="password" required minLength={access === 'setup' ? 14 : undefined} maxLength={200} autoComplete={access === 'setup' ? 'new-password' : 'current-password'} value={password} onChange={e => setPassword(e.target.value)}/></label><button className="ma-primary" disabled={busy}>{busy ? 'कृपया रुकिए…' : access === 'setup' ? 'Dashboard शुरू कीजिए' : 'Login कीजिए'}</button></>}</form> : <>
      <section className="ma-filters" aria-label="Report की अवधि"><div className="ma-presets">{[['today','आज'],['yesterday','कल'],['7','7 दिन'],['30','30 दिन'],['month','इस महीने']].map(([v,label]) => <button key={v} className={preset === v ? 'active' : ''} aria-pressed={preset === v} onClick={() => dates(v)}>{label}</button>)}</div><form className="ma-range" key={`${from}|${to}`} onSubmit={applyDates}><label>शुरुआत<input type="date" name="from" required defaultValue={from} min={istDay(dayStart(today) - (RETENTION_DAYS - 1) * 86400_000)} max={today}/></label><label>अंत<input type="date" name="to" required defaultValue={to} min={istDay(dayStart(today) - (RETENTION_DAYS - 1) * 86400_000)} max={today}/></label><button type="submit" className="ma-primary" disabled={busy}>तारीख़ें लागू कीजिए</button><button type="button" disabled={busy} onClick={() => { setBusy(true); setRefresh(v => v + 1); }}>↻ Refresh</button><button type="button" disabled={!data} onClick={exportReport}>CSV export ↓</button></form><label className="ma-auto"><input type="checkbox" checked={auto} onChange={e => setAuto(e.target.checked)}/>हर 30 sec में update · tab खुला होने पर</label></section>
      {!data ? <div className="ma-card" role="status">चुनी हुई अवधि की report खुल रही है…</div> : <>
        <div className="ma-stats">{stats.map(([label,value,note]) => <article key={label}><span>{label}</span><strong>{value}</strong><small>{note}</small></article>)}</div>
        {data.pageViews === 0 && <div className="ma-empty"><h2>इस अवधि में कोई recorded visit नहीं है।</h2><p>Tracking चालू होने के बाद की activity यहाँ आएगी। पुराने visits वापस नहीं बनाए जा सकते। Analytics बंद करने वाले browsers और पहचाने गए bots शामिल नहीं हैं।</p></div>}
        <nav className="ma-tabs" aria-label="Report view">{[['overview','Overview'],['content','Pages और attention'],['actions','Clicks और searches'],['journeys','Visitor journeys']].map(([value,label]) => <button key={value} aria-pressed={tab === value} className={tab === value ? 'active' : ''} onClick={() => setTab(value)}>{label}</button>)}</nav>
        {tab === 'overview' && <>
          <section className="ma-card"><div className="ma-card-heading"><div><p className="ma-eyebrow">DAILY TREND</p><h2>कब कितनी visits आईं?</h2></div><span>IST · {from} से {to}</span></div><div className="ma-chart" aria-label="हर दिन के sessions">{data.daily.map(d => <button key={d.day} title={`${d.day}: ${d.sessions} sessions, ${d.views} page views`} onClick={() => { setPreset('custom'); setFrom(d.day); setTo(d.day); setData(null); }}><b>{d.sessions}</b><span style={{height: `${Math.max(3, d.sessions / Math.max(1, ...data.daily.map(x => x.sessions)) * 140)}px`}}/><small>{d.day.slice(5)}</small></button>)}</div></section>
          <div className="ma-two"><MetricTable title="Traffic कहाँ से आया?" rows={data.sources} /><MetricTable title="कौन-सी device?" rows={data.devices}/><MetricTable title="Campaigns का योगदान" rows={data.campaigns}/><MetricTable title="देश · approximate" rows={data.countries}/></div>
          <section className="ma-card"><h2>किस समय pages खुले?</h2><div className="ma-hours">{data.hourly.map(h => <div key={h.hour} title={`${h.hour}:00 IST · ${h.views} views`} style={{background: `rgba(207,32,47,${0.04 + h.views / Math.max(1,...data.hourly.map(x => x.views)) * .65})`}}><small>{String(h.hour).padStart(2,'0')}:00</small><b>{h.views}</b></div>)}</div></section>
        </>}
        {tab === 'content' && <><MetricTable title="सबसे अधिक देखे गए pages" rows={data.pages} detailed/><section className="ma-card"><h2>कहाँ सबसे ज्यादा active time गया?</h2><p>Screen के बीच में दिख रहे section का समय। एक समय पर एक section; यह eye tracking नहीं है।</p><div className="ma-table"><table><thead><tr><th>Page · section</th><th>Page views में देखा</th><th>Active time</th></tr></thead><tbody>{data.sections.map(s => <tr key={s.label}><td>{s.label}</td><td>{s.views}</td><td>{duration(s.active)}</td></tr>)}</tbody></table></div></section></>}
        {tab === 'actions' && <section className="ma-card"><h2>Customers ने क्या किया?</h2><p>Search में पहचाने गए shopping terms ही आते हैं। Form के नाम, mobile numbers, passwords और message text record नहीं होते।</p><div className="ma-table"><table><thead><tr><th>Action</th><th>Product / topic / button</th><th>Count</th></tr></thead><tbody>{data.topics.map(t => <tr key={`${t.type}|${t.label}`}><td>{t.type}</td><td>{t.label}</td><td>{number(t.count)}</td></tr>)}</tbody></table></div></section>}
        {tab === 'journeys' && <section className="ma-card"><h2>हाल के 100 anonymous sessions</h2><p>यह browser activity है, customer की पहचान नहीं। हर page के आख़िरी 40 actions दिखते हैं।</p><div className="ma-journeys">{data.journeys.map(j => <details key={j.id}><summary><span>Session {j.id}<small>{time(j.started)} · {j.device} · {j.source}</small></span><b>{j.pages.length} pages · {duration(j.active)}</b></summary><ol>{j.pages.map((p,i) => <li key={`${p.path}-${i}`}><b>{p.path}</b><span>{duration(p.active)} active · {p.depth}% scroll</span></li>)}</ol>{j.events.length > 0 && <div className="ma-table"><table><thead><tr><th>समय</th><th>Action</th><th>क्या देखा / चुना</th></tr></thead><tbody>{j.events.map(e => <tr key={e.id}><td>{time(e.at)}</td><td>{e.type}</td><td>{e.label}</td></tr>)}</tbody></table></div>}</details>)}</div></section>}
        <section className="ma-notes"><h2>इन आँकड़ों का सही मतलब</h2><p>Active time तभी बढ़ता है जब page सामने हो, window focused हो और हाल में interaction या video playback हुआ हो। 60 sec inactivity के बाद समय रुकता है। Website WhatsApp chats, call connection या दुकान पर पहुँचना अपने आप नहीं देख सकती।</p><p>Unique browser IDs पहचान छिपाकर save होते हैं; अलग devices और browser storage हटाने से गिनती बदल सकती है। Ad blockers, network failure और privacy preferences के कारण activity छूट सकती है। Detailed history पिछले {RETENTION_DAYS} दिनों की है; ज़रूरी reports CSV में export कीजिए। Live का अर्थ पिछले 90 sec में update भेजने वाला session है।</p><p>असली enquiry, दुकान visit और sale को staff के register या inventory system में दर्ज करके इन contact clicks के साथ पढ़िए।</p></section>
      </>}
    </>}
  </div>;
}
function MetricTable({title, rows, detailed = false}: {title: string; rows: AnalyticsReport['pages']; detailed?: boolean}) {
  return <section className="ma-card"><h2>{title}</h2><div className="ma-table"><table><thead><tr><th>{detailed ? 'Page' : 'Source / group'}</th><th>Views</th><th>Sessions</th>{detailed && <><th>Avg active / view</th><th>Avg scroll</th></>}</tr></thead><tbody>{rows.map(r => <tr key={r.label}><td>{r.label}</td><td>{number(r.views)}</td><td>{number(r.sessions)}</td>{detailed && <><td>{duration(r.views ? r.active / r.views : 0)}</td><td>{r.depth}%</td></>}</tr>)}</tbody></table></div>{rows.length === 0 && <p className="ma-muted">अभी कोई activity नहीं।</p>}</section>;
}
