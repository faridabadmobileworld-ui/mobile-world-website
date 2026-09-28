"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { shop } from "@/data/shop";
import { artForCategory, whatsappGeneral } from "@/data/content";
import { sitePages } from "@/data/pages";
import { productMenu } from "@/data/menu";
import { primaryCategories } from "@/data/storefront";
import { Art } from "./ArtSprite";
import { LiveBadge } from "./StoreStatus";
import { IconMenu, IconSearch, IconPhone, IconWhatsApp, IconGrid, IconPin } from "./Icons";
import { searchIn, type SearchEntry } from "@/data/search";

export function SiteHeader({ searchIndex }: { searchIndex: SearchEntry[] }) {
  const [open, setOpen] = useState(false);
  // जिस page पर ग्राहक अभी है, पट्टी में वो अलग दिखे।
  const path = usePathname();
  const headerRef = useRef<HTMLElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  // Category strip header के नीचे चिपकती है। Header की असली ऊँचाई नापो —
  // 58px मान लेने से phone पर strip header के ऊपर चढ़ जाती थी।
  useEffect(() => {
    const el = headerRef.current;
    if (!el) return;
    const sync = () =>
      document.documentElement.style.setProperty(
        "--hdr", `${Math.round(el.getBoundingClientRect().height)}px`,
      );
    sync();
    addEventListener("resize", sync, { passive: true });
    const ro = typeof ResizeObserver !== "undefined" ? new ResizeObserver(sync) : null;
    ro?.observe(el);
    document.fonts?.ready.then(sync).catch(() => {});
    return () => { removeEventListener("resize", sync); ro?.disconnect(); };
  }, []);

  // Keep keyboard focus inside the open menu, then return it to the trigger.
  useEffect(() => {
    if (!open) return;
    const previousFocus = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const frame = requestAnimationFrame(() => dialogRef.current?.querySelector<HTMLButtonElement>(".drawer-close")?.focus());
    const keys = (event: KeyboardEvent) => {
      if (event.key === "Escape") { event.preventDefault(); setOpen(false); }
      if (event.key !== "Tab") return;
      const elements = Array.from(dialogRef.current?.querySelectorAll<HTMLElement>(
        'a[href],button,input,summary,[tabindex="0"]',
      ) ?? []).filter((element) => element.getClientRects().length > 0 && !element.hasAttribute("disabled"));
      const first = elements[0], last = elements[elements.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
      if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
    };
    document.addEventListener("keydown", keys);
    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener("keydown", keys);
      document.body.style.overflow = previousOverflow;
      previousFocus?.focus();
    };
  }, [open]);

  return (
    <>
      <div className="ann">
        <div className="wrap">
          <LiveBadge />
          <span className="r">
            <a className="shopping-location" href={shop.social.googleMaps} target="_blank" rel="noopener noreferrer"><IconPin /> {shop.address.locality}, {shop.address.city}</a>
            <span className="mw-header-hours">10 AM–10 PM · महीने की आख़िरी तारीख़ बंद</span>
          </span>
        </div>
      </div>

      <header className="hdr shopping-header" ref={headerRef}>
        <div className="wrap">
          <button
            className="iconbtn" aria-label="Menu खोलिए"
            aria-expanded={open} aria-controls="drawer"
            onClick={() => setOpen(true)}
          ><IconMenu /></button>

          <Link className="logo" href="/">
            <i><Image src="/images/mobile-world-logo-79e75645.webp" alt="" width={240} height={240} sizes="40px" /></i><span>{shop.name}<s>{shop.tagline}</s></span>
          </Link>

          <SearchBox id="q-header" index={searchIndex} />

          <div className="hdr-a">
            {/* ⚠️ 11 Sep 2026 — owner: "call ka icon h header me wahan Mobile
                number b show karo likhkar icon ke saath me hi"। बड़ी screen पर
                नंबर icon के साथ लिखा दिखता है; phone पर सिर्फ़ icon (वहाँ जगह
                नहीं, और नंबर ऊपर वाली पट्टी में पहले से है)। */}
            <a className="iconbtn callbtn" href={shop.phone.tel} aria-label="दुकान को call कीजिए">
              <IconPhone /><span className="lbl">{shop.phone.display}</span>
            </a>
            <a className="btn btn-w btn-s" href={whatsappGeneral} target="_blank" rel="noopener"
               aria-label="WhatsApp पर message कीजिए">
              <IconWhatsApp /> <span className="lbl">WhatsApp</span>
            </a>
          </div>
        </div>
      </header>

      <nav className="cstrip shopping-nav" aria-label="Products और customer services">
        <div className="wrap">
          <Link className="cs-pages" href="/products"><IconGrid /> सभी products</Link>
          {primaryCategories.map((category) => (
            <Link key={category.slug} href={`/products#${category.slug}`}>{category.shortName ?? category.name}</Link>
          ))}
          <Link className="shopping-nav-service" href="/finance" aria-current={path === "/finance" ? "page" : undefined}>EMI & Finance</Link>
          <Link href="/repairing" aria-current={path === "/repairing" ? "page" : undefined}>Repairing</Link>
          <Link className="shopping-nav-visit" href="/visit"><IconPin /> दुकान पर आइए</Link>
        </div>
      </nav>

      <div className={`drawer shopping-drawer${open ? " open" : ""}`} id="drawer" aria-hidden={!open} inert={!open}>
        <div className="veil" onClick={() => setOpen(false)} />
        <div className="panel" ref={dialogRef} role="dialog" aria-modal="true" aria-label="Mobile World menu">
          <button type="button" className="drawer-close" aria-label="Menu बंद कीजिए" onClick={() => setOpen(false)}>×</button>
          <Link className="logo" href="/" onClick={() => setOpen(false)}>
            <i><Image src="/images/mobile-world-logo-79e75645.webp" alt="" width={240} height={240} sizes="40px" /></i><span>{shop.name}<s>{shop.tagline}</s></span>
          </Link>

          <SearchBox id="q-drawer" index={searchIndex} onDone={() => setOpen(false)} />

          {/*
            दूसरी और तीसरी सीढ़ी — सामान।
            `<details>` से बनी है, इसलिए बिना JavaScript के भी खुलती-बंद होती
            है और Google को अंदर के सारे link पहले ही दिख जाते हैं।
          */}
          <h2 className="dh">सामान — category से चुनिए</h2>
          {productMenu.map((g) => (
            <details className="dsub" key={g.label} open>
              <summary>
                <i className="tone" aria-hidden="true">{g.emoji}</i>
                {g.label}
                <b aria-hidden="true" />
              </summary>
              <div className="dsub-in">
                {g.items.map((c) => (
                  <Link key={c.slug} className="d d3" href={c.href} onClick={() => setOpen(false)}>
                    <i className="pic">
                      <Art id={artForCategory(c.slug)} />
                    </i>
                    {c.label}
                  </Link>
                ))}
              </div>
            </details>
          ))}

          <h2 className="dh">Customer services</h2>
          {sitePages.filter((page) => ["/products", "/finance", "/returns", "/repairing", "/after-sales-support", "/visit", "/contact"].includes(page.href)).map((page) => (
            <Link className="d" key={page.href} href={page.href} onClick={() => setOpen(false)}>{page.label}</Link>
          ))}
          <h2 className="dh">Mobile World के बारे में</h2>
          {sitePages.filter((page) => ["/", "/about", "/team", "/posts", "/terms", "/privacy"].includes(page.href)).map((page) => (
            <Link className="d" key={page.href} href={page.href} onClick={() => setOpen(false)}>{page.label}</Link>
          ))}

          <div className="btns" style={{ marginTop: 18 }}>
            <a className="btn btn-w" href={whatsappGeneral} target="_blank" rel="noopener">
              <IconWhatsApp /> WhatsApp
            </a>
            <a className="btn btn-o" href={shop.phone.tel}><IconPhone /> Call</a>
          </div>
        </div>
      </div>
    </>
  );
}

/** Search सिर्फ़ browser में चलता है — कुछ भी कहीं भेजा नहीं जाता। */
/**
 * Search do jagah rehta hai — bade screen par header mein, phone par
 * menu ke andar. CSS tay karta hai kaunsa dikhega.
 *
 * `id` alag isliye chahiye ki ek hi page par do input hote hain, aur
 * label ka `htmlFor` sahi input se juda rehna chahiye.
 */
function SearchBox({ id, index, onDone }:
  { id: string; index: SearchEntry[]; onDone?: () => void }) {
  const [q, setQ] = useState("");
  // कौन सा नतीजा चुना हुआ है — तीर वाली key से बदलता है। -1 = कोई नहीं।
  const [sel, setSel] = useState(-1);
  const [shut, setShut] = useState(false);
  const router = useRouter();
  const box = useRef<HTMLDivElement>(null);

  const hits = q.trim() ? searchIn(index, q) : [];
  const open = hits.length > 0 && !shut;

  // बाहर कहीं click हो तो list बंद — वरना वो page के ऊपर टँगी रह जाती है।
  useEffect(() => {
    if (!open) return;
    const away = (e: PointerEvent) => {
      if (!box.current?.contains(e.target as Node)) setShut(true);
    };
    document.addEventListener("pointerdown", away);
    return () => document.removeEventListener("pointerdown", away);
  }, [open]);

  function go(href: string) {
    setShut(true);
    setQ("");
    onDone?.();
    router.push(href);
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const v = q.trim();
    if (!v) return;
    // कोई नतीजा चुना हुआ है तो सीधे वहीं, वरना पूरी list वाले page पर।
    if (sel >= 0 && hits[sel]) return go(hits[sel].h);
    setShut(true);
    onDone?.();
    router.push(`/products?q=${encodeURIComponent(v)}`);
  }

  function keys(e: React.KeyboardEvent) {
    if (e.key === "Escape") { setShut(true); return; }
    if (!open) return;
    if (e.key === "ArrowDown") { e.preventDefault(); setSel((n) => (n + 1) % hits.length); }
    if (e.key === "ArrowUp") { e.preventDefault(); setSel((n) => (n <= 0 ? hits.length : n) - 1); }
  }

  const listId = `${id}-list`;

  return (
    <div className="searchwrap" ref={box}>
      <form className="searchbox" onSubmit={submit} role="search">
        <label className="sr" htmlFor={id}>सामान ढूँढ़िए</label>
        <input
          id={id} type="search" autoComplete="off" value={q}
          onChange={(e) => { setQ(e.target.value); setSel(-1); setShut(false); }}
          onKeyDown={keys}
          role="combobox" aria-expanded={open} aria-controls={listId}
          aria-autocomplete="list"
          aria-activedescendant={open && sel >= 0 ? `${id}-option-${sel}` : undefined}
          placeholder="क्या ढूँढ़ रहे हैं — TV, AC, Laptop…"
        />
        <button type="submit" aria-label="ढूँढ़िए"><IconSearch /></button>
      </form>

      {open && (
        <ul className="sres" id={listId} role="listbox">
          {hits.map((h, i) => (
            <li key={h.h + h.t} id={`${id}-option-${i}`} role="option" aria-selected={i === sel}>
              <button type="button" className={i === sel ? "on" : undefined}
                onPointerEnter={() => setSel(i)}
                onClick={() => go(h.h)}>
                <b>{h.t}</b><i>{h.k}</i>
              </button>
            </li>
          ))}
        </ul>
      )}

      {/* कुछ न मिले तो ख़ाली मत छोड़िए — WhatsApp का रास्ता दिखाइए।
          दुकान पर चीज़ हो सकती है, बस इस list में न हो। */}
      {q.trim() && !hits.length && !shut && (
        <ul className="sres" role="listbox">
          <li>
            <a href={`${shop.phone.whatsapp}?text=${encodeURIComponent(
              `नमस्ते Mobile World! क्या आपके पास ${q.trim()} है?`)}`}
              target="_blank" rel="noopener" onClick={() => { setShut(true); onDone?.(); }}>
              <b>“{q.trim()}” यहाँ नहीं मिला</b>
              <i>WhatsApp पर पूछ लीजिए — दुकान पर हो सकता है</i>
            </a>
          </li>
        </ul>
      )}
    </div>
  );
}

