"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";

/**
 * Article के ऊपर चलने वाली video — पहले सिर्फ़ तस्वीर, video बाद में।
 *
 * **क्यों बनी:** पहले यह सीधा `<video autoPlay preload="none">` था। `autoPlay`
 * लिखते ही browser `preload="none"` को अनदेखा कर देता है और page खुलते ही
 * पूरी file उतारने लगता है — Redmi वाले article पर वो **1.7 MB** थी, हर
 * visitor के लिए, 4G पर। और जाँच में वही download बीच में कटकर बार-बार
 * `reqfail` बनकर आ रहा था।
 *
 * अब वही तरीक़ा है जो "हमारा सफ़र" और header की video में है:
 * तस्वीर पहले दिखती है, video तभी माँगी जाती है जब वो हिस्सा पास आ जाए।
 *
 * ⚠️ चार बातें जो पहले टूट चुकी हैं — दोबारा मत तोड़िएगा:
 * 1. **`src` लिखने के बाद `load()` कभी मत बुलाइए** — `src` लिखते ही browser
 *    ख़ुद load शुरू कर देता है; `load()` उसी को रद्द कर देता है और वो request
 *    "aborted" गिनी जाती है।
 * 2. **`play()` भी `loadeddata` के अंदर** — `src` के तुरंत बाद बुलाने पर वही
 *    aborted वाली दिक़्क़त आती है।
 * 3. **छोटी screen पर हल्की file** — `srcSm`। बिना उसके phone पर पूरी बड़ी
 *    file उतरती है।
 * 4. **तस्वीर हटती नहीं, video उसके ऊपर आती है** — इसलिए डिब्बा कभी ख़ाली
 *    नहीं दिखता, न धीमे internet पर, न autoplay बंद होने पर।
 */
export function AutoVideo({
  src, srcSm, poster, alt, width, height,
}: {
  src: string;
  srcSm?: string;
  poster: string;
  alt: string;
  width: number;
  height: number;
}) {
  const boxRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const box = boxRef.current;
    if (!box) return;
    // Motion कम माँगी हो तो video माँगी ही नहीं जाती — तस्वीर ही रहती है।
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const v = box.querySelector<HTMLVideoElement>(".av-v");
    if (!v) return;

    let asked = false;
    let timer = 0;

    function fetchVideo() {
      const url = (srcSm && matchMedia("(max-width: 860px)").matches) ? srcSm : src;
      v!.preload = "auto";
      v!.src = url;                    // ⚠️ इसके बाद `load()` नहीं
      v!.addEventListener("loadeddata", () => {
        box!.classList.add("av-on");
        const go = v!.play();
        if (go && typeof go.then === "function") go.catch(() => { /* न चले तो तस्वीर ही सही */ });
      }, { once: true });
    }

    const near = new IntersectionObserver((es) => {
      if (!es[0].isIntersecting || asked) return;
      asked = true;
      near.disconnect();
      // ⚠️ video **तुरंत** मत माँगिए। यह सजावट है, article नहीं। पहले page
      // पूरा खुल जाए और browser फ़ुरसत में आ जाए, तब माँगिए — तब तक ग्राहक
      // को वही तस्वीर दिखती रहती है जो video में है। इससे article की अपनी
      // लिखाई और तस्वीरें पहले आती हैं, और धीमे 4G पर video उनसे bandwidth
      // नहीं छीनती।
      const later = () => { timer = window.setTimeout(fetchVideo, 1200); };
      if (document.readyState === "complete") later();
      else addEventListener("load", later, { once: true });
    }, { rootMargin: "200px 0px" });

    near.observe(box);
    return () => { near.disconnect(); if (timer) clearTimeout(timer); };
  }, [src, srcSm]);

  return (
    <span className="av" ref={boxRef}>
      <Image className="ph-img" src={poster} alt={alt}
             width={width} height={height} priority
             sizes="(max-width:900px) 100vw, 900px" />
      <video className="av-v ph-img" loop muted playsInline preload="none"
             aria-hidden="true" tabIndex={-1} />
    </span>
  );
}
