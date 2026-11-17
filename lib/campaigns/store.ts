import 'server-only';
import { unstable_cache } from 'next/cache';
import { readPrivate } from '@/app/spin-store';
import { defaultCampaigns, featuredModelIds, type CampaignSettings } from './core';
export const CAMPAIGN_PATH = 'website/campaign-settings-v1.json';
export async function readCampaigns() {
  const saved = (await readPrivate<CampaignSettings>(CAMPAIGN_PATH))?.value;
  const defaults = defaultCampaigns();
  return saved ? { ...saved, items: { ...defaults.items, ...saved.items } } : defaults;
}
const cached = unstable_cache(readCampaigns, ['mw-campaign-settings-v2'], { revalidate: 60, tags: ['mw-campaigns'] });
export async function publicCampaigns(fresh = false) {
  try { return fresh ? await readCampaigns() : await cached(); }
  catch {
    const fallback = defaultCampaigns(false);
    // Model links have no promotional terms. Time-sensitive offers still fail closed.
    for (const id of featuredModelIds) fallback.items[id].enabled = true;
    return fallback;
  }
}
