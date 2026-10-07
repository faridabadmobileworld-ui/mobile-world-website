import { shop } from "./shop";
export type PhoneModel={id:string;brand:string;brandSlug:string;name:string;image:string;imageAlt:string;note:string;display:string;camera:string;processor:string;power:string;software:string;colours:{name:string;hex:string}[];variants:string[];system:"Android"|"iOS";reasons:Record<string,string>;source:string;checked:string;rank:number;status?:"available"|"upcoming"|"prebooking"};
export type PhoneBrand={slug:string;name:string;image:string;imageAlt:string;headline:string;note:string;models:PhoneModel[]};
const img={apple:"/images/iphone-display-at-the-mobile-world-counter-346d3e71.webp",samsung:"/images/flagship-phones-apple-samsung-xiaomi-vivo-c3df528a.webp",xiaomi:"/images/redmi-17-5g-colours-mobile-world-faridabad.webp",google:"/images/flagship-smartphone-e6739d50.webp",nothing:"/images/model-nothing3a.png",mid:"/images/mid-range-5g-phones-five-colours-v2-7c07be19.webp"};
const c=[{name:"Black",hex:"#15171a"},{name:"White",hex:"#f6f5f1"},{name:"Blue",hex:"#8da8cf"},{name:"Gold",hex:"#d8c7a4"}];
const slug=(s:string)=>s.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"");
function p(brand:string,brandSlug:string,rank:number,name:string,image:string,variants:string[],system:"Android"|"iOS"="Android"):PhoneModel{return{id:brandSlug+"-"+slug(name),brand,brandSlug,rank,name,image,imageAlt:brand+" "+name+" product image",note:"Variant, colour and live stock confirm at store.",display:rank<3?"Premium display":"Large daily-use display",camera:rank<3?"Camera-focused highlights":"Everyday camera highlights",processor:rank<3?"High performance range":"Daily performance range",power:"Battery and charging details at store",software:system,colours:c,variants,system,source:shop.siteUrl,checked:"2026-09-29",reasons:{camera:brand+" "+name+" camera buyers ke liye.",everyday:brand+" "+name+" daily use ke liye.",updates:brand+" "+name+" availability store se confirm karein."}}}
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
for(const brand of phoneBrands) brand.models.sort((a,b)=>a.rank-b.rank);
export const phoneModels:PhoneModel[]=phoneBrands.flatMap(x=>x.models);
export const availablePhoneModels=phoneModels.filter(x=>x.status!=="upcoming");
export const upcomingPhoneModels:PhoneModel[]=[];
export function validModelIds(value:string|null):string[]{return[...new Set((value??"").split(","))].filter(id=>phoneModels.some(p=>p.id===id)).slice(0,8)}
export function recommendPhones(system:string,priority:string):PhoneModel[]{const base=availablePhoneModels.filter(p=>system==="any"||p.system===system);return base.slice(0,4)}
export function modelEnquiry(models:PhoneModel[],details=""):string{const names=models.map((p,i)=>(i+1)+". "+p.brand+" "+p.name).join("\n");return shop.phone.whatsapp+"?text="+encodeURIComponent("Namaste Mobile World! My selected models:\n"+names+"\n"+details)}
