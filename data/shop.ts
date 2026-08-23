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

/** दुकान के इतिहास का एक पड़ाव — About page के लिए। */
export type Milestone = {
  year: number;
  event: string;
};

/** दुकान जो सुविधाएँ देती है — repair, EMI, exchange. */
export type Service = {
  slug: string;
  name: string;
  description: string;
};

export type Category = {
  slug: string;
  name: string;
  /**
   * एक लाइन का परिचय। ज़्यादातर owner की अपनी GMB Services वाली लिखाई से
   * लिए गए हैं। जो owner ने नहीं लिखे थे, उन पर नीचे निशान लगा है —
   * owner उन्हें अपने शब्दों में बदल सकता है।
   */
  description: string;
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
  /** हर महीने की आख़िरी तारीख़ को दुकान बंद रहती है। */
  closedOnLastDayOfMonth: boolean;
  milestones: Milestone[];
};

/**
 * दुकान जो सामान बेचती है।
 * `slug` URL में जाएगा (/products/mobiles), `name` screen पर दिखेगा।
 */
export const categories: Category[] = [
  {
    slug: "mobiles",
    name: "Mobiles",
    // owner की GMB लिखाई से
    description:
      "Leading brands के smartphones के options, अलग-अलग budgets और रोज़मर्रा की ज़रूरतों के अनुसार।",
  },
  {
    slug: "laptops",
    name: "Laptops",
    // owner की GMB लिखाई से
    description:
      "Study, work और रोज़मर्रा के काम के लिए laptops के अलग-अलग options।",
  },
  {
    slug: "televisions",
    name: "Televisions",
    // owner की GMB लिखाई से
    description:
      "अलग-अलग viewing needs और budgets के हिसाब से televisions के options।",
  },
  {
    slug: "air-conditioners",
    name: "Air Conditioners",
    // TODO (owner): यह लाइन मैंने लिखी है — अपने शब्दों में बदल लीजिए
    description: "घर और कमरे की ज़रूरत के हिसाब से air conditioners के options।",
  },
  {
    slug: "inverters-batteries",
    name: "Inverters & Batteries",
    // owner की GMB लिखाई से (Power Backup)
    description:
      "घर और रोज़मर्रा की ज़रूरतों के लिए power backup solutions के options।",
  },
  {
    slug: "washing-machines",
    name: "Washing Machines",
    // TODO (owner): यह लाइन मैंने लिखी है — अपने शब्दों में बदल लीजिए
    description: "घर की ज़रूरत और size के हिसाब से washing machines के options।",
  },
  {
    slug: "air-fryers",
    name: "Air Fryers",
    // TODO (owner): यह लाइन मैंने लिखी है — अपने शब्दों में बदल लीजिए
    description: "रसोई के रोज़मर्रा के इस्तेमाल के लिए air fryers के options।",
  },
  {
    slug: "stabilizers",
    name: "Stabilizers",
    // owner की GMB लिखाई से
    description:
      "Televisions और दूसरे electrical appliances के लिए suitable stabilizer options।",
  },
  {
    slug: "home-appliances",
    name: "Other Home Appliances",
    // owner की GMB लिखाई से
    description:
      "घर की रोज़मर्रा की ज़रूरतों के लिए अलग-अलग home appliances के options।",
  },
];

/**
 * दुकान जो सुविधाएँ देती है।
 *
 * Owner ने तीनों की पुष्टि की है। ध्यान: यहाँ कोई शर्त, दर या offer नहीं
 * लिखा गया — जैसे "0% EMI" या "24 घंटे में repair" — क्योंकि वो अभी पता
 * नहीं (CLAUDE.md §8)। हर जगह customer को पूछने के लिए कहा गया है।
 */
export const services: Service[] = [
  {
    slug: "repair",
    name: "Repair",
    description:
      "Mobile और electronics की repair की सुविधा। सामान दुकान पर लाकर दिखा दीजिए — देखकर बता देंगे कि क्या हो सकता है।",
  },
  {
    slug: "emi",
    name: "EMI",
    description:
      "EMI पर सामान लेने की सुविधा उपलब्ध है। किस product पर कौन सा plan चल रहा है, यह पूछ लीजिए।",
  },
  {
    slug: "exchange",
    name: "Exchange",
    description:
      "पुराना phone देकर नया लेने की सुविधा। पुराने phone की क़ीमत उसकी हालत देखकर तय होती है।",
  },
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

export const shop: Shop = {
  /** Public नाम — website पर यही दिखेगा। */
  name: "Mobile World",
  /** Registered नाम — सिर्फ़ legal/footer के लिए। */
  registeredName: "Aggarwal Kiryana And Communication",
  owner: "Tarun Gupta",

  siteUrl: "https://www.mobileworldfaridabad.com",

  address: {
    street: "Shop No. 3896/661/29, Gurudwara Road, Block F",
    landmark: "Near Bada Gurudwara and Disposal Chowk",
    locality: "Jawahar Colony",
    city: "NIT Faridabad",
    state: "Haryana",
    postalCode: "121005",
    country: "IN",
  },

  // तीनों एक ही नंबर के अलग-अलग रूप हैं: +91 93152 12131
  // यही नंबर Google Business Profile और WhatsApp पर भी है।
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

  // दुकान की जगह — Google को यही बताता है कि दुकान नक़्शे पर कहाँ है।
  geo: {
    latitude: 28.36249,
    longitude: 77.28786,
  },

  // सातों दिन सुबह 9 बजे से रात 11 बजे तक।
  openingHours: [
    { day: "Monday", opens: "09:00", closes: "23:00" },
    { day: "Tuesday", opens: "09:00", closes: "23:00" },
    { day: "Wednesday", opens: "09:00", closes: "23:00" },
    { day: "Thursday", opens: "09:00", closes: "23:00" },
    { day: "Friday", opens: "09:00", closes: "23:00" },
    { day: "Saturday", opens: "09:00", closes: "23:00" },
    { day: "Sunday", opens: "09:00", closes: "23:00" },
  ],

  // हर महीने की आख़िरी तारीख़ को दुकान बंद रहती है
  // (31, या जिस महीने में जो आख़िरी दिन हो — February में 28/29)।
  closedOnLastDayOfMonth: true,

  // दुकान का इतिहास — About page के लिए।
  // ध्यान: "Mobile World since 1973" कभी मत लिखना। Mobile World 2016 से है;
  // 1973 परिवार के किराना business की शुरुआत है, अलग बात है।
  milestones: [
    { year: 1973, event: "Aggarwal Kiryana Store" },
    { year: 2006, event: "Aggarwal Kiryana And Communication" },
    { year: 2016, event: "Mobile World" },
  ],
};

/**
 * आज दुकान बंद है या नहीं — यानी क्या आज महीने की आख़िरी तारीख़ है।
 * Visit Us page पर "आज बंद है" दिखाने के काम आएगा।
 */
export function isClosedOn(date: Date): boolean {
  if (!shop.closedOnLastDayOfMonth) return false;
  const tomorrow = new Date(date);
  tomorrow.setDate(date.getDate() + 1);
  // अगर कल नया महीना शुरू हो रहा है, तो आज आख़िरी तारीख़ है।
  return tomorrow.getMonth() !== date.getMonth();
}

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
