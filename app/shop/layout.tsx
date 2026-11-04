import type { Metadata } from 'next';
import { shoppingProducts } from '@/data/commerce';
import { ShopProvider } from '@/components/commerce/ShopProvider';
import { ShopShell } from '@/components/commerce/ShopShell';
import './shopping.css';

export const metadata: Metadata = { title: 'Shopping preview', description: 'Mobile World का shopping preview — sample prices, cart, favourites और demo customer account।', robots: { index: false, follow: false, googleBot: { index: false, follow: false } }, alternates: { canonical: '/shop' } };
export default function ShoppingLayout({ children }: { children: React.ReactNode }) { return <ShopProvider products={shoppingProducts}><ShopShell>{children}</ShopShell></ShopProvider>; }
