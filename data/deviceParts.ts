/**
 * एक फ़ोन के अंदर के हिस्से — scroll पर खुलने वाले "exploded view" के लिए।
 *
 * ध्यान (CLAUDE.md §8): यहाँ किसी brand या model का नाम नहीं है, न कोई
 * spec, न mAh, न nits, न क़ीमत। ये सिर्फ़ किसी भी smartphone के आम हिस्से
 * हैं — क्योंकि यह हिस्सा दुकान की repair सुविधा दिखाने के लिए है,
 * किसी product का दावा करने के लिए नहीं।
 *
 * नाप की इकाई: three.js units. 1 unit ≈ 10 cm मान लीजिए।
 * फ़ोन का शरीर लगभग 1.5 × 3.1 units का है।
 */

export type PhonePart = {
  id: string;
  /** Screen पर दिखने वाला नाम */
  label: string;
  /** एक छोटी लाइन — क्यों दिखा रहे हैं */
  note: string;
  /** चौड़ाई, ऊँचाई, मोटाई */
  size: [number, number, number];
  /** जुड़े हुए फ़ोन में यह हिस्सा कहाँ बैठता है */
  at: [number, number, number];
  /** खुलने पर कितना और किस दिशा में हटेगा */
  to: [number, number, number];
  /** hex रंग */
  color: string;
  /** धातु जैसा (1) या plastic जैसा (0) */
  metal: number;
  /** खुरदुरापन — 0 आईने जैसा, 1 बिलकुल मैट */
  rough: number;
  /** ख़ुद रौशनी देता है? (सिर्फ़ display) */
  glow?: string;
  /** काँच की तरह पार दिखता है? */
  glass?: boolean;
  /**
   * नाम हिस्से से कितनी दूर, किस तरफ़ लिखा जाए।
   * सब नाम एक ही जगह न आ जाएँ, इसलिए हर हिस्से का अलग रखा है।
   */
  labelAt: [number, number, number];
};

/**
 * क्रम मायने रखता है: पहला हिस्सा सबसे आगे (customer की तरफ़),
 * आख़िरी सबसे पीछे। खुलने पर पहला सबसे ज़्यादा आगे आता है।
 */
export const phoneParts: PhonePart[] = [
  {
    id: "cover-glass",
    labelAt: [0, 1.85, 0] as [number, number, number],
    label: "कवर ग्लास",
    note: "सबसे ऊपर की काँच की परत",
    size: [1.5, 3.1, 0.03],
    at: [0, 0, 0.13],
    to: [0, 1.15, 1.15],
    color: "#a8d6ff",
    metal: 0,
    rough: 0.02,
    glass: true,
  },
  {
    id: "display",
    labelAt: [-1.55, 0.9, 0] as [number, number, number],
    label: "डिस्प्ले पैनल",
    note: "जो आप देखते हैं, वो यहीं बनता है",
    size: [1.42, 3.0, 0.04],
    at: [0, 0, 0.09],
    to: [0, 0.55, 0.72],
    color: "#0a1020",
    metal: 0,
    rough: 0.25,
    glow: "#4cc9f0",
  },
  {
    id: "frame",
    labelAt: [1.6, -1.05, 0] as [number, number, number],
    label: "मिड-फ़्रेम",
    note: "पूरे फ़ोन का ढाँचा",
    size: [1.52, 3.12, 0.1],
    at: [0, 0, 0.0],
    to: [0, 0.02, 0.28],
    color: "#aab4c6",
    metal: 1,
    rough: 0.22,
  },
  {
    id: "battery",
    labelAt: [-1.1, -1.25, 0] as [number, number, number],
    label: "बैटरी",
    note: "सबसे ज़्यादा यही बदलवाई जाती है",
    size: [1.2, 1.6, 0.09],
    at: [0, -0.35, -0.06],
    to: [-1.32, -0.78, -0.18],
    color: "#1c2a4a",
    metal: 0.3,
    rough: 0.45,
  },
  {
    id: "board",
    labelAt: [1.15, 0.95, 0] as [number, number, number],
    label: "मेनबोर्ड",
    note: "फ़ोन का दिमाग़",
    size: [1.2, 1.0, 0.05],
    at: [0, 0.85, -0.06],
    to: [1.38, 0.18, -0.18],
    color: "#123a2a",
    metal: 0.2,
    rough: 0.6,
  },
  {
    id: "camera",
    labelAt: [-1.15, 0.6, 0] as [number, number, number],
    label: "कैमरा मॉड्यूल",
    note: "पीछे के lens का पूरा हिस्सा",
    size: [0.62, 0.62, 0.14],
    at: [-0.38, 1.02, -0.16],
    to: [-1.22, 0.98, -0.85],
    color: "#2b2f3a",
    metal: 0.8,
    rough: 0.3,
  },
  {
    id: "back-glass",
    labelAt: [0.15, -1.85, 0] as [number, number, number],
    label: "बैक ग्लास",
    note: "पीछे की काँच की परत",
    size: [1.5, 3.1, 0.03],
    at: [0, 0, -0.13],
    to: [0, -1.12, -0.95],
    color: "#0d1830",
    metal: 0.6,
    rough: 0.12,
  },
];

/** Exploded view के ऊपर लिखी जाने वाली लाइन। */
export const explodedHeading = {
  kicker: "REPAIR",
  title: "खोलिए,\nअंदर तक",
  body: "जो हिस्सा ख़राब है, वही देखा जाता है। सामान दुकान पर लाकर दिखा दीजिए — देखकर बता देंगे कि क्या हो सकता है।",
};
