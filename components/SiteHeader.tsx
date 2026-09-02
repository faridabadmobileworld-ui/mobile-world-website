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

export function SiteHeader() {
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
            <i><Image src="/images/mobile-world-logo-87f0b7f5.webp" alt="" width={240} height={240} sizes="40px" /></i><span>{shop.name}<s>{shop.tagline}</s></span>
          </Link>

          <SearchBox id="q-header" />

          <div className="hdr-a">
            <a className="iconbtn" href={shop.phone.tel} aria-label="दुकान को call कीजिए"><IconPhone /></a>
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
            <i><Image src="/images/mobile-world-logo-87f0b7f5.webp" alt="" width={240} height={240} sizes="40px" /></i><span>{shop.name}<s>{shop.tagline}</s></span>
          </Link>

          <SearchBox id="q-drawer" onDone={() => setOpen(false)} />

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
function SearchBox({ id, onDone }: { id: string; onDone?: () => void }) {
  const [q, setQ] = useState("");
  const router = useRouter();

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const v = q.trim();
    if (!v) return;
    onDone?.();
    router.push(`/products?q=${encodeURIComponent(v)}`);
  }

  return (
    <form className="searchbox" onSubmit={submit} role="search">
      <label className="sr" htmlFor={id}>सामान ढूँढ़िए</label>
      <input
        id={id} type="search" autoComplete="off" value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="क्या ढूँढ़ रहे हैं — TV, AC, Laptop…"
      />
      <button type="submit" aria-label="ढूँढ़िए"><IconSearch /></button>
    </form>
  );
}
