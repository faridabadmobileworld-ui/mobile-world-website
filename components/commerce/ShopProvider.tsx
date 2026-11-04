'use client';

import { createContext, useCallback, useContext, useEffect, useState, useSyncExternalStore, type ReactNode } from 'react';
import { cartTotals, cleanAddress, cleanCart, currentCustomer, editCustomer, emptyCustomer, emptyState, enterProfile, lineKey, placeDemoOrder, restoreState } from '@/lib/commerce/core';
import type { Address, CartLine, CustomerData, ShoppingState, ShopProduct } from '@/lib/commerce/types';

const STORAGE_KEY = 'mw-shopping-preview-v1';
function makeStore(products: ShopProduct[]) {
  const server = emptyState();
  let state = server, loaded = false;
  const listeners = new Set<() => void>();
  const read = () => { try { return restoreState(JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null'), products); } catch { return { ...emptyState(), storageAvailable: false }; } };
  const get = () => { if (!loaded && typeof window !== 'undefined') { state = read(); loaded = true; } return state; };
  const emit = () => listeners.forEach(fn => fn());
  const storage = (event: StorageEvent) => { if (event.key === STORAGE_KEY || event.key === null) { state = read(); loaded = true; emit(); } };
  return {
    get, server: () => server,
    subscribe(fn: () => void) { if (!listeners.size) window.addEventListener('storage', storage); listeners.add(fn); return () => { listeners.delete(fn); if (!listeners.size) window.removeEventListener('storage', storage); }; },
    update(fn: (s: ShoppingState) => ShoppingState) {
      state = fn(get());
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch { state = { ...state, storageAvailable: false }; }
      emit(); return state;
    },
  };
}
type ShopContextType = ReturnType<typeof useShoppingValue>;
const ShopContext = createContext<ShopContextType | null>(null);

function useShoppingValue(products: ShopProduct[]) {
  const [store] = useState(() => makeStore(products));
  const state = useSyncExternalStore(store.subscribe, store.get, store.server);
  const [toast, setToast] = useState('');
  useEffect(() => { if (!toast) return; const timer = setTimeout(() => setToast(''), 4200); return () => clearTimeout(timer); }, [toast]);
  const remember = useCallback((id: string) => { if (products.some(p => p.id === id) && store.get().recent[0] !== id) store.update(s => ({ ...s, recent: [id, ...s.recent.filter(p => p !== id)].slice(0, 8) })); }, [products, store]);
  const profile = state.profiles.find(p => p.id === state.activeProfile) ?? null;
  const customer = currentCustomer(state);
  const edit = (fn: (d: CustomerData) => CustomerData) => store.update(s => editCustomer(s, fn));
  const notify = (message: string) => setToast(message);
  function add(line: CartLine) {
    edit(d => ({ ...d, cart: cleanCart([...d.cart, line], products) }));
    notify('Cart में जोड़ दिया गया।');
  }
  function quantity(line: CartLine, quantity: number) {
    edit(d => ({ ...d, cart: cleanCart(d.cart.map(l => lineKey(l) === lineKey(line) ? { ...l, quantity } : l), products) }));
  }
  function remove(line: CartLine) { edit(d => ({ ...d, cart: d.cart.filter(l => lineKey(l) !== lineKey(line)) })); notify('Item cart से हटा दिया गया।'); }
  function favourite(id: string) { if (!products.some(p => p.id === id)) return; edit(d => ({ ...d, favourites: d.favourites.includes(id) ? d.favourites.filter(f => f !== id) : [...d.favourites, id] })); }
  function saveForLater(line: CartLine) { edit(d => ({ ...d, cart: d.cart.filter(l => lineKey(l) !== lineKey(line)), favourites: [...new Set([...d.favourites, line.productId])] })); notify('Favourites में save हो गया।'); }
  function login(id: string) { store.update(s => enterProfile(s, id, products)); notify('आपका demo profile खुल गया।'); }
  function createProfile(name: string, email: string, phone = '') {
    if (store.get().profiles.length >= 6) { notify('एक browser में 6 demo profiles रख सकते हैं।'); return null; }
    const id = crypto.randomUUID();
    store.update(s => enterProfile({ ...s, profiles: [...s.profiles, { id, name: name.trim().slice(0, 80) || 'Demo Customer', email: email.trim().slice(0, 160), phone: phone.trim().slice(0, 10), data: emptyCustomer() }] }, id, products));
    notify('आपका demo account तैयार है।'); return id;
  }
  function demoLogin() {
    const found = store.get().profiles.find(p => p.email === 'customer@example.test');
    if (found) login(found.id); else createProfile('Demo Customer', 'customer@example.test');
  }
  function logout() { store.update(s => ({ ...s, activeProfile: null, guest: emptyCustomer(), recent: [] })); notify('Demo profile से sign out हो गया।'); }
  function updateProfile(name: string, email: string, phone: string) { store.update(s => ({ ...s, profiles: s.profiles.map(p => p.id === s.activeProfile ? { ...p, name: name.trim().slice(0, 80), email: email.trim().slice(0, 160), phone: phone.trim().slice(0, 10) } : p) })); notify('Profile की जानकारी save हो गई।'); }
  function saveAddress(input: Address) {
    const address = cleanAddress(input); if (!address) return false;
    if (customer.addresses.length >= 10 && !customer.addresses.some(a => a.id === address.id)) { notify('अधिकतम 10 addresses रख सकते हैं।'); return false; }
    edit(d => { const other = d.addresses.filter(a => a.id !== address.id); const isDefault = address.isDefault || other.length === 0 || !other.some(a => a.isDefault); return { ...d, addresses: [...other.map(a => ({ ...a, isDefault: isDefault ? false : a.isDefault })), { ...address, isDefault }] }; });
    notify('Address save हो गया।'); return true;
  }
  function removeAddress(id: string) { edit(d => { const addresses = d.addresses.filter(a => a.id !== id); return { ...d, addresses: addresses.map((a, i) => ({ ...a, isDefault: addresses.some(b => b.isDefault) ? a.isDefault : i === 0 })) }; }); notify('Address हटा दिया गया।'); }
  function defaultAddress(id: string) { edit(d => ({ ...d, addresses: d.addresses.map(a => ({ ...a, isDefault: a.id === id })) })); notify('Default address बदल गया।'); }
  function order(fulfilment: 'pickup' | 'delivery', addressId: string, coupon: string, note: string) {
    const id = `MW-DEMO-${Date.now().toString(36).toUpperCase()}-${crypto.randomUUID().slice(0, 6).toUpperCase()}`;
    const next = store.update(s => placeDemoOrder(s, products, { id, createdAt: new Date().toISOString(), fulfilment, addressId, coupon, note }));
    return currentCustomer(next).orders.some(o => o.id === id) ? id : null;
  }
  function cancelOrder(id: string) { edit(d => ({ ...d, orders: d.orders.map(o => o.id === id ? { ...o, status: 'cancelled' } : o) })); notify('Demo order cancel हो गया। कोई payment नहीं लिया गया था।'); }
  function reorder(id: string) { edit(d => ({ ...d, cart: cleanCart([...d.cart, ...(d.orders.find(o => o.id === id)?.lines ?? [])], products) })); notify('Order के items cart में जोड़ दिए गए।'); }
  function deleteProfile() { store.update(s => ({ ...s, profiles: s.profiles.filter(p => p.id !== s.activeProfile), activeProfile: null, guest: emptyCustomer(), recent: [] })); notify('इस demo profile का local data हटा दिया गया।'); }
  return { products, state, customer, profile, ready: state !== store.server(), toast, notify, add, quantity, remove, favourite, saveForLater, login, createProfile, demoLogin, logout, updateProfile, saveAddress, removeAddress, defaultAddress, order, cancelOrder, reorder, deleteProfile, totals: cartTotals(customer.cart, products), remember };
}
export function ShopProvider({ products, children }: { products: ShopProduct[]; children: ReactNode }) { const value = useShoppingValue(products); return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>; }
export function useShop() { const context = useContext(ShopContext); if (!context) throw new Error('Shopping provider is required'); return context; }
