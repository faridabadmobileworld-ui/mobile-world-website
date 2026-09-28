import { shop } from "./shop";

/** Reference catalogue. Specifications are manufacturer sourced; these are not stock records. */
export type PhoneModel = {
  id: string; brand: string; name: string; image: string; imageAlt: string;
  note: string; display: string; camera: string; processor: string; power: string;
  software: string; colours: { name: string; hex: string }[]; variants: string[];
  system: "Android" | "iOS"; reasons: Record<string, string>;
  source: string; checked: string;
};

export const phoneModels: PhoneModel[] = [
  {
    id: "iphone-16", brand: "Apple", name: "iPhone 16",
    image: "/images/model-iphone16.png", imageAlt: "Apple iPhone 16 के colour options",
    note: "Camera और video के लिए एक विकल्प।",
    display: "6.1″ Super Retina XDR OLED", camera: "48MP Fusion + 12MP Ultra Wide",
    processor: "Apple A18", power: "22 घंटे तक video playback*", software: "iOS",
    colours: [{name:"Black",hex:"#303238"},{name:"White",hex:"#f1f0ed"},{name:"Pink",hex:"#e8a3cd"},{name:"Teal",hex:"#93bbb6"},{name:"Ultramarine",hex:"#7c85ce"}],
    variants: ["128GB"], system: "iOS",
    reasons: { camera: "4K Dolby Vision video और 48MP Fusion camera।", everyday: "6.1″ display और Apple A18 chip।", updates: "iPhone और Apple ecosystem पसंद हो तो देखिए।" },
    source: "https://www.apple.com/in/iphone-16/specs/", checked: "2026-09-28",
  },
  {
    id: "galaxy-a56-5g", brand: "Samsung", name: "Galaxy A56 5G",
    image: "/images/model-galaxya56.jpg", imageAlt: "Samsung Galaxy A56 5G के phones",
    note: "बड़े display और लंबे software support के लिए।",
    display: "6.7″ FHD+ Super AMOLED", camera: "50MP main + 12MP Ultra Wide + 5MP macro",
    processor: "Exynos 1580", power: "5,000mAh typical battery", software: "Android · 6 OS upgrades तक*",
    colours: [{name:"Awesome Graphite",hex:"#545652"},{name:"Awesome Olive",hex:"#aeb59b"},{name:"Awesome Lightgray",hex:"#d8d9d9"}],
    variants: ["8GB / 128GB", "8GB / 256GB", "12GB / 256GB"], system: "Android",
    reasons: { camera: "50MP main camera के साथ Ultra Wide और macro lenses।", everyday: "6.7″ Super AMOLED display और 5,000mAh battery।", updates: "Launch से 6 OS generations और 6 साल security updates तक का brand support।" },
    source: "https://news.samsung.com/in/samsung-india-launches-galaxy-a56-5g-galaxy-a36-5g-featuring-awesome-intelligence-all-new-design-and-enhanced-durability", checked: "2026-09-28",
  },
  {
    id: "nothing-phone-3a", brand: "Nothing", name: "Phone (3a)",
    image: "/images/model-nothing3a.png", imageAlt: "Nothing Phone (3a), Black colour",
    note: "अलग design और 2× optical zoom के लिए।",
    display: "6.77″ FHD+ AMOLED · 120Hz", camera: "50MP main + 50MP telephoto + 8MP Ultra Wide",
    processor: "Snapdragon 7s Gen 3", power: "5,000mAh · 50W charging*", software: "Android · Nothing OS",
    colours: [{name:"Black",hex:"#393d40"},{name:"White",hex:"#e7e5e3"},{name:"Blue",hex:"#8ca7c6"}],
    variants: ["8GB / 128GB", "अन्य variant की जानकारी चाहिए"], system: "Android",
    reasons: { camera: "50MP telephoto camera के साथ 2× optical zoom।", everyday: "120Hz AMOLED display और 50W charging support।", updates: "Nothing OS और Glyph design पसंद हो तो देखिए।" },
    source: "https://checkout-eu.nothing.tech/pages/phone-3a", checked: "2026-09-28",
  },
];

export function validModelIds(value: string | null): string[] {
  return [...new Set((value ?? "").split(","))].filter((id) => phoneModels.some((p) => p.id === id)).slice(0, 8);
}

export function recommendPhones(system: string, priority: string): PhoneModel[] {
  const order = priority === "updates" ? ["galaxy-a56-5g", "iphone-16", "nothing-phone-3a"]
    : priority === "camera" ? ["iphone-16", "nothing-phone-3a", "galaxy-a56-5g"]
    : ["galaxy-a56-5g", "nothing-phone-3a", "iphone-16"];
  return order.flatMap((id) => phoneModels.filter((p) => p.id === id && (system === "any" || p.system === system)));
}

export function modelEnquiry(models: PhoneModel[], details = ""): string {
  const names = models.map((p, i) => `${i + 1}. ${p.brand} ${p.name}`).join("\n");
  return `${shop.phone.whatsapp}?text=${encodeURIComponent(`नमस्ते Mobile World! मेरी पसंद की list:\n${names}\n${details ? `${details}\n` : ""}कृपया उपलब्ध variant, colour और दुकान के दाम की जानकारी दीजिए।`)}`;
}
