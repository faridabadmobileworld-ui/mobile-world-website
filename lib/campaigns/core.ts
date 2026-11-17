export const featuredModelIds = ['xiaomi-xiaomi-17t', 'vivo-vivo-v80-5g', 'oppo-f35-pro-5g'] as const;
export const campaignLabels = {
  diwali: 'Diwali यात्रा campaign', gifts: 'Festival gifts',
  'xiaomi-xiaomi-17t': 'Xiaomi 17T · Home',
  'vivo-vivo-v80-5g': 'vivo V80 5G · Home',
  'oppo-f35-pro-5g': 'OPPO F35 Pro 5G · Home',
  redmi: 'REDMI 17C · पुराना offer article', vivo: 'vivo V80 · पुराना offer article',
  oppo: 'OPPO F35 Pro · पुराना offer article', spin: 'नए Spin rewards',
} as const;
export type CampaignId = keyof typeof campaignLabels;
export type Campaign = { enabled: boolean; start: string; end: string; note: string };
export type CampaignSettings = { revision: number; updatedAt: string; items: Record<CampaignId, Campaign> };
export const campaignIds = Object.keys(campaignLabels) as CampaignId[];
export function isFeaturedModel(id: CampaignId) {
  return featuredModelIds.some(modelId => modelId === id);
}
export function defaultCampaigns(enabled = true): CampaignSettings {
  return { revision: 0, updatedAt: '', items: Object.fromEntries(campaignIds.map(id => [id, { enabled, start: '', end: '', note: '' }])) as CampaignSettings['items'] };
}
export function campaignIsLive(c: Campaign, now = Date.now()) {
  return c.enabled && (!c.start || now >= Date.parse(`${c.start}T00:00:00+05:30`)) && (!c.end || now < Date.parse(`${c.end}T23:59:59.999+05:30`) + 1);
}
export function validateCampaigns(value: unknown, saved?: Partial<CampaignSettings['items']>): CampaignSettings['items'] {
  if (!value || typeof value !== 'object') throw new Error('Campaign settings सही नहीं हैं।');
  const date = (v: unknown) => {
    if (v === '') return '';
    if (typeof v !== 'string' || !/^20\d\d-\d{2}-\d{2}$/.test(v) || !Number.isFinite(Date.parse(v)) || new Date(v).toISOString().slice(0, 10) !== v) throw new Error('सही campaign date चुनिए।');
    return v;
  };
  return Object.fromEntries(campaignIds.map(id => {
    // An editor opened before the Home cards were introduced only submits the original campaigns.
    const row = isFeaturedModel(id) && !Object.hasOwn(value, id)
      ? saved?.[id] ?? { enabled: true, start: '', end: '', note: '' }
      : (value as Record<string, unknown>)[id];
    if (!row || typeof row !== 'object') throw new Error('सभी campaigns की settings भेजिए।');
    const c = row as Record<string, unknown>, start = date(c.start), end = date(c.end);
    if (typeof c.enabled !== 'boolean' || typeof c.note !== 'string' || c.note.length > 180 || (start && end && start > end)) throw new Error('Campaign की dates या note सही नहीं हैं।');
    return [id, { enabled: c.enabled, start, end, note: c.note.replace(/[\u0000-\u001f]/g, ' ').trim() }];
  })) as CampaignSettings['items'];
}
