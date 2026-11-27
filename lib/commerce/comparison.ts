import { defaultChoice } from './discovery';
import { lineKey, validChoice, type Choice, type Listing } from './core';

export function comparisonHref(choices: Choice[], different = false) {
  const params = new URLSearchParams();
  choices.slice(0,3).forEach((c,i) => {
    const n = String(i + 1);
    params.set('m'+n,c.productId);
    if (c.variant) params.set('v'+n,c.variant);
    if (c.variant || c.colour) params.set('c'+n,c.colour);
  });
  if (different) params.set('different','1');
  return '/compare' + (params.size ? '?' + params : '');
}

type Params = Record<string,string | string[] | undefined>;
export function comparisonChoices(params: Params, items: Listing[]) {
  const choices: Choice[] = [];
  const seen = new Set<string>();
  let invalid = false;
  for (const n of ['1','2','3']) {
    const id = params['m'+n];
    if (id === undefined || id === '') continue;
    const item = items.find(i => i.kind === 'model' && i.id === id);
    const variant = params['v'+n], colour = params['c'+n];
    if (!item || typeof variant === 'object' || typeof colour === 'object') { invalid = true; continue; }
    const selection = variant === undefined && colour === undefined ? defaultChoice(item) :
      {productId:item.id,variant:variant ?? '',colour:colour ?? ''};
    if (!validChoice(item,selection)) { invalid = true; continue; }
    const key = lineKey(selection);
    if (!seen.has(key)) { choices.push(selection); seen.add(key); }
  }
  return { choices, invalid };
}
