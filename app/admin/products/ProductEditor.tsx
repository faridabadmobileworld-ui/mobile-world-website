'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { phoneModels } from '@/data/catalog';
import { blankProduct, imageUrl, specificationSections, type EditorRecord, type ProductDraft } from '@/lib/catalog/core';
import { configureSanity, productEditorState, productReferenceDraft, publishSavedProduct, saveProductDraft, unpublishSavedProduct, uploadEditorImage } from './actions';

type State = Awaited<ReturnType<typeof productEditorState>>;
function result<T>(value: { ok: true; data: T } | { ok: false; error: string }): T {
  if (!value.ok) throw new Error(value.error);
  return value.data;
}
export function ProductEditor({ initial }: { initial: State }) {
  const [state, setState] = useState(initial), [draft, setDraft] = useState<EditorRecord | null>(initial.records[0] ?? null);
  const [busy, setBusy] = useState(false), [dirty, setDirty] = useState(false), [notice, setNotice] = useState('');
  useEffect(() => {
    if (!dirty) return;
    const warn = (event: BeforeUnloadEvent) => { event.preventDefault(); event.returnValue = ''; };
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [dirty]);
  let previewImage = '';
  try { previewImage = imageUrl(draft?.image); } catch { /* Wait until the URL is valid. */ }
  async function run(action: () => Promise<void>) {
    setBusy(true); setNotice('');
    try { await action(); } catch (error) { setNotice(error instanceof Error ? error.message : 'यह action पूरा नहीं हुआ। फिर कोशिश कीजिए।'); }
    finally { setBusy(false); }
  }
  async function reload(id = draft?.id) {
    const next = await productEditorState();
    if (next.error) { setState(old => ({ ...old, connection: next.connection, error: next.error })); throw new Error(next.error); }
    setState(next); setDraft(next.records.find(row => row.id === id) ?? next.records[0] ?? null); setDirty(false);
  }
  function update(patch: Partial<ProductDraft>) {
    if (!draft) return;
    setDraft({ ...draft, ...patch, verified: patch.verified ?? false,
      imageVerified: patch.image !== undefined ? false : (patch.imageVerified ?? draft.imageVerified) }); setDirty(true);
  }
  function choose(record: EditorRecord) {
    if (dirty) { setNotice('पहले current draft Save कीजिए।'); return; }
    setDraft(record); setNotice('');
  }
  async function add(existingId = '') {
    if (dirty) { setNotice('पहले current draft Save कीजिए।'); return; }
    const existing = phoneModels.find(model => model.id === existingId);
    const already = state.records.find(row => row.id === existingId);
    if (already) { choose(already); return; }
    const reference = existingId ? result(await productReferenceDraft(existingId)) : null;
    const base = reference ?? blankProduct(existingId || 'model-' + crypto.randomUUID());
    if (existing && !reference) { base.name = existing.name; base.brand = existing.brand; base.image = existing.image.startsWith('/images/') ? existing.image : ''; base.imageAlt = existing.imageAlt; }
    setDraft({ ...base, draftRevision: '', publishedRevision: '', publishedSlug: '' }); setDirty(true);
    setNotice(reference ? 'Official India sources से तैयार reference खुल गया। Unknown fields खाली हैं; यह अभी Sanity में save या publish नहीं हुआ है।' : 'नया draft है। Unknown specifications खाली रखें।');
  }
  return <main className="mw-analytics mw-editor">
    <header className="ma-heading"><div><p>OWNER DESK · SANITY CMS</p><h1>आपका Product Editor</h1><p>86 अलग fields · 11 sections · Draft से verified publication तक।</p></div><nav><Link href="/admin/analytics">Analytics</Link> · <Link href="/admin/business">Google & Enquiries</Link> · <Link href="/admin/campaigns">Offers</Link></nav></header>
    <p className="me-notice" role="status" aria-live="polite">{notice}</p>
    {dirty && <p><button type="button" disabled={busy} onClick={() => {
      if (window.confirm('Unsaved changes छोड़कर आख़िरी saved version खोलें?')) void run(() => reload());
    }}>Unsaved changes छोड़ें</button></p>}
    {state.error && <section className="ma-error" role="alert"><p>{state.error}</p><button type="button" disabled={busy || dirty} onClick={() => void run(() => reload())}>Saved products फिर से खोलिए</button></section>}
    <details className="ma-card me-connect" open={!state.connection.configured || Boolean(state.error)}>
      <summary>{state.connection.configured ? 'Connection settings · token renew कीजिए' : 'Existing Sanity project connect कीजिए'}</summary><p>{state.connection.message} आपका owner login पहले से तैयार है।</p>
      <p><a href="https://www.sanity.io/manage" target="_blank" rel="noopener noreferrer">Sanity Manage खोलिए ↗</a> और अपने existing project का Project ID, dataset तथा उसी project का Editor API token इस private form में भरिए।</p>
      <form key={state.connection.projectId + '/' + state.connection.dataset} onSubmit={event => { event.preventDefault(); const form = event.currentTarget, values = new FormData(form); void run(async () => {
        const projectId = String(values.get('projectId') ?? '').trim(), dataset = String(values.get('dataset') ?? '').trim(), token = String(values.get('token') ?? '').trim();
        form.reset(); result(await configureSanity(projectId, dataset, token));
        await reload(); setNotice('Sanity draft और publish access verify हो गई। अब अपना draft खोलिए।');
      }); }}>
        <label>Project ID<input name="projectId" required autoComplete="off" pattern="[a-z0-9]{4,16}" defaultValue={state.connection.projectId} readOnly={state.connection.configured} /></label>
        <label>Existing dataset<input name="dataset" required autoComplete="off" pattern="[a-z0-9][a-z0-9_-]{0,63}" defaultValue={state.connection.dataset} readOnly={state.connection.configured} /></label>
        <label>Project API token<input name="token" type="password" required minLength={20} maxLength={3000} autoComplete="off" /></label>
        <p>Token browser को वापस नहीं भेजा जाता। नया project बनाने की आवश्यकता नहीं है।</p>
        <button className="btn btn-d" disabled={busy || dirty}>{busy ? 'Connection जाँची जा रही है…' : 'Connect और verify कीजिए'}</button>
      </form>
    </details>
    {state.connection.configured && (!state.error || Boolean(draft)) && <>
      <section className="ma-card me-toolbar"><p>Connected: <strong>{state.connection.projectId}</strong> / {state.connection.dataset}</p><button className="btn btn-o" disabled={busy || dirty} onClick={() => void run(() => reload())}>Refresh</button><button className="btn btn-d" disabled={busy || dirty} onClick={() => void run(() => add())}>+ नया product</button>
        <label>Existing catalogue से draft<select value="" disabled={busy || dirty} onChange={event => { const id = event.target.value; void run(() => add(id)); }}><option value="">Model चुनिए</option>{phoneModels.map(model => <option key={model.id} value={model.id}>{model.brand} · {model.name}</option>)}</select></label></section>
      <div className="me-workspace"><aside className="ma-card me-records"><h2>Saved products</h2>{state.records.length === 0 && <p>अभी कोई Sanity product saved नहीं है। Existing website catalogue वैसा ही है।</p>}
        {state.records.map(record => <button type="button" key={record.id} disabled={busy || dirty} aria-pressed={draft?.id === record.id} onClick={() => choose(record)}><b>{record.name || record.id}</b><span>{record.brand} · {record.publishedRevision ? 'Published' : 'Draft'}</span></button>)}</aside>
      {draft && <form className="me-document" onSubmit={event => { event.preventDefault(); void run(async () => { result(await saveProductDraft(draft, draft.draftRevision)); await reload(draft.id); setNotice('Draft Sanity में save हो गया। Publish होने तक customers को बदलाव नहीं दिखेंगे।'); }); }}>
        <fieldset disabled={busy}><section className="ma-card"><h2>Model की पहचान</h2><div className="me-grid">
          <label>Brand<input value={draft.brand} maxLength={80} onChange={event => update({ brand: event.target.value })} /></label>
          <label>Series<input value={draft.series} maxLength={100} onChange={event => update({ series: event.target.value })} /></label>
          <label>Model name<input value={draft.name} maxLength={120} onChange={event => update({ name: event.target.value })} /></label>
          <label>Product URL slug<input value={draft.slug} readOnly={Boolean(draft.publishedRevision)} maxLength={100} pattern="[a-z0-9][a-z0-9-]{1,99}" onChange={event => update({ slug: event.target.value })} /></label>
        </div><label>Customer description<textarea value={draft.description} maxLength={2000} onChange={event => update({ description: event.target.value })} /></label></section>
        <section className="ma-card"><h2>Product image</h2>{previewImage && <Image className="me-image" src={previewImage} alt={draft.imageAlt || draft.name} width={420} height={320} />}
          <label>Image URL<input value={draft.image} maxLength={1000} onChange={event => update({ image: event.target.value })} /></label>
          <label>Alt text<input value={draft.imageAlt} maxLength={200} onChange={event => update({ imageAlt: event.target.value })} /></label>
          <label>Image upload · PNG / JPEG / WebP · maximum 4 MB<input type="file" accept="image/png,image/jpeg,image/webp" onChange={event => { const file = event.target.files?.[0]; if (!file) return; const form = new FormData(); form.set('image', file); void run(async () => { const uploaded = result(await uploadEditorImage(form)); update({ image: uploaded.url }); setNotice('Image upload हो गई। सही model और colour verify करके draft save कीजिए।'); }); event.target.value = ''; }} /></label>
          <label className="me-check"><input type="checkbox" checked={draft.imageVerified} onChange={event => update({ imageVerified: event.target.checked })} /> यह सही model की approved/official product image है।</label>
        </section>
        {specificationSections.map(section => <details className="ma-card me-section" key={section.id} open={section.id === 1}><summary>{section.id}. {section.title}</summary><div className="me-grid">{section.fields.map(field => <label key={field.key}>{field.id}. {field.label}{field.id === 7 ? ' · केवल private admin' : ''}<input
          value={field.id === 1 ? draft.brand : field.id === 2 ? draft.name : draft.values[field.key] ?? ''}
          readOnly={field.id === 1 || field.id === 2} maxLength={500}
          onChange={event => update({ values: { ...draft.values, [field.key]: event.target.value } })} /></label>)}</div></details>)}
        <section className="ma-card"><h2>Actual variants</h2><p>केवल confirmed RAM + storage + colour combinations जोड़िए।</p>
          {draft.variants.map((variant, index) => <div className="me-variant" key={variant._key}><div className="me-grid">{(['ram', 'storage', 'colour', 'image'] as const).map(field => <label key={field}>{field === 'ram' ? 'RAM' : field === 'storage' ? 'Storage' : field === 'colour' ? 'Colour' : 'Variant image URL'}<input value={variant[field]} onChange={event => update({ variants: draft.variants.map((v, i) => i === index ? { ...v, [field]: event.target.value, imageVerified: field === 'image' ? false : v.imageVerified } : v) })} /></label>)}</div>
          <label className="me-check"><input type="checkbox" checked={variant.imageVerified} onChange={event => update({ variants: draft.variants.map((v, i) => i === index ? { ...v, imageVerified: event.target.checked } : v) })} /> Variant image का model और colour verified है।</label>
          <button className="btn btn-o" type="button" onClick={() => update({ variants: draft.variants.filter((_, i) => i !== index) })}>यह variant हटाइए</button></div>)}
          <button className="btn btn-o" type="button" onClick={() => update({ variants: [...draft.variants, { _key: 'v-' + crypto.randomUUID(), ram: '', storage: '', colour: '', image: '', imageVerified: false }] })}>+ Variant जोड़िए</button></section>
        <section className="ma-card"><h2>Verification और Publish</h2>
          <label>Official sources · हर line पर एक HTTPS URL<textarea value={draft.sources.join('\n')} onChange={event => update({ sources: event.target.value.split('\n') })} /></label>
          <label>India details verify करने की date<input type="date" value={draft.verifiedAt} onChange={event => update({ verifiedAt: event.target.value })} /></label>
          <label className="me-check"><input type="checkbox" checked={draft.verified} onChange={event => update({ verified: event.target.checked })} /> भरी हुई specifications और actual India variants इन sources से verify किए हैं। Unknown fields खाली हैं।</label>
          <div className="btns"><button className="btn btn-d" type="submit">{busy ? 'Save हो रहा है…' : 'Draft save कीजिए'}</button>
            <button className="btn btn-w" type="button" disabled={dirty || !draft.draftRevision || !draft.verified || !draft.imageVerified} onClick={() => void run(async () => { const published = result(await publishSavedProduct(draft.id, draft.draftRevision, draft.publishedRevision)); await reload(draft.id); setNotice(published.backupSaved ? 'Product publish हो गया। Website पर अपना page खोलकर देखिए।' : 'Product publish हो गया; backup snapshot save नहीं हुई। Connection जाँचिए।'); })}>Saved draft publish कीजिए</button>
            {draft.publishedRevision && <button className="btn btn-o" type="button" disabled={dirty} onClick={() => void run(async () => { const unpublished = result(await unpublishSavedProduct(draft.id, draft.publishedRevision)); await reload(draft.id); setNotice(unpublished.backupSaved ? 'Product public website से हट गया। Draft सुरक्षित है।' : 'Product unpublish हुआ; backup snapshot update नहीं हुई।'); })}>Unpublish · draft सुरक्षित रखें</button>}
          </div>{draft.publishedRevision && <p><Link href={'/catalog/' + draft.publishedSlug} target="_blank">Live product page खोलिए →</Link></p>}
          {dirty && <p>Unsaved changes हैं। Publish से पहले Draft save कीजिए।</p>}
        </section></fieldset>
      </form>}</div>
    </>}
  </main>;
}
