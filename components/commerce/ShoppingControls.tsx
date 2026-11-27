'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { addLine, type Choice } from '@/lib/commerce/core';
import { trackAction } from '../WebsiteAnalytics';
import { browserStorageAvailable, toggleFavourite, updateBasket, useBasket } from './basket';
import { ShopIcon } from './ShopIcon';

export function CartLink({ compact = false }: { compact?: boolean }) {
  const count = useBasket().cart.reduce((sum, line) => sum + line.quantity, 0);
  return <Link className={compact ? 'ec-nav-link ec-nav-mobile' : 'ec-nav-link'} href="/cart" aria-label={'आपका Cart, ' + count + ' items'}><span className="ec-nav-symbol"><ShopIcon name="bag" />{count > 0 && <b>{count > 99 ? '99+' : count}</b>}</span><span>Cart</span></Link>;
}
export function HeaderShopping() {
  return <div className="ec-header-shopping"><Link className="ec-nav-link ec-nav-heart" href="/favourites" aria-label="आपकी Favourites"><ShopIcon name="heart" /><span>Favourites</span></Link><CartLink /></div>;
}
export function ShopTabs({ active }: { active: 'cart' | 'favourites' | 'checkout' | 'orders' }) {
  return <nav className="ec-tabs" aria-label="आपकी shopping"><Link href="/cart" aria-current={active === 'cart' ? 'page' : undefined}><ShopIcon name="bag" />Cart</Link><Link href="/cart#saved"><ShopIcon name="clock" />Save for later</Link><Link href="/favourites" aria-current={active === 'favourites' ? 'page' : undefined}><ShopIcon name="heart" />Favourites</Link><Link href="/orders" aria-current={active === 'orders' ? 'page' : undefined}><ShopIcon name="box" />मेरे orders</Link></nav>;
}
export function FavouriteButton({ productId, name }: { productId: string; name: string }) {
  const selected = useBasket().favourites.includes(productId);
  const [notice, setNotice] = useState('');
  async function toggle() {
    try {
      await toggleFavourite(productId);
      trackAction('shortlist', (selected ? 'remove: ' : 'add: ') + productId);
      setNotice(browserStorageAvailable() ? '' : 'इस browser में पसंद सिर्फ़ खुले page पर रहेगी।');
    } catch { setNotice('पसंद save नहीं हो सकी। फिर कोशिश कीजिए।'); }
  }
  return <><button type="button" className="ec-heart" aria-label={name + (selected ? ' को Favourites से हटाइए' : ' को Favourites में रखिए')} aria-pressed={selected} onClick={toggle}><ShopIcon name="heart" /><span>{selected ? 'पसंद में है' : 'Favourite'}</span></button>{notice && <small role="status">{notice}</small>}</>;
}
export function AddSelection({ choice, name, category = false }: { choice: Choice; name: string; category?: boolean }) {
  const router = useRouter();
  const [notice, setNotice] = useState('');
  const [added, setAdded] = useState(false);
  const [busy, setBusy] = useState(false);
  async function add(checkout: boolean) {
    setBusy(true);
    try {
      await updateBasket(s => addLine(s, 'cart', { ...choice, quantity: 1 }));
      setAdded(true);
      setNotice(browserStorageAvailable() ? 'Cart में जोड़ दिया गया।' : 'Cart खुले browser session में है।');
      if (checkout) router.push('/checkout');
    } catch (e) { setNotice(e instanceof Error ? e.message : 'Cart फिर खोलिए।'); }
    finally { setBusy(false); }
  }
  return <div className={'ec-purchase' + (category ? ' ec-compact' : '')}><div className="ec-controls">
    <button type="button" className="ec-button" disabled={busy} onClick={() => add(false)} aria-label={name + ' को Cart में जोड़िए'}><ShopIcon name="bag" />{category ? 'पसंद Cart में रखें' : 'Cart में जोड़िए'}</button>
    {!category && <button type="button" className="ec-button ec-secondary" disabled={busy} onClick={() => add(true)}>अभी Checkout करें <ShopIcon name="arrow" /></button>}
    <FavouriteButton productId={choice.productId} name={name} /></div>
    <span className="ec-feedback" role="status">{notice} {added && <Link href="/cart">Cart देखिए →</Link>}</span></div>;
}
