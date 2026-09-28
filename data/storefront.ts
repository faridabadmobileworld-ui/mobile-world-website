import { shop, categories } from "@/data/shop";

/** Customer-facing navigation uses the existing, canonical category slugs. */
export const primaryCategorySlugs = [
  "smartphones", "laptops-tablets", "televisions", "air-conditioners",
  "kitchen-appliances", "accessories",
];

export const primaryCategories = primaryCategorySlugs
  .map((slug) => categories.find((category) => category.slug === slug))
  .filter((category) => category !== undefined);

export const shoppingSlides = [
  {
    id: "mobiles", label: "Mobiles", eyebrow: "SMARTPHONES · YOUR NEXT UPGRADE",
    heading: "नया phone.\nआपकी पसंद का.",
    body: "Camera, battery या रोज़ का काम — अपनी ज़रूरत के हिसाब से phone चुनिए। Model पसंद आए तो दुकान पर आकर हाथ में देखिए।",
    image: "/images/flagship-phones-apple-samsung-xiaomi-vivo-c3df528a.webp",
    alt: "अलग-अलग brands के smartphones", theme: "blue",
    detail: "Apple · Samsung · Xiaomi · Vivo · और भी brands",
    cta: "Mobiles देखिए", href: "/products#smartphones", topic: "नए Smartphone",
  },
  {
    id: "laptops", label: "Laptops", eyebrow: "STUDY · WORK · EVERYDAY",
    heading: "आपका काम.\nआपके लिए laptop.",
    body: "पढ़ाई, office या रोज़ के काम के लिए Laptop और Tablet। अपना budget और काम बताइए, model चुनने में हम मदद करेंगे।",
    image: "/images/laptop-for-study-and-office-a146b020.webp",
    alt: "पढ़ाई और office के लिए laptop", theme: "lavender",
    detail: "Laptops · Tablets · Monitors",
    cta: "Laptops देखिए", href: "/products#laptops-tablets", topic: "Laptop और Tablet",
  },
  {
    id: "home", label: "Home Appliances", eyebrow: "TV · AC · HOME APPLIANCES",
    heading: "घर की ज़रूरतें.\nएक जगह चुनिए.",
    body: "TV, AC, Fridge, Washing Machine और रसोई का सामान। Size और इस्तेमाल के हिसाब से अपने घर के लिए चुनिए।",
    image: "/images/home-appliances-at-mobile-world-0f587ac6.webp",
    alt: "घर में इस्तेमाल होने वाले appliances", theme: "sand",
    detail: "TV · AC · Refrigerators · Washing Machines",
    cta: "Appliances देखिए", href: "/products#televisions", topic: "TV और Home Appliances",
  },
  {
    id: "exchange", label: "Exchange & EMI", eyebrow: "EXCHANGE · FINANCE OPTIONS",
    heading: "पुराना phone बदलिए.\nनया अपना बनाइए.",
    body: "पुराने phone की जाँच के बाद उसकी value नए phone के दाम में कम होती है। Card EMI और finance की जानकारी भी यहीं मिलेगी।",
    image: "/images/purana-aur-naya-phone-counter-par.webp",
    alt: "Exchange के लिए पुराना और नया phone", theme: "mint",
    detail: "Exchange जाँच के बाद · EMI lender approval पर",
    cta: "Exchange समझिए", href: "/returns", topic: "Phone Exchange और EMI",
  },
] as const;

export function slideEnquiry(topic: string) {
  return `${shop.phone.whatsapp}?text=${encodeURIComponent(`Namaste Mobile World! मुझे ${topic} के बारे में जानकारी चाहिए।`)}`;
}
