'use client';
import { Suspense } from 'react';
import Link from 'next/link';
import { ShopHome, ShopProducts, ShopProductDetail, ShopFavourites, Breadcrumb } from './ShopCatalog';
import { ShopCart, ShopCheckout } from './ShopCheckout';
import { AccountOverview, AccountOrders, AccountAddresses, AccountProfile, OrderDetail } from './ShopAccount';
import { useShop } from './ShopProvider';
import { ShopIcon } from './ShopIcon';

function Help() { const faqs = [
  ['क्या यहाँ वास्तविक order place होगा?', 'यह shopping preview है। Checkout से आपके demo profile में sample order बनता है। दुकान को वास्तविक order नहीं भेजा जाता और payment नहीं लिया जाता।'],
  ['दिखाई गई prices क्या दुकान की selling prices हैं?', 'नहीं। सभी prices, coupon discount और delivery fee demo calculation के लिए हैं। वास्तविक selling price, stock और offers दुकान से confirm होंगे।'],
  ['मेरा account और order history कहाँ save होते हैं?', 'Demo profile, favourites, cart, addresses और order history इसी browser में save होते हैं। यह real authenticated account नहीं है। इस browser के दूसरे उपयोगकर्ता demo profiles खोल सकते हैं; sample details इस्तेमाल कीजिए।'],
  ['दूसरे phone पर account क्यों नहीं दिखता?', 'इस preview में cross-device sync, OTP, password login और cloud customer accounts सक्रिय नहीं हैं। Browser data साफ़ करने पर local demo profiles भी मिट सकते हैं।'],
  ['Model, colour और quantity कैसे चुनूँ?', 'Product page पर exact memory option और colour चुनिए। Cart में quantity घटा या बढ़ा सकते हैं। हर model, memory और colour combination की demo quantity अधिकतम 5 है।'],
  ['Order cancel या दोबारा कैसे करूँ?', 'My account → मेरे orders में order खोलिए। वहाँ demo order cancel कर सकते हैं या उसके items फिर cart में जोड़ सकते हैं। Refund नहीं बनता, क्योंकि payment लिया नहीं गया है।'],
  ['वास्तविक खरीदारी के लिए क्या करूँ?', 'दुकान के contact page से Mobile World से संपर्क कीजिए। Model की availability, final price, delivery, return और warranty terms की पुष्टि दुकान करेगी।'],
]; return <div className="ec-wrap ec-page ec-help"><Breadcrumb items={[{ label: 'Shopping help' }]} /><div className="ec-page-title"><p className="ec-eyebrow">WE ARE HERE TO HELP</p><h1>Shopping में मदद चाहिए?</h1><p>आपके account, cart और demo orders से जुड़े सवाल।</p></div><div className="ec-help-shortcuts"><Link href="/shop/account/orders"><ShopIcon name="box" /><b>मेरे orders</b><ShopIcon name="arrow" /></Link><Link href="/shop/account/addresses"><ShopIcon name="pin" /><b>Saved addresses</b><ShopIcon name="arrow" /></Link><Link href="/contact"><ShopIcon name="help" /><b>दुकान से संपर्क</b><ShopIcon name="arrow" /></Link></div><div className="ec-faqs">{faqs.map(([q, a]) => <details key={q}><summary>{q}<ShopIcon name="plus" /></summary><p>{a}</p></details>)}</div><div className="ec-help-contact"><h2>कुछ और पूछना है?</h2><p>वास्तविक खरीदारी और store support के लिए Mobile World की contact details देखिए।</p><Link className="ec-button" href="/contact">Contact page खोलिए <ShopIcon name="arrow" /></Link></div></div>; }
export function ShopScreen({ path }: { path: string[] }) {
  const { products } = useShop(); const route = path.join('/');
  let screen;
  if (!route) screen = <ShopHome />;
  else if (route === 'products') screen = <ShopProducts />;
  else if (path[0] === 'product') { const product = products.find(p => p.id === path[1]); screen = product ? <ShopProductDetail product={product} /> : null; }
  else if (route === 'cart') screen = <ShopCart />;
  else if (route === 'checkout') screen = <ShopCheckout />;
  else if (route === 'favourites') screen = <ShopFavourites />;
  else if (route === 'account') screen = <AccountOverview />;
  else if (route === 'account/orders') screen = <AccountOrders />;
  else if (path[0] === 'account' && path[1] === 'orders' && path[2]) screen = <OrderDetail id={path[2]} />;
  else if (route === 'account/addresses') screen = <AccountAddresses />;
  else if (route === 'account/profile') screen = <AccountProfile />;
  else screen = <Help />;
  return <Suspense fallback={<div className="ec-wrap ec-page ec-loading" role="status">Shopping page खुल रहा है…</div>}>{screen}</Suspense>;
}
