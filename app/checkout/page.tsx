import type { Metadata } from 'next';
import { Checkout } from '@/components/commerce/Checkout';
import { shoppingCatalogue } from '@/lib/commerce/catalogue';
export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title:'Checkout',robots:{index:false,follow:false},alternates:{ canonical:'/checkout' }, referrer:'no-referrer' };
export default async function Page() { return <Checkout catalogue={await shoppingCatalogue()}/>; }
