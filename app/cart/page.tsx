import type { Metadata } from 'next';
import { shoppingCatalogue } from '@/lib/commerce/catalogue';
import { ShoppingLists } from '@/components/commerce/ShoppingLists';
export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'आपका Cart', robots: { index: false, follow: false }, alternates: { canonical: '/cart' } };
export default async function Page() { return <ShoppingLists page="cart" catalogue={await shoppingCatalogue()}/>; }
