import type { PublicProduct, Variant } from './core';

export function productColours(product: PublicProduct): string[] {
  return [...new Set((product.values.spec_006 ?? '').split(/\s*[·\n]\s*/).map(value => value.trim()).filter(Boolean))];
}

export function selectedPreference(variant: Variant | undefined, colour: string): string {
  return [variant?.ram && 'RAM: ' + variant.ram, variant?.storage && 'Storage: ' + variant.storage,
    colour && 'Colour preference: ' + colour].filter(Boolean).join(' · ');
}

export type ReferencePrice = { amount: number; ram: string; storage: string; colour: string; checkedAt: string };
