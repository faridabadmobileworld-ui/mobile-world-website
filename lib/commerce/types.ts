export type ShopProduct = {
  id: string; name: string; brand: string; image: string; imageAlt: string;
  imageCaption: string; colours: { name: string; hex: string }[];
  variants: { name: string; price: number }[];
  specs: { label: string; value: string }[]; source: string; tag: string;
};
// All amounts are integer paise. This preview never represents live stock or prices.
export type CartLine = { productId: string; variant: string; colour: string; quantity: number };
export type Address = { id: string; label: string; name: string; phone: string; street: string; city: string; state: string; pin: string; isDefault: boolean };
export type OrderLine = CartLine & { name: string; image: string; unitPrice: number };
export type Totals = { subtotal: number; discount: number; delivery: number; total: number; count: number };
export type DemoOrder = {
  id: string; createdAt: string; status: 'placed' | 'cancelled'; lines: OrderLine[];
  totals: Totals; fulfilment: 'pickup' | 'delivery'; address: Address | null;
  coupon: string; payment: 'demo'; note: string;
};
export type CustomerData = { cart: CartLine[]; favourites: string[]; addresses: Address[]; orders: DemoOrder[] };
export type PreviewProfile = { id: string; name: string; email: string; phone: string; data: CustomerData };
export type ShoppingState = {
  version: 1; activeProfile: string | null; profiles: PreviewProfile[];
  guest: CustomerData; recent: string[]; storageAvailable: boolean;
};
