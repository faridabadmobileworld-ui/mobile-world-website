"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { phoneBrands, phoneModels, validModelIds, modelEnquiry, type PhoneModel } from "@/data/catalog";
import { categorySearchAliases } from "@/data/search";
import { shop } from "@/data/shop";
import type { Item, NavCategory } from "@/data/content";
import { ProductCard } from "./ProductCard";
import { IconArrow, IconWhatsApp, IconSearch } from "./Icons";

const storageKey = "mobile-world-shortlist-v1";
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

function ModelDetails({ model, save, saved }: { model: PhoneModel; save: () => void; saved: boolean }) {
  const [colour, setColour] = useState("");
  const [variant, setVariant] = useState("");
  const [imageIndex, setImageIndex] = useState(0);
  const gallery = model.gallery ?? [{ src: model.image, alt: model.imageAlt }];
  const selectedImage = gallery[imageIndex] ?? gallery[0];
  return <div className="mw-detail">
    <div className={`mw-detail-image${model.imageKind === "creative" ? " mw-detail-creative" : ""}`}><Image src={selectedImage.src} alt={selectedImage.alt} width={1122} height={1402} sizes="(max-width:700px) 90vw, 430px" />{gallery.length > 1 && <div className="mw-gallery-thumbnails" role="group" aria-label={`${model.name} की images`}>{gallery.map((item, index) => <button key={item.src} type="button" aria-label={`${model.name} की image ${index + 1} देखिए`} aria-pressed={imageIndex === index} onClick={() => setImageIndex(index)}><Image src={item.src} alt="" width={80} height={100}/></button>)}</div>}<p className="mw-small">{model.imageKind === "creative" ? "Mobile World product creative। असली design, colour और साथ मिलने वाले accessories model के अनुसार अलग हो सकते हैं।" : "Brand की product तस्वीर। चुना हुआ colour तस्वीर से अलग हो सकता है।"}</p></div>
    <div><p className="shopping-overline">{model.brand} · जानकारी देखिए</p><h2>{model.name}</h2><p>{model.note}</p>
      <dl className="mw-specs">{fields.map((f) => <div key={f.key}><dt>{f.label}</dt><dd>{model[f.key]}</dd></div>)}</dl>
      <div className="mw-form-row"><label>कौन सा colour चाहिए?<select value={colour} onChange={(e) => setColour(e.target.value)}><option value="">दुकान से options पूछिए</option>{model.colours.map((c) => <option key={c.name}>{c.name}</option>)}</select></label>
      <label>आपकी variant preference<select value={variant} onChange={(e) => setVariant(e.target.value)}><option value="">अभी तय नहीं</option>{model.variants.map((v) => <option key={v}>{v}</option>)}</select></label></div>
      <p className="mw-small">Colour, variant और stock की पुष्टि दुकान से कीजिए। *Battery और charging के आँकड़े brand की testing पर आधारित हैं; असल इस्तेमाल अलग हो सकता है। Updates की अवधि launch से गिनी जाती है।</p>
      <div className="btns"><a className="btn btn-w" href={modelEnquiry([model], `Colour preference: ${colour || "कोई भी"}। Variant preference: ${variant || "अभी तय नहीं"}।`)} target="_blank" rel="noopener noreferrer"><IconWhatsApp /> इस model के बारे में पूछिए</a><button className="btn btn-o" type="button" onClick={save} aria-pressed={saved}>{saved ? "✓ Shortlist में है" : "Shortlist में रखिए"}</button></div>
      {model.source && (model.source.startsWith("/") ? <Link className="mw-source" href={model.source}>Offers और पूरी specifications पढ़िए <IconArrow /></Link> : <a className="mw-source" href={model.source} target="_blank" rel="noopener noreferrer">Brand की specifications देखिए ↗</a>)}
    </div>
  </div>;
}

export function ProductExplorer({ categories, items }: { categories: NavCategory[]; items: Item[] }) {
  const params = useSearchParams();
  const [query, setQuery] = useState(params.get("q") ?? "");
  const [category, setCategory] = useState("all");
  const [brand, setBrand] = useState(phoneBrands.some((b) => b.slug === params.get("brand")) ? params.get("brand")! : "all");
  const [saved, setSaved] = useState<string[]>(validModelIds(params.get("shortlist")));
  const [onlySaved, setOnlySaved] = useState(params.has("shortlist") || params.get("view") === "shortlist");
  const [compare, setCompare] = useState<string[]>([]);
  const [compareOpen, setCompareOpen] = useState(false);
  const [model, setModel] = useState<PhoneModel | undefined>(phoneModels.find((p) => p.id === params.get("model")));
  const [notice, setNotice] = useState("");
  const [shareUrl, setShareUrl] = useState("");

  useEffect(() => {
    const sync = () => {
      const hash = window.location.hash.slice(1);
      setCategory(categories.some((c) => c.slug === hash) ? hash : "all");
    };
    const frame = requestAnimationFrame(() => {
      sync(); setQuery(params.get("q") ?? "");
      setBrand(phoneBrands.some((b) => b.slug === params.get("brand")) ? params.get("brand")! : "all");
      const selected = phoneModels.find((p) => p.id === params.get("model"));
      if (selected) setModel(selected);
      if (!params.has("shortlist")) {
        try { setSaved(validModelIds(localStorage.getItem(storageKey))); } catch { /* Session works without storage. */ }
      }
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

  function toggleSaved(id: string) {
    const next = saved.includes(id) ? saved.filter((v) => v !== id) : [...saved, id];
    setSaved(next);
    try { localStorage.setItem(storageKey, next.join(",")); } catch { setNotice("इस browser में list save नहीं हो सकी। आप इसे अभी share कर सकते हैं।"); }
  }
  function toggleCompare(id: string) {
    if (compare.includes(id)) { setCompare(compare.filter((v) => v !== id)); return; }
    if (compare.length === 3) { setNotice("एक बार में 3 models compare कर सकते हैं। पहले किसी model को हटाइए।"); return; }
    setCompare([...compare, id]); setNotice("");
  }
  function chooseCategory(slug: string) {
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
  const models = phoneModels.filter((p) => (category === "all" || category === "smartphones") && (brand === "all" || p.brandSlug === brand) && (!onlySaved || saved.includes(p.id)) && terms.every((w) => `${p.brand} ${p.name} ${p.note} ${p.display} ${p.system} phone mobile मोबाइल फोन फ़ोन smartphone 5g`.toLowerCase().includes(w)));
  const generic = onlySaved || brand !== "all" ? [] : items.filter((p) => (category === "all" || category === p.category) && terms.every((w) => `${p.title} ${p.kicker} ${p.tags.join(" ")} ${categorySearchAliases[p.category] ?? ""} ${categories.find((c) => c.slug === p.category)?.label ?? ""}`.toLowerCase().includes(w)));
  const chosen = saved.flatMap((id) => phoneModels.filter((p) => p.id === id));
  const comparing = compare.flatMap((id) => phoneModels.filter((p) => p.id === id));

  return <>
    <div className="mw-catalog-toolbar">
      <label className="mw-catalog-search"><span className="sr">Product या brand ढूँढ़िए</span><IconSearch /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Model, brand या सामान का नाम…" type="search" /></label>
      <label><span className="sr">Brand चुनिए</span><select value={brand} onChange={(e) => { setBrand(e.target.value); setCategory("all"); }}><option value="all">सभी brands / सामान</option>{phoneBrands.map((b) => <option key={b.slug} value={b.slug}>{b.name}</option>)}</select></label>
      <button className={`mw-filter ${onlySaved ? "active" : ""}`} type="button" aria-pressed={onlySaved} onClick={() => {setOnlySaved(!onlySaved);setCategory("all");setQuery("");setBrand("all");}}>♡ मेरी shortlist <span>{saved.length}</span></button>
    </div>
    <div className="mw-filter-row" aria-label="Product category"><button type="button" className={`mw-filter ${category === "all" ? "active" : ""}`} aria-pressed={category === "all"} onClick={() => chooseCategory("all")}>सभी products</button>{categories.map((c) => <button type="button" key={c.slug} className={`mw-filter ${category === c.slug ? "active" : ""}`} aria-pressed={category === c.slug} onClick={() => chooseCategory(c.slug)}>{c.label}</button>)}</div>
    <p className="mw-small mw-catalog-note">यह product guide है। दुकान पर उपलब्ध model, colour और दाम WhatsApp पर confirm कीजिए।</p>
    <p className="mw-notice" role="status">{notice}</p>
    {onlySaved && <section className="mw-shortlist-head"><div><h2>आपकी पसंद, एक जगह।</h2><p>{saved.length ? `${saved.length} models आपकी shortlist में हैं।` : "किसी model पर ♡ दबाकर अपनी shortlist बनाइए।"}</p></div>{saved.length > 0 && <div className="btns"><button type="button" className="btn btn-o" onClick={share}>Link copy कीजिए</button><a className="btn btn-w" href={modelEnquiry(chosen)} target="_blank" rel="noopener noreferrer"><IconWhatsApp /> पूरी list भेजिए</a></div>}{shareUrl && <label className="mw-share-field">आपकी shortlist का link<input readOnly value={shareUrl} onFocus={(e) => e.currentTarget.select()} /></label>}</section>}
    {models.length > 0 && <section className="mw-model-section" aria-labelledby="models-title"><div className="shopping-section-heading"><div><p className="shopping-overline">MODELS · खूबियाँ जानिए</p><h2 id="models-title">{onlySaved ? "Shortlist के models" : "देखिए, समझिए, फिर चुनिए।"}</h2></div><span className="mw-small">{models.length} models</span></div>
      <div className="mw-model-grid">{models.map((p) => <article className={`mw-model-card${p.imageKind === "creative" ? " mw-model-creative" : ""}`} key={p.id}>
        <div className="mw-model-media"><button type="button" className="mw-save" onClick={() => toggleSaved(p.id)} aria-label={`${p.brand} ${p.name} ${saved.includes(p.id) ? "shortlist से हटाइए" : "shortlist में रखिए"}`} aria-pressed={saved.includes(p.id)}>{saved.includes(p.id) ? "♥" : "♡"}</button><button className="mw-image-button" type="button" onClick={() => setModel(p)} aria-label={`${p.brand} ${p.name} की जानकारी`}><Image src={p.image} alt={p.imageAlt} width={700} height={520} sizes="(max-width:700px) 90vw, 380px" /></button><span className="mw-brand">{p.brand}</span></div>
        <div className="mw-model-body"><h3><button type="button" onClick={() => setModel(p)}>{p.name}</button></h3><p>{p.note}</p><div className="mw-swatches" aria-label="Brand के colour options">{p.colours.map((c) => <span key={c.name} style={{background:c.hex}} title={c.name}><span className="sr">{c.name}</span></span>)}</div><ul className="mw-model-specs"><li>{p.display}</li><li>{p.processor}</li></ul><div className="mw-model-actions"><button className="mw-text-link" type="button" onClick={() => setModel(p)}>पूरी जानकारी <IconArrow /></button><label className="mw-compare-check"><input type="checkbox" checked={compare.includes(p.id)} onChange={() => toggleCompare(p.id)} />Compare</label></div></div>
      </article>)}</div>
    </section>}
    {generic.length > 0 && <section className="mw-model-section"><div className="shopping-section-heading"><div><p className="shopping-overline">CATEGORIES · अपनी ज़रूरत से</p><h2>दुकान में और क्या मिलता है?</h2></div></div><div className="pgrid">{generic.map((p) => <ProductCard key={p.title} item={p} />)}</div></section>}
    {!models.length && !generic.length && <div className="mw-empty"><h2>{onlySaved ? "आपकी shortlist अभी खाली है।" : "यहाँ match नहीं मिला।"}</h2><p>आपकी ज़रूरत का सामान list में न दिखे तो हमारी team से पूछिए।</p><div className="btns"><button className="btn btn-d" type="button" onClick={() => {setQuery("");setCategory("all");setBrand("all");setOnlySaved(false);}}>सभी products देखिए</button><a className="btn btn-o" target="_blank" rel="noopener noreferrer" href={`${shop.phone.whatsapp}?text=${encodeURIComponent(`नमस्ते Mobile World! मुझे ${query || "एक product"} के बारे में जानकारी चाहिए।`)}`}>WhatsApp पर पूछिए</a></div></div>}
    {compare.length > 0 && <aside className="mw-compare-tray" aria-label="चुने हुए comparison models"><div><b>{compare.length}/3 models चुने हैं</b><span>{comparing.map((p) => p.name).join(" · ")}</span></div><button className="btn btn-d" type="button" disabled={compare.length < 2} onClick={() => setCompareOpen(true)}>Compare कीजिए <IconArrow /></button><button className="mw-tray-clear" type="button" onClick={() => {setCompare([]);setNotice("");}} aria-label="Comparison list खाली कीजिए">×</button></aside>}
    {model && <Modal title={`${model.name} की जानकारी`} close={() => setModel(undefined)}><ModelDetails key={model.id} model={model} saved={saved.includes(model.id)} save={() => toggleSaved(model.id)} /></Modal>}
    {compareOpen && <Modal title="Models का comparison" close={() => setCompareOpen(false)}><div className="mw-comparison"><p className="shopping-overline">COMPARE · साथ में देखिए</p><h2>फ़र्क़ साफ़ दिखे, फ़ैसला आसान हो।</h2><div className="mw-table-scroll" tabIndex={0} role="region" aria-label="Product comparison table"><table><caption className="sr">चुने हुए phone models की specifications</caption><thead><tr><th scope="col">ख़ूबी</th>{comparing.map((p) => <th key={p.id} scope="col">{p.brand}<br />{p.name}</th>)}</tr></thead><tbody>{fields.map((f) => <tr key={f.key}><th scope="row">{f.label}</th>{comparing.map((p) => <td key={p.id}>{p[f.key]}</td>)}</tr>)}<tr><th scope="row">दाम / stock</th>{comparing.map((p) => <td key={p.id}>दुकान से confirm कीजिए</td>)}</tr><tr><th scope="row">Specifications का source</th>{comparing.map((p) => <td key={p.id}>{p.source ? <a href={p.source} target="_blank" rel="noopener noreferrer">{p.brand} की जानकारी ↗</a> : "जानकारी दुकान से पूछिए"}</td>)}</tr></tbody></table></div><p className="mw-small">*Brand के test conditions लागू हैं। Battery playback और mAh अलग माप हैं। Software support की अवधि launch से है।</p><a className="btn btn-w" href={modelEnquiry(comparing)} target="_blank" rel="noopener noreferrer"><IconWhatsApp /> इन models के बारे में पूछिए</a></div></Modal>}
  </>;
}
