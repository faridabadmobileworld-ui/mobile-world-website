import type { PublicProduct, Variant } from './core';

export function productColours(product: PublicProduct): string[] {
  return [...new Set((product.values.spec_006 ?? '').split(/\s*[·\n]\s*/).map(value => value.trim()).filter(Boolean))];
}

export function selectedPreference(variant: Variant | undefined, colour: string): string {
  return [variant?.ram && 'RAM: ' + variant.ram, variant?.storage && 'Storage: ' + variant.storage,
    colour && 'Colour preference: ' + colour].filter(Boolean).join(' · ');
}

export type ReferencePrice = { amount: number; ram: string; storage: string; colour: string; checkedAt: string };

export const sectionNames: Record<number, string> = {
  1: 'Model की जानकारी', 2: 'Design और बनावट', 3: 'Display', 4: 'Processor और memory',
  5: 'Camera और video', 6: 'Battery और charging', 7: 'Software', 8: 'Network और connectivity',
  9: 'Security और audio', 10: 'Warranty', 11: 'Box में क्या मिलता है',
};
