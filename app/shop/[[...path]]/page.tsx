import { notFound } from 'next/navigation';
import { ShopScreen } from '@/components/commerce/ShopScreen';
import { shoppingProducts } from '@/data/commerce';
const fixed = ['', 'products', 'cart', 'checkout', 'favourites', 'account', 'account/orders', 'account/addresses', 'account/profile', 'help'];
export default async function ShoppingPage({ params }: { params: Promise<{ path?: string[] }> }) {
  const path = (await params).path ?? [];
  const key = path.join('/');
  if (!fixed.includes(key) && !(path.length === 2 && path[0] === 'product' && shoppingProducts.some(p => p.id === path[1])) && !(path.length === 3 && path[0] === 'account' && path[1] === 'orders' && /^MW-DEMO-[A-Z0-9-]{4,60}$/.test(path[2]))) notFound();
  return <ShopScreen key={key} path={path} />;
}
