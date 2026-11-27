import type { Metadata } from 'next';
import Link from 'next/link';
import { ownerAccess } from '@/app/spin-admin-actions';
import { orderMonth, ownerOrders } from '@/lib/commerce/orders';
import { statusLabels } from '@/lib/commerce/core';
import { OrderDetails } from '@/components/commerce/OrderHistory';
import { OrderEditor } from './OrderEditor';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title:'Order desk · Mobile World',robots:{index:false,follow:false},referrer:'no-referrer' };
export default async function Page({searchParams}:{searchParams:Promise<{month?:string}>}) {
  if (await ownerAccess() !== 'ready') return <div className="wrap ec-page"><section className="ec-panel ec-section"><h1>Private order desk</h1><p>Customers की requests और quotes देखने के लिए owner login करें।</p><Link className="ec-button" href="/admin/analytics">Owner login</Link></section></div>;
  const raw=(await searchParams).month;
  const month=typeof raw === 'string' && /^20\d{2}-(0[1-9]|1[0-2])$/.test(raw) ? raw.replace('-','') : orderMonth(new Date());
  const data=await ownerOrders(month);
  return <div className="wrap ec-page"><Link className="ec-text" href="/admin/business">← Business desk</Link><h1>Shopping order desk</h1><form className="ec-controls ec-month" method="get"><label>Requests का महीना <input type="month" name="month" defaultValue={month.slice(0,4)+'-'+month.slice(4)} required/></label><button className="ec-button ec-secondary">देखिए</button></form>
  {!data.length && <p>इस महीने अभी कोई shopping request दर्ज नहीं है।</p>}{data.map(({contact,...order}) => <article key={order.id} className="ec-panel ec-section ec-history"><header><div><small>{new Intl.DateTimeFormat('hi-IN',{dateStyle:'medium',timeStyle:'short',timeZone:'Asia/Kolkata'}).format(new Date(order.created))} IST</small><h2>{order.id}</h2></div><b className="ec-pill">{statusLabels[order.status]}</b></header>
  <p><strong>{contact.name}</strong> · <a className="ec-text" href={'tel:+91'+contact.phone}>{contact.phone}</a> · {contact.fulfilment === 'pickup' ? 'Store pickup' : 'Delivery request'}</p>
  {contact.fulfilment === 'delivery' && <p>{contact.address} · PIN {contact.pin}</p>}
  <OrderDetails order={order}/><OrderEditor key={[order.status,order.quote?.version].join('/')} order={order}/></article>)}</div>;
}
