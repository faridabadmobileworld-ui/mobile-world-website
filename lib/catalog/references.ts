import 'server-only';
import xiaomi17t from '@/data/verified-products/xiaomi-17t-india.json';
import { normalizeProduct } from './core';

// Checked source data can start a draft, but never writes or publishes content.
// Normalization returns a fresh copy, so editing cannot mutate the reference.
export function referenceDraft(id: string) {
  return id === xiaomi17t.id ? normalizeProduct(xiaomi17t) : null;
}
