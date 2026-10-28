export const campaignLabels = {
  diwali: 'Diwali यात्रा campaign', gifts: 'Festival gifts', redmi: 'REDMI 17C offer',
  vivo: 'vivo V80 pre-booking', oppo: 'OPPO F35 Pro launch', spin: 'नए Spin rewards',
} as const;
export type CampaignId = keyof typeof campaignLabels;
export type Campaign = { enabled: boolean; start: string; end: string; note: string };
export type CampaignSettings = { revision: number; updatedAt: string; items: Record<CampaignId, Campaign> };
export const campaignIds = Object.keys(campaignLabels) as CampaignId[];
export function defaultCampaigns(enabled = true): CampaignSettings {
  return { revision: 0, updatedAt: '', items: Object.fromEntries(campaignIds.map(id => [id, { enabled, start: '', end: '', note: '' }])) as CampaignSettings['items'] };
}
export function campaignIsLive(c: Campaign, now = Date.now()) {
  return c.enabled && (!c.start || now >= Date.parse(`${c.start}T00:00:00+05:30`)) && (!c.end || now < Date.parse(`${c.end}T23:59:59.999+05:30`) + 1);
}
export function validateCampaigns(value: unknown): CampaignSettings['items'] {
  if (!value || typeof value !== 'object') throw new Error('Campaign settings सही नहीं हैं।');
  const date = (v: unknown) => {
    if (v === '') return '';
    if (typeof v !== 'string' || !/^20\d\d-\d{2}-\d{2}$/.test(v) || !Number.isFinite(Date.parse(v)) || new Date(v).toISOString().slice(0, 10) !== v) throw new Error('सही campaign date चुनिए।');
    return v;
  };
  return Object.fromEntries(campaignIds.map(id => {
    const row = (value as Record<string, unknown>)[id];
    if (!row || typeof row !== 'object') throw new Error('सभी campaigns की settings भेजिए।');
    const c = row as Record<string, unknown>, start = date(c.start), end = date(c.end);
    if (typeof c.enabled !== 'boolean' || typeof c.note !== 'string' || c.note.length > 180 || (start && end && start > end)) throw new Error('Campaign की dates या note सही नहीं हैं।');
    return [id, { enabled: c.enabled, start, end, note: c.note.replace(/[\u0000-\u001f]/g, ' ').trim() }];
  })) as CampaignSettings['items'];
}
