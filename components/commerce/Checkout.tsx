'use client';
import Link from 'next/link';
import { useRef, useState, type FormEvent } from 'react';
import { shop } from '@/data/shop';
import { sendOrder } from '@/app/checkout/actions';
import { choiceText, cleanContact, finishRequest, lineKey, selectedLines, validChoice, type Contact, type Line, type Listing, type Receipt } from '@/lib/commerce/core';
import { updateBasket, useBasket } from './basket';
import { OrderSummary, ProductPicture } from './ShoppingLists';
import { modelHref } from '@/lib/commerce/discovery';
import { ShopTabs } from './ShoppingControls';
import { ShopIcon } from './ShopIcon';
import { MotionHeading } from '../MotionHeading';

const pendingKey = 'mw-checkout-attempt-v1';
type Attempt = { fingerprint: string; nonce: string };
async function identify(contact: Contact, cart: Line[], previous: Attempt | null) {
  const digest = new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(JSON.stringify([contact,cart]))));
  const fingerprint = Array.from(digest, b => b.toString(16).padStart(2,'0')).join('');
  let attempt = previous;
  try { attempt ??= JSON.parse(sessionStorage.getItem(pendingKey) ?? 'null'); } catch { /* A retry on the open page still shares its reference. */ }
  const month = new Date(Date.now() + 19800000).toISOString().slice(0,7).replace('-','');
  if (attempt?.fingerprint === fingerprint && (attempt.nonce.startsWith(month) || attempt.nonce.startsWith(new Date(Date.now()+19800000-86400000).toISOString().slice(0,7).replace('-','')))) return attempt;
  const fresh = { fingerprint, nonce: month + '-' + crypto.randomUUID() };
  try { sessionStorage.setItem(pendingKey,JSON.stringify(fresh)); } catch { /* The request can still be retried in memory. */ }
  return fresh;
}
export function Checkout({ catalogue, direct }: { catalogue: Listing[]; direct: Line | 'invalid' | null }) {
  const basket = useBasket();
  const directLine = direct && direct !== 'invalid' ? direct : null;
  const cart = directLine ? [directLine] : direct === null ? selectedLines(basket) : [];
  const [fulfilment,setFulfilment] = useState<Contact['fulfilment']>('pickup');
  const [busy,setBusy] = useState(false);
  const [error,setError] = useState('');
  const [receipt,setReceipt] = useState<Receipt | null>(null);
  const attempt = useRef<Attempt | null>(null);
  const sending = useRef(false);
  const map = new Map(catalogue.map(item => [item.id,item]));
  const available = cart.every(l => { const item=map.get(l.productId); return item && item.kind !== 'guide' && validChoice(item,l); });
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (sending.current) return;
    const form = new FormData(event.currentTarget);
    const contact = cleanContact({ name:form.get('name'), phone:form.get('phone'), address:form.get('address'), pin:form.get('pin'), fulfilment });
    if (!contact || !available || !cart.length) { setError('अपना नाम, mobile number और Cart जाँचिए। Delivery के लिए पूरा पता और PIN code भी भरिए।'); return; }
    const submitted = cart.map(l => ({ ...l }));
    sending.current = true; setBusy(true); setError('');
    try {
      attempt.current = await identify(contact,submitted,attempt.current);
      const response = await sendOrder(attempt.current.nonce,submitted,contact);
      if (!response.ok) { setError(response.message); return; }
      const confirmed = response.value.receipt;
      await updateBasket(s => finishRequest(s,direct === null ? submitted : [],confirmed));
      setReceipt(confirmed);
      try { sessionStorage.removeItem(pendingKey); } catch { /* Receipt remains in the basket. */ }
      window.scrollTo({ top:0, behavior:'instant' });
    } catch { setError('Request की पुष्टि नहीं मिल सकी। इन्हीं details के साथ फिर कोशिश कीजिए।'); }
    finally { sending.current = false; setBusy(false); }
  }
  return <div className="wrap ec-page"><div className="ec-crumb"><Link href="/cart">Cart</Link> / Checkout</div><MotionHeading as="h1">{receipt ? 'आपकी request पहुँच गई' : 'Checkout'}</MotionHeading><ShopTabs active="checkout"/>
  {receipt ? <section className="ec-panel ec-receipt" role="status"><span className="ec-empty-icon"><ShopIcon name="check"/></span><h2>Mobile World को आपकी पसंद मिल गई है।</h2><p>आपका request number <strong>{receipt.id}</strong></p><p>दुकान stock और दाम जाँचकर इसी request में quote देगी। इस browser में “मेरे orders” खोलकर उसे देखिए।</p><Link className="ec-button" href="/orders">मेरे orders देखिए <ShopIcon name="arrow"/></Link></section> :
  !cart.length ? <section className="ec-panel ec-empty"><h2>{direct === 'invalid' ? 'यह variant उपलब्ध विकल्पों में नहीं मिला' : 'Checkout के लिए अपना सामान चुनिए'}</h2>
    <Link className="ec-button" href={direct === 'invalid' ? '/products' : '/cart'}>{direct === 'invalid' ? 'मौजूदा models देखिए' : 'अपने Cart में चुनिए'} <ShopIcon name="arrow"/></Link></section> :
  <div className="ec-grid"><form className="ec-form" onSubmit={submit}><fieldset disabled={busy}><legend className="sr">Checkout details</legend>
    <section className="ec-panel ec-section"><h2>आपका सामान</h2>{cart.map(line => { const item=map.get(line.productId); return <div className="ec-review" key={lineKey(line)}><ProductPicture item={item} line={line}/><div><strong>{item?.name ?? 'पुराना selection'}</strong><p>{item ? choiceText(item,line) : ''}</p><small>{item?.kind === 'category' ? 'Category request · ' : ''}Quantity {line.quantity}</small></div></div>; })}<Link className="ec-text" href={directLine ? modelHref(map.get(directLine.productId)!,directLine) : '/cart'}>{directLine ? 'Model के विकल्प देखिए' : 'Cart में बदलाव करें'}</Link></section>
    <section className="ec-panel ec-section"><h2>सामान कैसे लेना चाहेंगे?</h2><div className="ec-methods">
      <label><input type="radio" name="method" value="pickup" checked={fulfilment === 'pickup'} onChange={() => setFulfilment('pickup')}/><ShopIcon name="store"/><span><b>दुकान से pickup</b><small>{shop.address.road}, {shop.address.locality}</small></span></label>
      <label><input type="radio" name="method" value="delivery" checked={fulfilment === 'delivery'} onChange={() => setFulfilment('delivery')}/><ShopIcon name="truck"/><span><b>Delivery की request</b><small>आपके PIN code पर सुविधा और charge दुकान बताएगी।</small></span></label>
    </div><div className="ec-fields"><label>आपका नाम<input required maxLength={100} name="name" autoComplete="name"/></label><label>Mobile number<input required type="tel" name="phone" autoComplete="tel" inputMode="tel" maxLength={20} placeholder="10 अंकों का नंबर"/></label>
      {fulfilment === 'delivery' && <><label>PIN code<input name="pin" required inputMode="numeric" autoComplete="postal-code" pattern="[1-9][0-9]{5}" maxLength={6}/></label><label className="ec-wide">Delivery का पूरा पता<textarea required name="address" rows={3} maxLength={350} autoComplete="street-address"/></label></>}</div></section>
    <section className="ec-panel ec-section"><h2>दुकान को request भेजें</h2><p>दुकान से quote मिलने पर आप उसे मंज़ूर कर सकेंगे। अभी कोई payment देय नहीं है। आपके contact details इस request को पूरा करने के लिए दुकान को मिलेंगे। <Link className="ec-text" href="/privacy">Privacy policy</Link></p>
    {!available && <p className="ec-error">एक selection बदल गया है। <Link href="/cart">Cart जाँचिए।</Link></p>}
    <button disabled={busy || !available} className="ec-button" type="submit">{busy ? 'Request भेजी जा रही है…' : 'दुकान को order request भेजें'} <ShopIcon name="arrow"/></button>
    {error && <p className="ec-error" role="alert">{error} <a href={shop.phone.tel}>दुकान को call करें</a></p>}</section>
  </fieldset></form><OrderSummary lines={cart} catalogue={catalogue}/></div>}</div>;
}
