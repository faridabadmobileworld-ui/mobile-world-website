/**
 * 3D scene और scroll के बीच का पुल।
 *
 * यह जान-बूझकर React state नहीं है। Scroll हर frame बदलता है — अगर हर बार
 * setState करते तो React पूरा tree दोबारा render करता और page अटक जाता।
 * इसलिए यह एक साधारण object है: GSAP ScrollTrigger इसमें लिखता है,
 * R3F का useFrame इसे पढ़ता है। बीच में React आता ही नहीं।
 */

export type ScrollState = {
  /** पूरे experience में कहाँ हैं — 0 (शुरू) से 1 (आख़िर) */
  raw: number;
  /** Act 1 — गिरते हुए फ़ोन, 0..1 */
  hero: number;
  /** Act 2 — फ़ोन खुलकर बिखरना, 0..1 */
  explode: number;
  /** Act 3 — particles का एक चीज़ से दूसरी चीज़ बनना, 0..1 */
  morph: number;
  /** Pointer की जगह, -1..1 (camera की हल्की हलचल के लिए) */
  px: number;
  py: number;
  /** Visitor ने फ़ोन में animation बंद कर रखी है? */
  reduced: boolean;
  /**
   * Device कितना दम रखता है — 0.5 (कमज़ोर) से 1 (तगड़ा)।
   * drei का PerformanceMonitor frame-rate देखकर इसे घटाता-बढ़ाता है।
   */
  quality: number;
  /** Canvas screen पर दिख रहा है? न दिख रहा हो तो render बंद कर देते हैं। */
  visible: boolean;
};

export const scrollState: ScrollState = {
  raw: 0,
  hero: 0,
  explode: 0,
  morph: 0,
  px: 0,
  py: 0,
  reduced: false,
  quality: 1,
  visible: true,
};

/** 0..1 के बीच काटना। */
export const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);

/**
 * a..b की range को 0..1 में बदलना।
 * जैसे range(0.3, 0.6, 0.45) → 0.5
 */
export function range(a: number, b: number, v: number): number {
  return clamp01((v - a) / (b - a));
}

/** नरम शुरुआत, नरम अंत — कटी-फटी movement से बचने के लिए। */
export const easeInOut = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

export const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

/** Frame-rate से आज़ाद lerp — 30fps और 120fps पर एक जैसी रफ़्तार। */
export function damp(current: number, target: number, lambda: number, dt: number) {
  return current + (target - current) * (1 - Math.exp(-lambda * dt));
}
