"use client";
import { MotionHeading } from "@/components/MotionHeading";
import { trackAction } from "./WebsiteAnalytics";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { phoneBrands, phoneModels, searchPhoneModels, legacyGuideGroups, modelEnquiry, modelDisplayName, catalogueGuidePath } from "@/data/catalog";
import { categorySearchAliases } from "@/data/search";
import { shop } from "@/data/shop";
import type { Item, NavCategory } from "@/data/content";
import { ProductCard } from "./ProductCard";
import { IconArrow, IconWhatsApp, IconSearch } from "./Icons";

import { useBasket, updateBasket } from './commerce/basket';
import { defaultChoice, findChoice } from '@/lib/commerce/discovery';
import { lineKey, type Listing } from '@/lib/commerce/core';
import { ShopModelCard } from './commerce/ShopModelCard';
const fields = [{key:"display",label:"Display"},{key:"camera",label:"Camera"},{key:"processor",label:"Processor"},{key:"power",label:"Battery / charging"},{key:"software",label:"Software"}] as const;

function Modal({ title, children, close }: { title: string; children: React.ReactNode; close: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const dialog = ref.current;
    const previous = document.activeElement as HTMLElement | null;
    const overflow = document.body.style.overflow;
    dialog?.showModal();
    document.body.style.overflow = "hidden";
    return () => { dialog?.close(); document.body.style.overflow = overflow; previous?.focus(); };
  }, []);
  return <dialog ref={ref} className="mw-dialog" aria-label={title} onCancel={close} onClick={(e) => {if (e.target === e.currentTarget) close();}}>
    <div className="mw-dialog-inner"><button type="button" className="mw-dialog-close" onClick={close} aria-label="जानकारी बंद कीजिए">×</button>{children}</div>
  </dialog>;
}

export function ProductExplorer({ categories, items, productPages = {}, listings = [] }: { categories: NavCategory[]; items: Item[]; productPages?: Record<string, string>; listings?: Listing[] }) {
  const params = useSearchParams();
  const legacyGroup = legacyGuideGroups[params.get("model") ?? ""];
  const [query, setQuery] = useState(params.get("q") ?? legacyGroup?.query ?? "");
  const [category, setCategory] = useState("all");
  const [brand, setBrand] = useState(phoneBrands.some((b) => b.slug === params.get("brand")) ? params.get("brand")! : legacyGroup?.brand ?? "all");
  const { favourites } = useBasket();
  const shared = params.get("shortlist");
  const [sharedList, setSharedList] = useState<{source: string; ids:string[]} | null>(null);
  const modelIds = new Set([...phoneModels.map(p => p.id), ...listings.map(p => p.id)]);
  const ids = shared !== null ? (sharedList?.source === shared ? sharedList.ids : shared.split(',')) : favourites;
  const saved = [...new Set(ids)].filter(id => modelIds.has(id));
  const [onlySaved, setOnlySaved] = useState(params.has("shortlist") || params.get("view") === "shortlist");
  const [compare, setCompare] = useState<string[]>([]);
  const [compareOpen, setCompareOpen] = useState(false);
  const [notice, setNotice] = useState("");
  const [shareUrl, setShareUrl] = useState("");
  const [sort,setSort] = useState('relevance');

  useEffect(() => {
    const sync = () => {
      const hash = window.location.hash.slice(1);
      setCategory(categories.some((c) => c.slug === hash) ? hash : "all");
    };
    const frame = requestAnimationFrame(() => {
      const group = legacyGuideGroups[params.get("model") ?? ""];
      sync(); setQuery(params.get("q") ?? group?.query ?? "");
      setBrand(phoneBrands.some((b) => b.slug === params.get("brand")) ? params.get("brand")! : group?.brand ?? "all");
      if (group) setNotice("इस series के अलग models नीचे हैं। अपना exact model चुनिए।");
    });
    const anchorClick = (event: MouseEvent) => {
      if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || event.button !== 0) return;
      const anchor = (event.target as HTMLElement).closest<HTMLAnchorElement>('a[href*="/products#"]');
      if (!anchor) return;
      const url = new URL(anchor.href, window.location.origin);
      if (url.origin !== window.location.origin || url.pathname !== "/products") return;
      const slug = url.hash.slice(1);
      if (categories.some((c) => c.slug === slug)) {setCategory(slug);setOnlySaved(false);setQuery("");setBrand("all");}
    };
    document.addEventListener("click", anchorClick, true);
    window.addEventListener("hashchange", sync);
    return () => { cancelAnimationFrame(frame); window.removeEventListener("hashchange", sync); document.removeEventListener("click", anchorClick, true); };
  }, [categories, params]);

  async function toggleSaved(id: string) {
    const removing = saved.includes(id);
    trackAction("shortlist", (removing ? "remove: " : "add: ") + id);
    if (shared !== null) setSharedList({source:shared,ids:removing ? saved.filter(v => v !== id) : [...saved,id]});
    try { await updateBasket(s => ({ ...s, favourites:removing ? s.favourites.filter(v => v !== id) : [...new Set([...s.favourites,id])] })); }
    catch { setNotice("इस browser में पसंद save नहीं हो सकी।"); }
  }
  function toggleCompare(id: string) {
    trackAction("compare", id);
    if (compare.includes(id)) { setCompare(compare.filter((v) => v !== id)); return; }
    if (compare.length === 3) { setNotice("एक बार में 3 models compare कर सकते हैं। पहले किसी model को हटाइए।"); return; }
    setCompare([...compare, id]); setNotice("");
  }
  function chooseCategory(slug: string) {
    trackAction("category", slug);
    setCategory(slug); setOnlySaved(false); setBrand("all");
    window.history.replaceState(null, "", `${window.location.pathname}${window.location.search}${slug === "all" ? "" : `#${slug}`}`);
  }
  async function share() {
    const link = `${shop.siteUrl}/products?shortlist=${saved.join(",")}`;
    setShareUrl(link);
    try { await navigator.clipboard.writeText(link); setNotice("Shortlist का link copy हो गया। आप इसे share कर सकते हैं।"); }
    catch { setNotice("नीचे दिए link को copy करके share कीजिए।"); }
  }
  const terms = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
  const byId = new Map(listings.map(item => [item.id,item]));
  const legacyHits = new Set(searchPhoneModels(query).map(p => p.id));
  const matches = new Map(listings.map(item => [item.id,findChoice(item,query)]));
  const models = phoneModels.filter(p => (legacyHits.has(p.id) || matches.get(p.id)) && (category === "all" || category === "smartphones") && (brand === "all" || p.brandSlug === brand) && (!onlySaved || saved.includes(p.id)));
  const known = new Set(phoneModels.map(p => p.id));
  const additional = listings.filter(p => !known.has(p.id) && matches.get(p.id) && (category === 'all' || category === 'smartphones') &&
    (brand === 'all' || p.id.startsWith(brand + '-') || p.group.toLowerCase() === brand) && (!onlySaved || saved.includes(p.id)));
  const results = [
    ...models.map(model => ({id:model.id, name:modelDisplayName(model), model, listing:byId.get(model.id)})),
    ...additional.map(listing => ({id:listing.id, name:listing.name, model:undefined, listing})),
  ];
  const reference = (id: string) => Math.min(...(byId.get(id)?.prices.map(p => p.amount) ?? []));
  const priority = (id: string) => id === 'xiaomi-xiaomi-17t' ? 0 : byId.has(id) ? 1 : 2;
  results.sort((a,b) => {
    if (sort === 'name') return a.name.localeCompare(b.name,'en-IN');
    if (sort === 'price') {
      const low = reference(a.id), high = reference(b.id);
      if (low !== high) return low < high ? -1 : 1;
    }
    return priority(a.id) - priority(b.id);
  });
  const generic = onlySaved || brand !== "all" ? [] : items.filter((p) => (category === "all" || category === p.category) && terms.every((w) => `${p.title} ${p.kicker} ${p.tags.join(" ")} ${categorySearchAliases[p.category] ?? ""} ${categories.find((c) => c.slug === p.category)?.label ?? ""}`.toLowerCase().includes(w)));
  const chosen = saved.flatMap((id) => phoneModels.filter((p) => p.id === id));
  const comparing = compare.flatMap((id) => phoneModels.filter((p) => p.id === id));

  return <>
    <div className="mw-catalog-toolbar">
      <label className="mw-catalog-search"><span className="sr">Product या brand ढूँढ़िए</span><IconSearch /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Model, brand या सामान का नाम…" type="search" /></label>
      <label><span className="sr">Brand चुनिए</span><select value={brand} onChange={(e) => { trackAction("brand", e.target.value); setBrand(e.target.value); setCategory("all"); }}><option value="all">सभी brands / सामान</option>{phoneBrands.map((b) => <option key={b.slug} value={b.slug}>{b.name}</option>)}</select></label>
      <label><span className="sr">Models का क्रम</span><select value={sort} onChange={e => setSort(e.target.value)}><option value="relevance">सुझाया गया क्रम</option><option value="name">Model का नाम · A–Z</option><option value="price">सबसे कम दर्ज India reference पहले</option></select></label>
      <button className={`mw-filter ${onlySaved ? "active" : ""}`} type="button" aria-pressed={onlySaved} onClick={() => {setOnlySaved(!onlySaved);setCategory("all");setQuery("");setBrand("all");}}>♡ मेरी Favourites <span>{saved.length}</span></button>
    </div>
    <div className="mw-filter-row" aria-label="Product category"><button type="button" className={`mw-filter ${category === "all" ? "active" : ""}`} aria-pressed={category === "all"} onClick={() => chooseCategory("all")}>सभी products</button>{categories.map((c) => <button type="button" key={c.slug} className={`mw-filter ${category === c.slug ? "active" : ""}`} aria-pressed={category === c.slug} onClick={() => chooseCategory(c.slug)}>{c.label}</button>)}</div>
    <p className="mw-small mw-catalog-note" role="status">{results.length} phone results · {generic.length} अन्य products। दुकान का दाम और stock Mobile World से confirm होगा।</p>
    <p className="mw-notice" role="status">{notice}</p>
    {onlySaved && <section className="mw-shortlist-head"><div><MotionHeading as="h2">आपकी पसंद, एक जगह।</MotionHeading><p>{saved.length ? `${saved.length} models आपकी shortlist में हैं।` : "किसी model पर ♡ दबाकर अपनी shortlist बनाइए।"}</p></div>{saved.length > 0 && <div className="btns"><button type="button" className="btn btn-o" onClick={share}>Link copy कीजिए</button><a className="btn btn-w" href={modelEnquiry(chosen)} target="_blank" rel="noopener noreferrer"><IconWhatsApp /> पूरी list भेजिए</a></div>}{shareUrl && <label className="mw-share-field">आपकी shortlist का link<input readOnly value={shareUrl} onFocus={(e) => e.currentTarget.select()} /></label>}</section>}
    {results.length > 0 && <section className="mw-model-section" aria-labelledby="models-title"><div className="shopping-section-heading"><div><p className="shopping-overline">MODELS · खूबियाँ जानिए</p><MotionHeading as="h2" id="models-title">{onlySaved ? "Shortlist के models" : "देखिए, समझिए, फिर चुनिए।"}</MotionHeading></div><span className="mw-small">{results.length} models</span></div>
      <div className="mw-model-grid">{results.map(({id,model:p,listing}) => {
        if (listing) {
          const initial = matches.get(id) ?? defaultChoice(listing);
          return <ShopModelCard key={lineKey(initial)} item={listing} initial={initial} saved={saved.includes(id)} compared={compare.includes(id)}
            onSave={() => toggleSaved(id)} onCompare={p ? () => toggleCompare(id) : undefined} onOpen={() => trackAction("product",listing.name)}/>;
        }
        if (!p) return null;
        const fullSpecs = productPages[p.id];
        const href = fullSpecs ?? catalogueGuidePath(p.id);
        const track = () => trackAction("product", modelDisplayName(p));
        return <article className={`mw-model-card${p.imageKind === "creative" ? " mw-model-creative" : ""}`} key={p.id}>
          <div className="mw-model-media">
            <button type="button" className="mw-save" onClick={() => toggleSaved(p.id)} aria-label={`${modelDisplayName(p)} ${saved.includes(p.id) ? "shortlist से हटाइए" : "shortlist में रखिए"}`} aria-pressed={saved.includes(p.id)}>{saved.includes(p.id) ? "♥" : "♡"}</button>
            <a className="mw-image-button" href={href} onClick={track} aria-label={modelDisplayName(p) + (fullSpecs ? " की पूरी specifications" : " की guide खोलिए")}>
              <Image src={p.image} alt={p.imageAlt} width={700} height={520} sizes="(max-width:700px) 90vw, 380px" />
            </a>
            <span className="mw-brand">{p.brand}</span>
          </div>
          <div className="mw-model-body">
            {p.imageCaption && <p className="mw-small">{p.imageCaption}</p>}
            <h3><a href={href} onClick={track}>{p.name}</a></h3>
            <p>{p.note}</p>
            {p.colours.length > 0 && <div className="mw-swatches" aria-label="Model के colours">{p.colours.map(c => <span key={c.name} style={{background:c.hex}} title={c.name}><span className="sr">{c.name}</span></span>)}</div>}
            {fullSpecs && <ul className="mw-model-specs"><li>{p.display}</li><li>{p.processor}</li></ul>}
            <div className="mw-model-actions">
              <a className="mw-text-link" href={href} onClick={track}>{fullSpecs ? "Specifications" : "Guide खोलिए"} <IconArrow /></a>
              <label className="mw-compare-check"><input type="checkbox" checked={compare.includes(p.id)} onChange={() => toggleCompare(p.id)} />Compare</label>
            </div>
          </div>
        </article>;
      })}</div>
    </section>}
    {generic.length > 0 && <section className="mw-model-section"><div className="shopping-section-heading"><div><p className="shopping-overline">CATEGORIES · अपनी ज़रूरत से</p><MotionHeading as="h2">दुकान में और क्या मिलता है?</MotionHeading></div></div><div className="pgrid">{generic.map((p) => <ProductCard key={p.title} item={p} />)}</div></section>}
    {!results.length && !generic.length && <div className="mw-empty"><MotionHeading as="h2">{onlySaved ? "आपकी shortlist अभी खाली है।" : "यहाँ match नहीं मिला।"}</MotionHeading><p>आपकी ज़रूरत का सामान list में न दिखे तो हमारी team से पूछिए।</p><div className="btns"><button className="btn btn-d" type="button" onClick={() => {setQuery("");setCategory("all");setBrand("all");setOnlySaved(false);}}>सभी products देखिए</button><a className="btn btn-o" target="_blank" rel="noopener noreferrer" href={`${shop.phone.whatsapp}?text=${encodeURIComponent(`नमस्ते Mobile World! मुझे ${query || "एक product"} के बारे में जानकारी चाहिए।`)}`}>WhatsApp पर पूछिए</a></div></div>}
    {compare.length > 0 && <aside className="mw-compare-tray" aria-label="चुने हुए comparison models"><div><b>{compare.length}/3 models चुने हैं</b><span>{comparing.map((p) => p.name).join(" · ")}</span></div><button className="btn btn-d" type="button" disabled={compare.length < 2} onClick={() => setCompareOpen(true)}>Compare कीजिए <IconArrow /></button><button className="mw-tray-clear" type="button" onClick={() => {setCompare([]);setNotice("");}} aria-label="Comparison list खाली कीजिए">×</button></aside>}
    {compareOpen && <Modal title="Models का comparison" close={() => setCompareOpen(false)}><div className="mw-comparison"><p className="shopping-overline">COMPARE · साथ में देखिए</p><MotionHeading as="h2">फ़र्क़ साफ़ दिखे, फ़ैसला आसान हो।</MotionHeading><div className="mw-table-scroll" tabIndex={0} role="region" aria-label="Product comparison table"><table><caption className="sr">चुने हुए phone models की specifications</caption><thead><tr><th scope="col">ख़ूबी</th>{comparing.map((p) => <th key={p.id} scope="col">{modelDisplayName(p)}</th>)}</tr></thead><tbody>{fields.map((f) => <tr key={f.key}><th scope="row">{f.label}</th>{comparing.map((p) => <td key={p.id}>{p[f.key]}</td>)}</tr>)}<tr><th scope="row">दाम / stock</th>{comparing.map((p) => <td key={p.id}>दुकान से confirm कीजिए</td>)}</tr><tr><th scope="row">Specifications का source</th>{comparing.map((p) => <td key={p.id}>{p.source ? <a href={p.source} target="_blank" rel="noopener noreferrer">{p.brand} की जानकारी ↗</a> : "जानकारी दुकान से पूछिए"}</td>)}</tr></tbody></table></div><p className="mw-small">*Brand के test conditions लागू हैं। Battery playback और mAh अलग माप हैं। Software support की शुरुआत और अवधि model की brand policy पर निर्भर है।</p><a className="btn btn-w" href={modelEnquiry(comparing)} target="_blank" rel="noopener noreferrer"><IconWhatsApp /> इन models के बारे में पूछिए</a></div></Modal>}
  </>;
}
