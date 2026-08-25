"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { slides, whatsappGeneral, hasDevanagari } from "@/data/content";
import { IconArrow, IconChevL, IconChevR, IconPause, IconPlay } from "./Icons";

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
              <div className="hs-c">
                <span className={hasDevanagari(s.kicker) ? "hs-k dev" : "hs-k"}>{s.kicker}</span>
                {k === 0
                  ? <h1 className={hasDevanagari(s.heading) ? "hs-h dev" : "hs-h"}>{s.heading.split("\n").map((l, n) => <span key={n}>{l}<br /></span>)}</h1>
                  : <h2 className={hasDevanagari(s.heading) ? "hs-h dev" : "hs-h"}>{s.heading.split("\n").map((l, n) => <span key={n}>{l}<br /></span>)}</h2>}
                <p className="hs-p">{s.body}</p>
                <div className="btns">
                  <a className="btn btn-d" href={whatsappGeneral} target="_blank" rel="noopener">
                    💬 आज का Rate पूछें <IconArrow />
                  </a>
                </div>
              </div>
              <div className="hs-m">
                <Image
                  className="ph-img" src={s.image} alt={s.alt}
                  width={1000} height={562} priority={k === 0}
                  sizes="(max-width:768px) 100vw, 620px"
                />
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
