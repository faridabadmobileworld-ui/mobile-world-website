import type { Metadata } from 'next';
import { Checkout } from '@/components/commerce/Checkout';
import { shoppingCatalogue } from '@/lib/commerce/catalogue';
import { checkoutItem } from '@/lib/commerce/core';
export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title:'Checkout',robots:{index:false,follow:false},alternates:{ canonical:'/checkout' }, referrer:'no-referrer' };
export default async function Page({ searchParams }: { searchParams: Promise<Record<string,string | string[] | undefined>> }) {
  const [catalogue, params] = await Promise.all([shoppingCatalogue(), searchParams]);
  const direct = checkoutItem(params, catalogue);
  return <Checkout key={JSON.stringify(direct)} catalogue={catalogue} direct={direct}/>;
}
