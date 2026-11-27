import { productDisplayName, type PublicProduct } from '@/lib/catalog/core';
import { productColours, type ReferencePrice } from '@/lib/catalog/preferences';
import type { Listing } from './core';

export function modelListing(product: PublicProduct, href: string, prices: ReferencePrice[] = []): Listing {
  return {
    id:product.id, name:productDisplayName(product), group:product.brand, kind:'model', href,
    image:product.image, imageAlt:product.imageAlt, colours:productColours(product),
    variants:product.variants.map(v => ({
      key:v._key, ram:v.ram, storage:v.storage, colour:v.colour,
      ...(v.imageVerified && v.image ? {image:v.image} : {}),
    })),
    prices:prices.map(({ amount, ram, storage, colour, checkedAt }) => ({ amount, ram, storage, colour, checkedAt })),
  };
}
