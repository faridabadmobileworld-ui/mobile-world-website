import 'server-only';
import { cache } from 'react';
import { phoneModels, modelDisplayName, catalogueGuidePath } from '@/data/catalog';
import { items } from '@/data/content';
import prices from '@/data/phone-reference-prices.json';
import { publicPhoneGuides } from '@/lib/catalog/guides';
import { publicProducts } from '@/lib/catalog/sanity';
import { modelListing } from './model';
import type { Listing } from './core';

export const shoppingCatalogue = cache(async (): Promise<Listing[]> => {
  const catalogue = new Map<string, Listing>();
  for (const model of phoneModels) catalogue.set(model.id, { id: model.id, name: modelDisplayName(model), group: model.brand, kind: 'guide', href: catalogueGuidePath(model.id), image: model.image, imageAlt: model.imageAlt, variants: [], colours: [], prices: [] });
  for (const item of items) {
    const id = item.id;
    catalogue.set(id, { id, name: item.title, group: item.kicker, kind: 'category', href: '/products#' + item.category, image: item.image ?? '', imageAlt: item.imageAlt ?? item.title, variants: [], colours: [], prices: [] });
  }
  const editorial = publicPhoneGuides().map(product => ({ product, path: '/phones/', prices: prices[product.slug as keyof typeof prices] ?? [] }));
  const merchant = (await publicProducts()).map(product => ({ product, path: '/catalog/', prices: [] }));
  for (const { product, path, prices: refs } of [...editorial, ...merchant]) {
    catalogue.set(product.id,modelListing(product,path + product.slug,refs));
  }
  return [...catalogue.values()];
});
