"use client";

import { useEffect, useRef, useState } from "react";
import { IconPause, IconPlay } from "@/components/Icons";

/** Decoration has its own gutters, never a layer over the shop's content. */
export function FestivalFrame() {
  const flight = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    root.dataset.festivalMotion = paused ? "paused" : "playing";
    return () => { delete root.dataset.festivalMotion; };
  }, [paused]);

  useEffect(() => {
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    const update = () => {
      frame = 0;
      if (paused) return;
      const start = Math.min(230, window.innerHeight * .35);
      const distance = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const progress = Math.min(1, Math.max(0, window.scrollY / distance));
      const travel = Math.max(0, window.innerHeight - start - 140);
      const y = start + (motion.matches ? 0 : progress * travel);
      flight.current?.style.setProperty("--flight-y", `${Math.round(y)}px`);
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    motion.addEventListener("change", schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      motion.removeEventListener("change", schedule);
    };
  }, [paused]);

  return <>
    <div className="festival-rail festival-rail-left" aria-hidden="true" />
    <div className="festival-rail festival-rail-right" aria-hidden="true" />
    <div className="festival-flight" ref={flight} aria-hidden="true">
      <svg viewBox="0 16 160 70" fill="none" focusable="false">
        <defs>
          <linearGradient id="mw-flight-red" x1="25" y1="35" x2="80" y2="74" gradientUnits="userSpaceOnUse"><stop stopColor="#f45348"/><stop offset="1" stopColor="#9d102a"/></linearGradient>
          <linearGradient id="mw-flight-glass" x1="30" y1="35" x2="65" y2="60" gradientUnits="userSpaceOnUse"><stop stopColor="#427792"/><stop offset="1" stopColor="#102e46"/></linearGradient>
        </defs>
        <g className="festival-flight-body">
          <path d="m95 48 49-14 3-16 7 1-1 38-14-2-38 7" fill="#e4e6e6" stroke="#7a2834" strokeWidth="1.5"/>
          <path d="m116 43 28-9 3-16 7 1-1 25-33 8" fill="url(#mw-flight-red)"/>
          <path d="M15 57c4-14 23-24 46-24 19 0 32 8 46 21l-9 16H45c-16 0-31-4-30-13Z" fill="#fff8ec" stroke="#813540" strokeWidth="1.5"/>
          <path d="M16 58c19 7 53 8 83 3l-1 9H45c-16 0-30-4-29-12Z" fill="url(#mw-flight-red)"/>
          <path d="M20 54c7-9 17-15 29-16l-2 17Zm34-16-1 18h18V39Zm23 2v16h21c-6-7-13-13-21-16Z" fill="url(#mw-flight-glass)"/>
          <path d="m49 57 1 12m24-11v11M56 31v-5M24 79h77M36 66l-5 13m48-11 8 11" stroke="#555b62" strokeWidth="3" strokeLinecap="round"/>
          <path className="festival-rotor" d="M9 26h104" stroke="#333b46" strokeWidth="3" strokeLinecap="round"/>
          <circle cx="150" cy="43" r="8" stroke="#6b737b" strokeWidth="2"/>
          <path d="m145 38 10 10m0-10-10 10" stroke="#313e48" strokeWidth="2"/>
        </g>
      </svg>
    </div>
    <div className="festival-crown" aria-hidden="true" />
    <div className="festival-greeting">
      <span className="festival-diya" aria-hidden="true"><i /></span>
      <p><span className="festival-eyebrow">DIWALI AT MOBILE WORLD</span>रोशनी, भरोसा और ख़ुशियाँ।</p>
      <button type="button" className="festival-motion" aria-pressed={paused}
        aria-label={paused ? "Festival animations चलाइए" : "Festival animations रोकिए"}
        onClick={() => setPaused(value => !value)}>
        {paused ? <IconPlay /> : <IconPause />}<span>{paused ? "Animation चलाइए" : "Animation रोकिए"}</span>
      </button>
    </div>
  </>;
}
