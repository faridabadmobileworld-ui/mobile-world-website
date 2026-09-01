/**
 * Mobile World — दुकान की सारी जानकारी सिर्फ़ इसी file में।
 *
 * नियम: किसी component या page में phone number, address या दुकान का नाम
 * दोबारा मत लिखो। हमेशा यहीं से import करो:
 *
 *     import { shop } from "@/data/shop";
 *
 * जानकारी बदलनी हो तो सिर्फ़ यह file बदलो — पूरी website अपने आप बदल जाएगी।
 */

export type Address = {
  /** "Shop No. 3896/661/29, Gurudwara Road, Block F" */
  street: string;
  /** सिर्फ़ सड़क का नाम — "Gurudwara Road"। Short lines में काम आता है। */
  road: string;
  /** पास की पहचान — "Near Bada Gurudwara and Disposal Chowk" */
  landmark: string;
  /** मोहल्ला — "Jawahar Colony" */
  locality: string;
  /** शहर — "NIT Faridabad" */
  city: string;
  state: string;
  postalCode: string;
  /** ISO country code, JSON-LD schema के लिए */
  country: string;
};

export type Phone = {
  /** Screen पर दिखाने के लिए — "+91 93152 12131" */
  display: string;
  /** Call button के लिए — <a href={shop.phone.tel}> */
  tel: string;
  /** WhatsApp button के लिए — <a href={shop.phone.whatsapp}> */
  whatsapp: string;
};

export type Social = {
  youtube: string;
  instagram: string;
  facebook: string;
  /** TODO (owner): Google Maps listing का पूरा URL। तब तक खाली। */
  googleMaps: string;
};

/** Map के coordinates — LocalBusiness JSON-LD schema के लिए चाहिए। */
export type Geo = {
  latitude: number;
  longitude: number;
};

/** दुकान खुलने-बंद होने का समय, एक दिन के लिए। */
export type OpeningHours = {
  /** JSON-LD schema का format — "Monday", "Tuesday", ... */
  day: string;
  /** 24-hour format — "10:00" */
  opens: string;
  /** 24-hour format — "21:00" */
  closes: string;
};

export type Category = {
  slug: string;
  name: string;
};

export type Brand = {
  slug: string;
  name: string;
};

export type Shop = {
  name: string;
  /**
   * दुकान के board वाला दूसरा हिस्सा — "Mobile • Laptop • Electronics • Home Appliances"।
   * Owner हर जगह (Google, Instagram, Facebook, YouTube) यही naam रख रहे हैं,
   * इसलिए website के title, header, footer और schema में भी यही जाता है।
   */
  tagline: string;
  registeredName: string;
  owner: string;
  siteUrl: string;
  address: Address;
  phone: Phone;
  social: Social;
  geo: Geo | null;
  openingHours: OpeningHours[];
  /**
   * दुकान हर महीने की आख़िरी तारीख़ को बंद रहती है (28/29/30/31 — जो भी हो)।
   * कोई weekly off नहीं है।
   */
  monthlyClosure: "last-calendar-date";
  services: Services;
  /**
   * Mobile World किस साल शुरू हुई — 2016।
   * Google को schema में यही तारीख़ जाती है।
   */
  foundingYear: number;
  /**
   * परिवार का business किस साल शुरू हुआ — 1973।
   * यह दुकान की कहानी है, Mobile World की founding date नहीं।
   * इसे schema की `foundingDate` में कभी मत डालो।
   */
  legacyStartYear: number;
  /** Cash, UPI, card, EMI — owner ने 31 Aug 2026 को confirm किया। */
  paymentMethods: readonly string[];
  /** दुकान की नींव रखने वाले — स्व. श्री बाबू लाल अग्रवाल जी। */
  founderName: string;
  /** Website के content का author — हर article के नीचे यही नाम छपता है। */
  authorName: string;
};

/**
 * ये सारी services owner ने 24 Aug 2026 को confirm कीं।
 * जो service बंद हो जाए, उसे यहाँ false कर दीजिए — website से अपने आप हट जाएगी।
 */
export type Services = {
  /**
   * Mobile repairing की सुविधा है।
   *
   * Owner ने 31 Aug 2026 को साफ़ किया: दुकान retail shop भी है और repairing
   * shop भी — दोनों। कोई पूछे "आपके यहाँ repairing होती है क्या?" तो जवाब
   * हाँ है। **पर नए phone का warranty वाला काम brand के service centre पर
   * ही होता है** — दुकान उसका दावा नहीं करती।
   *
   * ⚠️ फिर भी इसे बढ़ा-चढ़ाकर मत लिखो। Screen / battery / water damage की
   * पूरी list मत गिनाओ — वो repairing shop का इश्तिहार लगता है, retail
   * दुकान का नहीं।
   */
  repair: boolean;
  /** Cards और finance दोनों पर EMI */
  emi: boolean;
  /** पुराना फ़ोन exchange — estimate WhatsApp पर */
  exchange: boolean;
  /** Faridabad में home delivery */
  delivery: boolean;
  /**
   * ⚠️ Owner ने 26 Aug 2026 को साफ़ किया: **दुकान installation या service
   * नहीं करती। सिर्फ़ सामान बेचती है।** इसे कभी true मत करो जब तक owner
   * ख़ुद न कहे।
   */
  installation: boolean;
  /**
   * बेचने के बाद ग्राहक की सुनना और मदद करना — **हाँ, यह करते हैं।**
   *
   * Owner की परिभाषा (31 Aug 2026): ग्राहक phone लेकर गया, अब उसे data
   * transfer करवाना है, settings समझनी हैं, कोई दिक़्क़त आ गई, या service
   * centre पर बात नहीं बन रही — तो वो आमने-सामने आकर बात कर सकता है।
   * "Amazon-Flipkart पर ग्राहक और service centre के बीच कोई नहीं होता।
   * यहाँ हम ख़ुद सामान देते हैं और आगे सुनते भी हैं।"
   *
   * ⚠️ इसका मतलब warranty या guarantee **नहीं** है। वो brand के service
   * centre से ही मिलती है। यह सिर्फ़ मदद है, कोई वादा नहीं।
   */
  afterSaleSupport: boolean;
};

/**
 * दुकान जो सामान बेचती है — **पूरी website की इकलौती category list**।
 *
 * `slug` URL में जाता है (/products#smartphones) और `name` screen पर
 * दिखता है — header की strip, drawer, footer, Products page और About
 * page, सब यहीं से बनते हैं।
 *
 * यहाँ कुछ जोड़ने से पहले `data/content.ts` के `items` में उसी slug का
 * कम से कम एक सामान डालिए, वरना Products page पर वो heading ख़ाली रहेगी।
 */
export const categories: Category[] = [
  { slug: "smartphones", name: "Smartphones" },
  { slug: "laptops-tablets", name: "Laptops & Tablets" },
  { slug: "televisions", name: "Televisions" },
  { slug: "air-conditioners", name: "Air Conditioners" },
  { slug: "washing-machines", name: "Washing Machines" },
  { slug: "refrigerators", name: "Refrigerators" },
  { slug: "inverters-batteries", name: "Inverters & Batteries" },
  { slug: "audio-wearables", name: "Audio & Wearables" },
  { slug: "kitchen-appliances", name: "Kitchen Appliances" },
  { slug: "accessories", name: "Accessories" },
];

/** दुकान पर मिलने वाले brands। */
export const brands: Brand[] = [
  { slug: "apple", name: "Apple" },
  { slug: "samsung", name: "Samsung" },
  { slug: "xiaomi-redmi", name: "Xiaomi / Redmi" },
  { slug: "oneplus", name: "OnePlus" },
  { slug: "vivo", name: "Vivo" },
  { slug: "oppo", name: "Oppo" },
  { slug: "motorola", name: "Motorola" },
  { slug: "nothing", name: "Nothing" },
  { slug: "iqoo", name: "iQOO" },
  { slug: "realme", name: "Realme" },
  { slug: "tecno", name: "Tecno" },
  { slug: "infinix", name: "Infinix" },
  { slug: "lava", name: "Lava" },
  { slug: "nokia", name: "Nokia" },
  { slug: "philips", name: "Philips" },
];

/**
 * Website का पता।
 *
 * Domain ख़रीदा जा चुका है — `www.mobileworldfaridabad.com`.
 *
 *  1. अगर Vercel में `NEXT_PUBLIC_SITE_URL` भरा है — वही
 *  2. वरना नीचे लिखा असली domain
 *
 * Vercel का अपना `.vercel.app` पता अब जान-बूझकर इस्तेमाल नहीं होता —
 * वरना Google को canonical, sitemap और schema में वही पता जाता रहता,
 * और असली domain कभी index नहीं होता।
 *
 * यह ज़रूरी क्यों है: canonical, sitemap, schema और share वाली तस्वीर —
 * सब इसी पते से बनते हैं। ग़लत पता होगा तो Google ऐसी जगह ढूँढ़ेगा जो है ही नहीं।
 */
/** Domain owner ने 30 Aug 2026 को ख़रीद लिया। यही website का असली पता है। */
const SITE_URL = "https://www.mobileworldfaridabad.com";

function resolveSiteUrl(): string {
  // Vercel में `NEXT_PUBLIC_SITE_URL` भरा हो तो वही — domain बदलने पर
  // सिर्फ़ वही एक जगह बदलनी पड़ेगी, code छूना नहीं पड़ेगा।
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return explicit.replace(/\/+$/, "");

  return SITE_URL;
}

export const shop: Shop = {
  /** Public नाम — website पर हर जगह यही। Owner ने 27 Aug 2026 को final किया। */
  name: "Mobile World",
  /** Board वाला दूसरा हिस्सा। Title और header में naam के साथ जाता है। */
  tagline: "Mobile • Laptop • Electronics • Home Appliances",
  /** Registered नाम — सिर्फ़ legal/footer के लिए। */
  registeredName: "Aggarwal Kiryana And Communication",
  owner: "Tarun Gupta",

  siteUrl: resolveSiteUrl(),

  address: {
    street: "Shop No. 3896/661/29, Gurudwara Road, Block F",
    road: "Gurudwara Road",
    landmark: "Near Bada Gurudwara and Disposal Chowk",
    locality: "Jawahar Colony",
    city: "NIT Faridabad",
    state: "Haryana",
    postalCode: "121005",
    country: "IN",
  },

  // तीनों एक ही नंबर के अलग-अलग रूप हैं: +91 93152 12131
  // (owner ने 24 Aug 2026 को confirm किया — यही चालू नंबर है)
  phone: {
    display: "+91 93152 12131",
    tel: "tel:+919315212131",
    whatsapp: "https://wa.me/919315212131",
  },

  social: {
    youtube: "https://youtube.com/@mobileworldfaridabad",
    instagram: "https://www.instagram.com/mobileworldfaridabad",
    facebook: "https://www.facebook.com/mobileworldfaridabad/",
    googleMaps: "https://maps.app.goo.gl/zivMudFFatYYF3yf7",
  },

  // Owner ने 24 Aug 2026 को दिए। LocalBusiness JSON-LD schema में जाते हैं।
  geo: {
    latitude: 28.36249,
    longitude: 77.28786,
  },

  // Mobile World 2016 में शुरू हुई। 1973 परिवार के business की शुरुआत है —
  // दोनों अलग बातें हैं, मिलाना मत (ऊपर `legacy` का note देखिए)।
  foundingYear: 2016,
  legacyStartYear: 1973,

  /**
   * दुकान की नींव किसने रखी — स्व. श्री बाबू लाल अग्रवाल जी (owner के पिताजी)।
   * Owner: Mr. Tarun Gupta S/O Lt. Shri Babu Lal Aggarwal.
   */
  founderName: "स्व. श्री बाबू लाल अग्रवाल",
  /** Website का content कौन लिखता है — हर article के नीचे यही नाम जाता है। */
  authorName: "Sachin",

  services: {
    repair: true,
    emi: true,
    exchange: true,
    delivery: true,
    installation: false,
    afterSaleSupport: true,
  },

  /**
   * Owner ने 31 Aug 2026 को confirm किया — ये पाँचों तरीक़े दुकान पर चलते हैं।
   * इससे पहले यह list मानकर लिखी गई थी। अब पूछकर लिखी है।
   * Schema और page — दोनों यहीं से बनते हैं, दोबारा कहीं मत लिखना।
   */
  paymentMethods: ["Cash", "UPI", "Credit Card", "Debit Card", "EMI"],

  // Owner ने 24 Aug 2026 को confirm किया: रोज़ 10 AM – 10 PM, सातों दिन।
  openingHours: [
    { day: "Monday", opens: "10:00", closes: "22:00" },
    { day: "Tuesday", opens: "10:00", closes: "22:00" },
    { day: "Wednesday", opens: "10:00", closes: "22:00" },
    { day: "Thursday", opens: "10:00", closes: "22:00" },
    { day: "Friday", opens: "10:00", closes: "22:00" },
    { day: "Saturday", opens: "10:00", closes: "22:00" },
    { day: "Sunday", opens: "10:00", closes: "22:00" },
  ],

  // साप्ताहिक छुट्टी नहीं है। दुकान हर महीने की आख़िरी तारीख़ को बंद रहती है —
  // वो 28, 29, 30 या 31 जो भी हो। बाक़ी सारे दिन खुली।
  monthlyClosure: "last-calendar-date",
};

/**
 * पता एक लाइन में — footer और JSON-LD schema के काम आएगा।
 */
export const fullAddress = [
  shop.address.street,
  shop.address.landmark,
  shop.address.locality,
  shop.address.city,
  `${shop.address.state} – ${shop.address.postalCode}`,
].join(", ");

/**
 * दुकान का सफ़र — तीन पड़ाव।
 *
 * ये तीनों owner के approved brand post से हैं (25 Aug 2026)। नाम बिलकुल
 * वैसे ही लिखे हैं जैसे owner लिखते हैं।
 *
 * ⚠️ सबसे ज़रूरी बात — इन्हें कभी मिलाकर मत लिखो:
 *
 *   1973 = परिवार के business की शुरुआत (Aggarwal Kiryana Store)
 *   2016 = Mobile World की शुरुआत
 *
 * "Mobile World 1973 में शुरू हुई" या "Aggarwal Kiryana & Communication
 * 1973 में खुली" — दोनों ग़लत हैं। दुकान 1973 से इसी पते पर है, ये भी
 * owner ने confirm नहीं किया, इसलिए ये भी मत लिखो।
 */
export type Milestone = {
  year: string;
  /** उस वक़्त दुकान का नाम — owner के अपने शब्दों में */
  name: string;
  /** छोटी सी पंक्ति — owner के अपने brand graphic से */
  tag: string;
  body: string;
};

export const legacy: Milestone[] = [
  {
    year: "1973",
    name: "Aggarwal Kiryana Store",
    tag: "शुरुआत एक भरोसे की",
    body: "छोटी सी किराना दुकान, बड़ा सपना, सच्ची मेहनत।",
  },
  {
    year: "1996",
    name: "अगली पीढ़ी ने कमान सँभाली",
    tag: "पिताजी के साथ, क़दम से क़दम",
    body: "Tarun Gupta जी ने अपने आदरणीय पिताजी के साथ इस business को सँभाला और आगे बढ़ाया।",
  },
  {
    year: "2006",
    name: "Aggarwal Kiryana & Communication",
    tag: "ज़रूरत बदली, हमने साथ बढ़ाया",
    body: "किराने के साथ जुड़ी communication सेवाएँ — आपकी हर ज़रूरत, एक ही जगह।",
  },
  {
    year: "2016",
    name: "Mobile World",
    tag: "विरासत वही, सोच नई, सेवा बेहतर",
    body: "नए दौर की technology, आपके विश्वास के साथ आगे बढ़ते क़दम।",
  },
];

/**
 * दुकान किन बातों पर चलती है — owner के अपने brand graphics से उठाई गई।
 *
 * ⚠️ यहाँ सिर्फ़ वही बात आती है जो customer ख़ुद जाँच सके।
 * Owner के graphic में "BEST PRICES GUARANTEED", "100% GENUINE" और
 * "best brands" भी लिखा था — तीनों जान-बूझकर नहीं लाए गए, क्योंकि owner
 * का अपना standard (docs/BRAND-VOICE.md §4) ऐसे दावों को मना करता है।
 * उनकी जगह पक्का GST Bill और Brand Warranty लिखा है, जो साबित हो सकते हैं।
 */
export type Value = {
  title: string;
  body: string;
};

export const values: Value[] = [
  { title: "लेने के बाद भी साथ", body: "Data transfer, settings या कोई दिक़्क़त — दुकान पर आकर पूछ लीजिए।" },
  { title: "भरोसा और साफ़ बात", body: "ईमानदार सौदा और पूरी जानकारी, हर बार।" },
  { title: "Genuine Products", body: "पक्के GST Bill और पूरी Brand Warranty के साथ।" },
  { title: "सही Guidance", body: "आपकी असल ज़रूरत के हिसाब से सही product चुनने में मदद।" },
  { title: "एक ही पता", body: "कोई branch नहीं, कोई franchise नहीं।" },
];
