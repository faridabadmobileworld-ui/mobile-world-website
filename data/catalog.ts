import { shop } from "./shop";
export type PhoneModel={id:string;brand:string;brandSlug:string;name:string;image:string;imageAlt:string;imageKind?:"creative";imageCaption?:string;imageSource?:string;gallery?:{src:string;alt:string}[];note:string;display:string;camera:string;processor:string;power:string;software:string;colours:{name:string;hex:string}[];variants:string[];system:"Android"|"iOS";reasons:Record<string,string>;source:string;checked:string;rank:number;status?:"available"|"upcoming"|"prebooking"};
export type PhoneBrand={slug:string;name:string;image:string;imageAlt:string;headline:string;note:string;models:PhoneModel[]};
const img={apple:"/images/iphone-display-at-the-mobile-world-counter-346d3e71.webp",samsung:"/images/flagship-phones-apple-samsung-xiaomi-vivo-c3df528a.webp",xiaomi:"/images/redmi-17-5g-colours-mobile-world-faridabad.webp",google:"/images/flagship-smartphone-e6739d50.webp",nothing:"/images/model-nothing3a.png",mid:"/images/mid-range-5g-phones-five-colours-v2-7c07be19.webp"};
const slug=(s:string)=>s.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"");
function p(brand:string,brandSlug:string,rank:number,name:string,image:string,variants:string[],system:"Android"|"iOS"="Android"):PhoneModel{return{id:brandSlug+"-"+slug(name),brand,brandSlug,rank,name,image,imageAlt:brand+" "+name+" product image",note:"अपने colour, variant और stock की पुष्टि दुकान से कीजिए।",display:rank<3?"Premium display":"Large daily-use display",camera:rank<3?"Camera-focused highlights":"Everyday camera highlights",processor:rank<3?"High performance range":"Daily performance range",power:"Battery and charging details at store",software:system,colours:[],variants,system,source:shop.siteUrl,checked:"2026-09-29",reasons:{camera:brand+" "+name+" camera buyers ke liye.",everyday:brand+" "+name+" daily use ke liye.",updates:brand+" "+name+" availability store se confirm karein."}}}
function b(slug:string,name:string,image:string,note:string,models:PhoneModel[]):PhoneBrand{return{slug,name,image,imageAlt:name+" smartphone product display",headline:name+" models",note,models}}
const redmiNote17ProMax:PhoneModel={
  ...p("Xiaomi Redmi","xiaomi",3,"Redmi Note 17 Pro Max","/images/redmi-note-17-pro-max-black-official.webp",["8GB / 256GB","12GB / 256GB"]),
  imageAlt:"REDMI Note 17 Pro Max 5G, Stealth Black की official Xiaomi India product image",
  note:"10,000mAh battery और 100W charging। Colour, variant और stock दुकान से confirm कीजिए।",
  display:"6.83-inch 1.5K AMOLED · up to 120Hz",
  camera:"50MP OIS + 8MP ultra-wide · 32MP front",
  processor:"Snapdragon 6 Gen 5 · LPDDR5X · UFS 4.1",
  power:"10,000mAh · 100W HyperCharge · 27W reverse charging",
  software:"HyperOS 3 / Android 16 · 4 OS + 6 years security updates",
  colours:[{name:"Stealth Black",hex:"#333335"},{name:"Matcha Green",hex:"#bac4ac"},{name:"Secret Sunrise",hex:"#f3e4db"}],
  source:"https://www.mi.com/in/product/redmi-note-17-pro-max-5g/specs/",checked:"2026-10-04",
  reasons:{camera:"50MP OIS camera की खूबियाँ जानिए।",everyday:"बड़ी battery और AMOLED display को करीब से देखिए।",updates:"Brand की software support policy देखिए।"}
};
export const phoneBrands:PhoneBrand[]=[
b("apple","Apple",img.apple,"iPhone models high-to-low.",[p("Apple","apple",1,"iPhone 18 Pro Max",img.apple,["256GB","512GB","1TB"],"iOS"),p("Apple","apple",2,"iPhone 18 Pro",img.apple,["128GB","256GB","512GB"],"iOS"),p("Apple","apple",3,"iPhone 18",img.apple,["128GB","256GB"],"iOS"),p("Apple","apple",4,"iPhone 17 Series",img.apple,["128GB","256GB","512GB"],"iOS"),p("Apple","apple",5,"iPhone 16 Series",img.apple,["128GB","256GB"],"iOS"),p("Apple","apple",6,"iPhone 15 Series",img.apple,["128GB","256GB"],"iOS")]),
b("samsung","Samsung",img.samsung,"Galaxy S, Fold and A series.",[p("Samsung","samsung",1,"Galaxy Z Fold 2026",img.samsung,["256GB","512GB","1TB"]),p("Samsung","samsung",2,"Galaxy S26 Ultra",img.samsung,["256GB","512GB","1TB"]),p("Samsung","samsung",3,"Galaxy S26 / S26+",img.samsung,["256GB","512GB"]),p("Samsung","samsung",4,"Galaxy S25 Series",img.samsung,["128GB","256GB","512GB"]),p("Samsung","samsung",5,"Galaxy A Series 2026",img.samsung,["6GB/128GB","8GB/128GB","8GB/256GB"]),p("Samsung","samsung",6,"Galaxy A Series 2025",img.samsung,["6GB/128GB","8GB/256GB"])]),
b("xiaomi","Xiaomi / Redmi",img.xiaomi,"Xiaomi और Redmi के models देखिए।",[p("Xiaomi","xiaomi",1,"Xiaomi 17 Ultra",img.xiaomi,["256GB","512GB","1TB"]),p("Xiaomi","xiaomi",2,"Xiaomi 17 / 17T",img.xiaomi,["12GB/256GB","12GB/512GB"]),redmiNote17ProMax,p("Xiaomi Redmi","xiaomi",4,"Redmi Note 17 Pro",img.xiaomi,["8GB/128GB","8GB/256GB"]),p("Xiaomi Redmi","xiaomi",5,"Redmi Note 15 Pro+",img.xiaomi,["8GB/256GB","12GB/256GB"]),p("Xiaomi Redmi","xiaomi",6,"Redmi 15 / 15C / 15A",img.xiaomi,["4GB/128GB","6GB/128GB","8GB/256GB"]),p("Xiaomi Redmi","xiaomi",7,"Redmi A7 / A7 Pro 4G",img.xiaomi,["3GB/64GB","4GB/128GB"])]),
b("google","Google",img.google,"Pixel models.",[p("Google","google",1,"Pixel 10 Pro XL",img.google,["256GB","512GB"]),p("Google","google",2,"Pixel 10 Pro",img.google,["128GB","256GB"]),p("Google","google",3,"Pixel 10",img.google,["128GB","256GB"]),p("Google","google",4,"Pixel 9 Series",img.google,["128GB","256GB"])]),
b("vivo","Vivo",img.samsung,"V, X, T and Y series.",[p("Vivo","vivo",1,"Vivo X Series 2026",img.samsung,["12GB/256GB","16GB/512GB"]),p("Vivo","vivo",2,"Vivo V Series 2026",img.samsung,["8GB/128GB","8GB/256GB","12GB/256GB"]),p("Vivo","vivo",3,"Vivo T Series",img.samsung,["8GB/128GB","8GB/256GB"]),p("Vivo","vivo",4,"Vivo Y Series",img.samsung,["4GB/128GB","6GB/128GB"])]),
b("oppo","Oppo",img.mid,"Find, Reno, F and A series.",[p("Oppo","oppo",1,"Oppo Find X Series",img.mid,["12GB/256GB","16GB/512GB"]),p("Oppo","oppo",2,"Oppo Reno Series 2026",img.mid,["8GB/256GB","12GB/256GB"]),p("Oppo","oppo",3,"Oppo F Series",img.mid,["8GB/128GB","8GB/256GB"]),p("Oppo","oppo",4,"Oppo A Series",img.mid,["4GB/128GB","6GB/128GB"])]),
b("realme","Realme",img.mid,"GT, Number, P and Narzo series.",[p("Realme","realme",1,"Realme GT Series",img.mid,["12GB/256GB","16GB/512GB"]),p("Realme","realme",2,"Realme Number Series 2026",img.mid,["8GB/128GB","8GB/256GB"]),p("Realme","realme",3,"Realme P Series",img.mid,["6GB/128GB","8GB/256GB"]),p("Realme","realme",4,"Realme Narzo Series",img.mid,["4GB/128GB","6GB/128GB"])]),
b("nothing","Nothing",img.nothing,"Nothing Phone and CMF.",[p("Nothing","nothing",1,"Nothing Phone (3)",img.nothing,["12GB/256GB","12GB/512GB"]),p("Nothing","nothing",2,"Nothing Phone (3a)",img.nothing,["8GB/128GB","8GB/256GB"]),p("Nothing","nothing",3,"CMF Phone Series",img.nothing,["6GB/128GB","8GB/128GB"])]),
b("oneplus","OnePlus",img.google,"Flagship and Nord.",[p("OnePlus","oneplus",1,"OnePlus 14",img.google,["12GB/256GB","16GB/512GB"]),p("OnePlus","oneplus",2,"OnePlus 13 Series",img.google,["12GB/256GB","16GB/512GB"]),p("OnePlus","oneplus",3,"OnePlus Nord 2026",img.google,["8GB/128GB","8GB/256GB"]),p("OnePlus","oneplus",4,"OnePlus Nord CE",img.google,["8GB/128GB","8GB/256GB"])]),
b("poco","Poco",img.xiaomi,"F, X, M and C series.",[p("Poco","poco",1,"Poco F Series",img.xiaomi,["8GB/256GB","12GB/256GB"]),p("Poco","poco",2,"Poco X Series",img.xiaomi,["8GB/128GB","8GB/256GB"]),p("Poco","poco",3,"Poco M Series",img.xiaomi,["6GB/128GB","8GB/256GB"]),p("Poco","poco",4,"Poco C Series",img.xiaomi,["4GB/64GB","4GB/128GB"])]),
b("iqoo","iQOO",img.google,"Performance phones.",[p("iQOO","iqoo",1,"iQOO 15 Series",img.google,["12GB/256GB","16GB/512GB"]),p("iQOO","iqoo",2,"iQOO Neo Series",img.google,["8GB/128GB","12GB/256GB"]),p("iQOO","iqoo",3,"iQOO Z Series",img.google,["6GB/128GB","8GB/256GB"])]),
b("tecno","Tecno",img.mid,"Phantom, Camon, Pova and Spark.",[p("Tecno","tecno",1,"Tecno Phantom Series",img.mid,["12GB/256GB","12GB/512GB"]),p("Tecno","tecno",2,"Tecno Camon Series",img.mid,["8GB/128GB","8GB/256GB"]),p("Tecno","tecno",3,"Tecno Pova Series",img.mid,["6GB/128GB","8GB/256GB"]),p("Tecno","tecno",4,"Tecno Spark Series",img.mid,["4GB/64GB","4GB/128GB"])])];
// Owner-confirmed sale / pre-booking offers, 7 October 2026.
// Device specifications and catalogue images are from the official India pages.
const redmi17C:PhoneModel={
  ...p("Xiaomi Redmi","xiaomi",8,"REDMI 17C 5G","/images/redmi-17c-official-colours.png",["4GB / 128GB","6GB / 128GB"]),
  status:"available", imageAlt:"REDMI 17C 5G Dark Night, Coffee Brew और Purple Dawn — official Xiaomi India product image",
  note:"Sale शुरू हो चुकी है। ₹17 Customer PF offer की eligibility और variant का stock दुकान से पूछिए।",
  display:"6.9-inch HD+ · up to 120Hz", camera:"50MP main camera · 8MP front camera",
  processor:"MediaTek Dimensity 6300 5G", power:"6000mAh · 33W charging · 33W charger in box",
  software:"Xiaomi HyperOS 3", colours:[{name:"Dark Night",hex:"#2c2b30"},{name:"Coffee Brew",hex:"#b79070"},{name:"Purple Dawn",hex:"#b8a0cd"}],
  source:"/posts/redmi-17c-5g-sale-offer-specifications-faridabad",checked:"2026-10-07",
  reasons:{camera:"50MP camera को करीब से देखिए।",everyday:"6000mAh battery और 120Hz display की जानकारी लीजिए।",updates:"Software और current variant की जानकारी दुकान से पूछिए।"}
};
const vivoV80:PhoneModel={
  ...p("Vivo","vivo",1.5,"vivo V80 5G","/images/vivo-v80-sunrise-official.png",["8GB / 128GB","8GB / 256GB","8GB / 512GB"]),
  status:"prebooking",imageAlt:"vivo V80 Sunrise Anthem — official vivo India product image",
  note:"Pre-booking चालू है और live demo उपलब्ध है। Cashback, warranty benefit, backpack और finance की शर्तें दुकान से जानिए।",
  display:"6.59-inch AMOLED · up to 144Hz",camera:"50MP OIS main + 50MP telephoto + 8MP wide · 50MP front",
  processor:"Snapdragon 7 Gen 4",power:"7200mAh · 90W FlashCharge",software:"OriginOS 7 / Android 17",
  colours:[{name:"Sunrise Anthem",hex:"#d59953"},{name:"Horizon Blue",hex:"#94bbb9"},{name:"Stellar Black",hex:"#363638"}],
  source:"/posts/vivo-v80-prebooking-offers-specifications-faridabad",checked:"2026-10-07",
  reasons:{camera:"ZEISS camera और portraits का live demo देखिए।",everyday:"बड़ी battery और AMOLED display को करीब से देखिए।",updates:"Pre-booking और उपलब्ध variants की पुष्टि team से कीजिए।"}
};
phoneBrands.find(brand=>brand.slug==="xiaomi")?.models.push(redmi17C);
phoneBrands.find(brand=>brand.slug==="vivo")?.models.push(vivoV80);
// Owner-supplied product artwork, matched by the model/series printed on each image.
// Keep these creatives distinct from official specification sources.
const artworkRoot = "/images/mw-art-";
const xiaomiBrand = phoneBrands.find(brand => brand.slug === "xiaomi")!;
const xiaomi17 = xiaomiBrand.models.find(model => model.id === "xiaomi-xiaomi-17-17t")!;
xiaomi17.name = "Xiaomi 17"; // Preserve the existing shared model link.
xiaomi17.note = "Xiaomi 17 के colour, variant और stock की पुष्टि दुकान से कीजिए।";
xiaomi17.reasons = { camera: "Xiaomi 17 का camera दुकान पर देखिए।", everyday: "अपनी ज़रूरत के अनुसार Xiaomi 17 को जानिए।", updates: "Software और variant की जानकारी दुकान से पूछिए।" };
xiaomiBrand.models.push(
  p("Xiaomi", "xiaomi", 2.5, "Xiaomi 17T", img.xiaomi, []),
  p("Xiaomi Redmi", "xiaomi", 4.5, "Redmi Note 17", img.xiaomi, []),
  p("Xiaomi Redmi", "xiaomi", 5.5, "Redmi 17", img.xiaomi, []),
);
for (const model of xiaomiBrand.models.filter(model => ["xiaomi-xiaomi-17t", "xiaomi-redmi-note-17", "xiaomi-redmi-17"].includes(model.id))) {
  model.colours = [];
  model.source = "";
  model.note = "अपने पसंदीदा colour, variant और stock की जानकारी दुकान से लीजिए।";
  model.display = "Display की जानकारी दुकान से पूछिए।";
  model.camera = "Camera को दुकान पर करीब से देखिए।";
  model.processor = "Processor की जानकारी दुकान से पूछिए।";
  model.power = "Battery और charging की पुष्टि दुकान से कीजिए।";
  model.reasons = { camera: "Camera की जानकारी दुकान से लीजिए।", everyday: "अपनी ज़रूरत के अनुसार model जानिए।", updates: "Software और variant की जानकारी दुकान से पूछिए।" };
}
const artworkByModel: Record<string, { title: string; files: string[] }> = {
  "samsung-galaxy-z-fold-2026": { title: "Samsung Galaxy Z Fold8 Series", files: ["galaxy-z-fold8.webp"] },
  "samsung-galaxy-s26-ultra": { title: "Samsung Galaxy S26 Series", files: ["galaxy-s26-series.webp"] },
  "samsung-galaxy-s26-s26": { title: "Samsung Galaxy S26 Series", files: ["galaxy-s26-series.webp"] },
  "samsung-galaxy-s25-series": { title: "Samsung Galaxy S25 Series", files: ["galaxy-s25-series.webp"] },
  "samsung-galaxy-a-series-2026": { title: "Samsung Galaxy A Series", files: ["galaxy-a-series.webp"] },
  "samsung-galaxy-a-series-2025": { title: "Samsung Galaxy A Series", files: ["galaxy-a-series.webp"] },
  "xiaomi-xiaomi-17-ultra": { title: "Xiaomi 17 Ultra", files: ["xiaomi-17-ultra.webp"] },
  "xiaomi-xiaomi-17-17t": { title: "Xiaomi 17", files: ["xiaomi-17.webp"] },
  "xiaomi-xiaomi-17t": { title: "Xiaomi 17T", files: ["xiaomi-17t.webp"] },
  "xiaomi-redmi-note-17-pro-max": { title: "REDMI Note 17 Pro Max", files: ["redmi-note-17-pro-max.webp", "redmi-note-17-pro-max-alternate.webp"] },
  "xiaomi-redmi-note-17-pro": { title: "REDMI Note 17 Pro", files: ["redmi-note-17-pro.webp"] },
  "xiaomi-redmi-note-17": { title: "REDMI Note 17", files: ["redmi-note-17-battery.webp", "redmi-note-17-emerald.webp"] },
  "xiaomi-redmi-17": { title: "REDMI 17", files: ["redmi-17.webp"] },
  "xiaomi-redmi-17c-5g": { title: "REDMI 17C", files: ["redmi-17c.webp"] },
};
for (const brand of phoneBrands) {
  for (const model of brand.models) {
    const artwork = artworkByModel[model.id];
    if (!artwork) continue;
    model.gallery = artwork.files.map((file, index) => ({ src: artworkRoot + file, alt: `${artwork.title} का Mobile World product creative${index ? " · दूसरा view" : ""}` }));
    model.image = model.gallery[0].src;
    model.imageAlt = model.gallery[0].alt;
    model.imageKind = "creative";
    if (model.id === "samsung-galaxy-z-fold-2026") model.name = "Galaxy Z Fold8 Series";
  }
  if (brand.slug === "samsung" || brand.slug === "xiaomi") {
    const cover = brand.slug === "samsung" ? artworkByModel["samsung-galaxy-s26-ultra"] : artworkByModel["xiaomi-xiaomi-17-ultra"];
    brand.image = artworkRoot + cover.files[0];
    brand.imageAlt = cover.title + " का Mobile World product creative";
  }
}
// Original manufacturer logos, obtained from their official websites on 10 October 2026.
export const homepageBrands = [
  { slug: "apple", name: "Apple", logo: "/images/brand-apple.svg" },
  { slug: "samsung", name: "Samsung", logo: "/images/brand-samsung.svg" },
  { slug: "xiaomi", name: "Xiaomi / Redmi", logo: "/images/brand-xiaomi.svg" },
  { slug: "google", name: "Google", logo: "/images/brand-google.svg" },
  { slug: "vivo", name: "vivo", logo: "/images/brand-vivo.svg" },
  { slug: "oppo", name: "OPPO", logo: "/images/brand-oppo.svg" },
  { slug: "motorola", name: "Motorola", logo: "/images/brand-motorola.png" },
  { slug: "realme", name: "realme", logo: "/images/brand-realme.svg" },
  { slug: "nothing", name: "Nothing", logo: "/images/brand-nothing.svg" },
  { slug: "tecno", name: "TECNO", logo: "/images/brand-tecno.svg" },
];

// Names and product photos are from motorola.in. Store availability is not implied.
const motorolaModels: PhoneModel[] = [
  { name: "motorola razr fold", file: "motorola-razr-fold-official.png", path: "smartphones-motorola-razr-fold" },
  { name: "motorola edge 70 max", file: "motorola-edge-70-max-official.png", path: "smartphones-motorola-edge-70-max" },
].map((model, index) => ({
  ...p("Motorola", "motorola", index + 1, model.name, `/images/${model.file}`, []),
  imageAlt: `${model.name} की official Motorola product image`,
  note: "अपना पसंदीदा colour, variant और stock दुकान से जानिए।",
  display: "Display की जानकारी दुकान से पूछिए।", camera: "Camera की जानकारी दुकान से पूछिए।",
  processor: "Processor की जानकारी दुकान से पूछिए।", power: "Battery और charging की जानकारी दुकान से पूछिए।",
  software: "Android · version की पुष्टि कीजिए।", colours: [],
  source: `https://www.motorola.in/${model.path}/p`, checked: "2026-10-10",
  reasons: { camera: "Camera और variants के बारे में बात कीजिए।", everyday: "अपनी ज़रूरत के अनुसार phone चुनिए।", updates: "Software support की जानकारी brand से जानिए।" },
}));
phoneBrands.push(b("motorola", "Motorola", motorolaModels[0].image, "razr और edge के models देखिए।", motorolaModels));

const oppoF35Pro: PhoneModel = {
  ...p("OPPO", "oppo", 2.5, "F35 Pro 5G", "/images/oppo-f35-pro-colours-official.png", ["6GB / 128GB", "8GB / 128GB", "8GB / 256GB"]),
  imageAlt: "OPPO F35 Pro 5G के तीन colours और front view — official OPPO India image",
  note: "50MP autofocus selfie camera और 8000mAh battery। अपने colour और stock की जानकारी दुकान से लीजिए।",
  display: "17.22cm AMOLED · 2772 × 1272 · maximum 144Hz",
  camera: "50MP OIS main + 8MP ultra-wide · 50MP AF selfie",
  processor: "MediaTek Dimensity 7360 MAX · LPDDR4X · UFS 3.1",
  power: "8000mAh typical · 80W SUPERVOOC", software: "ColorOS 16.5",
  colours: [{ name: "Sunrise Orange", hex: "#efa278" }, { name: "Wave Blue", hex: "#bed4e9" }, { name: "Twilight Brown", hex: "#6c5551" }],
  source: "https://www.oppo.com/in/smartphones/series-f/f35-pro-5g/specs/", checked: "2026-10-10",
  reasons: { camera: "100° selfie camera और OIS main camera को जानिए।", everyday: "बड़ी battery और AMOLED display की जानकारी लीजिए।", updates: "अपने variant की software support policy OPPO से जानिए।" },
};
phoneBrands.find(brand => brand.slug === "oppo")?.models.push(oppoF35Pro);

// Exact-model source audit: do not publish a different phone under an unverified name.
const unverifiedModelIds = new Set(["apple-iphone-18", "oneplus-oneplus-14"]);
for (const brand of phoneBrands) {
  brand.models = brand.models.filter(model => !unverifiedModelIds.has(model.id));
  brand.models.sort((a, b) => a.rank - b.rank);
}
const studioImageReferences: Record<string, { name: string; source: string; representative: boolean; creative: boolean }> = {
  "google-pixel-9-series": {
    "name": "Google Pixel 9, Peony",
    "source": "https://store.google.com/in/magazine/compare_pixel?hl=en-IN&toggler0=Pixel+9&toggler1=Pixel+10+Pro&toggler2=Pixel+10",
    "representative": true,
    "creative": false
  },
  "google-pixel-10-pro": {
    "name": "Google Pixel 10 Pro, Moonstone",
    "source": "https://store.google.com/in/magazine/compare_pixel?hl=en-IN&toggler0=Pixel+9&toggler1=Pixel+10+Pro&toggler2=Pixel+10",
    "representative": false,
    "creative": false
  },
  "google-pixel-10": {
    "name": "Google Pixel 10, Indigo",
    "source": "https://store.google.com/in/magazine/compare_pixel?hl=en-IN&toggler0=Pixel+9&toggler1=Pixel+10+Pro&toggler2=Pixel+10",
    "representative": false,
    "creative": false
  },
  "google-pixel-10-pro-xl": {
    "name": "Google Pixel 10 Pro XL, Moonstone",
    "source": "https://store.google.com/in/magazine/compare_pixel?hl=en-IN&toggler0=Pixel+10+Pro+XL&toggler1=Pixel+10+Pro&toggler2=Pixel+10",
    "representative": false,
    "creative": false
  },
  "vivo-vivo-x-series-2026": {
    "name": "vivo X300 Ultra, Eclipse Black",
    "source": "https://www.vivo.com/in/products/param/x300-ultra",
    "representative": true,
    "creative": false
  },
  "vivo-vivo-t-series": {
    "name": "vivo T5 5G",
    "source": "https://www.vivo.com/in/products/t5-5g",
    "representative": true,
    "creative": false
  },
  "vivo-vivo-y-series": {
    "name": "vivo Y51 Pro 5G, Festive Red",
    "source": "https://www.vivo.com/in/products/param/y51-pro-5g",
    "representative": true,
    "creative": false
  },
  "vivo-vivo-v80-5g": {
    "name": "vivo V80 5G, Sunrise Anthem",
    "source": "https://www.vivo.com/in/products/v80",
    "representative": false,
    "creative": false
  },
  "vivo-vivo-v-series-2026": {
    "name": "vivo V80 5G, Sunrise Anthem",
    "source": "https://www.vivo.com/in/products/v80",
    "representative": true,
    "creative": false
  },
  "oppo-oppo-find-x-series": {
    "name": "OPPO Find X9 Ultra",
    "source": "https://www.oppo.com/in/product/oppo-find-x9-ultra.P.P1110142",
    "representative": true,
    "creative": false
  },
  "oppo-oppo-reno-series-2026": {
    "name": "OPPO Reno16 5G",
    "source": "https://www.oppo.com/in/product/reno16-5g.P.P1110156",
    "representative": true,
    "creative": false
  },
  "oppo-oppo-a-series": {
    "name": "OPPO A6 Pro 5G",
    "source": "https://www.oppo.com/in/smartphones/series-a/a6-pro-5g/",
    "representative": true,
    "creative": false
  },
  "oppo-f35-pro-5g": {
    "name": "OPPO F35 Pro 5G, three colours",
    "source": "https://www.oppo.com/in/smartphones/series-f/f35-pro-5g/specs/",
    "representative": false,
    "creative": false
  },
  "oppo-oppo-f-series": {
    "name": "OPPO F35 Pro 5G, three colours",
    "source": "https://www.oppo.com/in/smartphones/series-f/f35-pro-5g/specs/",
    "representative": true,
    "creative": false
  },
  "realme-realme-p-series": {
    "name": "realme P4s 5G",
    "source": "https://www.realme.com/in/realme-p4s-5g",
    "representative": true,
    "creative": false
  },
  "realme-realme-gt-series": {
    "name": "realme GT 8 Pro",
    "source": "https://www.realme.com/in/realme-gt-8-pro",
    "representative": true,
    "creative": false
  },
  "realme-realme-number-series-2026": {
    "name": "realme 16 Pro+ 5G",
    "source": "https://www.realme.com/in/realme-16-pro-plus-5g",
    "representative": true,
    "creative": false
  },
  "realme-realme-narzo-series": {
    "name": "realme NARZO 100x 5G",
    "source": "https://www.realme.com/in/realme-narzo-100x-5g",
    "representative": true,
    "creative": false
  },
  "nothing-nothing-phone-3": {
    "name": "Nothing Phone (3), White",
    "source": "https://in.nothing.tech/products/phone-3",
    "representative": false,
    "creative": false
  },
  "nothing-nothing-phone-3a": {
    "name": "Nothing Phone (3a), White",
    "source": "https://in.nothing.tech/products/phone-3a",
    "representative": false,
    "creative": false
  },
  "nothing-cmf-phone-series": {
    "name": "CMF Phone 2 Pro, Orange",
    "source": "https://in.nothing.tech/products/cmf-phone-2-pro",
    "representative": true,
    "creative": false
  },
  "oneplus-oneplus-13-series": {
    "name": "OnePlus 13 — Midnight Ocean",
    "source": "https://www.oneplus.in/13/specs",
    "representative": true,
    "creative": false
  },
  "oneplus-oneplus-nord-2026": {
    "name": "OnePlus Nord 6 — Fresh Mint",
    "source": "https://www.oneplus.in/nord-6/specs",
    "representative": true,
    "creative": false
  },
  "oneplus-oneplus-nord-ce": {
    "name": "OnePlus Nord CE6",
    "source": "https://www.oneplus.in/nord-ce6/specs",
    "representative": true,
    "creative": false
  },
  "poco-poco-f-series": {
    "name": "POCO F9 Ultra",
    "source": "https://www.po.co/global/product/poco-f9-ultra/specs/",
    "representative": true,
    "creative": false
  },
  "poco-poco-x-series": {
    "name": "POCO X8 Pro Max",
    "source": "https://www.mi.com/global/product/poco-x8-pro-max/",
    "representative": true,
    "creative": false
  },
  "poco-poco-m-series": {
    "name": "POCO M8 Pro 5G",
    "source": "https://www.mi.com/global/product/poco-m8-pro-5g/",
    "representative": true,
    "creative": false
  },
  "poco-poco-c-series": {
    "name": "POCO C81 Pro",
    "source": "https://www.mi.com/global/product/poco-c81-pro/",
    "representative": true,
    "creative": false
  },
  "iqoo-iqoo-15-series": {
    "name": "iQOO 15",
    "source": "https://www.iqoo.com/in/products",
    "representative": true,
    "creative": false
  },
  "iqoo-iqoo-neo-series": {
    "name": "iQOO Neo 10 — Asphalt Black",
    "source": "https://shop.iqoo.com/in/product/2063?skuId=8452",
    "representative": true,
    "creative": false
  },
  "iqoo-iqoo-z-series": {
    "name": "iQOO Z11 5G — Aurora Green",
    "source": "https://www.iqoo.com/in/products",
    "representative": true,
    "creative": false
  },
  "tecno-tecno-phantom-series": {
    "name": "TECNO PHANTOM V Fold2 5G",
    "source": "https://www.tecno-mobile.in/",
    "representative": true,
    "creative": false
  },
  "tecno-tecno-camon-series": {
    "name": "TECNO CAMON 50 Ultra 5G",
    "source": "https://www.tecno-mobile.in/products/mobile/camon-50-ultra-5g/",
    "representative": true,
    "creative": false
  },
  "tecno-tecno-pova-series": {
    "name": "TECNO POVA 8 Pro 5G",
    "source": "https://www.tecno-mobile.in/products/mobile/pova-8-pro-5g/",
    "representative": true,
    "creative": false
  },
  "tecno-tecno-spark-series": {
    "name": "TECNO SPARK Go 3 Pro",
    "source": "https://www.tecno-mobile.in/products/mobile/spark-go-3-pro/",
    "representative": true,
    "creative": false
  },
  "motorola-motorola-razr-fold": {
    "name": "Motorola razr fold",
    "source": "https://www.motorola.in/smartphones-motorola-razr-fold/p",
    "representative": false,
    "creative": false
  },
  "motorola-motorola-edge-70-max": {
    "name": "Motorola edge 70 max",
    "source": "https://www.motorola.in/smartphones-motorola-edge-70-max/p",
    "representative": false,
    "creative": true
  },
  "xiaomi-redmi-17c-5g": {
    "name": "REDMI 17C 5G",
    "source": "https://www.mi.com/in/product/redmi-17c-5g/",
    "representative": false,
    "creative": false
  },
  "samsung-galaxy-z-fold-2026": {
    "name": "Samsung Galaxy Z Fold8, Cream",
    "source": "https://www.samsung.com/in/smartphones/galaxy-z-fold8/buy/",
    "representative": true,
    "creative": false
  },
  "samsung-galaxy-s26-ultra": {
    "name": "Samsung Galaxy S26 Ultra, Cobalt Violet",
    "source": "https://www.samsung.com/in/smartphones/galaxy-s26-ultra/buy/",
    "representative": false,
    "creative": false
  },
  "samsung-galaxy-s26-s26": {
    "name": "Samsung Galaxy S26, Sky Blue",
    "source": "https://www.samsung.com/in/smartphones/galaxy-s26/buy/",
    "representative": true,
    "creative": false
  },
  "samsung-galaxy-s25-series": {
    "name": "Samsung Galaxy S25 Ultra, Titanium Silverblue",
    "source": "https://www.samsung.com/in/smartphones/galaxy-s25-ultra/buy/",
    "representative": true,
    "creative": false
  },
  "samsung-galaxy-a-series-2026": {
    "name": "Samsung Galaxy A57 5G, Awesome Icyblue",
    "source": "https://www.samsung.com/in/smartphones/galaxy-a57/buy/",
    "representative": true,
    "creative": false
  },
  "samsung-galaxy-a-series-2025": {
    "name": "Samsung Galaxy A56 5G, Awesome Olive",
    "source": "https://www.samsung.com/in/smartphones/galaxy-a56/buy/",
    "representative": true,
    "creative": false
  },
  "xiaomi-xiaomi-17-17t": {
    "name": "Xiaomi 17",
    "source": "https://www.mi.com/in/product/xiaomi-17/specs/",
    "representative": false,
    "creative": false
  },
  "xiaomi-redmi-note-17-pro-max": {
    "name": "REDMI Note 17 Pro Max 5G — Stealth Black",
    "source": "https://www.mi.com/in/product/redmi-note-17-pro-max-5g/specs/",
    "representative": false,
    "creative": false
  },
  "xiaomi-redmi-note-17-pro": {
    "name": "REDMI Note 17 Pro 5G",
    "source": "https://www.mi.com/in/product/redmi-note-17-pro-5g/specs/",
    "representative": false,
    "creative": false
  },
  "xiaomi-redmi-note-17": {
    "name": "REDMI Note 17 5G",
    "source": "https://www.mi.com/in/product/redmi-note-17-5g/specs/",
    "representative": false,
    "creative": false
  },
  "xiaomi-redmi-17": {
    "name": "REDMI 17 5G",
    "source": "https://www.mi.com/in/product/redmi-17-5g/specs/",
    "representative": false,
    "creative": false
  },
  "xiaomi-redmi-note-15-pro": {
    "name": "REDMI Note 15 Pro+ 5G",
    "source": "https://www.mi.com/in/product/redmi-note-15-pro-plus-5g/",
    "representative": false,
    "creative": false
  },
  "xiaomi-xiaomi-17-ultra": {
    "name": "Xiaomi 17 Ultra",
    "source": "https://www.mi.com/in/product/xiaomi-17-ultra/specs/",
    "representative": false,
    "creative": true
  },
  "xiaomi-xiaomi-17t": {
    "name": "Xiaomi 17T",
    "source": "https://www.mi.com/in/product/xiaomi-17t/specs/",
    "representative": false,
    "creative": true
  },
  "xiaomi-redmi-15-15c-15a": {
    "name": "REDMI 15 5G / REDMI 15C 5G / REDMI 15A 5G",
    "source": "https://www.mi.com/in/product/redmi-15-5g/",
    "representative": false,
    "creative": true
  },
  "xiaomi-redmi-a7-a7-pro-4g": {
    "name": "REDMI A7 / REDMI A7 Pro 4G",
    "source": "https://www.mi.com/bd/product/redmi-a7/specs/",
    "representative": false,
    "creative": true
  },
  "apple-iphone-18-pro-max": {
    "name": "iPhone 18 Pro Max · Burgundy",
    "source": "https://www.apple.com/in/iphone-18-pro/",
    "representative": false,
    "creative": true
  },
  "apple-iphone-18-pro": {
    "name": "iPhone 18 Pro · Silver",
    "source": "https://www.apple.com/in/iphone-18-pro/",
    "representative": false,
    "creative": true
  },
  "apple-iphone-17-series": {
    "name": "iPhone 17e, iPhone 17, iPhone 17 Pro, iPhone 17 Pro Max और iPhone Air",
    "source": "https://www.apple.com/in/iphone/",
    "representative": false,
    "creative": true
  },
  "apple-iphone-16-series": {
    "name": "iPhone 16, 16 Plus, 16 Pro, 16 Pro Max और 16e",
    "source": "https://support.apple.com/en-in/108044",
    "representative": false,
    "creative": true
  },
  "apple-iphone-15-series": {
    "name": "iPhone 15, 15 Plus, 15 Pro और 15 Pro Max",
    "source": "https://www.apple.com/in/newsroom/2023/09/apple-unveils-iphone-15-pro-and-iphone-15-pro-max/",
    "representative": false,
    "creative": true
  }
};
// A completed image becomes active only after that individual asset is published.
const studioImageIds = new Set<string>(JSON.parse(process.env.NEXT_PUBLIC_STUDIO_IMAGE_IDS || "[]"));
for (const brand of phoneBrands) {
  for (const model of brand.models) {
    if (!studioImageIds.has(model.id)) continue;
    const reference = studioImageReferences[model.id];
    model.image = `/images/mw-studio-${model.id}.webp`;
    model.imageAlt = `${reference?.name ?? model.name} की साफ़ product image`;
    model.imageKind = reference?.creative ? "creative" : undefined;
    model.imageCaption = reference ? `तस्वीर में: ${reference.name}${reference.representative ? " · इस series का model" : ""}।` : undefined;
    model.imageSource = reference?.source;
    model.gallery = [{ src: model.image, alt: model.imageAlt }];
  }
  const cover = brand.models.find((model) => studioImageIds.has(model.id));
  if (cover) { brand.image = cover.image; brand.imageAlt = cover.imageAlt; }
}
export const phoneModels:PhoneModel[]=phoneBrands.flatMap(x=>x.models);
export const availablePhoneModels=phoneModels.filter(x=>x.status!=="upcoming");
export const upcomingPhoneModels:PhoneModel[]=[];
export function validModelIds(value:string|null):string[]{return[...new Set((value??"").split(","))].filter(id=>phoneModels.some(p=>p.id===id)).slice(0,8)}
export function recommendPhones(system:string):PhoneModel[]{const base=availablePhoneModels.filter(p=>system==="any"||p.system===system);return base.slice(0,4)}
export function modelEnquiry(models:PhoneModel[],details=""):string{const names=models.map((p,i)=>(i+1)+". "+p.brand+" "+p.name).join("\n");return shop.phone.whatsapp+"?text="+encodeURIComponent("Namaste Mobile World! My selected models:\n"+names+"\n"+details)}
