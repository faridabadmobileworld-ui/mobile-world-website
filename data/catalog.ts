import { shop } from "./shop";

/** Available catalogue preview. These are customer-facing model-name cards, not price or stock records. */
export type PhoneModel = {
  id: string; brand: string; name: string; image: string; imageAlt: string;
  note: string; display: string; camera: string; processor: string; power: string;
  software: string; colours: { name: string; hex: string }[]; variants: string[];
  system: "Android" | "iOS"; reasons: Record<string, string>;
  source: string; checked: string; status?: "available" | "upcoming";
};

const redmiImage = "/images/redmi-17-5g-colours-mobile-world-faridabad.webp";
const iphoneImage = "/images/iphone-display-at-the-mobile-world-counter-346d3e71.webp";

export const phoneModels: PhoneModel[] = [
  {
    id: "redmi-a7", brand: "Xiaomi Redmi", name: "Redmi A7",
    image: redmiImage, imageAlt: "Mobile World में Redmi phone options",
    note: "Daily calling, WhatsApp और basic smartphone use के लिए entry segment option।",
    display: "Large display · रोज़ के इस्तेमाल के लिए", camera: "AI camera setup · casual photos",
    processor: "Everyday performance", power: "Long battery focus", software: "Android · Redmi experience",
    colours: [{name:"Black",hex:"#20242a"},{name:"Blue",hex:"#9fb5cf"},{name:"Green",hex:"#b9c7a3"}],
    variants: ["RAM/Storage options दुकान से confirm कीजिए"], system: "Android",
    reasons: { camera: "Casual photos और social sharing के लिए Redmi का simple option।", everyday: "Calling, WhatsApp और daily apps के लिए budget-friendly choice।", updates: "Entry phone चाहिए तो availability पूछिए।" },
    source: shop.siteUrl, checked: "2026-09-29",
  },
  {
    id: "redmi-15-series", brand: "Xiaomi Redmi", name: "Redmi 15 Series",
    image: redmiImage, imageAlt: "Redmi 15 series के colours",
    note: "Bigger screen, battery और smooth daily performance वाली Redmi series।",
    display: "Large FHD+ style display", camera: "Multi-camera highlights", processor: "Daily + entertainment performance",
    power: "Battery-focused Redmi series", software: "Android · HyperOS/Redmi UI",
    colours: [{name:"Black",hex:"#1f2328"},{name:"Silver",hex:"#d8dce2"},{name:"Blue",hex:"#86a8d8"}],
    variants: ["Redmi 15", "Redmi 15A", "Redmi 15C"], system: "Android",
    reasons: { camera: "Photos, reels और daily social use के लिए practical option।", everyday: "Large display और battery priority वाले customers के लिए।", updates: "Latest Redmi family में options देखिए।" },
    source: shop.siteUrl, checked: "2026-09-29",
  },
  {
    id: "redmi-a7-pro-4g", brand: "Xiaomi Redmi", name: "Redmi A7 Pro 4G",
    image: redmiImage, imageAlt: "Redmi A7 Pro 4G availability card",
    note: "4G Redmi option चाहिए तो इस model की availability दुकान से पूछिए।",
    display: "Big screen experience", camera: "Everyday camera highlights", processor: "Daily app performance",
    power: "Battery backup focus", software: "Android · Redmi experience",
    colours: [{name:"Midnight",hex:"#161b22"},{name:"Mint",hex:"#b8d0bd"},{name:"Blue",hex:"#8daed0"}],
    variants: ["Variant और colour दुकान से confirm कीजिए"], system: "Android",
    reasons: { camera: "Normal photos और video calls के लिए suitable Redmi option।", everyday: "Budget buyers के लिए simple और practical 4G model।", updates: "New Redmi option चाहिए तो team से पूछिए।" },
    source: shop.siteUrl, checked: "2026-09-29",
  },
  {
    id: "redmi-note-15-series", brand: "Xiaomi Redmi", name: "Redmi Note 15 Series",
    image: redmiImage, imageAlt: "Redmi Note series options",
    note: "Display, camera और performance balance चाहने वालों के लिए Note series।",
    display: "AMOLED / high refresh-rate style options", camera: "Camera-focused Note highlights", processor: "Balanced performance",
    power: "Fast charging और battery focus", software: "Android · HyperOS/Redmi UI",
    colours: [{name:"Graphite",hex:"#3a3d42"},{name:"White",hex:"#f2f4f7"},{name:"Blue",hex:"#779bd0"}],
    variants: ["Note 15", "Note 15 Pro", "Note 15 Pro+"], system: "Android",
    reasons: { camera: "Camera और display priority वाले Redmi customers के लिए।", everyday: "Entertainment, multitasking और daily use का balanced option।", updates: "Note series में बेहतर feature set चाहिए तो पूछिए।" },
    source: shop.siteUrl, checked: "2026-09-29",
  },
  {
    id: "redmi-note-17-series", brand: "Xiaomi Redmi", name: "Redmi Note 17 Series",
    image: redmiImage, imageAlt: "Redmi Note 17 series availability card",
    note: "Redmi Note 17, Note 17 Pro और Pro Max enquiries के लिए priority card।",
    display: "Premium Note display highlights", camera: "Camera-focused Note highlights", processor: "Performance-focused Note series",
    power: "Fast charging और battery focus", software: "Android · HyperOS/Redmi UI",
    colours: [{name:"Black",hex:"#17191d"},{name:"Silver",hex:"#d9dde2"},{name:"Blue",hex:"#7898c8"}],
    variants: ["Redmi Note 17", "Note 17 Pro", "Note 17 Pro Max"], system: "Android",
    reasons: { camera: "Better Redmi Note camera और performance पूछने वालों के लिए।", everyday: "Premium Note experience चाहिए तो availability पूछिए।", updates: "Note series में आगे के options watchlist में रखिए।" },
    source: shop.siteUrl, checked: "2026-09-29",
  },
  {
    id: "xiaomi-17-series", brand: "Xiaomi", name: "Xiaomi 17 Series",
    image: redmiImage, imageAlt: "Xiaomi flagship series card",
    note: "Premium Xiaomi experience, flagship performance और camera-focused buyers के लिए।",
    display: "Premium display experience", camera: "Flagship camera highlights", processor: "Flagship-grade performance",
    power: "Fast charging और premium battery focus", software: "Android · Xiaomi HyperOS",
    colours: [{name:"Black",hex:"#101317"},{name:"White",hex:"#f4f2ec"},{name:"Green",hex:"#88967d"}],
    variants: ["Xiaomi 17", "Xiaomi 17 Pro", "Xiaomi 17 Ultra", "Xiaomi 17T"], system: "Android",
    reasons: { camera: "Premium camera और performance priority हो तो Xiaomi flagship पूछिए।", everyday: "Power users और premium Android buyers के लिए।", updates: "Xiaomi flagship family की availability confirm कीजिए।" },
    source: shop.siteUrl, checked: "2026-09-29",
  },
  {
    id: "iphone-18-series", brand: "Apple", name: "iPhone 18 Series",
    image: iphoneImage, imageAlt: "Mobile World में iPhone display counter",
    note: "Apple ecosystem, premium camera और long-term iPhone experience चाहने वालों के लिए।",
    display: "Premium Super Retina style experience", camera: "Advanced iPhone camera highlights", processor: "Next-generation Apple performance",
    power: "All-day iPhone experience", software: "iOS",
    colours: [{name:"Black",hex:"#25272b"},{name:"White",hex:"#f1f0ed"},{name:"Natural",hex:"#c8bfb2"},{name:"Blue",hex:"#8da3be"}],
    variants: ["iPhone 18", "iPhone 18 Plus/Air", "iPhone 18 Pro", "iPhone 18 Pro Max"], system: "iOS",
    reasons: { camera: "Premium photos, video और Apple ecosystem के लिए।", everyday: "iOS, performance और long-term usage पसंद हो तो।", updates: "Long-term iPhone ownership के लिए Apple series पूछिए।" },
    source: shop.siteUrl, checked: "2026-09-29",
  },
  {
    id: "redmi-17c-upcoming", brand: "Xiaomi Redmi", name: "Redmi 17C",
    image: redmiImage, imageAlt: "Upcoming Redmi 17C model card",
    note: "Upcoming section में अभी सिर्फ़ Redmi 17C रखा गया है। Details बाद में update करेंगे।",
    display: "Upcoming · details later", camera: "Upcoming · details later", processor: "Upcoming model", power: "Upcoming model", software: "Android · Redmi experience",
    colours: [{name:"Expected options",hex:"#d7dde7"}], variants: ["Details बाद में add करेंगे"], system: "Android",
    reasons: { camera: "Upcoming details बाद में update होंगे।", everyday: "Redmi 17C के लिए enquiry रख सकते हैं।", updates: "Upcoming model watchlist में रखा है।" },
    source: shop.siteUrl, checked: "2026-09-29", status: "upcoming",
  },
];

export const availablePhoneModels = phoneModels.filter((model) => model.status !== "upcoming");
export const upcomingPhoneModels = phoneModels.filter((model) => model.status === "upcoming");

export function validModelIds(value: string | null): string[] {
  return [...new Set((value ?? "").split(","))].filter((id) => phoneModels.some((p) => p.id === id)).slice(0, 8);
}

export function recommendPhones(system: string, priority: string): PhoneModel[] {
  const base = availablePhoneModels.filter((p) => system === "any" || p.system === system);
  const order = priority === "camera" ? ["iphone-18-series", "xiaomi-17-series", "redmi-note-15-series", "redmi-note-17-series"]
    : priority === "updates" ? ["iphone-18-series", "xiaomi-17-series", "redmi-note-15-series", "redmi-15-series"]
    : ["redmi-15-series", "redmi-a7", "redmi-a7-pro-4g", "iphone-18-series"];
  return order.flatMap((id) => base.filter((p) => p.id === id)).concat(base.filter((p) => !order.includes(p.id))).slice(0, 4);
}

export function modelEnquiry(models: PhoneModel[], details = ""): string {
  const names = models.map((p, i) => `${i + 1}. ${p.brand} ${p.name}`).join("\n");
  return `${shop.phone.whatsapp}?text=${encodeURIComponent(`नमस्ते Mobile World! मेरी पसंद की list:\n${names}\n${details ? `${details}\n` : ""}कृपया उपलब्ध variant, colour और दुकान के दाम की जानकारी दीजिए।`)}`;
}
