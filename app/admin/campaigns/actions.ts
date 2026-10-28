'use server';
import { revalidatePath, updateTag } from 'next/cache';
import { requireOwnerAccess } from '@/app/spin-admin-actions';
import { transactPrivate } from '@/app/spin-store';
import { CAMPAIGN_PATH } from '@/lib/campaigns/store';
import { defaultCampaigns, validateCampaigns, type CampaignSettings } from '@/lib/campaigns/core';
export async function saveCampaigns(items: unknown, revision: number) {
  await requireOwnerAccess();
  const validated = validateCampaigns(items);
  const saved = await transactPrivate<CampaignSettings, CampaignSettings>(CAMPAIGN_PATH, defaultCampaigns, state => {
    if (state.revision !== revision) throw new Error('Settings किसी दूसरे tab में बदल गई हैं। Page refresh करके फिर save कीजिए।');
    state.items = validated; state.revision += 1; state.updatedAt = new Date().toISOString();
    return { value: state, changed: true };
  });
  updateTag('mw-campaigns');
  revalidatePath('/'); revalidatePath('/posts/[slug]', 'page');
  revalidatePath('/admin/campaigns');
  return saved;
}
