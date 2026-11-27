import type { Metadata } from 'next';
import { shoppingCatalogue } from '@/lib/commerce/catalogue';
import { ShoppingLists } from '@/components/commerce/ShoppingLists';
export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'आपकी Favourites', robots: { index: false, follow: false }, alternates: { canonical: '/favourites' } };
export default async function Page() { return <ShoppingLists page="favourites" catalogue={await shoppingCatalogue()}/>; }
