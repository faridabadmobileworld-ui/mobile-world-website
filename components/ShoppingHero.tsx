"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { shoppingSlides, slideEnquiry } from "@/data/storefront";
import { IconArrow, IconChevL, IconChevR, IconPause, IconPlay, IconWhatsApp } from "./Icons";

/** Product discovery stays visible immediately; no scroll-scrub introduction. */
export function ShoppingHero() {
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [hovered, setHovered] = useState(false);
  const touch = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    if (!playing || hovered) return;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let timer: ReturnType<typeof setInterval> | undefined;
    const sync = () => {
      clearInterval(timer);
      if (!motion.matches && !document.hidden) {
        timer = setInterval(() => setIndex((n) => (n + 1) % shoppingSlides.length), 7500);
      }
    };
    sync();
    document.addEventListener("visibilitychange", sync);
    motion.addEventListener("change", sync);
    return () => {
      clearInterval(timer);
      document.removeEventListener("visibilitychange", sync);
      motion.removeEventListener("change", sync);
    };
  }, [playing, hovered, index]);

  function choose(next: number) {
    setPlaying(false);
    setIndex((next + shoppingSlides.length) % shoppingSlides.length);
  }

  return (
    <section className="shopping-hero" aria-label="आपकी ज़रूरत के products" aria-roledescription="carousel"
      onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      onFocusCapture={(event) => {
        if (!(event.target as HTMLElement).closest(".shopping-play")) setPlaying(false);
      }}
      onKeyDown={(event) => {
        if (event.key === "ArrowRight") { event.preventDefault(); choose(index + 1); }
        if (event.key === "ArrowLeft") { event.preventDefault(); choose(index - 1); }
      }}
      onTouchStart={(event) => { touch.current = { x: event.touches[0].clientX, y: event.touches[0].clientY }; }}
      onTouchEnd={(event) => {
        if (!touch.current) return;
        const dx = event.changedTouches[0].clientX - touch.current.x;
        const dy = event.changedTouches[0].clientY - touch.current.y;
        if (Math.abs(dx) > 55 && Math.abs(dx) > Math.abs(dy) * 1.5) choose(index + (dx < 0 ? 1 : -1));
        touch.current = null;
      }}>
      <h1 className="sr">Mobile, Laptop और Home Appliances — Mobile World, Faridabad</h1>
      <div className="shopping-stage" aria-live={playing ? "off" : "polite"} aria-atomic="false">
        {shoppingSlides.map((slide, n) => (
          <div className={`shopping-slide shopping-${slide.theme}${index === n ? " is-active" : ""}`}
            key={slide.id} id={`shopping-slide-${n}`} role="group" aria-roledescription="slide"
            aria-label={`${n + 1} / ${shoppingSlides.length}: ${slide.label}`}
            aria-hidden={index !== n} inert={index !== n}>
            <div className="shopping-copy">
              <p className="shopping-eyebrow"><span aria-hidden="true" />{slide.eyebrow}</p>
              <h2>{slide.heading.split("\n").map((line) => <span key={line}>{line}</span>)}</h2>
              <p className="shopping-description">{slide.body}</p>
              <div className="shopping-actions">
                <Link className="shopping-primary" href={slide.href}>{slide.cta}<IconArrow /></Link>
                <a className="shopping-secondary" href={slideEnquiry(slide.topic)} target="_blank" rel="noopener noreferrer">
                  <IconWhatsApp /> WhatsApp <span className="shopping-enquiry-label">पर पूछिए</span>
                </a>
              </div>
            </div>
            <div className="shopping-visual">
              <div className="shopping-image">
                <Image src={slide.image} alt={slide.alt} fill sizes="(max-width:700px) 92vw, 560px"
                  priority={n === 0} />
              </div>
              <p className="shopping-detail">{slide.detail}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="shopping-controls">
        <div className="shopping-tabs" role="group" aria-label="Slide चुनिए">
          {shoppingSlides.map((slide, n) => (
            <button type="button" key={slide.id} className={index === n ? "is-active" : ""}
              aria-controls={`shopping-slide-${n}`} aria-pressed={index === n}
              onClick={() => choose(n)}><span className="shopping-tab-number">0{n + 1}</span>{slide.label}</button>
          ))}
        </div>
        <div className="shopping-arrows">
          <button type="button" className="shopping-play" onClick={() => setPlaying((v) => !v)}
            aria-label={playing ? "Slides रोकिए" : "Slides चलाइए"} aria-pressed={playing}>
            {playing ? <IconPause /> : <IconPlay />}
          </button>
          <button type="button" onClick={() => choose(index - 1)} aria-label="पिछली slide"><IconChevL /></button>
          <button type="button" onClick={() => choose(index + 1)} aria-label="अगली slide"><IconChevR /></button>
        </div>
      </div>
    </section>
  );
}
