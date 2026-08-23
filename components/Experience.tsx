"use client";

import dynamic from "next/dynamic";
import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { ExperienceOverlay, useOverlayProgress } from "@/components/ExperienceOverlay";
import { clamp01, scrollState } from "@/components/three/scrollStore";

/**
 * पूरा 3D experience — home page का सबसे ऊपर वाला हिस्सा।
 *
 * बनावट ऐसी है: एक बहुत लंबा section (कई screens जितना), और उसके अंदर एक
 * चिपका हुआ (sticky) canvas जो हमेशा screen भरता है। आप scroll करते हैं तो
 * page नहीं सरकता — canvas के अंदर की कहानी आगे बढ़ती है।
 *
 * तीन acts:
 *   1. फ़ोन ऊपर से गिरकर ढेर बनाते हैं (असली physics)
 *   2. एक फ़ोन खुलकर अपने हिस्सों में बिखरता है, फिर वापस जुड़ता है
 *   3. हज़ारों कण mobile → laptop → TV → AC बनते हैं
 */

/**
 * 3D सिर्फ़ browser में चलेगा, server पर नहीं। इससे दो फ़ायदे: page का पहला
 * HTML हल्का रहता है, और three.js की भारी file तभी उतरती है जब असल में चाहिए।
 */
const Scene = dynamic(() => import("@/components/three/Scene"), {
  ssr: false,
  loading: () => null,
});

const EXPLODE_ID = "mw-act-explode";

/**
 * क्या visitor का connection धीमा है, या उसने "data बचाओ" चालू कर रखा है?
 *
 * यह जाँच इसलिए ज़रूरी है: 3D वाला हिस्सा लगभग 1 MB का है। CLAUDE.md §1 के
 * हिसाब से इस website का असली काम है फ़रीदाबाद के customer से call या
 * WhatsApp करवाना — और वो काम बिना 3D के भी पूरा होता है। इसलिए धीमे
 * connection पर 3D उतारा ही नहीं जाता; लिखाई और दोनों button वैसे ही
 * रहते हैं, सिर्फ़ पीछे का दृश्य स्थिर रहता है।
 */
function isLiteConnection(): boolean {
  if (typeof navigator === "undefined") return false;
  const c = (
    navigator as Navigator & {
      connection?: { saveData?: boolean; effectiveType?: string };
    }
  ).connection;
  if (!c) return false;
  if (c.saveData) return true;
  return c.effectiveType === "slow-2g" || c.effectiveType === "2g";
}

/** कोई subscription नहीं चाहिए — जाँच एक ही बार होती है। */
const noSubscribe = () => () => {};

export default function Experience() {
  const wrap = useRef<HTMLElement>(null);
  const progress = useOverlayProgress(wrap);

  /*
    Server पर हमेशा false — वहाँ connection का पता ही नहीं चलता। Browser में
    असली जाँच होती है। useSyncExternalStore इसलिए, ताकि पहला render दोनों
    जगह एक जैसा रहे और React शिकायत न करे।
  */
  const lite = useSyncExternalStore(noSubscribe, isLiteConnection, () => false);

  /** canvas screen पर है या नहीं — नहीं है तो render रोक देते हैं। */
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    // Animation बंद रखने वाले visitor का ख़याल (CLAUDE.md §3)
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => {
      scrollState.reduced = mq.matches;
    };
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  /** Pointer — camera की हल्की हलचल के लिए। */
  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      scrollState.px = (e.clientX / window.innerWidth) * 2 - 1;
      scrollState.py = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  /** Canvas दिख नहीं रहा या tab पीछे है → render बंद, battery बचे। */
  useEffect(() => {
    const el = wrap.current;
    if (!el) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        scrollState.visible = entry.isIntersecting;
        setPaused(!entry.isIntersecting || document.hidden);
      },
      { rootMargin: "120px" },
    );
    io.observe(el);

    const onVis = () => setPaused(document.hidden || !scrollState.visible);
    document.addEventListener("visibilitychange", onVis);

    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  /**
   * एक ही ScrollTrigger पूरे experience को नापता है, और उसी एक नाप से
   * पहला और तीसरा act निकाल लिए जाते हैं।
   *
   * पहले तीनों के अलग-अलग trigger थे — और वही सबसे बड़ी गड़बड़ी निकली:
   * हर trigger अपनी शुरुआत अलग जगह से गिनता था, इसलिए तीसरे act के कण
   * तब तक ग़ायब रहते थे जब तक वो act ख़त्म ही न हो जाए। अब एक ही नाप है,
   * तो तीनों acts पक्के तौर पर एक-दूसरे से जुड़े रहते हैं।
   *
   * (दूसरे act का ScrollTrigger ExplodedPhone.tsx के अंदर है, क्योंकि
   * वहाँ GSAP की पूरी timeline scroll से बँधी है।)
   */
  useLayoutEffect(() => {
    if (typeof window === "undefined") return;
    gsap.registerPlugin(ScrollTrigger);
    const el = wrap.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: el,
        start: "top top",
        end: "bottom bottom",
        onUpdate: (self) => {
          const p = self.progress;
          scrollState.raw = p;
          scrollState.hero = clamp01(p / 0.3);
          scrollState.morph = clamp01((p - 0.74) / 0.25);
        },
      });
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={wrap}
      className={`relative bg-ink ${lite ? "h-svh" : "h-[460svh]"}`}
      aria-label="Mobile World — परिचय"
    >
      {/* दूसरे act की scroll-लंबाई नापने के लिए — दिखता नहीं */}
      <div id={EXPLODE_ID} className="pointer-events-none absolute left-0 top-[26%] h-[44%] w-px" />

      <div className="sticky top-0 h-svh w-full overflow-hidden">
        {/* 3D आने से पहले और न चल पाने पर — यही background दिखेगा */}
        <div
          aria-hidden
          className="absolute inset-0 bg-[radial-gradient(120%_80%_at_50%_0%,#101a33_0%,#06070b_60%)]"
        />

        {/* Scene खुद ही सिर्फ़ browser में उतरता है (ssr: false) */}
        {lite ? null : (
          <div className="absolute inset-0">
            <Scene explodeTriggerId={EXPLODE_ID} paused={paused} />
          </div>
        )}

        <ExperienceOverlay progress={progress} lite={lite} />
      </div>
    </section>
  );
}
