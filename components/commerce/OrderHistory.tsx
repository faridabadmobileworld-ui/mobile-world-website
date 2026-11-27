'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { decideOrder, readOrders } from '@/app/checkout/actions';
import { rupees, statusLabels, type PublicOrder } from '@/lib/commerce/core';
import { useBasket } from './basket';
import { EmptySelection } from './ShoppingLists';
import { ShopTabs } from './ShoppingControls';
import { MotionHeading } from '../MotionHeading';
import { shop } from '@/data/shop';

export function OrderDetails({ order }: { order: PublicOrder }) {
  return <><ul className="ec-order-items">{order.items.map((item,i) => <li key={i}><div><b>{item.name}</b><small>{item.choice || (item.kind === 'category' ? 'Category की ज़रूरत' : '')}</small>
    {order.quote?.descriptions[i] && <small>दुकान का item · {order.quote.descriptions[i]}</small>}</div><span>× {item.quantity}{order.quote && <small>{rupees(order.quote.unitPrices[i])} प्रति item</small>}</span></li>)}</ul>
    {order.quote && <dl className="ec-quote"><div><dt>Delivery charge</dt><dd>{rupees(order.quote.fee)}</dd></div><div><dt>दुकान का पूरा quote</dt><dd>{rupees(order.quote.total)}</dd></div></dl>}</>;
}
export function OrderHistory() {
  const { receipts } = useBasket();
  const [orders,setOrders] = useState<PublicOrder[]>([]);
  const [message,setMessage] = useState('');
  const [loading,setLoading] = useState(false);
  const [busy,setBusy] = useState('');
  const [question,setQuestion] = useState('');
  const [revision,setRevision] = useState(0);
  useEffect(() => {
    if (!receipts.length) return;
    let live=true;
    async function load() {
      setLoading(true);
      try {
        const result = await readOrders(receipts);
        if (!live) return;
        if (result.ok) setOrders(result.value); else setMessage(result.message);
      } catch { if (live) setMessage('Status खुल नहीं सका। फिर refresh कीजिए।'); }
      finally { if (live) setLoading(false); }
    }
    void load();
    return () => { live=false; };
  },[receipts,revision]);
  async function decide(order:PublicOrder, action:'accept'|'cancel') {
    const receipt=receipts.find(r => r.id === order.id);
    if (!receipt) return;
    setBusy(order.id); setMessage('');
    try {
      const result=await decideOrder(receipt,action,order.quote?.version ?? '');
      if (result.ok) { setOrders(old => old.map(o => o.id === order.id ? result.value : o)); setMessage(action === 'cancel' ? 'Request रद्द हो गई।' : 'आपकी मंज़ूरी दुकान तक पहुँच गई।'); }
      else { setMessage(result.message); setRevision(n => n+1); }
    } catch { setMessage('Status की पुष्टि नहीं मिल सकी। Refresh कीजिए।'); }
    finally { setBusy(''); setQuestion(''); }
  }
  return <div className="wrap ec-page"><div className="ec-crumb"><Link href="/cart">Cart</Link> / मेरे orders</div><MotionHeading as="h1">मेरे orders</MotionHeading><ShopTabs active="orders"/>
    {!receipts.length ? <section className="ec-panel"><EmptySelection icon="box" text="इस browser में अभी कोई order request नहीं है" hint="Checkout से भेजी request का number, दुकान का quote और status यहाँ मिलेगा।"/></section> :
    <><div className="ec-tools"><p>इसी browser से भेजी गई requests</p><button type="button" className="ec-text" disabled={loading || !!busy} onClick={() => {setMessage('');setRevision(n => n+1);}}>Status refresh करें</button></div>
    <p role="status" className="ec-status">{loading ? 'Status जाँचा जा रहा है…' : message}</p>{!loading && !orders.length && !message && <p>Request खोलने में सहायता के लिए <a href={shop.phone.tel}>दुकान को call करें</a>।</p>}
    {orders.map(order => <article className="ec-panel ec-section ec-history" key={order.id}><header><div><small>{new Intl.DateTimeFormat('hi-IN',{dateStyle:'long',timeZone:'Asia/Kolkata'}).format(new Date(order.created))} · {order.fulfilment === 'pickup' ? 'Store pickup' : 'Delivery request'}</small><h2>{order.id}</h2></div><b className="ec-pill">{statusLabels[order.status]}</b></header><OrderDetails order={order}/>
      <div className="ec-controls">{order.status === 'quoted' && order.quote && <button className="ec-button" disabled={!!busy} onClick={() => decide(order,'accept')}>{rupees(order.quote.total)} का quote मंज़ूर करें</button>}
      {['received','quoted'].includes(order.status) && (question === order.id ? <><span>यह request रद्द करें?</span><button className="ec-text" disabled={!!busy} onClick={() => decide(order,'cancel')}>हाँ, रद्द करें</button><button className="ec-text" onClick={() => setQuestion('')}>वापस जाएँ</button></> : <button className="ec-text" disabled={!!busy} onClick={() => setQuestion(order.id)}>Request रद्द करें</button>)}</div>
    </article>)}</>}</div>;
}
