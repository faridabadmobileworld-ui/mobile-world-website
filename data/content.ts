/**
 * Website का सारा दिखने वाला content — एक ही जगह।
 *
 * Owner को कुछ बदलना हो तो यहीं बदलेगा। किसी component में text
 * hardcode मत करो।
 *
 * दुकान की जानकारी (phone, पता, timings) यहाँ नहीं — वो `data/shop.ts`
 * में है। दोनों को मिलाओ मत।
 */

import { shop } from "@/data/shop";

/** WhatsApp पर सवाल भेजने का link। Text हमेशा encode होकर जाता है। */
export function ask(topic: string): string {
  return `${shop.phone.whatsapp}?text=${encodeURIComponent(
    `Hello Mobile World! I would like to know about ${topic}.`,
  )}`;
}

export const whatsappGeneral = `${shop.phone.whatsapp}?text=${encodeURIComponent(
  "Hello Mobile World! I have a question about a product.",
)}`;

/** Header और drawer की category list। */
export type NavCategory = { label: string; slug: string };

export const navCategories: NavCategory[] = [
  { label: "Smartphones", slug: "smartphones" },
  { label: "Laptops & Tablets", slug: "laptops-tablets" },
  { label: "Televisions", slug: "televisions" },
  { label: "Air Conditioners", slug: "air-conditioners" },
  { label: "Washing Machines", slug: "washing-machines" },
  { label: "Refrigerators", slug: "refrigerators" },
  { label: "Inverters & Batteries", slug: "inverters-batteries" },
  { label: "Audio & Wearables", slug: "audio-wearables" },
  { label: "Kitchen Appliances", slug: "kitchen-appliances" },
  { label: "Accessories", slug: "accessories" },
];

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
    title: "5G smartphones — every major brand",
    tags: ["5G", "All brands", "Exchange"],
    image: "/images/redmi-5g-smartphones-in-three-colours-21ed89c6.webp",
  },
  {
    category: "smartphones",
    kicker: "Smartphones",
    title: "Flagship phones — Apple & Samsung",
    tags: ["Genuine", "Full warranty"],
    image: "/images/apple-iphone-16-in-five-colours-d6654067.webp",
  },
  {
    category: "smartphones",
    kicker: "Smartphones",
    title: "Mid-range 5G — 3 to 4 year phones",
    tags: ["Long updates", "Fast charge"],
    image: "/images/redmi-5g-phone-front-and-back-c0a78bf9.webp",
  },
  {
    category: "laptops-tablets",
    kicker: "Laptops",
    title: "Study, office and everyday laptops",
    tags: ["All brands", "Setup"],
    art: "a-laptop",
  },
  {
    category: "laptops-tablets",
    kicker: "Tablets",
    title: "Tablets for study and work",
    tags: ["All sizes", "Setup"],
    art: "a-tablet",
  },
  {
    category: "televisions",
    kicker: "Televisions",
    title: "Smart TVs from 32″ to 75″",
    tags: ["4K", "Wall mount", "Setup"],
    art: "a-tv",
  },
  {
    category: "air-conditioners",
    kicker: "Air Conditioners",
    title: "Split & window AC with installation",
    tags: ["1–2 ton", "Fitted", "Serviced"],
    image: "/images/daikin-split-air-conditioner-indoor-unit-6c2ee913.webp",
  },
  {
    category: "washing-machines",
    kicker: "Washing Machines",
    title: "Semi, top load and front load",
    tags: ["6–8 kg", "Home demo"],
    art: "a-wash",
  },
  {
    category: "refrigerators",
    kicker: "Refrigerators",
    title: "Single door, double door, frost-free",
    tags: ["Delivered", "Installed"],
    art: "a-fridge",
  },
  {
    category: "inverters-batteries",
    kicker: "Inverters & Batteries",
    title: "Inverter, battery and stabilizer",
    tags: ["Load check", "Fitted"],
    art: "a-inverter",
  },
  {
    category: "audio-wearables",
    kicker: "Audio & Wearables",
    title: "Earbuds, speakers and smart watches",
    tags: ["Try in store", "Warranty"],
    art: "a-speaker",
  },
  {
    category: "audio-wearables",
    kicker: "Audio",
    title: "Bluetooth speakers",
    tags: ["Try in store"],
    art: "a-speaker",
  },
  {
    category: "audio-wearables",
    kicker: "Wearables",
    title: "Smart watches & bands",
    tags: ["All brands"],
    art: "a-watch",
  },
  {
    category: "audio-wearables",
    kicker: "Audio",
    title: "Headphones & earbuds",
    tags: ["ANC options"],
    art: "a-buds",
  },
  {
    category: "kitchen-appliances",
    kicker: "Kitchen",
    title: "Air fryers, microwaves, mixers",
    tags: ["In stock"],
    art: "a-kitchen",
  },
  {
    category: "kitchen-appliances",
    kicker: "Home Appliances",
    title: "Water purifiers & geysers",
    tags: ["Installed"],
    art: "a-accessory",
  },
  {
    category: "accessories",
    kicker: "Accessories",
    title: "Covers, tempered glass, chargers",
    tags: ["Every model"],
    image: "/images/tempered-glass-protecting-a-smartphone-scree-90c6724b.webp",
  },
  {
    category: "accessories",
    kicker: "Accessories",
    title: "Power banks & cables",
    tags: ["Fast charge"],
    art: "a-charger",
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
    kicker: "New this week",
    heading: "Every big brand,\none counter",
    body: `Smartphones, laptops, televisions and home appliances — all in one shop on ${shop.address.road}.`,
    image: "/images/inside-mobile-world-jawahar-colony-the-phone-37da6e97.webp",
    alt: "Inside Mobile World, Jawahar Colony — the phone counter and brand displays",
    bg: "var(--lav)",
  },
  {
    kicker: "Cooling season",
    heading: "Air conditioners\nfitted & tested",
    body: "We size the tonnage to your room, deliver it, install it and run it before we leave.",
    image: "/images/daikin-1-5-ton-inverter-split-air-conditione-e14be4db.webp",
    alt: "1.5 ton inverter split air conditioner stocked at Mobile World",
    bg: "var(--peach)",
  },
  {
    kicker: "Since 1973",
    heading: "Three generations\non one street",
    body: `${shop.registeredName} opened in 1973. Mobile World has run from the same address since 2016.`,
    image: "/images/customers-at-mobile-world-jawahar-colony-nit-bc85762b.webp",
    alt: "Customers at Mobile World, Jawahar Colony, NIT Faridabad",
    bg: "var(--sky)",
  },
  {
    kicker: "After sales",
    heading: "Service stays\nin the shop",
    body: "Something fails in month four? Walk in. No courier, no fifteen-day wait, no ticket number.",
    image: "/images/redmi-smartphone-available-at-mobile-world-f-c4835de5.webp",
    alt: "Redmi smartphone available at Mobile World Faridabad",
    bg: "var(--mint)",
  },
];

/** दुकान की असली photos। */
export const storePhotos = [
  {
    src: "/images/mobile-world-storefront-on-gurudwara-road-ja-a182b026.webp",
    w: 720,
    h: 340,
    alt: `Mobile World storefront on ${shop.address.road}, ${shop.address.locality}, lit up at night`,
    title: "The shop",
    caption: `${shop.address.road}, ${shop.address.locality} — open until 10 at night.`,
  },
  {
    src: "/images/customers-with-the-mobile-world-thank-you-bo-8f346a1e.webp",
    w: 1000,
    h: 1000,
    alt: "Customers with the Mobile World thank-you board",
    title: "The counter",
    caption: `Staff and customers inside the showroom on ${shop.address.road}.`,
  },
  {
    src: "/images/a-family-collecting-their-purchase-at-mobile-4e86f3cb.webp",
    w: 900,
    h: 1125,
    alt: `A family collecting their purchase at Mobile World, ${shop.address.locality}`,
    title: "Our customers",
    caption: `Families from ${shop.address.locality} and across ${shop.address.city}.`,
  },
  {
    src: "/images/mobile-world-team-handing-over-a-purchase-to-b3645f82.webp",
    w: 900,
    h: 1125,
    alt: "Mobile World team handing over a purchase to customers",
    title: "The team",
    caption: "The people who will still be here when you come back.",
  },
];

/** Repair, EMI, exchange वग़ैरह — जो `shop.services` में true है वही दिखेगा। */
export const serviceCards = [
  {
    key: "repair" as const,
    kicker: "Service",
    title: "Repairs stay in the shop",
    body: "Screen, battery, charging port or software — we look at it in front of you first.",
    cta: "Ask about a repair",
    topic: "mobile repair",
    tone: "mint",
  },
  {
    key: "exchange" as const,
    kicker: "Exchange",
    title: "Trade in your old phone",
    body: "Send the model and its condition for an estimate. Final figure at the counter.",
    cta: "Get an estimate",
    topic: "exchanging my old phone",
    tone: "sand",
  },
  {
    key: "emi" as const,
    kicker: "Finance",
    title: "EMI on cards and finance",
    body: "Terms and approval are set by your bank, not by the shop.",
    cta: "Ask about EMI",
    topic: "EMI options",
    tone: "lav",
  },
  {
    key: "installation" as const,
    kicker: "Installation",
    title: "Fitted, run and checked",
    body: "AC, washing machine or TV — we install it and run it before we leave.",
    cta: "Ask about installation",
    topic: "installation and service",
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
    kicker: "Buying Guides",
    date: "20 August 2026",
    dateISO: "2026-08-20",
    title: "How to pick the right AC tonnage for your room",
    excerpt:
      "A bigger air conditioner is not automatically a better one. Here is how we size it at the counter.",
    image: "/images/daikin-split-ac-indoor-unit-mounted-on-a-wal-ea182a93.webp",
    imageW: 900,
    imageH: 900,
    alt: "Split AC indoor unit mounted on a wall",
    body: `
<p>A bigger air conditioner is not automatically a better one. An oversized unit cools the room fast, switches off, and switches back on again minutes later — which uses more electricity and leaves the room damp. An undersized one never stops running.</p>
<p>As a rough starting point: a room up to about 110 square feet suits 1 ton, 110 to 180 square feet suits 1.5 ton, and anything larger usually needs 2 ton. Those numbers move if the room is on the top floor, has a west-facing wall, has a high ceiling, or holds more than three or four people at a time.</p>
<p>Bring the room measurements — length, width and ceiling height — and tell us which floor it is on and which direction the main wall faces. We will size it in front of you rather than guessing.</p>
<p>Installation matters as much as the unit. The outdoor position, the drain slope and the copper run all change how well it cools and how long it lasts. We fit it, run it and check the cooling before we leave.</p>`,
  },
  {
    slug: "new-phones",
    kicker: "New Arrivals",
    date: "14 August 2026",
    dateISO: "2026-08-14",
    title: "New smartphones on the counter this week",
    excerpt:
      "Stock changes every week, so here is how to think about the three bands people actually buy in.",
    image: "/images/a-customer-collecting-a-redmi-note-17-at-mob-c8b22cc4.webp",
    imageW: 900,
    imageH: 1125,
    alt: "A customer collecting a new phone at Mobile World",
    body: `
<p>Stock changes every week, so rather than list model numbers that go out of date, here is how to think about the three bands people actually buy in.</p>
<p>For a first phone, or a phone for a student, battery life and screen quality matter far more than the camera megapixel number printed on the box. A phone that lasts a full day and stays readable in sunlight will feel better every single day than one with a headline camera spec.</p>
<p>If you plan to keep the phone three or four years, look at the processor and how long the manufacturer promises software updates. That single decision is what separates a phone that still feels fine in year three from one that does not.</p>
<p>For flagship phones, come and hold them. Weight, grip and screen brightness are the three things that never come across in photographs.</p>
<p>Send a model name on WhatsApp and we will confirm whether it is on the shelf today before you make the trip.</p>`,
  },
  {
    slug: "monthly-closure",
    kicker: "Store Updates",
    date: "1 August 2026",
    dateISO: "2026-08-01",
    title: "We close on the last calendar date of every month",
    excerpt:
      "That is the 28th, 29th, 30th or 31st depending on the month. Every other day we are open 10 to 10.",
    image: "/images/customers-at-the-mobile-world-counter-aa76e06b.webp",
    imageW: 800,
    imageH: 450,
    alt: "Customers at the Mobile World counter",
    body: `
<p>The store, and the market around it, stays shut on the last calendar date of every month. That is the 28th, 29th, 30th or 31st depending on the month.</p>
<p>The live status at the top of this page works this out on its own, so it will always show the correct next closure date.</p>
<p>Every other day of the year we are open from 10 in the morning until 10 at night, including Sundays.</p>
<p>If you are travelling in from outside ${shop.address.locality}, send a message before you leave. We will confirm both that we are open and that what you want is in stock.</p>`,
  },
];

/** Buying guides वग़ैरह — छोटे links, अपना page नहीं। */
export const guides = [
  { kicker: "Buying Guides", title: "Washing machine: 6.5, 7 or 8 kg?", note: "By household size" },
  { kicker: "Buying Guides", title: "TV size vs seating distance", note: "Measure first" },
  { kicker: "Trust", title: "Why the GST bill matters", note: "Warranty proof" },
];
