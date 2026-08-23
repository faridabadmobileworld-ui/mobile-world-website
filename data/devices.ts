/**
 * Home page पर scroll करने पर जो तीन फ़ोन घूमते हैं।
 *
 * ये दुकान के flagship models हैं। बदलने हों तो सिर्फ़ यह file बदलिए।
 *
 * ⚠ ध्यान — यहाँ कोई specs (RAM, camera MP, battery) या price नहीं लिखा।
 * वो हमें पता नहीं और stock भी रोज़ बदलता है। इसलिए हर card पर customer
 * को "availability पूछें" कहा गया है (CLAUDE.md §8)।
 */

/** तीन में से कौन सा आकार बनाना है। */
export type DeviceShape = "bar" | "ultra" | "fold";

export type Device = {
  slug: string;
  /** Screen पर दिखने वाला नाम */
  name: string;
  brand: string;
  shape: DeviceShape;
  /** एक लाइन में क्या ख़ास है — बनावट के बारे में, specs नहीं */
  note: string;
  /** छोटे-छोटे tags */
  chips: string[];
  /** पीछे की विशाल लिखाई — \n से टूटती है */
  bigType: string;
  /** दूसरी लाइन खोखली (सिर्फ़ किनारा) दिखे या नहीं */
  hollowSecondLine: boolean;
  /** इस पड़ाव का रंग */
  wash: string;
  glowA: string;
  glowB: string;
  /** इस पड़ाव में लिखाई का रंग */
  ink: string;
  /** फ़ोन की screen पर कौन सी तस्वीर */
  screen: string;
  /** Fold के दूसरे पन्ने पर तस्वीर */
  screen2?: string;
};

export const devices: Device[] = [
  {
    slug: "iphone-17-pro-max",
    name: "iPhone 17 Pro Max",
    brand: "Apple",
    shape: "bar",
    note: "Titanium बनावट और बड़ा camera square। रंग और variant देखकर चुनिए।",
    chips: ["Apple", "Pro Max", "availability पूछें"],
    bigType: "PRO\nMAX",
    hollowSecondLine: true,
    wash: "radial-gradient(125% 95% at 50% 6%,#20242e 0%,#0a0b10 58%,#06070b 100%)",
    glowA: "#c9a227",
    glowB: "#5b6472",
    ink: "#f4f1ec",
    screen: "/photos/iphone-display.webp",
  },
  {
    slug: "galaxy-s26-ultra",
    name: "Galaxy S26 Ultra",
    brand: "Samsung",
    shape: "ultra",
    note: "तीन अलग lens और अंदर ही S-Pen। हाथ में लेकर देखिए, फिर तय कीजिए।",
    chips: ["Samsung", "S-Pen", "availability पूछें"],
    bigType: "S26\nULTRA",
    hollowSecondLine: false,
    wash: "radial-gradient(125% 95% at 50% 6%,#4a2f8f 0%,#170f2e 62%,#06070b 100%)",
    glowA: "#8b5cf6",
    glowB: "#e4002b",
    ink: "#f2eaff",
    screen: "/photos/showroom.webp",
  },
  {
    // TODO (owner): Samsung Fold का exact model नाम confirm करके बदल लीजिए।
    // आपकी GMB list में भी लिखा था कि यह confirm करना है।
    slug: "galaxy-z-fold",
    name: "Galaxy Z Fold",
    brand: "Samsung",
    shape: "fold",
    note: "बंद हो तो फ़ोन, खुल जाए तो tablet। दुकान पर आकर खोलकर देखिए।",
    chips: ["Samsung", "Foldable", "model confirm करें"],
    bigType: "FOLD",
    hollowSecondLine: false,
    wash: "radial-gradient(125% 95% at 50% 6%,#0a4f8c 0%,#04203f 60%,#06070b 100%)",
    glowA: "#4cc9f0",
    glowB: "#2678ff",
    ink: "#e8f4ff",
    screen: "/photos/storefront-night.webp",
    screen2: "/photos/customers-redmi.webp",
  },
];

/** आख़िरी पड़ाव — फ़ोन नहीं, बुलावा। */
export const finalAct = {
  bigType: "आ\nजाइए",
  wash: "radial-gradient(125% 95% at 50% 6%,#e4002b 0%,#5c0013 64%,#06070b 100%)",
  glowA: "#e4002b",
  glowB: "#ff7a45",
  ink: "#fff1f2",
};
