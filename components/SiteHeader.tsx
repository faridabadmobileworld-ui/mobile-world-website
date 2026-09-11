"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { shop } from "@/data/shop";
import { artForCategory, whatsappGeneral } from "@/data/content";
import { sitePages } from "@/data/pages";
import { productMenu } from "@/data/menu";
import { Art } from "./ArtSprite";
import { LiveBadge } from "./StoreStatus";
import { IconMenu, IconSearch, IconPhone, IconWhatsApp, IconGrid } from "./Icons";
import { searchIn, type SearchEntry } from "@/data/search";

export function SiteHeader({ searchIndex }: { searchIndex: SearchEntry[] }) {
  const [open, setOpen] = useState(false);
  // जिस page पर ग्राहक अभी है, पट्टी में वो अलग दिखे।
  const path = usePathname();
  const headerRef = useRef<HTMLElement>(null);

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

  // Drawer खुला हो तो page scroll बंद, और Escape से बंद हो।
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    const esc = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    addEventListener("keydown", esc);
    return () => { removeEventListener("keydown", esc); document.body.style.overflow = ""; };
  }, [open]);

  return (
    <>
      <div className="ann">
        <div className="wrap">
          <LiveBadge />
          <span className="r">
            <span>{shop.address.road}, {shop.address.locality}, {shop.address.city}</span>
            <a href={shop.phone.tel}><b>{shop.phone.display}</b></a>
          </span>
        </div>
      </div>

      <header className="hdr" ref={headerRef}>
        <div className="wrap">
          <button
            className="iconbtn" aria-label="Menu kholiye"
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

      {/*
        Strip का सबसे पहला button — "सारे Page"।
        Owner ने 2 Sep 2026 को कहा: home page पर कहीं दिखता ही नहीं था कि और
        page भी हैं। यह button वही menu खोलता है जिसमें सारे page हैं, और
        strip को उँगली से खिसकाने पर भी बाएँ चिपका रहता है (sticky)।
      */}
      <nav className="cstrip" aria-label="Website ke page">
        <div className="wrap">
          <button
            className="cs-pages" type="button"
            aria-label="पूरा menu खोलिए" aria-expanded={open} aria-controls="drawer"
            onClick={() => setOpen(true)}
          ><IconGrid /> Menu</button>
          {sitePages.map((p) => (
            <Link key={p.href} href={p.href} aria-current={path === p.href ? "page" : undefined}
                  style={{ "--t": p.tone } as React.CSSProperties}>
              <em aria-hidden="true">{p.emoji}</em>{p.short}
            </Link>
          ))}
        </div>
      </nav>

      <div className={`drawer${open ? " open" : ""}`} id="drawer">
        <div className="veil" onClick={() => setOpen(false)} />
        <div className="panel">
          <Link className="logo" href="/" onClick={() => setOpen(false)}>
            <i><Image src="/images/mobile-world-logo-79e75645.webp" alt="" width={240} height={240} sizes="40px" /></i><span>{shop.name}<s>{shop.tagline}</s></span>
          </Link>

          <SearchBox id="q-drawer" index={searchIndex} onDone={() => setOpen(false)} />

          {/* पहली सीढ़ी — सारे page */}
          <h2 className="dh">सारे Page</h2>
          {sitePages.map((p) => (
            <Link key={p.href} className="d" href={p.href} onClick={() => setOpen(false)}
                  style={{ "--t": p.tone } as React.CSSProperties}>
              <i className="tone" aria-hidden="true">{p.emoji}</i>
              {p.label}
            </Link>
          ))}

          {/*
            दूसरी और तीसरी सीढ़ी — सामान।
            `<details>` से बनी है, इसलिए बिना JavaScript के भी खुलती-बंद होती
            है और Google को अंदर के सारे link पहले ही दिख जाते हैं।
          */}
          <h2 className="dh">सामान — category से चुनिए</h2>
          {productMenu.map((g) => (
            <details className="dsub" key={g.label}>
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
          placeholder="क्या ढूँढ़ रहे हैं — TV, AC, Laptop…"
        />
        <button type="submit" aria-label="ढूँढ़िए"><IconSearch /></button>
      </form>

      {open && (
        <ul className="sres" id={listId} role="listbox">
          {hits.map((h, i) => (
            <li key={h.h + h.t} role="option" aria-selected={i === sel}>
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
              `Namaste Mobile World! क्या आपके पास ${q.trim()} है?`)}`}
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
