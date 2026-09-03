"use client";

import { useEffect, useRef } from "react";

/* Wahi scrub engine jo /showcase par chal raha tha, ab ek component ke andar.
   Standard wahi hai: seek gating, wo rAF loop jo kaam khatam hote hi so jaata
   hai, DOM par likhna sirf badlaav par, caption ki naap scroll ki doori mein,
   aur paanch haalaton mein ek thehri hui tasveer wala hero.

   Badi screen par safar video se chalta hai; phone par aur video na aa paane
   par wahi safar dukaan ki tasveeron ki chaar parton se chalta hai. */

const VIDEO_URL = "/showcase/assets/hero-scrub.mp4";
const VIDEO_BYTES = 8026975;

/* Paanch haalatein jahan hero ek thehri hui tasveer ban jaata hai.
   CSS mein bhi bilkul yahi naap likhi hai — dono ek saath badalni hoti hain. */
const GATES = [
  "(max-width: 720px)",
  "(orientation: portrait) and (max-width: 1024px)",
  "(orientation: portrait) and (pointer: coarse)",
  "(orientation: landscape) and (pointer: coarse) and (max-height: 560px)",
  "(prefers-reduced-motion: reduce)",
];

export function CineHero() {
  const heroRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;
    const stage = hero.querySelector<HTMLDivElement>(".sc-stage")!;
    const video = hero.querySelector<HTMLVideoElement>("video")!;
    const ring = hero.querySelector<SVGSVGElement>(".sc-ring")!;
    const layers = Array.from(hero.querySelectorAll<HTMLDivElement>(".sc-layer"));

    type Band = { el: HTMLElement; a: number; b: number; ramp: number; op: number; k: number };
    const bands: Band[] = Array.from(hero.querySelectorAll<HTMLElement>(".sc-band")).map((el) => {
      const r = (el.dataset.band || "0,1").split(",");
      return { el, a: +r[0], b: +r[1], ramp: +(el.dataset.ramp || 0), op: -1, k: -1 };
    });

    /* ⚠️ Devanagari ko akshar-akshar mat todiye — maatra apne vyanjan se alag
       ho jaati hai. Isliye todh shabd par hoti hai. */
    const rng = (seed: number) => {
      let s = seed >>> 0;
      return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; };
    };
    hero.querySelectorAll<HTMLElement>("[data-split]").forEach((el, bi) => {
      if (el.dataset.done) return;
      el.dataset.done = "1";
      const text = (el.textContent || "").trim();
      const rand = rng(1234 + bi * 77);
      const sr = document.createElement("span");
      sr.className = "sc-sr"; sr.textContent = text;
      const vis = document.createElement("span");
      vis.setAttribute("aria-hidden", "true");
      const words = text.split(" ");
      words.forEach((w, wi) => {
        const ws = document.createElement("span");
        ws.className = "sc-w";
        ws.textContent = w;
        ws.style.setProperty("--th", (wi / Math.max(1, words.length) * 0.5 + rand() * 0.06).toFixed(3));
        ws.style.setProperty("--jx", Math.round((rand() - 0.5) * 44) + "px");
        ws.style.setProperty("--jy", Math.round((rand() - 0.5) * 30 + 16) + "px");
        ws.style.setProperty("--jr", Math.round((rand() - 0.5) * 10) + "deg");
        vis.appendChild(ws);
        if (wi < words.length - 1) vis.appendChild(document.createTextNode(" "));
      });
      el.textContent = "";
      el.append(sr, vis);
    });

    const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));
    const smoothstep = (p: number, e0: number, e1: number) => {
      const t = clamp((p - e0) / (e1 - e0), 0, 1);
      return t * t * (3 - 2 * t);
    };
    const heroProgress = () => {
      const range = hero.offsetHeight - window.innerHeight;
      if (range <= 0) return 0;
      return clamp(-hero.getBoundingClientRect().top / range, 0, 1);
    };

    let loadK = 0;
    let lastLayer: number[] = [];

    function updateLayers(p: number) {
      const n = layers.length, seg = 1 / (n - 1);
      for (let i = 0; i < n; i++) {
        const c = i * seg;
        const d = Math.abs(p - c) / seg;
        let op = clamp(1 - d, 0, 1);
        op = op * op * (3 - 2 * op);
        // Sabse neeche wali parat hamesha poori — do tasveeron ke beech mein
        // bhi frame kabhi kaala nahi padta.
        if (i === 0) op = 1;
        const local = clamp((p - (c - seg)) / (seg * 2), 0, 1);
        const sc = 1.16 - 0.14 * local;
        const ty = (0.5 - local) * 5;
        if (lastLayer[i] === undefined || Math.abs(op - lastLayer[i]) > 0.004) {
          layers[i].style.opacity = op.toFixed(3);
          layers[i].style.transform =
            `translate3d(0,${ty.toFixed(2)}%,0) scale(${sc.toFixed(3)})`;
          lastLayer[i] = op;
        }
      }
    }

    function updateCaptions(p: number) {
      for (let i = 0; i < bands.length; i++) {
        const bd = bands[i];
        const f = Math.min(0.02, (bd.b - bd.a) / 3);
        const inRamp = i === 0 ? 1 : smoothstep(p, bd.a, bd.a + f);
        const outRamp = i === bands.length - 1 ? 1 : 1 - smoothstep(p, bd.b - f, bd.b);
        const op = inRamp * outRamp;
        let k = clamp((p - bd.a) / (bd.ramp || Math.min(0.025, (bd.b - bd.a) * 0.35)), 0, 1);
        if (i === 0) k = Math.max(k, loadK);
        if (Math.abs(op - bd.op) > 0.004) { bd.el.style.opacity = op.toFixed(3); bd.op = op; }
        if (Math.abs(k - bd.k) > 0.008) { bd.el.style.setProperty("--k", k.toFixed(3)); bd.k = k; }
      }
      if (!stage.classList.contains("video-ready")) updateLayers(p);
    }

    /* seek ka darwaaza: ek baar mein ek hi */
    let seekBusy = false, pendingTime: number | null = null;
    function requestSeek(t: number) {
      if (!video.duration) return;
      // ⚠️ जहाँ video पहले से है वहीं भेजने पर browser कोई `seeked` नहीं भेजता,
      // और यह दरवाज़ा हमेशा के लिए बंद रह जाता है। Page के बिलकुल ऊपर से
      // शुरू करने वाले हर visitor के साथ यही होता था।
      if (Math.abs(video.currentTime - t) < 1 / 48) return;
      if (seekBusy) { pendingTime = t; return; }
      seekBusy = true; video.currentTime = t;
    }
    const onSeeked = () => {
      seekBusy = false;
      if (pendingTime !== null) { const t = pendingTime; pendingTime = null; requestSeek(t); }
    };
    const onError = () => { seekBusy = false; pendingTime = null; failVideo(); };
    video.addEventListener("seeked", onSeeked);
    video.addEventListener("error", onError);

    /* wo loop jo kaam khatam hote hi so jaata hai */
    let target = 0, shown = 0, rafId: number | null = null, lastTick = 0, onScreen = true;
    function tick(now: number) {
      const dt = Math.min(100, now - (lastTick || now));
      lastTick = now;
      shown += (target - shown) * (1 - Math.pow(1 - 0.16, dt / 16.667));
      if (Math.abs(target - shown) < 0.0005) { shown = target; rafId = null; lastTick = 0; }
      else rafId = requestAnimationFrame(tick);
      if (video.duration) requestSeek(shown * video.duration);
      updateCaptions(shown);
    }
    function onScroll() {
      target = heroProgress();
      if (rafId === null && onScreen) rafId = requestAnimationFrame(tick);
    }

    const io = new IntersectionObserver((es) => {
      onScreen = es[0].isIntersecting;
      if (onScreen) onScroll();
      else if (rafId !== null) { cancelAnimationFrame(rafId); rafId = null; }
    }, { rootMargin: "80px" });
    io.observe(hero);

    function failVideo() { ring.classList.remove("on"); }

    let started = false;
    let ctrl: AbortController | null = null;
    function startBlobFetch() {
      if (started) return; started = true;
      loadHeroBlob().catch(failVideo);
    }
    function loadHeroBlob() {
      ctrl = new AbortController();
      const c = ctrl;
      let watchdog = window.setTimeout(() => c.abort(), 20000);
      ring.classList.add("on");
      return fetch(VIDEO_URL, { signal: c.signal }).then((res) => {
        if (!res.ok || !res.body) throw new Error("no video");
        const total = Number(res.headers.get("Content-Length")) || VIDEO_BYTES;
        const mime = (res.headers.get("Content-Type") || "video/mp4").split(";")[0];
        const reader = res.body.getReader();
        const chunks: Uint8Array[] = [];
        let got = 0, lastRing = 0;
        const pump = (): Promise<void> => reader.read().then((r) => {
          if (r.done) return;
          clearTimeout(watchdog);
          watchdog = window.setTimeout(() => c.abort(), 20000);
          chunks.push(r.value); got += r.value.length;
          const frac = Math.min(1, got / total), now = performance.now();
          if (now - lastRing > 100 || frac === 1) {
            lastRing = now;
            ring.style.setProperty("--ld", String(Math.round(126 * (1 - frac))));
          }
          return pump();
        });
        return pump().then(() => {
          clearTimeout(watchdog);
          ring.style.setProperty("--ld", "0");
          ring.classList.remove("on");
          // Blob par MIME likhna zaroori hai — bina type ke browser blob: wali
          // video ko pehchanta hi nahi (error 4). preload bhi yahin kholna
          // padta hai, warna 'none' rehte hue ek byte bhi buffer nahi hota.
          video.preload = "auto";
          video.src = URL.createObjectURL(new Blob(chunks as BlobPart[], { type: mime }));
          video.load();
          video.addEventListener("canplay", () => {
            requestSeek(heroProgress() * video.duration);
            stage.classList.add("video-ready");
          }, { once: true });
        });
      });
    }

    const mqls = GATES.map((q) => matchMedia(q));
    let scrubOn = false, inited = false;
    function initOnce() {
      if (inited) return; inited = true;
      startBlobFetch();
      const t0 = performance.now();
      const ramp = (now: number) => {
        loadK = Math.min(1, (now - t0) / 900);
        updateCaptions(shown);
        if (loadK < 1) requestAnimationFrame(ramp);
      };
      ramp(t0);
    }
    function enableScrub() {
      if (scrubOn) return; scrubOn = true;
      initOnce();
      addEventListener("scroll", onScroll, { passive: true });
      bands.forEach((b) => { b.op = -1; b.k = -1; });
      lastLayer = [];
      updateCaptions(heroProgress());
      onScroll();
    }
    function disableScrub() {
      if (!scrubOn) return; scrubOn = false;
      removeEventListener("scroll", onScroll);
      if (rafId !== null) { cancelAnimationFrame(rafId); rafId = null; }
    }
    function applyHeroMode() {
      const still = mqls.some((m) => m.matches);
      if (still) {
        disableScrub(); loadK = 1;
        bands.forEach((b) => b.el.style.removeProperty("--k"));
      } else enableScrub();
    }
    mqls.forEach((m) => m.addEventListener("change", applyHeroMode));
    applyHeroMode();

    return () => {
      mqls.forEach((m) => m.removeEventListener("change", applyHeroMode));
      removeEventListener("scroll", onScroll);
      video.removeEventListener("seeked", onSeeked);
      video.removeEventListener("error", onError);
      io.disconnect();
      if (rafId !== null) cancelAnimationFrame(rafId);
      ctrl?.abort();
    };
  }, []);

  return (
    <section className="sc-hero" ref={heroRef} aria-label="Mobile World, in one scroll">
      <div className="sc-stage">
        <video muted playsInline preload="none" aria-hidden="true" tabIndex={-1} />
        <div className="sc-layer sc-l0" aria-hidden="true" />
        <div className="sc-layer sc-l1" aria-hidden="true" />
        <div className="sc-layer sc-l2" aria-hidden="true" />
        <div className="sc-layer sc-l3" aria-hidden="true" />
        <div className="sc-scrim" aria-hidden="true" />
        <div className="sc-vig" aria-hidden="true" />

        <div className="sc-bands">
          <div className="sc-band" data-band="0,0.27">
            <span className="sc-kick">Gurudwara Road, Jawahar Colony</span>
            <p className="sc-h" data-split>Open till 10 PM, every day</p>
            <p className="sc-sub">The rest of the market winds down. Our lights stay on.</p>
          </div>

          <div className="sc-band" data-band="0.30,0.575" data-ramp="0.03">
            <span className="sc-kick">One counter</span>
            <p className="sc-h" data-split>Every major brand, one counter</p>
            <p className="sc-sub">Phones, laptops, televisions, air conditioners, refrigerators, washing machines.</p>
          </div>

          <div className="sc-band" data-band="0.60,0.81">
            <span className="sc-kick">On the record</span>
            <p className="sc-h" data-split>Everything billed, GST and all</p>
            <p className="sc-sub">The warranty is the manufacturer&rsquo;s. We stand with you while you claim it.</p>
          </div>

          <div className="sc-band sc-settle" data-band="0.835,1">
            <span className="sc-kick">Come and see</span>
            <p className="sc-h" data-split>We&rsquo;ll be at the counter</p>
            <p className="sc-sub">Shop No. 3896/661/29, Gurudwara Road, Block F, Jawahar Colony, NIT Faridabad.</p>
          </div>
        </div>

        <div className="sc-cue" aria-hidden="true"><i />scroll</div>
        <svg className="sc-ring" viewBox="0 0 48 48" aria-hidden="true">
          <circle cx="24" cy="24" r="20" fill="none" stroke="currentColor" strokeWidth="3"
                  strokeDasharray="126" style={{ strokeDashoffset: "var(--ld,126)" }} />
        </svg>
      </div>
    </section>
  );
}
