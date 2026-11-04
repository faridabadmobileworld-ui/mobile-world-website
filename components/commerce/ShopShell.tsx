'use client';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, type FormEvent, type ReactNode } from 'react';
import { useShop } from './ShopProvider';
import { ShopIcon } from './ShopIcon';
import { shop } from '@/data/shop';

export function ShopShell({ children }: { children: ReactNode }) {
  const { customer, totals, profile, toast, state } = useShop();
  const path = usePathname(); const router = useRouter(); const [query, setQuery] = useState('');
  function search(e: FormEvent) { e.preventDefault(); router.push(`/shop/products?q=${encodeURIComponent(query.trim())}`); }
  return <div className="ec-site">
    <div className="ec-preview"><span><i /> SHOPPING PREVIEW</span><span>Sample prices · Demo checkout · कोई payment नहीं</span></div>
    <div className="ec-topline"><div className="ec-wrap"><span>1973 से भरोसे का सफ़र। आज आपकी online shopping।</span><Link href="/visit"><ShopIcon name="pin" /> {shop.address.locality}, Faridabad <ShopIcon name="arrow" /></Link></div></div>
    <header className="ec-header"><div className="ec-wrap ec-header-inner">
      <Link className="ec-logo" href="/shop" aria-label="Mobile World shopping home"><Image src="/images/mobile-world-logo-79e75645.webp" width={48} height={48} alt="" /><span>Mobile World<small>{shop.tagline}</small></span></Link>
      <form className="ec-search" role="search" onSubmit={search}><ShopIcon name="search" /><input type="search" value={query} onChange={e => setQuery(e.target.value)} placeholder="आप क्या ढूँढ रहे हैं?" aria-label="Shopping products खोजिए" /><button type="submit" aria-label="Search कीजिए"><ShopIcon name="arrow" /></button></form>
      <nav className="ec-actions" aria-label="आपकी shopping"><Link href="/shop/account" className={path.startsWith('/shop/account') ? 'is-active' : ''}><ShopIcon name="user" /><span><small>नमस्ते, {profile?.name.split(' ')[0] || 'Guest'}</small>My account</span></Link><Link href="/shop/favourites" aria-label={`Favourites, ${customer.favourites.length} items`}><ShopIcon name="heart" />{customer.favourites.length > 0 && <b>{customer.favourites.length}</b>}<span>Favourites</span></Link><Link href="/shop/cart" aria-label={`Cart, ${totals.count} items`}><ShopIcon name="bag" /><b>{totals.count}</b><span>Cart</span></Link></nav>
    </div></header>
    <nav className="ec-nav" aria-label="Shopping categories"><div className="ec-wrap"><Link className={path === '/shop' ? 'is-active' : ''} href="/shop">Home</Link><Link href="/shop/products"><ShopIcon name="phone" /> सभी smartphones</Link>{['Apple', 'Samsung', 'Xiaomi', 'Google', 'Nothing'].map(b => <Link key={b} href={`/shop/products?brand=${b}`}>{b}</Link>)}<Link href="/shop/products?budget=30000">₹30,000 तक <small>sample</small></Link><Link className="ec-nav-last" href="/shop/account/orders">मेरे orders <ShopIcon name="box" /></Link></div></nav>
    {!state.storageAvailable && <p className="ec-storage-alert" role="alert">Browser storage उपलब्ध नहीं है। इस session का preview चल सकता है, लेकिन reload पर data खो सकता है।</p>}
    <div className="ec-content">{children}</div>
    <section className="ec-service-strip ec-wrap" aria-label="Shopping सुविधाएँ"><div><ShopIcon name="store" /><span><b>आपका अपना store</b><small>Faridabad से जुड़ा भरोसा</small></span></div><div><ShopIcon name="bag" /><span><b>अपनी पसंद, अपना cart</b><small>Exact model और variant चुनिए</small></span></div><div><ShopIcon name="box" /><span><b>Orders एक जगह</b><small>History और status देखिए</small></span></div><div><ShopIcon name="heart" /><span><b>पसंद संभालकर रखिए</b><small>Favourites में save कीजिए</small></span></div></section>
    <footer className="ec-footer"><div className="ec-wrap ec-footer-grid"><div><Link className="ec-logo" href="/shop"><Image src="/images/mobile-world-logo-79e75645.webp" width={42} height={42} alt="" /><span>Mobile World<small>भरोसा पीढ़ियों का।</small></span></Link><p>1973 की छोटी Kiryana Store से आज की Mobile World तक। आपके परिवार की हर नई ज़रूरत में, हम साथ हैं।</p><Link className="ec-text-link" href="/">हमारी पूरी website देखिए <ShopIcon name="arrow" /></Link></div><div><h3>Shopping</h3><Link href="/shop/products">सभी smartphones</Link><Link href="/shop/favourites">मेरे favourites</Link><Link href="/shop/cart">Shopping cart</Link></div><div><h3>आपका account</h3><Link href="/shop/account">My account</Link><Link href="/shop/account/orders">Order history</Link><Link href="/shop/account/addresses">Saved addresses</Link><Link href="/shop/help">मदद और FAQs</Link></div><div><h3>दुकान से जुड़िए</h3><p>{shop.address.road}<br />{shop.address.locality}, {shop.address.city}</p><Link href="/contact">Contact details <ShopIcon name="arrow" /></Link><Link href="/visit">दुकान का रास्ता</Link></div></div><div className="ec-wrap ec-footer-bottom"><span>© {new Date().getFullYear()} Mobile World · Faridabad</span><span>यह shopping demo है। Prices, stock और delivery commitments वास्तविक नहीं हैं।</span></div></footer>
    <nav className="ec-mobile-nav" aria-label="Mobile shopping"><Link href="/shop" className={path === '/shop' ? 'is-active' : ''}><ShopIcon name="store" /><span>Home</span></Link><Link href="/shop/products" className={path.startsWith('/shop/products') ? 'is-active' : ''}><ShopIcon name="grid" /><span>Shop</span></Link><Link href="/shop/favourites" className={path === '/shop/favourites' ? 'is-active' : ''}><ShopIcon name="heart" /><span>Favourites</span></Link><Link href="/shop/cart" className={path === '/shop/cart' ? 'is-active' : ''}><ShopIcon name="bag" /><span>Cart ({totals.count})</span></Link><Link href="/shop/account" className={path.startsWith('/shop/account') ? 'is-active' : ''}><ShopIcon name="user" /><span>Account</span></Link></nav>
    <div className={`ec-toast${toast ? ' is-visible' : ''}`} role="status" aria-live="polite">{toast && <><ShopIcon name="check" /><span>{toast}</span></>}</div>
  </div>;
}
