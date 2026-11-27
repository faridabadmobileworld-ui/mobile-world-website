'use client';

import { useSyncExternalStore } from 'react';
import { basketFrom, emptyBasket, type Basket } from '@/lib/commerce/core';

const key = 'mw-shopping-basket-v1';
const legacyKey = 'mobile-world-shortlist-v1';
const server = emptyBasket();
let current = server, previous: string | null | undefined, volatile = false;
const listeners = new Set<() => void>();
const notify = () => { for (const listener of listeners) listener(); };

function snapshot(): Basket {
  if (volatile) return current;
  try {
    const raw = localStorage.getItem(key);
    if (previous !== raw) { previous = raw; current = basketFrom(raw, localStorage.getItem(legacyKey)); }
  } catch { volatile = true; }
  return current;
}
function refresh() { previous = undefined; notify(); }
function onStorage(e: StorageEvent) { if (e.key === key || e.key === legacyKey || e.key === null) refresh(); }
function subscribe(listener: () => void) {
  if (!listeners.size) { window.addEventListener('storage', onStorage); window.addEventListener('pageshow', refresh); }
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
    if (!listeners.size) { window.removeEventListener('storage', onStorage); window.removeEventListener('pageshow', refresh); }
  };
}
export function useBasket() { return useSyncExternalStore(subscribe, snapshot, () => server); }
export function browserStorageAvailable() { return !volatile; }

export async function updateBasket(change: (state: Basket) => Basket) {
  const write = () => {
    const next = change(snapshot());
    const raw = JSON.stringify(next);
    try { localStorage.setItem(key, raw); previous = raw; } catch { volatile = true; }
    current = next; notify();
  };
  if (navigator.locks) await navigator.locks.request(key, write); else write();
}
export async function toggleFavourite(id: string) {
  await updateBasket(s => ({ ...s, favourites: s.favourites.includes(id) ? s.favourites.filter(v => v !== id) : [...s.favourites, id] }));
}
