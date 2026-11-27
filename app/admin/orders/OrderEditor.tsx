'use client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import type { PublicOrder } from '@/lib/commerce/core';
import { manageOrder } from './actions';

export function OrderEditor({ order }: { order: PublicOrder }) {
  const router = useRouter();
  const [busy,setBusy]=useState(false);
  const [message,setMessage]=useState('');
  const [confirm,setConfirm]=useState(false);
  async function submit(form:FormData) {
    setBusy(true); setMessage('');
    try {
      const result = await manageOrder(order.id,order.status,order.quote?.version ?? '',form);
      if (result.ok) { setMessage('Update save हो गया।'); setConfirm(false); router.refresh(); }
      else setMessage(result.message);
    } catch { setMessage('Owner login और connection जाँचकर फिर कोशिश कीजिए।'); } finally { setBusy(false); }
  }
  return <div><form action={submit} className="ec-form"><fieldset disabled={busy}><legend className="sr">Order actions</legend>
    {['received','quoted'].includes(order.status) && <details className="ec-owner-quote"><summary>{order.quote ? 'दुकान का quote बदलें' : 'Stock जाँचकर quote तैयार करें'}</summary>
      {order.items.map((item,i) => <div className="ec-fields" key={i}><label>{item.name} · प्रति item ₹<input type="number" min="1" max="10000000" step="1" name="unit" required defaultValue={order.quote?.unitPrices[i]}/></label>
        <label>{item.kind === 'category' ? 'Exact brand और model' : 'Variant की जानकारी (वैकल्पिक)'}<input name="description" maxLength={180} required={item.kind === 'category'} defaultValue={order.quote?.descriptions[i]}/></label></div>)}
      <label>Delivery charge ₹<input name="fee" type="number" min="0" max="10000000" step="1" required readOnly={order.fulfilment === 'pickup'} defaultValue={order.quote?.fee ?? 0}/></label>
      <button type="submit" className="ec-button" name="action" value="quote">ग्राहक के लिए quote save करें</button></details>}
    {order.status === 'accepted' && <button type="submit" className="ec-button" name="action" value="ready">सामान तैयार दर्ज करें</button>}
    {order.status === 'ready' && <button type="submit" className="ec-button" name="action" value="completed">सामान दे दिया गया</button>}
  </fieldset></form>
  {!['completed','cancelled'].includes(order.status) && <div className="ec-controls">{confirm ? <><button className="ec-text" disabled={busy} onClick={() => { const f=new FormData(); f.set('action','cancelled'); void submit(f); }}>हाँ, request रद्द करें</button><button className="ec-text" disabled={busy} onClick={() => setConfirm(false)}>वापस जाएँ</button></> : <button className="ec-text" disabled={busy} onClick={() => setConfirm(true)}>Request रद्द करें</button>}</div>}
  <p role="status" className="ec-status">{message}</p></div>;
}
