import 'server-only';
import xiaomi17t from '@/data/verified-products/xiaomi-17t-india.json';
import xiaomi17 from '@/data/verified-products/xiaomi-17-india.json';
import xiaomi17Ultra from '@/data/verified-products/xiaomi-17-ultra-india.json';
import { normalizeProduct } from './core';

const references = [xiaomi17t, xiaomi17, xiaomi17Ultra];

// Checked source data can start a draft, but never writes or publishes content.
// Normalization returns a fresh copy, so editing cannot mutate the reference.
export function referenceDraft(id: string) {
  const reference = references.find(product => product.id === id);
  return reference ? normalizeProduct(reference) : null;
}
