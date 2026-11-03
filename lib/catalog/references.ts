import 'server-only';
import xiaomi17t from '@/data/verified-products/xiaomi-17t-india.json';
import xiaomi17 from '@/data/verified-products/xiaomi-17-india.json';
import xiaomi17Ultra from '@/data/verified-products/xiaomi-17-ultra-india.json';
import redmiNote17 from '@/data/verified-products/redmi-note-17-5g-india.json';
import redmiNote17ProMax from '@/data/verified-products/redmi-note-17-pro-max-5g-india.json';
import redmiNote17Pro from '@/data/verified-products/redmi-note-17-pro-5g-india.json';
import redmi17 from '@/data/verified-products/redmi-17-5g-india.json';
import redmi17c from '@/data/verified-products/redmi-17c-5g-india.json';
import iphone18Pro from '@/data/verified-products/iphone-18-pro-india.json';
import iphone18ProMax from '@/data/verified-products/iphone-18-pro-max-india.json';
import { normalizeProduct } from './core';

const references = [xiaomi17t, xiaomi17, xiaomi17Ultra, redmiNote17, redmiNote17ProMax, redmiNote17Pro, redmi17, redmi17c, iphone18Pro, iphone18ProMax];

// Checked source data can start a draft, but never writes or publishes content.
// Normalization returns a fresh copy, so editing cannot mutate the reference.
export function referenceDraft(id: string) {
  const reference = references.find(product => product.id === id);
  return reference ? normalizeProduct(reference) : null;
}
