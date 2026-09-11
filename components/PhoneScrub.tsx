"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { shop } from "@/data/shop";
import { IconArrow, IconWhatsApp } from "./Icons";

/**
 * Home page के सबसे ऊपर — owner की अपनी video, scroll के साथ आगे-पीछे चलती हुई।
 *
 * Owner ने 7 Sep 2026 को यह video भेजकर साफ़ कहा:
 *   *"mujhe meri original same video chahiye yahan same to same Exactly jo
 *   maine di h 16:9 ratio me ye... ise exactly ise hi scrolling ke saath
 *   Animate karna h bina isme kuch b badli. jaise legacy ke liye 3 peedhiyo
 *   wali real video chalti najar aati h aage piche same waise hi."*
 *
 * इसलिए यहाँ **कोई बनाई हुई चीज़ नहीं है** — न shader, न drawing। जो video
 * owner ने दी, वही चलती है, उसी 16:9 नाप में, बिना काटे। Scroll आगे बढ़ाइए तो
 * video आगे चलती है, पीछे कीजिए तो पीछे — ठीक वैसे ही जैसे "हमारा सफ़र" वाला
 * हिस्सा (`JourneyScroll.tsx`) चलता है। दोनों की मशीनरी एक ही है।
 *
 * ⚠️ **`object-fit: contain` जान-बूझकर है।** `cover` लगाने पर छोटी screen पर
 *    video के किनारे कट जाते — और video के बाएँ कोने में ही "iPhone 18 Pro Max"
 *    लिखा है। Owner ने कहा है कुछ भी बदलना नहीं, इसलिए पूरा frame दिखता है।
 *
 * ⚠️ **दुकान का अपना नाम video के ऊपर नहीं, नीचे है।** Video के अपने अक्षर
 *    बाएँ कोने में हैं; ऊपर लिखने पर दोनों आपस में टकराते।
 *
 * ⚠️ चार बातें `public/hero-phone/README.md` में लिखी हैं — video blob बनाकर
 *    चलती है, `src` के बाद `load()` कभी नहीं, जहाँ video खड़ी है वहीं seek
 *    नहीं भेजा जाता, और decoder को एक बार चुपचाप चलाकर जगाया जाता है। ये
 *    चारों असली ख़राबियाँ हैं जो पहले पकड़ी जा चुकी हैं — तोड़िएगा मत।
 */

const SRC = "/hero-phone/iphone18.mp4";
const SRC_SM = "/hero-phone/iphone18-sm.mp4";
const POSTER = "/hero-phone/iphone18.jpg";

/** इन हालतों में video माँगी ही नहीं जाती — सिर्फ़ ठहरी हुई तस्वीर दिखती है। */
const GATES = [
  "(prefers-reduced-motion: reduce)",
  "(orientation: landscape) and (pointer: coarse) and (max-height: 460px)",
];

/** छोटी screen पर हल्की वाली file — 561 KB, बड़ी screen पर 2.4 MB */
const SMALL = "(max-width: 860px)";

export function PhoneScrub() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!rootRef.current) return;
    const root: HTMLDivElement = rootRef.current;
    const v = root.querySelector<HTMLVideoElement>(".phv-v");
    if (!v) return;

    const clamp = (n: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, n));
    /* ⚠️ बड़ी screen पर hero चिपकता नहीं (देखिए `globals.css` का पूरी
       चौड़ाई वाला हिस्सा) — वहाँ scroll की कोई दूरी बचती ही नहीं। ऐसी
       हालत में video scroll से नहीं, अपने आप चलती है। */
    const scrubKar = () => root.offsetHeight - window.innerHeight > 0;

    const progress = () => {
      const range = root.offsetHeight - window.innerHeight;
      if (range <= 0) return 0;
      return clamp(-root.getBoundingClientRect().top / range, 0, 1);
    };

    /* seek का दरवाज़ा — एक बार में एक ही seek, बाक़ी क़तार में। */
    let busy = false;
    let queued: number | null = null;
    function seek(t: number) {
      if (!v!.duration) return;
      // ⚠️ जहाँ video पहले से खड़ी है वहीं भेजने पर browser कोई `seeked` नहीं
      // भेजता, और दरवाज़ा हमेशा के लिए बंद रह जाता है। Page के बिलकुल ऊपर से
      // शुरू करने वाले हर visitor के साथ यही होता।
      if (Math.abs(v!.currentTime - t) < 1 / 48) return;
      if (busy) { queued = t; return; }
      busy = true; v!.currentTime = t;
    }
    function onSeeked() {
      busy = false;
      if (queued !== null) { const t = queued; queued = null; seek(t); }
    }
    v.addEventListener("seeked", onSeeked);

    function paint(p: number) {
      root.style.setProperty("--p", p.toFixed(3));
      if (!scrubKar()) return;
      if (v!.duration) seek(clamp(p, 0, 1) * v!.duration);
    }

    /* काम ख़त्म होते ही सो जाने वाला loop */
    let target = 0, shown = 0, raf: number | null = null, last = 0, onScreen = true;
    function tick(now: number) {
      const dt = Math.min(100, now - (last || now));
      last = now;
      shown += (target - shown) * (1 - Math.pow(1 - 0.2, dt / 16.667));
      if (Math.abs(target - shown) < 0.0004) { shown = target; raf = null; last = 0; }
      else raf = requestAnimationFrame(tick);
      paint(shown);
    }
    function onScroll() {
      target = progress();
      if (raf === null && onScreen) raf = requestAnimationFrame(tick);
    }

    let asked = false;
    const near = new IntersectionObserver((es) => {
      if (!es[0].isIntersecting || asked) return;
      asked = true;
      /* ⚠️ पूरी file एक बार में उतारकर blob बनाना ज़रूरी है। सीधे पते से हर
         seek एक अलग range request बन जाती है — 4G पर वो अटकती है, और कई जगह
         video seekable होती ही नहीं। */
      const url = matchMedia(SMALL).matches ? SRC_SM : SRC;
      /* ⚠️ माँगिए **page पूरा खुल जाने के बाद**। यह 2.4 MB की file है; पहले
         यह page की अपनी तस्वीरों और लिखाई से bandwidth छीन रही थी, और जाँच
         में बीच में कटकर `reqfail blob:` बनकर आती रहती थी। तब तक ग्राहक को
         वही तस्वीर दिखती है जो video का पहला frame है। */
      const start = () => fetchVideo(url);
      if (document.readyState === "complete") setTimeout(start, 500);
      else addEventListener("load", () => setTimeout(start, 500), { once: true });
      near.disconnect();
    }, { rootMargin: "300px 0px" });

    /* ⚠️ हाथ से type लिखना ज़रूरी है — यह `function` hoisted है और TypeScript
       इसके अंदर ऊपर वाली `if (!v) return` वाली जाँच भूल जाता है। (यही बात
       `JourneyScroll.tsx` में भी लिखी है।) */
    function fetchVideo(url: string) {
      const vid: HTMLVideoElement = v!;
      fetch(url)
        .then((r) => (r.ok ? r.blob() : Promise.reject(new Error("no video"))))
        .then((blob) => {
          vid.preload = "auto";
          // ⚠️ `src` लिखते ही browser ख़ुद load शुरू कर देता है। उसके बाद
          // `load()` बुलाना उसी load को **रद्द** कर देता है और वो request
          // "aborted" गिनी जाती है। इसलिए यहाँ `load()` जान-बूझकर नहीं है।
          vid.src = URL.createObjectURL(
            blob.type ? blob : new Blob([blob], { type: "video/mp4" }));
          vid.addEventListener("loadeddata", () => {
            // iPhone पर जो video कभी चली ही नहीं, उसे seek करने पर कई बार
            // ख़ाली frame आता है — एक बार चुपचाप चलाकर रोक देने से decoder
            // जाग जाता है। ⚠️ यह `loadeddata` के **अंदर** है, बाहर नहीं।
            const prime = vid.play();
            if (prime && typeof prime.then === "function") {
              prime.then(() => vid.pause()).catch(() => { /* न चले तो भी ठीक */ });
            }
            root.classList.add("phv-live");
            if (scrubKar()) { onScroll(); }
            else {
              // पूरी चौड़ाई वाला रूप — video अपने आप चलती और दोहराती रहे
              vid.loop = true;
              const go = vid.play();
              if (go && typeof go.then === "function") go.catch(() => { /* न चले तो तस्वीर */ });
            }
          }, { once: true });
        })
        .catch(() => { /* video न आए तो ठहरी हुई तस्वीर ही रहती है */ });
    }

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
      root.classList.remove("phv-live");
    }
    const apply = () => (mqls.some((m) => m.matches) ? disable() : enable());
    mqls.forEach((m) => m.addEventListener("change", apply));
    apply();

    return () => {
      mqls.forEach((m) => m.removeEventListener("change", apply));
      removeEventListener("scroll", onScroll);
      v.removeEventListener("seeked", onSeeked);
      near.disconnect(); vis.disconnect();
      if (raf !== null) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section className="phv" aria-labelledby="phv-h">
      <div className="phv-scroll" ref={rootRef}>
        <div className="phv-pin">
          <div className="phv-stage">
            {/* video आने तक — और phone/reduce-motion पर हमेशा — यही तस्वीर */}
            {/* ⚠️ `unoptimized` लगाकर देखा गया था (यह सोचकर कि optimizer एक
                पड़ाव और जोड़ता है) — नाप ने उल्टा बताया: LCP 1450ms से बढ़कर
                2040ms हो गया, क्योंकि तब पूरी 73 KB की JPEG जाती है, छोटी
                WebP नहीं। इसलिए optimizer से ही जाने दीजिए। */}
            <Image className="phv-still" src={POSTER} alt="" width={1280} height={720}
                   sizes="(max-width:860px) 100vw, 1100px" priority />
            {/* ⚠️ यहाँ `poster` जान-बूझकर नहीं है। पीछे वही तस्वीर `<Image>`
                से पहले ही दिख रही है; `poster` लगाने पर browser **वही file
                दोबारा**, पूरी 73 KB की कच्ची JPEG में उतारता है — और वो
                ठीक उसी वक़्त होता है जब पहला दृश्य बन रहा होता है। */}
            <video className="phv-v" muted playsInline preload="none"
                   aria-hidden="true" tabIndex={-1} />
          </div>

          <div className="phv-c">
            {/* Apple का hero वाला क्रम: ऊपर छोटा नारंगी label, फिर सबसे बड़ी
                heading, फिर एक line का परिचय, फिर नीले link। */}
            <p className="phv-eyebrow">Coming Soon</p>
            <h1 id="phv-h">नया iPhone जल्दी ही</h1>
            <p className="phv-sub">
              {shop.address.locality}, {shop.address.city} में — {shop.name} पर
            </p>

            <div className="phv-links">
              <a className="btn btn-d" href={`${shop.phone.whatsapp}?text=${encodeURIComponent(
                `Namaste ${shop.name}! नया iPhone आने पर मुझे बता दीजिएगा।`)}`}
                 target="_blank" rel="noopener">
                <IconWhatsApp />आने पर बता दीजिए
              </a>
              <Link className="phv-a" href="/products">
                दुकान का सामान देखिए<IconArrow />
              </Link>
            </div>

            {/* Owner (7 Sep 2026): "logo use karo, Red Glossy me likha ho
                Mobile World b, aur just uske hi niche tagline b." */}
            <div className="phv-brand">
              <Image className="phv-logo" src="/images/mobile-world-logo-79e75645.webp"
                     alt="" width={240} height={240} sizes="44px" />
              <p className="phv-name">{shop.name}</p>
              <p className="phv-tag">{shop.tagline}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
