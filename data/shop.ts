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
   * MOBILE WORLD किस साल शुरू हुई — 2016।
   * Google को schema में यही तारीख़ जाती है।
   */
  foundingYear: number;
  /**
   * परिवार का business किस साल शुरू हुआ — 1973।
   * यह दुकान की कहानी है, MOBILE WORLD की founding date नहीं।
   * इसे schema की `foundingDate` में कभी मत डालो।
   */
  legacyStartYear: number;
};

/**
 * ये सारी services owner ने 24 Aug 2026 को confirm कीं।
 * जो service बंद हो जाए, उसे यहाँ false कर दीजिए — website से अपने आप हट जाएगी।
 */
export type Services = {
  /** दुकान पर ही repair — screen, battery, charging port, software */
  repair: boolean;
  /** Cards और finance दोनों पर EMI */
  emi: boolean;
  /** पुराना फ़ोन exchange — estimate WhatsApp पर */
  exchange: boolean;
  /** Faridabad में home delivery */
  delivery: boolean;
  /** AC वग़ैरह की installation — fitted and tested */
  installation: boolean;
};

/**
 * दुकान जो सामान बेचती है।
 * `slug` URL में जाएगा (/products/mobiles), `name` screen पर दिखेगा।
 */
export const categories: Category[] = [
  { slug: "mobiles", name: "Mobiles" },
  { slug: "laptops", name: "Laptops" },
  { slug: "televisions", name: "Televisions" },
  { slug: "air-conditioners", name: "Air Conditioners" },
  { slug: "inverters-batteries", name: "Inverters & Batteries" },
  { slug: "washing-machines", name: "Washing Machines" },
  { slug: "air-fryers", name: "Air Fryers" },
  { slug: "stabilizers", name: "Stabilizers" },
  { slug: "home-appliances", name: "Other Home Appliances" },
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
 * Domain अभी ख़रीदा नहीं है, इसलिए यह अपने आप तय होता है:
 *
 *  1. अगर Vercel में `NEXT_PUBLIC_SITE_URL` भरा है — वही (domain आने पर यही भरना है)
 *  2. वरना Vercel जो मुफ़्त पता देता है — जैसे `mobile-world-website.vercel.app`
 *  3. वरना (अपने computer पर) आने वाला domain
 *
 * यह ज़रूरी क्यों है: canonical, sitemap, schema और share वाली तस्वीर —
 * सब इसी पते से बनते हैं। ग़लत पता होगा तो Google ऐसी जगह ढूँढ़ेगा जो है ही नहीं।
 */
function resolveSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return explicit.replace(/\/+$/, "");

  const vercel = process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL;
  if (vercel) return `https://${vercel}`;

  return "https://www.mobileworldfaridabad.com";
}

export const shop: Shop = {
  /** Public नाम — website पर यही दिखेगा। */
  name: "Mobile World",
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
    facebook: "https://facebook.com/mobileworldfaridabad",
    googleMaps: "https://maps.app.goo.gl/zivMudFFatYYF3yf7",
  },

  // Owner ने 24 Aug 2026 को दिए। LocalBusiness JSON-LD schema में जाते हैं।
  geo: {
    latitude: 28.36249,
    longitude: 77.28786,
  },

  // MOBILE WORLD 2016 में शुरू हुई। 1973 परिवार के business की शुरुआत है —
  // दोनों अलग बातें हैं, मिलाना मत (ऊपर `legacy` का note देखिए)।
  foundingYear: 2016,
  legacyStartYear: 1973,

  services: {
    repair: true,
    emi: true,
    exchange: true,
    delivery: true,
    installation: true,
  },

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
 *   2016 = MOBILE WORLD की शुरुआत
 *
 * "Mobile World 1973 में शुरू हुई" या "Aggarwal Kiryana & Communication
 * 1973 में खुली" — दोनों ग़लत हैं। दुकान 1973 से इसी पते पर है, ये भी
 * owner ने confirm नहीं किया, इसलिए ये भी मत लिखो।
 */
export type Milestone = {
  year: string;
  /** उस वक़्त दुकान का नाम — owner के अपने शब्दों में */
  name: string;
  body: string;
};

export const legacy: Milestone[] = [
  {
    year: "1973",
    name: "Aggarwal Kiryana Store",
    body: "हमारे परिवार का business सफ़र यहीं से शुरू हुआ।",
  },
  {
    year: "2006",
    name: "Aggarwal Kiryana & Communication",
    body: "यह सफ़र आगे बढ़ा, और नाम बदलकर यह हुआ।",
  },
  {
    year: "2016",
    name: "MOBILE WORLD",
    body: "इसी विरासत को आगे बढ़ाते हुए MOBILE WORLD की शुरुआत हुई।",
  },
];
