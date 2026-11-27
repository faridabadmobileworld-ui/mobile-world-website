'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { changeQuantity, choiceText, exactPrice, lineKey, maxUnits, moveLine, rupees, validChoice, type Basket, type Line, type List, type Listing } from '@/lib/commerce/core';
import { updateBasket, useBasket } from './basket';
import { AddSelection, FavouriteButton, ShopTabs } from './ShoppingControls';
import { ShopIcon, type IconName } from './ShopIcon';
import { MotionHeading } from '../MotionHeading';

export function EmptySelection({ icon, text, hint }: { icon: IconName; text: string; hint: string }) {
  return <div className="ec-empty"><span className="ec-empty-icon"><ShopIcon name={icon} /></span><h2>{text}</h2><p>{hint}</p><Link className="ec-button" href="/products">Products देखिए <ShopIcon name="arrow" /></Link></div>;
}
export function ProductPicture({ item }: { item?: Listing }) {
  return <div className="ec-picture">{item?.image ? <Image src={item.image} alt={item.imageAlt} width={130} height={145} sizes="(max-width: 700px) 70px, 105px" /> : <ShopIcon name="box" />}</div>;
}
export function Reference({ item, line }: { item: Listing; line: Line }) {
  const price = exactPrice(item, line);
  if (!price) return null;
  return <p className="ec-reference">Official India reference <b>{rupees(price.amount)}</b> प्रति item · {new Intl.DateTimeFormat('en-IN',{day:'numeric',month:'short',year:'numeric',timeZone:'Asia/Kolkata'}).format(new Date(price.checkedAt + 'T12:00:00+05:30'))}</p>;
}
export function OrderSummary({ lines, catalogue, children }: { lines: Line[]; catalogue: Listing[]; children?: React.ReactNode }) {
  const byId = new Map(catalogue.map(item => [item.id, item]));
  const values = lines.map(line => { const item = byId.get(line.productId); return item && validChoice(item,line) ? exactPrice(item,line)?.amount : undefined; });
  const units = lines.reduce((sum, line) => sum + line.quantity, 0);
  return <aside className="ec-summary"><div className="ec-summary-head"><ShopIcon name="bag" /><h2>Shopping summary</h2></div><dl><div><dt>कुल quantity</dt><dd>{units}</dd></div>
    {lines.length > 0 && values.every((v): v is number => v !== undefined) && <div><dt>Official India references का जोड़</dt><dd>{rupees(values.reduce((sum,v,i) => sum + v * lines[i].quantity,0))}</dd></div>}
    <div className="ec-total"><dt>दुकान का कुल दाम</dt><dd>पुष्टि के बाद</dd></div></dl>
    <p>Mobile World आपकी पसंद का stock, दुकान का दाम और लागू delivery charge भेजेगा। आप पूरा दाम देखकर मंज़ूर कर सकेंगे।</p>{children}</aside>;
}
function BasketRow({ item, line, list, onNotice }: { item?: Listing; line: Line; list: List; onNotice: (s:string) => void }) {
  const [busy, setBusy] = useState(false);
  const available = item && item.kind !== 'guide' && validChoice(item, line);
  async function change(fn: (s: Basket) => Basket, message: string) {
    setBusy(true);
    try { await updateBasket(fn); onNotice(message); } catch(e) { onNotice(e instanceof Error ? e.message : 'फिर कोशिश कीजिए।'); } finally { setBusy(false); }
  }
  function adjust(delta: number) {
    return change(s => {
      const current = s[list].find(l => lineKey(l) === lineKey(line));
      return current ? changeQuantity(s, list, current, Math.max(1,current.quantity + delta)) : s;
    }, 'Quantity बदल गई है।');
  }
  return <article className="ec-line"><ProductPicture item={item} /><div className="ec-line-content">
    <small>{item?.kind === 'category' ? 'Category की ज़रूरत' : item?.group}</small>
    <h3>{item ? <Link href={item.href}>{item.name}</Link> : 'पुराना selection'}</h3>
    {item && <p>{choiceText(item,line)}</p>}{item && available && <Reference item={item} line={line}/>}
    {!available && <p className="ec-error">यह option बदल गया है। {item && <Link href={item.href}>मौजूदा options देखिए।</Link>}</p>}
    <div className="ec-row-actions"><div className="ec-quantity" role="group" aria-label={(item?.name ?? 'Item') + ' की quantity'}><button type="button" aria-label="Quantity घटाइए" disabled={busy || line.quantity === 1} onClick={() => adjust(-1)}><ShopIcon name="minus"/></button><span>{line.quantity}</span><button type="button" aria-label="Quantity बढ़ाइए" disabled={busy || line.quantity >= maxUnits} onClick={() => adjust(1)}><ShopIcon name="plus"/></button></div>
      <button type="button" className="ec-text" disabled={busy || (list === 'saved' && !available)} onClick={() => change(s => moveLine(s,list,line),list === 'cart' ? 'Save for later में रख दिया।' : 'वापस Cart में रख दिया।')}>{list === 'cart' ? 'Save for later' : 'Cart में वापस रखें'}</button>
      <button type="button" className="ec-text" disabled={busy} onClick={() => change(s => changeQuantity(s,list,line,0),'Item हटा दिया।')}>हटाएँ</button>
    </div></div></article>;
}
export function ShoppingLists({ catalogue, page }: { catalogue: Listing[]; page: 'cart' | 'favourites' }) {
  const { cart, saved, favourites } = useBasket();
  const [notice, setNotice] = useState('');
  const map = new Map(catalogue.map(item => [item.id, item]));
  const valid = cart.every(l => { const i = map.get(l.productId); return i && i.kind !== 'guide' && validChoice(i,l); });
  const rows = (list: List, lines: Line[]) => lines.map(l => <BasketRow key={lineKey(l)} list={list} item={map.get(l.productId)} line={l} onNotice={setNotice}/>);
  return <div className="wrap ec-page"><div className="ec-crumb"><Link href="/">Home</Link> / आपकी shopping</div><MotionHeading as="h1">{page === 'cart' ? 'आपका Cart' : 'आपकी Favourites'}</MotionHeading><ShopTabs active={page}/><p className="ec-status" role="status">{notice}</p>
    {page === 'cart' ? <div className="ec-grid"><div><section className="ec-panel" aria-label="Cart में सामान">{cart.length ? rows('cart',cart) : <EmptySelection icon="bag" text="आपका Cart अभी खाली है" hint="अपना model खोलिए और अपनी पसंद का variant जोड़िए।"/>}</section>
      <section id="saved" className="ec-panel ec-saved"><h2><ShopIcon name="clock"/> Save for later <small>{saved.length}</small></h2>{saved.length ? rows('saved',saved) : <p>Cart में किसी item पर “Save for later” चुनेंगे तो वह यहाँ मिलेगा।</p>}</section></div>
      <OrderSummary lines={cart} catalogue={catalogue}>{cart.length > 0 && valid ? <Link className="ec-button" href="/checkout">Checkout पर जाएँ <ShopIcon name="arrow"/></Link> : <Link className="ec-button ec-secondary" href="/products">Shopping जारी रखें</Link>}</OrderSummary></div> :
      <section className="ec-panel ec-favourites">{favourites.length ? favourites.map(id => {
        const item = map.get(id);
        return <article key={id} className="ec-line"><ProductPicture item={item}/><div className="ec-line-content"><small>{item?.group}</small><h3>{item ? <Link href={item.href}>{item.name}</Link> : 'पुरानी पसंद'}</h3>
          {item?.kind === 'category' ? <AddSelection name={item.name} choice={{productId:id,variant:'',colour:''}} category/> : <div className="ec-controls">{item && <Link href={item.href} className="ec-button ec-secondary">{item.kind === 'model' ? 'Options चुनिए' : 'Guide खोलिए'} <ShopIcon name="arrow"/></Link>}<FavouriteButton productId={id} name={item?.name ?? 'पुरानी पसंद'}/></div>}</div></article>;
      }) : <EmptySelection icon="heart" text="अपनी पहली पसंद रखिए" hint="किसी product या category पर दिल दबाइए। आपकी पसंद इस browser में यहाँ मिलेगी।"/>}</section>}
  </div>;
}
