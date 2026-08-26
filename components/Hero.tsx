"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { slides, whatsappGeneral, hasDevanagari } from "@/data/content";
import Link from "next/link";
import { shop } from "@/data/shop";
import {
  IconArrow, IconChevL, IconChevR, IconPause, IconPlay,
  IconYouTube, IconInstagram, IconFacebook, IconWhatsApp,
} from "./Icons";

export function Hero() {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reduce, setReduce] = useState(false);
  const box = useRef<HTMLDivElement>(null);
  const touchX = useRef(0);

  // Jise kam animation chahiye, uske liye slider apne aap nahi badalta.
  useEffect(() => {
    const mq = matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => { setReduce(mq.matches); if (mq.matches) setPaused(true); };
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  const go = useCallback((n: number) => setI((n + slides.length) % slides.length), []);

  // अपने आप बदलना — रुका हुआ हो, tab पीछे हो, या user ने motion कम माँगी हो तो नहीं।
  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => setI((v) => (v + 1) % slides.length), 6000);
    return () => clearInterval(id);
  }, [paused, i]);

  useEffect(() => {
    const vis = () => setPaused((p) => (document.hidden ? true : p));
    document.addEventListener("visibilitychange", vis);
    return () => document.removeEventListener("visibilitychange", vis);
  }, []);

  return (
    <section className="hero">
      <div
        className="hs" ref={box} tabIndex={0}
        aria-roledescription="carousel" aria-label="Store highlights"
        onMouseEnter={() => !reduce && setPaused(true)}
        onMouseLeave={() => !reduce && setPaused(false)}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") { e.preventDefault(); go(i + 1); }
          if (e.key === "ArrowLeft") { e.preventDefault(); go(i - 1); }
        }}
        onTouchStart={(e) => { touchX.current = e.touches[0].clientX; }}
        onTouchEnd={(e) => {
          const dx = e.changedTouches[0].clientX - touchX.current;
          if (Math.abs(dx) > 45) go(i + (dx < 0 ? 1 : -1));
        }}
      >
        <div className="hs-t">
          {slides.map((s, k) => (
            <div
              key={s.kicker} className={`hs-s${k === i ? " on" : ""}`}
              style={{ background: s.bg }} role="group"
              aria-roledescription="slide" aria-label={`Slide ${k + 1} of ${slides.length}`}
              aria-hidden={k !== i}
            >
              <Image
                className="hs-bg" src={s.image} alt={s.alt}
                fill priority={k === 0} sizes="100vw"
                style={{ objectPosition: s.focus ?? "center" }}
              />
              <span className="hs-veil" aria-hidden="true" />

              <div className="hs-c">
                <span className={hasDevanagari(s.kicker) ? "hs-k dev" : "hs-k"}>{s.kicker}</span>
                {k === 0
                  ? <h1 className={hasDevanagari(s.heading) ? "hs-h dev" : "hs-h"}>{s.heading.split("\n").map((l, n) => <span key={n}>{l}<br /></span>)}</h1>
                  : <h2 className={hasDevanagari(s.heading) ? "hs-h dev" : "hs-h"}>{s.heading.split("\n").map((l, n) => <span key={n}>{l}<br /></span>)}</h2>}
                <p className="hs-p">{s.body}</p>

                <div className="hs-cta">
                  <Link className="btn btn-h" href="/products">
                    Shop Now <IconArrow />
                  </Link>
                  <a className="hs-soc yt" href={shop.social.youtube} target="_blank"
                     rel="noopener" aria-label="YouTube"><IconYouTube /></a>
                  <a className="hs-soc ig" href={shop.social.instagram} target="_blank"
                     rel="noopener" aria-label="Instagram"><IconInstagram /></a>
                  <a className="hs-soc fb" href={shop.social.facebook} target="_blank"
                     rel="noopener" aria-label="Facebook"><IconFacebook /></a>
                  <a className="hs-soc wa" href={whatsappGeneral} target="_blank"
                     rel="noopener" aria-label="WhatsApp"><IconWhatsApp size={17} /></a>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="hs-ui" role="group" aria-label="Choose a slide">
          {slides.map((s, k) => (
            <button
              key={s.kicker} type="button" className={k === i ? "on" : undefined}
              aria-label={`Show slide ${k + 1} of ${slides.length}`}
              aria-current={k === i} onClick={() => go(k)}
            />
          ))}
        </div>

        <div className="hs-ar">
          {!reduce && (
            <button
              type="button" aria-pressed={paused}
              aria-label={paused ? "Play slideshow" : "Pause slideshow"}
              onClick={() => setPaused((p) => !p)}
            >{paused ? <IconPlay /> : <IconPause />}</button>
          )}
          <button type="button" aria-label="Previous slide" onClick={() => go(i - 1)}><IconChevL /></button>
          <button type="button" aria-label="Next slide" onClick={() => go(i + 1)}><IconChevR /></button>
        </div>
      </div>
    </section>
  );
}
