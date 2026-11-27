import type { Metadata } from 'next';
import { OrderHistory } from '@/components/commerce/OrderHistory';
export const metadata: Metadata = { title:'मेरे orders',robots:{index:false,follow:false},alternates:{canonical:'/orders'},referrer:'no-referrer' };
export default function Page() { return <OrderHistory/>; }
