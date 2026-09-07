"use client";

import { useEffect } from "react";

/**
 * हर डिब्बे पर एक रोशनी, जो cursor के पीछे-पीछे चलती है।
 *
 * Owner ने 7 Sep 2026 को कहा: पूरी website का UI ऐसा लगे कि यक़ीन न हो।
 * यह उसी की सबसे बड़ी परत है — card की सतह पर एक नरम उजाला, जो ठीक वहीं
 * बनता है जहाँ आपकी उँगली या cursor है, और किनारे की धार भी उसी तरफ़
 * जगमगाती है। काँच जैसे डिब्बे और असली परछाईं वाली जो सोच पूरी site पर है,
 * यह उसी को आगे ले जाती है — कोई नया अंदाज़ नहीं।
 *
 * ⚠️ पाँच बातें जान-बूझकर ऐसी हैं, इन्हें तोड़िए मत:
 *
 * 1. **छूने वाले phone पर यह चलती ही नहीं।** `pointer: fine` की जाँच है —
 *    यानी mouse/trackpad वाले उपकरण पर ही। Faridabad का ग्राहक phone पर है;
 *    उसके यहाँ यह एक भी हिसाब नहीं लगाती। (Phone पर मज़ा दबाने से आता है —
 *    वो CSS के `:active` से है, यहाँ से नहीं।)
 *
 * 2. **पूरे page पर एक ही listener।** हर card पर अलग listener लगाते तो
 *    सैकड़ों बन जाते। यहाँ document पर एक है, और `closest()` से पता चलता है
 *    कि उँगली किस डिब्बे पर है।
 *
 * 3. **हर हलचल पर हिसाब नहीं होता।** `requestAnimationFrame` एक बार में एक
 *    ही बार चलता है, इसलिए screen जितनी बार बनती है उससे ज़्यादा काम कभी
 *    नहीं होता।
 *
 * 4. **कोई layout दोबारा नहीं नापा जाता।** सिर्फ़ चार CSS variable बदलते हैं —
 *    `--mx`/`--my` (रोशनी की जगह) और `--tx`/`--ty` (डिब्बे का झुकाव)। चारों
 *    एक ही नाप से निकलते हैं, और सिर्फ़ `background-position` तथा `transform`
 *    में जाते हैं। दोनों compositor पर चलते हैं — browser को दोबारा नाप-जोख
 *    नहीं करनी पड़ती।
 *
 *    ⚠️ **`filter` यहाँ कभी मत जोड़िए।** एक `filter:saturate()` ने home का
 *    LCP 652ms से 1416ms कर दिया था (CLAUDE.md में पूरी नाप लिखी है)।
 *    सिर्फ़ `transform` — वो रँगने के काम को छूता ही नहीं।
 *
 * 5. **कुछ भी छुपता नहीं।** यह सिर्फ़ रोशनी जोड़ती है। JavaScript न चले, तो
 *    हर डिब्बा वैसा ही दिखता है जैसा आज दिखता है।
 */

/** जिन डिब्बों पर रोशनी चलेगी। नया डिब्बा बने तो यहीं जोड़िए। */
const AURA = [
  ".pc", ".post", ".ct", ".lnew", ".pmini", ".lrow",
  ".rbody .spec", ".rbody .tier", ".rbody .sw",
  ".mlinks a", ".qr-card", ".shot", ".panel", ".toc", ".byl", ".shr", ".pfoot",
].join(",");

/**
 * डिब्बा कितना झुकेगा (डिग्री में)। 5 से ज़्यादा मत कीजिए — उससे ऊपर
 * card टेढ़ा दिखने लगता है और पढ़ने में दिक़्क़त होती है।
 */
const TILT = 4.5;

export function Aura() {
  useEffect(() => {
    // छूने वाले उपकरण पर कुछ भी मत जोड़िए — वहाँ cursor होता ही नहीं।
    if (!matchMedia("(pointer: fine)").matches) return;

    const root = document.documentElement;
    root.classList.add("aura");

    let raf = 0;
    let pending: { el: HTMLElement; x: number; y: number } | null = null;
    let last: HTMLElement | null = null;

    function paint() {
      raf = 0;
      if (!pending) return;
      const { el, x, y } = pending;
      if (last && last !== el) last.classList.remove("aura-on");
      el.style.setProperty("--mx", `${x.toFixed(1)}%`);
      el.style.setProperty("--my", `${y.toFixed(1)}%`);
      // उसी दो हिसाबों से डिब्बे का झुकाव भी — cursor जिस तरफ़ है, card
      // उसी तरफ़ ज़रा सा झुक जाता है। कोई नई नाप-जोख नहीं, वही x/y।
      el.style.setProperty("--tx", `${(((50 - y) / 50) * TILT).toFixed(2)}deg`);
      el.style.setProperty("--ty", `${(((x - 50) / 50) * TILT).toFixed(2)}deg`);
      el.classList.add("aura-on");
      last = el;
    }

    function onMove(e: PointerEvent) {
      const el = (e.target as Element | null)?.closest?.(AURA) as HTMLElement | null;
      if (!el) {
        if (last) { last.classList.remove("aura-on"); last = null; }
        pending = null;
        return;
      }
      const r = el.getBoundingClientRect();
      pending = {
        el,
        x: ((e.clientX - r.left) / r.width) * 100,
        y: ((e.clientY - r.top) / r.height) * 100,
      };
      if (!raf) raf = requestAnimationFrame(paint);
    }

    function onLeave() {
      if (last) { last.classList.remove("aura-on"); last = null; }
      pending = null;
    }


    document.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave, { passive: true });

    return () => {
      document.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
      if (raf) cancelAnimationFrame(raf);
      if (last) last.classList.remove("aura-on");
      root.classList.remove("aura");
    };
  }, []);

  return null;
}
