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
  // (owner ने 24 Aug 2026 को confirm किया — यही चालू नंबर है)
  phone: {
    display: "+91 93152 12131",
    tel: "tel:+919315212131",
    whatsapp: "https://wa.me/919315212131",
  },

  social: {
    youtube: "https://youtube.com/@mobileworldfaridabad",
    instagram: "https://instagram.com/mobileworldfaridabad2026",
    facebook: "https://facebook.com/mobileworldfaridabad",
    googleMaps: "https://maps.app.goo.gl/zivMudFFatYYF3yf7",
  },

  // Owner ने 24 Aug 2026 को दिए। LocalBusiness JSON-LD schema में जाते हैं।
  geo: {
    latitude: 28.36249,
    longitude: 77.28786,
  },

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
