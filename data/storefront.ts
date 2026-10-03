import { shop, categories } from "@/data/shop";

export const primaryCategorySlugs = [
  "smartphones", "laptops-tablets", "televisions", "air-conditioners",
  "kitchen-appliances", "accessories",
];

export const primaryCategories = primaryCategorySlugs
  .map((slug) => categories.find((category) => category.slug === slug))
  .filter((category) => category !== undefined);

export const shoppingSlides = [
  {
    id: "diwali", label: "Diwali", eyebrow: "MOBILE WORLD · DIWALI 2026",
    heading: "इस Diwali,\nख़ुशियाँ घर लाइए।",
    body: "माँ वैष्णो देवी यात्रा और घर के gifts वाली हमारी Diwali campaign की जानकारी लीजिए। आपकी ख़ुशियों में हमारा भी एक छोटा सा हिस्सा।",
    image: "/images/mw-diwali-2026.webp",
    alt: "Diwali campaign artwork: माँ वैष्णो देवी, helicopter यात्रा, Fridge, Washing Machine, TV और Oven",
    theme: "festive", detail: "Campaign की eligibility और शर्तें दुकान से जानिए।",
    cta: "Diwali की जानकारी", href: "#festival-highlights", topic: "Diwali campaign, भागीदारी और prizes की शर्तों",
  },
  {
    id: "everything", label: "सभी Products", eyebrow: "MOBILE WORLD · आपकी अपनी दुकान",
    heading: "Phone से पूरे घर तक.\nपसंद सबकी, जगह एक।",
    body: "Mobile, Laptop, TV, AC, Fridge, Washing Machine, Kitchen Appliances और Speakers। अपनी ज़रूरत का सामान एक जगह देखिए।",
    image: "/images/mw-all-products-2026.webp",
    alt: "White background पर Mobiles, Laptop, TV, AC, Fridge, Washing Machines, Kitchen Appliances, Audio और Inverter-Battery का category display",
    theme: "light", detail: "Mobile · Laptop · Electronics · Home Appliances",
    cta: "Products देखिए", href: "/products", topic: "Mobile, Electronics और Home Appliances",
  },
  {
    id: "gifts", label: "Festival Gifts", eyebrow: "FESTIVAL SPECIAL · ख़ुशियाँ बाँटिए",
    heading: "अपनों के लिए ख़रीदारी.\nGifts की बात भी हो जाए।",
    body: "Trolley bag, smartwatch, soundbar और दूसरे festival gifts की जानकारी पूछिए। कौन सा offer आपकी ख़रीदारी पर लागू है, team से समझिए।",
    image: "/images/mw-festival-gifts-2026.webp",
    alt: "Festival gift theme में cycle, trolley bag, smartwatches, headphones, soundbar और gift boxes",
    theme: "light", detail: "Gift, eligibility और offer dates की पुष्टि ज़रूरी है।",
    cta: "Gifts की जानकारी", href: "#festival-highlights", topic: "Festival gifts और current offer eligibility",
  },
  {
    id: "accessories", label: "Accessories", eyebrow: "APPLE · SAMSUNG · ACCESSORIES",
    heading: "आपके phone के साथ,\nसही accessories भी।",
    body: "Charger, cable, earbuds या smartwatch चुनिए। Apple और Samsung के साथ accessory offers की applicability भी दुकान से पूछिए।",
    image: "/images/mw-chargers-2026.webp",
    alt: "White background पर phones, USB-C chargers और charging cables का accessory campaign display",
    theme: "light", detail: "Charger compatibility और offer की शर्तें model पर निर्भर हैं।",
    cta: "Accessories देखिए", href: "/products#accessories", topic: "Apple या Samsung के compatible charger और accessory offers",
  },
  {
    id: "finance", label: "Finance", eyebrow: "FINANCE और EMI · पूरी जानकारी",
    heading: "पसंद का product.\nसमझकर payment plan।",
    body: "Card EMI, paper finance और documents की जानकारी एक जगह। अपनी ज़रूरत बताइए, हमारी finance team से बात कीजिए।",
    image: "/images/mw-finance-2026.webp",
    alt: "Shopping trolley में phone और accessories, साथ में Laptop, TV, Fridge और Washing Machine का finance campaign visual",
    theme: "light", detail: "Down payment, charges और approval lender की शर्तों पर हैं।",
    cta: "Finance समझिए", href: "/finance", topic: "EMI, down payment, charges और ज़रूरी documents",
  },
  {
    id: "exchange", label: "Exchange", eyebrow: "EXCHANGE · SECOND-HAND MOBILES",
    heading: "पुराने phone से,\nअगली पसंद की ओर।",
    body: "पुराना phone exchange करना हो या second-hand phone देखना हो, दुकान पर बात कीजिए। Condition की जाँच के बाद ही value तय होती है।",
    image: "/images/mw-exchange-2026.webp",
    alt: "दुकान के counter पर पुराने phone की जाँच और नए phone की पसंद का illustrative exchange scene",
    theme: "light", detail: "Phone की condition, documents और उपलब्ध models दुकान से पूछिए।",
    cta: "Exchange समझिए", href: "/returns", topic: "पुराने phone के exchange और second-hand mobiles",
  },
] as const;

export function slideEnquiry(topic: string) {
  return `${shop.phone.whatsapp}?text=${encodeURIComponent(`नमस्ते Mobile World! मुझे ${topic} के बारे में जानकारी चाहिए।`)}`;
}
