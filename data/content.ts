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
    `Namaste MOBILE WORLD! मुझे ${topic} के बारे में जानना है।`,
  )}`;
}

export const whatsappGeneral = `${shop.phone.whatsapp}?text=${encodeURIComponent(
  "Namaste MOBILE WORLD! मुझे एक सामान के बारे में पूछना है।",
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
  smartphones: "/images/flagship-phones-apple-and-samsung-7eb024cc.webp",
  "laptops-tablets": "/images/laptops-and-tablets-at-mobile-world-563b92a9.webp",
  televisions: "/images/smart-televisions-at-mobile-world-3cc7aa29.webp",
  "air-conditioners": "/images/split-air-conditioner-fitted-in-a-room-17b0cbd3.webp",
  "washing-machines": "/images/front-load-and-top-load-washing-machines-337dbf77.webp",
  refrigerators: "/images/refrigerators-at-mobile-world-10a76a77.webp",
  "inverters-batteries": "/images/inverter-and-batteries-at-mobile-world-4c7d7bb1.webp",
  "audio-wearables": "/images/wireless-earbuds-0e160569.webp",
  cameras: "/images/mirrorless-camera-with-lens-3be70d11.webp",
  "kitchen-appliances": "/images/kitchen-appliances-at-mobile-world-0409b7f4.webp",
  accessories: "/images/mobile-accessories-at-mobile-world-55dedbfe.webp",
};

export const navCategories: NavCategory[] = categories.map((c) => ({
  label: c.name,
  slug: c.slug,
  image: categoryImages[c.slug],
}));

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
    image: "/images/5g-smartphones-every-brand-216fa70a.webp",
  },
  {
    category: "smartphones",
    kicker: "Smartphones",
    title: "Flagship phones — Apple और Samsung",
    tags: ["Genuine", "पूरी Warranty"],
    image: "/images/flagship-smartphone-e6739d50.webp",
  },
  {
    category: "smartphones",
    kicker: "Smartphones",
    title: "Mid-range 5G — तीन-चार साल चलने वाले",
    tags: ["लंबे updates", "Fast charge"],
    image: "/images/mid-range-5g-phones-b8368948.webp",
  },
  {
    category: "laptops-tablets",
    kicker: "Laptops",
    title: "पढ़ाई, office और रोज़ के Laptops",
    tags: ["सभी brands", "Setup"],
    image: "/images/laptop-for-study-and-office-a146b020.webp",
  },
  {
    category: "laptops-tablets",
    kicker: "Tablets",
    title: "पढ़ाई और काम के लिए Tablets",
    tags: ["हर size", "Setup"],
    image: "/images/tablets-in-four-colours-9b68921c.webp",
  },
  {
    category: "laptops-tablets",
    kicker: "Monitors",
    title: "Office और gaming के Monitors",
    tags: ["हर size", "Setup"],
    image: "/images/computer-monitor-579cd6b9.webp",
  },
  {
    category: "televisions",
    kicker: "Televisions",
    title: "32″ से 75″ तक Smart TV",
    tags: ["4K", "Wall mount", "Setup"],
    image: "/images/smart-television-4k-07c36f7d.webp",
  },
  {
    category: "air-conditioners",
    kicker: "Air Conditioners",
    title: "Split और Window AC, installation के साथ",
    tags: ["1–2 ton", "Fitted", "Serviced"],
    image: "/images/split-air-conditioner-indoor-unit-24422a50.webp",
  },
  {
    category: "washing-machines",
    kicker: "Washing Machines",
    title: "Semi, Top Load और Front Load",
    tags: ["6–8 kg", "घर पर demo"],
    image: "/images/front-load-washing-machine-fb1ba13b.webp",
  },
  {
    category: "refrigerators",
    kicker: "Refrigerators",
    title: "Single door, Double door, Frost-free",
    tags: ["Delivery", "Installation"],
    image: "/images/double-door-refrigerator-8c144446.webp",
  },
  {
    category: "inverters-batteries",
    kicker: "Inverters & Batteries",
    title: "Inverter, Battery और Stabilizer",
    tags: ["Load check", "Fitted"],
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
    tags: ["Installation के साथ"],
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
  bg: string;
};

export const slides: Slide[] = [
  {
    kicker: "MOBILE WORLD",
    heading: "Every big brand,\none counter",
    body: `Smartphones, laptops, televisions और home appliances — सब एक ही दुकान पर, ${shop.address.road} पर। `
      + `${shop.legacyStartYear} से परिवार का business सफ़र, ${shop.foundingYear} से MOBILE WORLD।`,
    image: "/images/smartphones-counter-wide-0f945e6d.webp",
    alt: "MOBILE WORLD के counter पर हर बड़े brand के smartphones",
    bg: "var(--lav)",
  },
  {
    kicker: "गर्मी का मौसम",
    heading: "Air conditioners\nfitted & tested",
    body: "AC का tonnage सिर्फ़ कमरे के size से तय नहीं होता — धूप, floor और room की condition भी देखनी पड़ती है। "
      + "हम कमरे के हिसाब से चुनते हैं, लगाते हैं, और चलाकर देखने के बाद ही जाते हैं।",
    image: "/images/split-air-conditioner-fitted-in-a-room-17b0cbd3.webp",
    alt: "कमरे में लगा हुआ split air conditioner, चलता हुआ",
    bg: "var(--peach)",
  },
  {
    kicker: "हमारा सफ़र",
    heading: "हर सफ़र की शुरुआत\nएक भरोसे से होती है",
    body: `परिवार का business सफ़र ${shop.legacyStartYear} में Aggarwal Kiryana Store से शुरू हुआ। `
      + `इसी विरासत को आगे बढ़ाते हुए ${shop.foundingYear} में MOBILE WORLD की शुरुआत हुई।`,
    image: "/images/customers-at-mobile-world-jawahar-colony-nit-bc85762b.webp",
    alt: "Customers at Mobile World, Jawahar Colony, NIT Faridabad",
    bg: "var(--sky)",
  },
  {
    kicker: "ख़रीदने के बाद",
    heading: "जो यहाँ से लिया,\nउसकी बात यहीं होगी",
    body: "चौथे महीने में कुछ गड़बड़ हुई? सीधे दुकान पर आ जाइए। न courier, न पंद्रह दिन का इंतज़ार, न ticket number।",
    image: "/images/expert-mobile-repairing-at-mobile-world-f65f73a0.webp",
    alt: "दुकान पर ही phone की repair — screen, battery और charging port",
    bg: "var(--mint)",
  },
];

/** दुकान की असली photos। */
export const storePhotos = [
  {
    src: "/images/inside-mobile-world-jawahar-colony-the-phone-37da6e97.webp",
    w: 1000,
    h: 562,
    alt: `${shop.name} के अंदर — phone counter और brands का display`,
    title: "Counter के पीछे",
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
    title: "Repair दुकान पर ही होती है",
    body: "Screen, battery, charging port या software — पहले आपके सामने खोलकर देखते हैं, फिर बताते हैं।",
    cta: "Repair के बारे में पूछिए",
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
  {
    key: "installation" as const,
    kicker: "Installation",
    title: "लगाकर, चलाकर दिखाते हैं",
    body: "AC, Washing Machine या TV — लगाने के बाद चलाकर देखने तक हम रुकते हैं।",
    cta: "Installation के बारे में पूछिए",
    topic: "Installation और service",
    tone: "sky",
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
    image: "/images/split-ac-fitted-and-tested-wide-8c7ac6ae.webp",
    imageW: 1200,
    imageH: 675,
    alt: "दीवार पर लगी split AC की indoor unit",
    body: `
<p>बड़ा AC अपने आप बेहतर नहीं होता। ज़रूरत से बड़ा AC कमरे को झट से ठंडा करके बंद हो जाता है, फिर थोड़ी देर में दोबारा चालू — इससे bijli ज़्यादा लगती है और कमरे में नमी बनी रहती है। छोटा AC कभी बंद ही नहीं होता।</p>
<p>मोटा-मोटी हिसाब यह है: लगभग 110 square feet तक का कमरा 1 ton में, 110 से 180 square feet तक 1.5 ton में, और उससे बड़ा आमतौर पर 2 ton में। लेकिन यह हिसाब बदल जाता है अगर कमरा सबसे ऊपर की मंज़िल पर है, दीवार पश्चिम की तरफ़ है, छत ऊँची है, या कमरे में तीन-चार से ज़्यादा लोग एक साथ बैठते हैं।</p>
<p>इसीलिए tonnage सिर्फ़ size से तय नहीं होता — धूप, floor और कमरे की हालत भी देखनी पड़ती है।</p>
<p>कमरे की लंबाई, चौड़ाई और छत की ऊँचाई नाप कर आइए, और यह भी बता दीजिए कि कौन सी मंज़िल है और मुख्य दीवार किस दिशा में है। हम आपके सामने हिसाब लगाकर बताएँगे, अंदाज़े से नहीं।</p>
<p>AC जितना ज़रूरी है, उसकी installation भी उतनी ही ज़रूरी है। बाहर की unit कहाँ लगी है, पानी की निकासी का ढलान कैसा है, और copper की लंबाई कितनी है — ये तीनों तय करते हैं कि कूलिंग कैसी रहेगी और AC कितने साल चलेगा। हम लगाते हैं, चलाकर देखते हैं, और कूलिंग जाँचने के बाद ही जाते हैं।</p>`,
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
    alt: "MOBILE WORLD पर नया phone लेते हुए एक ग्राहक",
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
    alt: "MOBILE WORLD के counter पर ग्राहक",
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
    title: "Repair",
    body: "दुकान पर ही, आपके सामने खोलकर।",
    topic: "repair",
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
    title: "Expert Support",
    body: "ख़रीदने के बाद भी, हर क़दम पर।",
    topic: "support",
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
