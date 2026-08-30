/**
 * Website का सारा दिखने वाला content — एक ही जगह।
 *
 * Owner को कुछ बदलना हो तो यहीं बदलेगा। किसी component में text
 * hardcode मत करो।
 *
 * दुकान की जानकारी (phone, पता, timings) यहाँ नहीं — वो `data/shop.ts`
 * में है। दोनों को मिलाओ मत।
 */

import { shop, categories } from "@/data/shop";

/** WhatsApp पर सवाल भेजने का link। Text हमेशा encode होकर जाता है। */
export function ask(topic: string): string {
  return `${shop.phone.whatsapp}?text=${encodeURIComponent(
    `Namaste Mobile World! मुझे ${topic} के बारे में जानना है।`,
  )}`;
}

export const whatsappGeneral = `${shop.phone.whatsapp}?text=${encodeURIComponent(
  "Namaste Mobile World! मुझे एक product के बारे में जानकारी चाहिए।",
)}`;

/**
 * Text देवनागरी में है या नहीं।
 *
 * ज़रूरत क्यों: kicker और heading पर हमने चौड़ी letter-spacing और UPPERCASE
 * रखी है — English में अच्छी लगती है, पर देवनागरी में मात्राएँ अक्षर से
 * दूर हो जाती हैं और पढ़ने में दिक़्क़त होती है। ऐसे text पर `.dev` class
 * लगती है, जो दोनों बंद कर देती है।
 */
export const hasDevanagari = (text: string): boolean => /[\u0900-\u097F]/.test(text);

/**
 * Header, drawer, footer और Products page की category list।
 *
 * यह अपनी अलग list नहीं है — सीधे `data/shop.ts` की `categories` से बनती
 * है। पहले दो list थीं और दोनों अलग हो गई थीं (About page पर Refrigerators
 * ग़ायब थे)। अब category जोड़नी या हटानी हो तो सिर्फ़ `shop.ts` बदलिए।
 */
export type NavCategory = { label: string; slug: string; image?: string };

/**
 * Category tile पर दिखने वाली तस्वीर।
 *
 * जिस category की तस्वीर यहाँ नहीं है, उसके tile पर code वाली SVG
 * drawing लग जाती है — कोई डिब्बा कभी ख़ाली नहीं दिखता।
 */
const categoryImages: Record<string, string> = {
  smartphones: "/images/mid-range-5g-phones-five-colours-v2-7c07be19.webp",
  "laptops-tablets": "/images/laptop-for-study-and-office-a146b020.webp",
  televisions: "/images/smart-television-on-white-4b38b4f8.webp",
  "air-conditioners": "/images/split-air-conditioner-indoor-unit-24422a50.webp",
  "washing-machines": "/images/semi-and-front-load-washing-machines-28ae1060.webp",
  refrigerators: "/images/double-door-refrigerator-8c144446.webp",
  "inverters-batteries": "/images/inverter-and-battery-fbb02fc5.webp",
  "audio-wearables": "/images/wireless-earbuds-0e160569.webp",
  cameras: "/images/mirrorless-camera-with-lens-3be70d11.webp",
  // TODO (owner): Kitchen Appliances की safed background वाली photo चाहिए।
  // तब तक यहाँ कुछ नहीं — tile पर code वाली साफ़ drawing लग जाती है,
  // क्योंकि बाक़ी सब tiles safed हैं और एक गहरी तस्वीर अलग दिखती है।
  accessories: "/images/fast-charger-and-cable-93b9db0d.webp",
};

export const navCategories: NavCategory[] = categories.map((c) => ({
  label: c.name,
  slug: c.slug,
  image: categoryImages[c.slug],
}));

/**
 * जिस category की photo नहीं है, उसके लिए code वाली SVG drawing।
 *
 * Header का drawer और home page के tiles — दोनों यही इस्तेमाल करते हैं,
 * ताकि icon दोनों जगह एक जैसा रहे।
 */
export function artForCategory(slug: string): string {
  const m: Record<string, string> = {
    smartphones: "a-phone", "laptops-tablets": "a-laptop", televisions: "a-tv",
    "air-conditioners": "a-ac", "washing-machines": "a-wash", refrigerators: "a-fridge",
    "inverters-batteries": "a-inverter", "audio-wearables": "a-speaker",
    "kitchen-appliances": "a-kitchen", accessories: "a-accessory",
    cameras: "a-accessory",
  };
  return m[slug] ?? "a-accessory";
}

/**
 * एक product card। `image` हो तो असली photo लगती है, वरना code वाली
 * SVG drawing (`art`) — ताकि कोई खाली डिब्बा कभी न दिखे।
 */
export type Item = {
  kicker: string;
  title: string;
  tags: string[];
  /** `/images/...` की file, अगर असली photo है */
  image?: string;
  /** SVG symbol id जैसे `a-phone` — जब photo नहीं है */
  art?: string;
  /** किस category page पर दिखे */
  category: string;
};

export const items: Item[] = [
  {
    category: "smartphones",
    kicker: "Smartphones",
    title: "हर बड़े brand के 5G Smartphones",
    tags: ["5G", "सभी brands", "Exchange"],
    image: "/images/flagship-phones-apple-samsung-xiaomi-vivo-c3df528a.webp",
  },
  {
    category: "smartphones",
    kicker: "Smartphones",
    title: "Flagship phones — Apple और Samsung",
    tags: ["Genuine", "Brand Warranty"],
    image: "/images/flagship-smartphone-e6739d50.webp",
  },
  {
    category: "smartphones",
    kicker: "Smartphones",
    title: "Mid-range 5G — तीन-चार साल चलने वाले",
    tags: ["लंबे updates", "Fast charge"],
    image: "/images/mid-range-5g-phones-five-colours-v2-7c07be19.webp",
  },
  {
    category: "laptops-tablets",
    kicker: "Laptops",
    title: "पढ़ाई, office और रोज़ के Laptops",
    tags: ["सभी brands"],
    image: "/images/laptop-for-study-and-office-a146b020.webp",
  },
  {
    category: "laptops-tablets",
    kicker: "Tablets",
    title: "पढ़ाई और काम के लिए Tablets",
    tags: ["हर size"],
    image: "/images/tablets-in-four-colours-9b68921c.webp",
  },
  {
    category: "laptops-tablets",
    kicker: "Monitors",
    title: "Office और gaming के Monitors",
    tags: ["हर size"],
    image: "/images/computer-monitor-579cd6b9.webp",
  },
  {
    category: "televisions",
    kicker: "Televisions",
    title: "32″ से 75″ तक Smart TV",
    tags: ["4K", "32″ से 75″"],
    image: "/images/smart-television-on-white-4b38b4f8.webp",
  },
  {
    category: "air-conditioners",
    kicker: "Air Conditioners",
    title: "Split और Window AC",
    tags: ["1–2 ton", "हर brand"],
    image: "/images/split-air-conditioner-indoor-unit-24422a50.webp",
  },
  {
    category: "washing-machines",
    kicker: "Washing Machines",
    title: "Semi, Top Load और Front Load",
    tags: ["6–8 kg", "Semi और Front Load"],
    image: "/images/semi-and-front-load-washing-machines-28ae1060.webp",
  },
  {
    category: "refrigerators",
    kicker: "Refrigerators",
    title: "Single door, Double door, Frost-free",
    tags: ["Single, Double door"],
    image: "/images/double-door-refrigerator-8c144446.webp",
  },
  {
    category: "inverters-batteries",
    kicker: "Inverters & Batteries",
    title: "Inverter, Battery और Stabilizer",
    tags: ["Inverter + Battery"],
    image: "/images/inverter-and-battery-fbb02fc5.webp",
  },
  {
    category: "audio-wearables",
    kicker: "Audio & Wearables",
    title: "Earbuds, Speakers और Smart Watches",
    tags: ["दुकान पर सुनकर देखिए", "Warranty"],
    image: "/images/wireless-earbuds-0e160569.webp",
  },
  {
    category: "audio-wearables",
    kicker: "Audio",
    title: "Bluetooth Speakers",
    tags: ["दुकान पर सुनकर देखिए"],
    art: "a-speaker",
  },
  {
    category: "audio-wearables",
    kicker: "Wearables",
    title: "Smart Watches और Bands",
    tags: ["सभी brands"],
    art: "a-watch",
  },
  {
    category: "audio-wearables",
    kicker: "Audio",
    title: "Headphones और Earbuds",
    tags: ["ANC वाले भी"],
    art: "a-buds",
  },
  {
    category: "cameras",
    kicker: "Cameras",
    title: "Camera और Lens",
    tags: ["दुकान पर देखिए"],
    image: "/images/mirrorless-camera-with-lens-3be70d11.webp",
  },
  {
    category: "kitchen-appliances",
    kicker: "Kitchen",
    title: "Air Fryer, Microwave, Mixer",
    tags: ["Stock में"],
    image: "/images/kitchen-appliances-on-the-counter-a35bd84a.webp",
  },
  {
    category: "kitchen-appliances",
    kicker: "Home Appliances",
    title: "Vacuum Cleaner",
    tags: ["Cordless भी"],
    image: "/images/cordless-vacuum-cleaner-d6335ad5.webp",
  },
  {
    category: "kitchen-appliances",
    kicker: "Home Appliances",
    title: "Water Purifier और Geyser",
    tags: ["हर brand"],
    image: "/images/home-appliances-at-mobile-world-0f587ac6.webp",
  },
  {
    category: "accessories",
    kicker: "Accessories",
    title: "Cover, Tempered Glass, Charger",
    tags: ["हर model का"],
    image: "/images/mobile-accessories-at-mobile-world-55dedbfe.webp",
  },
  {
    category: "accessories",
    kicker: "Accessories",
    title: "Power Bank और Cable",
    tags: ["Fast charge"],
    image: "/images/fast-charger-and-cable-93b9db0d.webp",
  },
];

/** Home page का hero slider। */
export type Slide = {
  kicker: string;
  heading: string;
  body: string;
  image: string;
  alt: string;
  /** Text पीछे न घुल जाए, इसलिए हर slide के पीछे अपना रंग रहता है। */
  bg: string;
  /**
   * Tasveer poore box mein भरती है, इसलिए ऊपर-नीचे थोड़ा कट जाता है।
   * यह बताता है कि कौन सा हिस्सा ज़रूर दिखना चाहिए (CSS object-position)।
   */
  focus?: string;
};

export const slides: Slide[] = [
  {
    kicker: "Mobile World",
    heading: "हर बड़ा brand,\nएक ही counter",
    body: `Smartphone, Laptop, TV, AC, Refrigerator, Washing Machine और घर का बाक़ी सामान — सब ${shop.address.road} पर।`,
    image: "/images/hero-showroom-e594f39c.webp",
    alt: "Mobile World की दुकान के अंदर — mobile, laptop, TV, AC, fridge और washing machine",
    bg: "#141428",
    focus: "center 62%",
  },
  {
    kicker: "गर्मी का मौसम",
    heading: "Air Conditioners\n1 ton से 2 ton तक",
    body: "कौन सा AC आपके कमरे के लिए ठीक रहेगा — धूप, floor और कमरे की हालत देखकर दुकान पर बता देंगे।",
    image: "/images/hero-air-conditioner-d24b9473.webp",
    alt: "कमरे में लगा हुआ split air conditioner",
    bg: "#1B2436",
    focus: "center 55%",
  },
  {
    kicker: "हमारा सफ़र",
    heading: "हर सफ़र की शुरुआत\nएक भरोसे से होती है",
    body: `${shop.legacyStartYear} में Aggarwal Kiryana Store से शुरू हुआ परिवार का business सफ़र, और ${shop.foundingYear} से Mobile World।`,
    image: "/images/hero-hamara-safar-bffea417.webp",
    alt: "1973 Aggarwal Kiryana, 2006 Aggarwal Kiryana & Communication, 2016 Mobile World",
    bg: "#2A1E12",
    focus: "center 58%",
  },
  {
    kicker: "एक ही पता",
    heading: "हाथ में लेकर\nदेखिए, फिर लीजिए",
    body: "Display, वज़न और पकड़ — ये photo में पूरी तरह समझ नहीं आते। दुकान पर आइए और ख़ुद देख लीजिए।",
    image: "/images/iphone-display-at-the-mobile-world-counter-346d3e71.webp",
    alt: `${shop.name} के counter पर phones का display`,
    bg: "#101018",
    focus: "center 32%",
  },
];

/** दुकान की असली photos। */
export const storePhotos = [
  {
    src: "/images/iphone-display-at-the-mobile-world-counter-346d3e71.webp",
    w: 772,
    h: 1524,
    alt: `${shop.name} के counter पर iPhone का display`,
    title: "Counter",
    caption: "जहाँ से हर सामान आपके हाथ में जाता है।",
  },
  {
    src: "/images/mobile-world-storefront-on-gurudwara-road-ja-a182b026.webp",
    w: 720,
    h: 340,
    alt: `Mobile World storefront on ${shop.address.road}, ${shop.address.locality}, lit up at night`,
    title: "दुकान",
    caption: `${shop.address.road}, ${shop.address.locality} — रात 10 बजे तक खुली।`,
  },
  {
    src: "/images/customers-with-the-mobile-world-thank-you-bo-8f346a1e.webp",
    w: 1000,
    h: 1000,
    alt: "Customers with the Mobile World thank-you board",
    title: "Counter",
    caption: `${shop.address.road} की दुकान के अंदर — staff और ग्राहक।`,
  },
  {
    src: "/images/a-family-collecting-their-purchase-at-mobile-4e86f3cb.webp",
    w: 900,
    h: 1125,
    alt: `A family collecting their purchase at Mobile World, ${shop.address.locality}`,
    title: "हमारे ग्राहक",
    caption: `${shop.address.locality} और पूरे ${shop.address.city} से आने वाले परिवार।`,
  },
  {
    src: "/images/mobile-world-team-handing-over-a-purchase-to-b3645f82.webp",
    w: 900,
    h: 1125,
    alt: "Mobile World team handing over a purchase to customers",
    title: "हमारी टीम",
    caption: "वही लोग, जो आपके दोबारा आने पर भी यहीं मिलेंगे।",
  },
];

/** Repair, EMI, exchange वग़ैरह — जो `shop.services` में true है वही दिखेगा। */
export const serviceCards = [
  {
    key: "repair" as const,
    kicker: "Repair",
    title: "Mobile Repairing",
    body: "Repairing की सुविधा भी दुकान पर है।",
    cta: "Repairing के बारे में पूछिए",
    topic: "repair",
    tone: "mint",
  },
  {
    key: "exchange" as const,
    kicker: "Exchange",
    title: "पुराना phone Exchange कीजिए",
    body: "Model और उसकी हालत बता दीजिए, अंदाज़ा बता देंगे। पक्का valuation counter पर आपके सामने।",
    cta: "Exchange का अंदाज़ा लीजिए",
    topic: "पुराने phone के Exchange",
    tone: "sand",
  },
  {
    key: "emi" as const,
    kicker: "EMI",
    title: "Cards और finance पर EMI",
    body: "कौन सा plan मिलेगा और कितना approval होगा, यह आपका bank तय करता है — दुकान नहीं।",
    cta: "EMI के बारे में पूछिए",
    topic: "EMI",
    tone: "lav",
  },
];

/** Blog posts. `body` सीधे HTML है — यही owner बाद में edit करेगा। */
export type Post = {
  slug: string;
  kicker: string;
  date: string;
  dateISO: string;
  title: string;
  excerpt: string;
  image: string;
  imageW: number;
  imageH: number;
  alt: string;
  body: string;
};

export const posts: Post[] = [
  {
    slug: "ac-tonnage",
    kicker: "Buying Guide",
    date: "20 August 2026",
    dateISO: "2026-08-20",
    title: "अपने कमरे के लिए सही AC tonnage कैसे चुनें",
    excerpt:
      "बड़ा AC अपने आप बेहतर नहीं होता। हम counter पर कमरे का हिसाब कैसे लगाते हैं, वही यहाँ लिखा है।",
    image: "/images/split-ac-indoor-unit-wide-8c7ac6ae.webp",
    imageW: 1200,
    imageH: 675,
    alt: "दीवार पर लगी split AC की indoor unit",
    body: `
<p>बड़ा AC अपने आप बेहतर नहीं होता। ज़रूरत से बड़ा AC कमरे को झट से ठंडा करके बंद हो जाता है, फिर थोड़ी देर में दोबारा चालू — इससे bijli ज़्यादा लगती है और कमरे में नमी बनी रहती है। छोटा AC कभी बंद ही नहीं होता।</p>
<p>मोटा-मोटी हिसाब यह है: लगभग 110 square feet तक का कमरा 1 ton में, 110 से 180 square feet तक 1.5 ton में, और उससे बड़ा आमतौर पर 2 ton में। लेकिन यह हिसाब बदल जाता है अगर कमरा सबसे ऊपर की मंज़िल पर है, दीवार पश्चिम की तरफ़ है, छत ऊँची है, या कमरे में तीन-चार से ज़्यादा लोग एक साथ बैठते हैं।</p>
<p>इसीलिए tonnage सिर्फ़ size से तय नहीं होता — धूप, floor और कमरे की हालत भी देखनी पड़ती है।</p>
<p>कमरे की लंबाई, चौड़ाई और छत की ऊँचाई नाप कर आइए, और यह भी बता दीजिए कि कौन सी मंज़िल है और मुख्य दीवार किस दिशा में है। हम आपके सामने हिसाब लगाकर बताएँगे, अंदाज़े से नहीं।</p>
<p>दुकान पर आकर बता दीजिए, हम आपके कमरे के हिसाब से सही tonnage निकालने में मदद कर देंगे।</p>`,
  },
  {
    slug: "new-phones",
    kicker: "New Arrivals",
    date: "14 August 2026",
    dateISO: "2026-08-14",
    title: "इस हफ़्ते counter पर आए नए Smartphones",
    excerpt:
      "Stock हर हफ़्ते बदलता है, इसलिए model के नाम गिनाने की जगह यह समझिए कि लोग असल में किन तीन तरह के phones लेते हैं।",
    image: "/images/a-customer-collecting-a-redmi-note-17-at-mob-c8b22cc4.webp",
    imageW: 900,
    imageH: 1125,
    alt: "Mobile World पर नया phone लेते हुए एक ग्राहक",
    body: `
<p>Stock हर हफ़्ते बदलता है। इसलिए ऐसे model के नाम गिनाने का कोई फ़ायदा नहीं जो अगले हफ़्ते बदल जाएँ। इसकी जगह यह समझ लीजिए कि लोग असल में किन तीन तरह के phones में से चुनते हैं।</p>
<p>पहला phone हो, या बच्चे की पढ़ाई के लिए हो — तो battery और screen डिब्बे पर छपे camera के megapixel से कहीं ज़्यादा मायने रखते हैं। जो phone पूरा दिन चल जाए और धूप में भी साफ़ दिखे, वो रोज़ ज़्यादा अच्छा लगेगा, चाहे उसका camera कितने भी megapixel का हो।</p>
<p>अगर phone तीन-चार साल चलाने का इरादा है तो processor देखिए, और यह भी कि company कितने साल software update देने का वादा कर रही है। साल तीन में phone अच्छा लगेगा या नहीं — फ़र्क़ बस यही एक बात डालती है।</p>
<p>Gaming के लिए सिर्फ़ RAM मत देखिए। Processor और cooling भी उतने ही important हैं।</p>
<p>Flagship phone लेना हो तो दुकान पर आकर हाथ में लेकर देखिए। वज़न, पकड़ और screen की brightness — ये तीनों photo में कभी पूरी तरह समझ नहीं आते।</p>
<p>Model का नाम WhatsApp कर दीजिए। चलने से पहले हम बता देंगे कि वो आज shelf पर है या नहीं।</p>`,
  },
  {
    slug: "monthly-closure",
    kicker: "Store Update",
    date: "1 August 2026",
    dateISO: "2026-08-01",
    title: "हर महीने की आख़िरी तारीख़ को दुकान बंद रहती है",
    excerpt:
      "यानी 28, 29, 30 या 31 — जो भी उस महीने की आख़िरी हो। बाक़ी हर दिन हम 10 से 10 खुले हैं।",
    image: "/images/customers-at-the-mobile-world-counter-aa76e06b.webp",
    imageW: 800,
    imageH: 450,
    alt: "Mobile World के counter पर ग्राहक",
    body: `
<p>दुकान और आस-पास का पूरा बाज़ार हर महीने की आख़िरी तारीख़ को बंद रहता है। यानी 28, 29, 30 या 31 — जो भी उस महीने की आख़िरी तारीख़ हो।</p>
<p>इस website पर ऊपर जो live status दिखता है, वो यह ख़ुद गिन लेता है — इसलिए अगली छुट्टी की तारीख़ हमेशा सही दिखेगी।</p>
<p>साल के बाक़ी हर दिन हम सुबह 10 बजे से रात 10 बजे तक खुले रहते हैं, रविवार को भी।</p>
<p>अगर आप ${shop.address.locality} से बाहर से आ रहे हैं तो निकलने से पहले एक message कर दीजिए। हम दोनों बातें confirm कर देंगे — दुकान खुली है, और जो चाहिए वो मौजूद है।</p>`,
  },
];

/**
 * "काम की बातें" — home page का बायाँ panel।
 *
 * Icon owner के अपने design से आए हैं (26 Aug 2026)। हर line WhatsApp
 * पर उसी विषय का सवाल खोलती है।
 */
export const helpPoints = [
  {
    icon: "/images/icon-guidance-0e26ba46.webp",
    title: "सही Product चुनने में मदद",
    body: "आपकी ज़रूरत और budget के हिसाब से सुझाव।",
    topic: "सही product चुनने",
  },
  {
    icon: "/images/icon-info-cd0b739c.webp",
    title: "पूरी जानकारी, पहले ही",
    body: "Features, Warranty और Offers — सब ख़रीदने से पहले।",
    topic: "features और warranty",
  },
  {
    icon: "/images/icon-savings-aeb79a07.webp",
    title: "पैसे की बचत, बेहतर फ़ैसला",
    body: "कौन सा model आपके काम का है और कौन सा नहीं — साफ़ बताते हैं।",
    topic: "सही Deal चुनने",
  },
];

/**
 * "आपके काम की services" — home page का दायाँ panel।
 *
 * ⚠️ Owner के design में आख़िरी line "100% Genuine — Original Products
 * की गारंटी" थी। "100%" और "गारंटी" जैसे दावे उनके अपने standard
 * (docs/BRAND-VOICE.md §4) में मना हैं, इसलिए यहाँ वही बात उस रूप में
 * लिखी है जो customer ख़ुद जाँच सके — GST Bill और Brand Warranty।
 * Icon owner का ही है।
 */
export const serviceList = [
  {
    icon: "/images/icon-repair-56383a67.webp",
    title: "Mobile Repairing",
    body: "Repairing की सुविधा भी दुकान पर है।",
    topic: "repairing",
  },
  {
    icon: "/images/icon-exchange-bc53d7d0.webp",
    title: "Exchange",
    body: "पुराने phone की आसान Exchange।",
    topic: "पुराने phone के Exchange",
  },
  {
    icon: "/images/icon-emi-e6aad705.webp",
    title: "Card & EMI Finance",
    body: "Cards और finance दोनों पर EMI।",
    topic: "EMI",
  },
  {
    icon: "/images/icon-gst-fbdd378a.webp",
    title: "GST Bill",
    body: "हर ख़रीद पर पक्का GST Bill।",
    topic: "GST Bill",
  },
  {
    icon: "/images/icon-support-0ba4e4a1.webp",
    title: "सीधे दुकान से बात",
    body: "किसी भी जानकारी के लिए हमसे सीधे संपर्क कीजिए।",
    topic: "एक product",
  },
  {
    icon: "/images/icon-genuine-d7ae5712.webp",
    title: "Genuine Products",
    body: "Original सामान, पूरी Brand Warranty के साथ।",
    topic: "genuine products और warranty",
  },
];

/**
 * Repair, Exchange और EMI के बड़े poster — home page पर।
 * ये अभी sample हैं, owner की असली तस्वीरें बाद में आएँगी।
 */
export const serviceBanners = [
  {
    key: "repair" as const,
    src: "/images/expert-mobile-repairing-at-mobile-world-f65f73a0.webp",
    alt: "Mobile repairing — screen, battery, charging port और software",
    topic: "repair",
  },
  {
    key: "exchange" as const,
    src: "/images/mobile-exchange-at-mobile-world-e15aba81.webp",
    alt: "पुराना phone Exchange करके नया लीजिए",
    topic: "पुराने phone के Exchange",
  },
  {
    key: "emi" as const,
    src: "/images/easy-emi-finance-at-mobile-world-61ddf8e4.webp",
    alt: "Cards और finance पर EMI",
    topic: "EMI",
  },
];
