import 'server-only';
import publication from '@/data/published-phone-guides.json';
import { referenceDraft } from './references';
import { publicProduct, validatePublication, type PublicProduct } from './core';

// These are deliberately released editorial specifications, not Sanity drafts.
// An editor reference is never public merely because a new JSON file exists.
export function publicPhoneGuides(): PublicProduct[] {
  return publication.modelIds.map(id => {
    const product = referenceDraft(id);
    if (!product) throw new Error(`Published phone guide has no reference: ${id}`);
    validatePublication(product);
    return publicProduct(product, publication.updatedAt);
  });
}

export function phoneGuideLinks(): Record<string, string> {
  return Object.fromEntries(publicPhoneGuides().map(product => [product.id, '/phones/' + product.slug]));
}
