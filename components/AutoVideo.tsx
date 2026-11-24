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
    const motion = matchMedia("(prefers-reduced-motion: reduce)");
    const video = box.querySelector<HTMLVideoElement>(".av-v");
    if (!video) return;
    let requested = false;
    let nearby = false;
    let visible = false;
    let disposed = false;
    let timer = 0;
    const allowed = () => !disposed && !motion.matches && document.documentElement.dataset.festivalMotion !== 'paused';
    function fetchVideo() {
      timer = 0;
      if (!allowed() || requested || !nearby) return;
      requested = true;
      video!.preload = "auto";
      video!.src = (srcSm && matchMedia("(max-width: 860px)").matches) ? srcSm : src;
    }
    function sync() {
      if (!allowed() || document.hidden || !visible) video!.pause();
      else if (video!.readyState >= 2) {
        void video!.play().then(() => {
          if (!allowed() || document.hidden || !visible) video!.pause();
        }).catch(() => { /* Poster remains available when autoplay is restricted. */ });
      }
      if (allowed() && nearby && !requested && !timer && document.readyState === 'complete') {
        timer = window.setTimeout(fetchVideo, 1200);
      }
    }
    const loaded = () => { if (!disposed) { box!.classList.add('av-on'); sync(); } };
    const near = new IntersectionObserver(([entry]) => { nearby = entry.isIntersecting; sync(); }, { rootMargin: '200px 0px' });
    const view = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; sync(); });
    near.observe(box); view.observe(box);
    video.addEventListener('loadeddata', loaded);
    window.addEventListener('load', sync);
    window.addEventListener('mw-festival-motion', sync);
    document.addEventListener('visibilitychange', sync);
    motion.addEventListener('change', sync);
    return () => {
      disposed = true; near.disconnect(); view.disconnect(); clearTimeout(timer); video.pause();
      video.removeEventListener('loadeddata', loaded);
      window.removeEventListener('load', sync);
      window.removeEventListener('mw-festival-motion', sync);
      document.removeEventListener('visibilitychange', sync);
      motion.removeEventListener('change', sync);
    };
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
