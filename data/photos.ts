/**
 * दुकान की असली photos।
 *
 * सारी तस्वीरें owner ने ख़ुद भेजी हैं। `alt` वो लिखाई है जो तब दिखती है जब
 * तस्वीर न खुले, और जो screen reader पढ़कर सुनाता है — इसलिए हर तस्वीर का
 * alt सच में बताना चाहिए कि उसमें क्या है (CLAUDE.md §6)।
 *
 * width/height असली नाप हैं। ये देना ज़रूरी है वरना तस्वीर load होते समय
 * page उछलता है।
 */

export type Photo = {
  src: string;
  alt: string;
  width: number;
  height: number;
};

/** दुकान बाहर से — नया customer इन्हीं से दुकान पहचानेगा। */
export const exteriorPhotos: Photo[] = [
  {
    src: "/photos/storefront-night.webp",
    alt: "Mobile World की दुकान रात में, जगमगाते Mobile World बोर्ड और brand साइनबोर्ड के साथ",
    width: 720,
    height: 340,
  },
  {
    src: "/photos/storefront-day.webp",
    alt: "दुकान के बाहर vivo का कार्यक्रम, ऊपर Motorola, Nokia और Mobile World के बोर्ड",
    width: 544,
    height: 1152,
  },
  {
    src: "/photos/storefront-brands.webp",
    alt: "दुकान के बाहर OPPO और vivo के बोर्ड, नीचे Aggarwal Kiryana & Communication लिखा हुआ",
    width: 1351,
    height: 1164,
  },
];

/** दुकान अंदर से। */
export const interiorPhotos: Photo[] = [
  {
    src: "/photos/showroom.webp",
    alt: "Mobile World का showroom अंदर से — OPPO, vivo और JBL के display counter",
    width: 544,
    height: 1152,
  },
  {
    src: "/photos/iphone-display.webp",
    alt: "दुकान में iPhone का display — कई रंगों और models के डिब्बे सजे हुए",
    width: 772,
    height: 1524,
  },
];

/**
 * ग्राहकों की तस्वीरें।
 *
 * ये असली ग्राहक हैं जिनकी तस्वीरें owner ने भेजी हैं। किसी तस्वीर के नीचे
 * कोई बनाई हुई "review" या रेटिंग नहीं लिखी गई — सिर्फ़ यह बताया गया है कि
 * तस्वीर में क्या हो रहा है (CLAUDE.md §8)।
 */
export const customerPhotos: Photo[] = [
  {
    src: "/photos/customers-redmi.webp",
    alt: "ग्राहक दुकान में अपना नया Redmi फ़ोन और accessories लेते हुए",
    width: 1226,
    height: 1280,
  },
  {
    src: "/photos/customers-samsung.webp",
    alt: "दो ग्राहक अपना नया Samsung Galaxy फ़ोन लेते हुए",
    width: 824,
    height: 660,
  },
  {
    src: "/photos/customers-tv.webp",
    alt: "एक परिवार अपना नया LED TV दुकान से ले जाते हुए",
    width: 720,
    height: 1280,
  },
  {
    src: "/photos/customers-gifts.webp",
    alt: "दुकान के बाहर ग्राहक अपने उपहार लेते हुए",
    width: 1280,
    height: 960,
  },
  {
    src: "/photos/customers-earphones.webp",
    alt: "ग्राहक दुकान में अपने नए earphones के साथ",
    width: 720,
    height: 1280,
  },
  {
    src: "/photos/customers-frame.webp",
    alt: "ग्राहक दुकान से मिली भेंट के साथ",
    width: 899,
    height: 1280,
  },
];

/** दुकान का brand banner — owner के designer का बनाया हुआ। */
export const brandBanner: Photo = {
  src: "/photos/banner-brand.webp",
  alt: "Mobile World का banner — Aggarwal Kiryana & Communication, smartphones, laptops और TV के साथ",
  width: 1983,
  height: 793,
};

/** दुकान के सफ़र वाला banner — 1973, 2006, 2016. */
export const legacyBanner: Photo = {
  src: "/photos/banner-legacy.webp",
  alt: "Mobile World का सफ़र — 1973 Aggarwal Kiryana Store, 2006 Aggarwal Kiryana And Communication, 2016 Mobile World",
  width: 1672,
  height: 941,
};

/** दुकान की झलक वाली gallery — बाहर, अंदर और ग्राहक, सब मिलाकर। */
export const galleryPhotos: Photo[] = [
  interiorPhotos[1], // iPhone display
  exteriorPhotos[1], // storefront day
  customerPhotos[0], // Redmi
  interiorPhotos[0], // showroom
  customerPhotos[2], // TV
  exteriorPhotos[2], // OPPO/vivo
  customerPhotos[1], // Samsung
  customerPhotos[3], // gifts
];
