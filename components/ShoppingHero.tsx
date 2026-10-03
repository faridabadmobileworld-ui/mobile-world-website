"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { shoppingSlides, slideEnquiry } from "@/data/storefront";
import { IconArrow, IconChevL, IconChevR, IconPause, IconPlay, IconWhatsApp } from "./Icons";

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
        timer = setInterval(() => setIndex((n) => (n + 1) % shoppingSlides.length), 9000);
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
    <section className="campaign-hero" aria-label="Mobile World के products और festival highlights" aria-roledescription="carousel"
      onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      onFocusCapture={(event) => {
        if (!(event.target as HTMLElement).closest(".campaign-play")) setPlaying(false);
      }}
      onKeyDown={(event) => {
        if (event.key === "ArrowRight") { event.preventDefault(); choose(index + 1); }
        if (event.key === "ArrowLeft") { event.preventDefault(); choose(index - 1); }
      }}
      onTouchStart={(event) => { touch.current = { x: event.touches[0].clientX, y: event.touches[0].clientY }; }}
      onTouchEnd={(event) => {
        if (!touch.current || !event.changedTouches.length) return;
        const dx = event.changedTouches[0].clientX - touch.current.x;
        const dy = event.changedTouches[0].clientY - touch.current.y;
        if (Math.abs(dx) > 55 && Math.abs(dx) > Math.abs(dy) * 1.5) choose(index + (dx < 0 ? 1 : -1));
        touch.current = null;
      }} onTouchCancel={() => { touch.current = null; }}>
      <h1 className="sr">Mobile World, Faridabad · Diwali, Mobiles और Home Appliances</h1>
      <div className="campaign-stage" aria-live={playing ? "off" : "polite"}>
        {shoppingSlides.map((slide, n) => (
          <div className={`campaign-slide campaign-${slide.theme}${index === n ? " is-active" : ""}`}
            key={slide.id} id={`campaign-slide-${n}`} role="group" aria-roledescription="slide"
            aria-label={`${n + 1} / ${shoppingSlides.length}: ${slide.label}`}
            aria-hidden={index !== n} inert={index !== n}>
            <div className="campaign-art">
              <Image src={slide.image} alt={slide.alt} fill
                sizes="(max-width:767px) 160vw, 100vw" preload={n === 0} />
            </div>
            <div className="campaign-inner">
              <div className="campaign-copy">
                <p className="campaign-eyebrow">{slide.eyebrow}</p>
                <h2>{slide.heading.split("\n").map((line) => <span key={line}>{line}</span>)}</h2>
                <p className="campaign-description">{slide.body}</p>
                <div className="campaign-actions">
                  <Link className="shopping-primary" href={slide.href}>{slide.cta}<IconArrow /></Link>
                  <a className="shopping-secondary" href={slideEnquiry(slide.topic)} target="_blank" rel="noopener noreferrer">
                    <IconWhatsApp /> WhatsApp पर पूछिए
                  </a>
                </div>
                <p className="campaign-note">{slide.detail}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="campaign-controls wrap">
        <div className="campaign-tabs" role="group" aria-label="Campaign चुनिए">
          {shoppingSlides.map((slide, n) => (
            <button type="button" key={slide.id} className={index === n ? "is-active" : ""}
              aria-controls={`campaign-slide-${n}`} aria-pressed={index === n}
              onClick={() => choose(n)}><span aria-hidden="true">{String(n + 1).padStart(2, "0")}</span>{slide.label}</button>
          ))}
        </div>
        <div className="campaign-arrows">
          <span className="campaign-count" aria-hidden="true">{index + 1} / {shoppingSlides.length}</span>
          <button type="button" className="campaign-play" onClick={() => setPlaying((v) => !v)}
            aria-label={playing ? "Slides रोकिए" : "Slides चलाइए"} aria-pressed={playing} title={playing ? "Slides रोकिए" : "Slides चलाइए"}>
            {playing ? <IconPause /> : <IconPlay />}
          </button>
          <button type="button" onClick={() => choose(index - 1)} aria-label="पिछली slide" title="पिछली slide"><IconChevL /></button>
          <button type="button" onClick={() => choose(index + 1)} aria-label="अगली slide" title="अगली slide"><IconChevR /></button>
        </div>
      </div>
    </section>
  );
}
