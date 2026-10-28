import 'server-only';
import { unstable_cache } from 'next/cache';
import { readPrivate } from '@/app/spin-store';
import { defaultCampaigns, type CampaignSettings } from './core';
export const CAMPAIGN_PATH = 'website/campaign-settings-v1.json';
export async function readCampaigns() {
  return (await readPrivate<CampaignSettings>(CAMPAIGN_PATH))?.value ?? defaultCampaigns();
}
const cached = unstable_cache(readCampaigns, ['mw-campaign-settings-v1'], { revalidate: 60, tags: ['mw-campaigns'] });
export async function publicCampaigns(fresh = false) {
  try { return fresh ? await readCampaigns() : await cached(); }
  catch { return defaultCampaigns(false); }
}
