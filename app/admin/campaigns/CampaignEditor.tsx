'use client';
import { useState } from 'react';
import { campaignIds, campaignLabels, campaignIsLive, type CampaignSettings } from '@/lib/campaigns/core';
import { saveCampaigns } from './actions';
export function CampaignEditor({ initial }: { initial: CampaignSettings }) {
  const [data, setData] = useState(initial), [busy, setBusy] = useState(false), [message, setMessage] = useState('');
  return <form onSubmit={async e => { e.preventDefault(); setBusy(true); setMessage(''); try { setData(await saveCampaigns(data.items, data.revision)); setMessage('Settings save हो गई हैं। Homepage पर बदलाव लागू है।'); } catch (error) { setMessage(error instanceof Error ? error.message : 'Settings save नहीं हुईं।'); } finally { setBusy(false); } }}>
    <div className="ma-notes" style={{margin:'24px 0'}}><p>हर offer को चालू/बंद कीजिए और उसकी पुष्टि की हुई dates डालिए। सभी dates India time की हैं; end date की रात 11:59:59 तक campaign दिखेगा। खाली date का मतलब कोई समय सीमा तय नहीं है। Homepage अगली refresh पर बदलेगा; scheduled बदलाव लगभग एक मिनट में दिख सकते हैं।</p><p>Spin बंद करने से केवल नए spins रुकते हैं। पहले से जारी rewards के benefits और redemption records सुरक्षित रहते हैं। Product specifications और prices इस editor से नहीं बदलते।</p></div>
    {message && <p className="ma-card" role="status">{message}</p>}
    <div className="ma-two">{campaignIds.map(id => {
      const item = data.items[id];
      const change = (field: keyof typeof item, value: string | boolean) => setData(old => ({...old, items:{...old.items,[id]:{...old.items[id],[field]:value}}}));
      return <fieldset className="ma-card" key={id} disabled={busy}><legend>{campaignLabels[id]}</legend><label className="ma-auto"><input type="checkbox" checked={item.enabled} onChange={e => change('enabled',e.target.checked)}/>Enabled · {campaignIsLive(item) ? 'अभी चालू' : item.enabled ? 'Dates के बाहर' : 'बंद'}</label><div className="ma-range" style={{marginTop:18}}><label>शुरू होने की तारीख़<input type="date" value={item.start} max={item.end || undefined} onChange={e => change('start',e.target.value)}/></label><label>आख़िरी तारीख़<input type="date" value={item.end} min={item.start || undefined} onChange={e => change('end',e.target.value)}/></label></div><label className="ma-campaign-note">Customer को दिखने वाला note · optional<textarea maxLength={180} value={item.note} onChange={e => change('note',e.target.value)} placeholder="पुष्टि की हुई eligibility या offer की शर्त…"/></label></fieldset>;
    })}</div><button className="ma-primary" type="submit" disabled={busy}>{busy ? 'Save हो रहा है…' : 'Save और live कीजिए'}</button><p className="ma-muted">{data.updatedAt ? `आख़िरी बदलाव: ${new Date(data.updatedAt).toLocaleString('en-IN',{timeZone:'Asia/Kolkata'})}` : 'अभी मूल campaign settings लागू हैं।'}</p>
  </form>;
}
