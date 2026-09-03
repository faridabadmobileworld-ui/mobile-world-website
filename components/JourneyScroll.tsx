"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { legacy } from "@/data/shop";

/* हमारा सफ़र — scroll के साथ बहती हुई दुकान की कहानी।
   तीन video, चार पड़ाव। 1996 वाला पड़ाव जान-बूझकर किराना दुकान वाली video पर
   ही बैठता है, क्योंकि उस वक़्त दुकान वही थी।

   ⚠️ Video सिर्फ़ बड़ी screen पर उतरती है, और तभी जब यह हिस्सा पास आ जाए।
   Phone पर, और motion कम माँगी हो तो, यही सफ़र तीन ठहरी हुई तस्वीरों से
   चलता है — एक byte भी video का download नहीं होता। */

type Era = { year: string; src: string; poster: string; a: number; b: number };

/* video कहाँ से कहाँ तक चलती है (scroll की दूरी में, 0 से 1) */
const ERAS: Era[] = [
  { year: "1973", src: "/journey/era-1973.mp4", poster: "/journey/era-1973.jpg", a: 0,    b: 0.5  },
  { year: "2006", src: "/journey/era-2006.mp4", poster: "/journey/era-2006.jpg", a: 0.5,  b: 0.75 },
  { year: "2016", src: "/journey/era-2016.mp4", poster: "/journey/era-2016.jpg", a: 0.75, b: 1    },
];

/* चारों पड़ाव — कौन सा कब दिखे। 1973 और 1996 दोनों पहली video पर। */
const BEATS: Array<[number, number]> = [[0, 0.25], [0.25, 0.5], [0.5, 0.75], [0.75, 1]];

/* वही पाँच हालतें जिनमें scroll वाला सफ़र नहीं चलता।
   ⚠️ ये नाप CSS में भी हूबहू लिखी हैं — एक बदले तो दूसरी भी। */
const GATES = [
  "(max-width: 860px)",
  "(orientation: portrait) and (max-width: 1024px)",
  "(orientation: portrait) and (pointer: coarse)",
  "(orientation: landscape) and (pointer: coarse) and (max-height: 560px)",
  "(prefers-reduced-motion: reduce)",
];

export function JourneyScroll() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!rootRef.current) return;
    // ⚠️ हाथ से type लिखना ज़रूरी है — नीचे `function` वाले हिस्से hoisted हैं
    // और TypeScript उनके अंदर narrowing भूल जाता है।
    const root: HTMLDivElement = rootRef.current;
    const videos = Array.from(root.querySelectorAll<HTMLVideoElement>(".jrn-v"));
    const beats = Array.from(root.querySelectorAll<HTMLElement>(".jrn-beat"));
    const rail = Array.from(root.querySelectorAll<HTMLElement>(".jrn-rail li"));
    if (!videos.length) return;

    const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));
    const smooth = (t: number) => { const c = clamp(t, 0, 1); return c * c * (3 - 2 * c); };
    const progress = () => {
      const range = root.offsetHeight - window.innerHeight;
      if (range <= 0) return 0;
      return clamp(-root.getBoundingClientRect().top / range, 0, 1);
    };

    /* seek का दरवाज़ा — हर video के लिए अलग, एक बार में एक ही */
    const busy = videos.map(() => false);
    const pending: (number | null)[] = videos.map(() => null);
    const seek = (i: number, t: number) => {
      const v = videos[i];
      if (!v.duration) return;
      // ⚠️ जहाँ video पहले से है वहीं भेजने पर browser कोई `seeked` नहीं भेजता।
      // दरवाज़ा तब हमेशा के लिए बंद रह जाता है और video कभी हिलती ही नहीं —
      // page के बिलकुल ऊपर से शुरू करने पर यही हुआ था।
      if (Math.abs(v.currentTime - t) < 1 / 48) return;
      if (busy[i]) { pending[i] = t; return; }
      busy[i] = true; v.currentTime = t;
    };
    const onSeeked = videos.map((v, i) => () => {
      busy[i] = false;
      if (pending[i] !== null) { const t = pending[i]!; pending[i] = null; seek(i, t); }
    });
    videos.forEach((v, i) => v.addEventListener("seeked", onSeeked[i]));

    const lastOp = videos.map(() => -1);
    const lastBeat = beats.map(() => -1);
    let lastActive = -1;

    function paint(p: number) {
      /* परतें ऊपर चढ़ती जाती हैं: हर नई video आकर पिछली को ढक लेती है और फिर
         कभी हटती नहीं। इसलिए न कोई frame काला पड़ता है, न कभी दो तस्वीरें
         एक साथ दिखती हैं (आख़िर में पहले यही गड़बड़ हुई थी)। */
      const fade = 0.035;
      for (let i = 0; i < ERAS.length; i++) {
        const e = ERAS[i];
        const op = i === 0 ? 1 : smooth((p - (e.a - fade)) / (fade * 2));
        if (Math.abs(op - lastOp[i]) > 0.004) {
          videos[i].style.opacity = op.toFixed(3);
          lastOp[i] = op;
        }
        // सिर्फ़ वही video seek होती है जो अभी दिख रही है या आ रही है
        if (p >= e.a - fade * 2 && p <= e.b + fade * 2 && videos[i].duration) {
          seek(i, clamp((p - e.a) / (e.b - e.a), 0, 1) * videos[i].duration);
        }
      }
      let active = 0;
      for (let i = 0; i < BEATS.length; i++) {
        const [a, b] = BEATS[i];  // b का इस्तेमाल सिर्फ़ ऊपर fade में
        const f = 0.03;
        const op = (i === 0 ? 1 : smooth((p - a) / f)) *
                   (i === BEATS.length - 1 ? 1 : 1 - smooth((p - (b - f)) / f));
        if (Math.abs(op - lastBeat[i]) > 0.004) {
          beats[i].style.opacity = op.toFixed(3);
          beats[i].style.setProperty("--k", op.toFixed(3));
          lastBeat[i] = op;
        }
        // ⚠️ `p < b` मत लिखिए — page के बिलकुल आख़िर में p ठीक 1 होता है और
        // आख़िरी पड़ाव छूट जाता है (नीचे की पट्टी वहीं ग़लत दिखने लगी थी)।
        if (p >= a) active = i;
      }
      if (active !== lastActive) {
        rail.forEach((li, i) => li.classList.toggle("on", i <= active));
        lastActive = active;
      }
    }

    /* वो loop जो काम ख़त्म होते ही सो जाता है */
    let target = 0, shown = 0, raf: number | null = null, last = 0, onScreen = true;
    function tick(now: number) {
      const dt = Math.min(100, now - (last || now));
      last = now;
      shown += (target - shown) * (1 - Math.pow(1 - 0.18, dt / 16.667));
      if (Math.abs(target - shown) < 0.0004) { shown = target; raf = null; last = 0; }
      else raf = requestAnimationFrame(tick);
      paint(shown);
    }
    function onScroll() {
      target = progress();
      if (raf === null && onScreen) raf = requestAnimationFrame(tick);
    }

    /* video तभी माँगी जाती है जब यह हिस्सा पास आ जाए — home page का
       पहला भार इससे नहीं बढ़ता। */
    let asked = false;
    const near = new IntersectionObserver((es) => {
      if (!es[0].isIntersecting || asked) return;
      asked = true;
      /* ⚠️ पूरी file एक बार में उतारकर blob बनाना ज़रूरी है। सीधे पते से
         चलाने पर हर seek एक अलग range request बन जाती है — 4G पर वो अटकती
         है, और कुछ जगह video seekable होती ही नहीं। Blob एक बार आता है,
         फिर scrub बिजली की तरह चलता है। */
      let ready = 0;
      videos.forEach((v) => {
        const url = v.dataset.src;
        if (!url) return;
        fetch(url)
          .then((r) => (r.ok ? r.blob() : Promise.reject(new Error("no video"))))
          .then((blob) => {
            v.preload = "auto";
            v.src = URL.createObjectURL(
              blob.type ? blob : new Blob([blob], { type: "video/mp4" }));
            v.load();
            v.addEventListener("loadeddata", () => {
              // तीनों आ जाएँ, तभी तस्वीरों से video पर जाइए — वरना बीच में
              // एक परत ख़ाली दिखती है।
              if (++ready === videos.length) root.classList.add("jrn-live");
              onScroll();
            }, { once: true });
          })
          .catch(() => { /* video न आए तो तस्वीरें ही सफ़र हैं */ });
      });
      near.disconnect();
    }, { rootMargin: "600px 0px" });

    const vis = new IntersectionObserver((es) => {
      onScreen = es[0].isIntersecting;
      if (onScreen) onScroll();
      else if (raf !== null) { cancelAnimationFrame(raf); raf = null; }
    }, { rootMargin: "80px" });

    const mqls = GATES.map((q) => matchMedia(q));
    let on = false;
    function enable() {
      if (on) return; on = true;
      near.observe(root); vis.observe(root);
      addEventListener("scroll", onScroll, { passive: true });
      onScroll();
    }
    function disable() {
      if (!on) return; on = false;
      near.disconnect(); vis.disconnect();
      removeEventListener("scroll", onScroll);
      if (raf !== null) { cancelAnimationFrame(raf); raf = null; }
      root.classList.remove("jrn-live");
      beats.forEach((b) => { b.style.removeProperty("opacity"); b.style.removeProperty("--k"); });
      videos.forEach((v) => v.style.removeProperty("opacity"));
    }
    const apply = () => (mqls.some((m) => m.matches) ? disable() : enable());
    mqls.forEach((m) => m.addEventListener("change", apply));
    apply();

    return () => {
      mqls.forEach((m) => m.removeEventListener("change", apply));
      removeEventListener("scroll", onScroll);
      videos.forEach((v, i) => v.removeEventListener("seeked", onSeeked[i]));
      near.disconnect(); vis.disconnect();
      if (raf !== null) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section className="sec jrn">
      <div className="shead"><h2 id="hamara-safar">हमारा सफ़र</h2></div>

      <div className="jrn-scroll" ref={rootRef}>
        <div className="jrn-stage">
          {ERAS.map((e) => (
            <video key={e.year} className={`jrn-v jrn-v-${e.year}`} data-src={e.src}
                   poster={e.poster} muted playsInline preload="none"
                   aria-hidden="true" tabIndex={-1} />
          ))}
          {/* phone पर और video आने से पहले — वही सफ़र, ठहरी हुई तस्वीरों में */}
          <div className="jrn-stills" aria-hidden="true">
            {ERAS.map((e) => (
              <Image key={e.year} src={e.poster} alt="" width={1120} height={630}
                     sizes="(max-width:860px) 100vw, 1120px" />
            ))}
          </div>
          <div className="jrn-grade" aria-hidden="true" />

          <div className="jrn-beats">
            {legacy.map((m, i) => (
              <article className="jrn-beat" key={m.year} style={{ "--i": i } as React.CSSProperties}>
                <span className="jrn-year">{m.year}</span>
                <h3>{m.name}</h3>
                <p className="jrn-tag">{m.tag}</p>
                <p className="jrn-body">{m.body}</p>
              </article>
            ))}
          </div>

          <ol className="jrn-rail" aria-hidden="true">
            {legacy.map((m, i) => (
              <li key={m.year} className={i === 0 ? "on" : ""}><i />{m.year}</li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
