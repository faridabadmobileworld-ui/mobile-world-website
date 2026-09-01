"use client";

/**
 * Instagram वाली पट्टी के दोनों तीर।
 *
 * Phone पर उँगली से खिसकाना ही काफ़ी है, इसलिए ये तीर सिर्फ़ बड़ी screen पर
 * दिखते हैं (CSS में)। एक card जितना ही खिसकाते हैं, ताकि आधी post बीच में
 * कटी हुई न रह जाए।
 */

import { useCallback } from "react";

export function InstaArrows({ target }: { target: string }) {
  const khiskao = useCallback((dir: 1 | -1) => {
    const el = document.getElementById(target);
    if (!el) return;
    const card = el.querySelector<HTMLElement>(".igs-c");
    const step = card ? card.offsetWidth + 12 : el.clientWidth * 0.8;
    el.scrollBy({ left: step * dir, behavior: "smooth" });
  }, [target]);

  return (
    <>
      <button className="igs-nav prev" type="button" aria-label="पिछली post"
              onClick={() => khiskao(-1)}>
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor"
             strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M15 18l-6-6 6-6" />
        </svg>
      </button>
      <button className="igs-nav next" type="button" aria-label="अगली post"
              onClick={() => khiskao(1)}>
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor"
             strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M9 6l6 6-6 6" />
        </svg>
      </button>
    </>
  );
}
