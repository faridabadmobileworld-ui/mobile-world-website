import type { Post } from "./content";
import { shop } from "./shop";

// Specifications verified 2026-10-07 from the manufacturers' India pages:
// https://www.mi.com/in/product/redmi-17c-5g/specs/
// https://www.vivo.com/in/products/param/v80
// Benefits and vivo variants: owner's 7 October campaign posters.
function storeVisit(model: string, prebook = false) {
  const whatsapp = `${shop.phone.whatsapp}?text=${encodeURIComponent(`नमस्ते Mobile World! मैंने आपकी website पर ${model} का article पढ़ा। मुझे ${prebook ? "pre-booking और live demo" : "phone और finance offer"} की जानकारी चाहिए।`)}`;
  return `<h2 id="store-visit">पसंद आया? Mobile World पर मिलिए।</h2>
<p>${prebook ? "vivo V80 का live demo दुकान पर उपलब्ध है। Camera आज़माइए, colours देखिए और अपनी पसंद का variant pre-book कीजिए।" : "REDMI 17C की sale शुरू हो चुकी है। अपनी ज़रूरत बताइए—हम RAM, colour और finance option समझने में मदद करेंगे।"}</p>
<div class="rcta"><b>आपकी अपनी Mobile World · ${shop.address.city}</b>
<p>${shop.address.street}, ${shop.address.landmark}, ${shop.address.locality}, ${shop.address.city}, ${shop.address.state} – ${shop.address.postalCode}</p>
<p>सुबह 10:00 बजे से रात 10:00 बजे तक। हर महीने की आख़िरी तारीख़ को दुकान बंद रहती है।</p>
<div class="btns"><a class="btn btn-d" href="${shop.social.googleMaps}" target="_blank" rel="noopener noreferrer">Google Maps पर रास्ता देखिए ↗</a><a class="btn btn-w" href="${whatsapp}" target="_blank" rel="noopener noreferrer">${prebook ? "Pre-booking के लिए बात कीजिए" : "दुकान से बात कीजिए"}</a></div></div>`;
}

export const redmi17CPost: Post = {
  slug: "redmi-17c-5g-sale-offer-specifications-faridabad",
  kicker: "Tech Update", date: "7 October 2026", dateISO: "2026-10-07",
  title: "REDMI 17C 5G की sale शुरू: ₹17 Processing Fee offer के साथ जानिए पूरा phone।",
  excerpt: "REDMI 17C की battery, display, camera, RAM और colours की पूरी जानकारी। Mobile World पर IDFC FIRST Bank का ₹17 Processing Fee offer जानिए।",
  image: "/images/redmi-17c-sale-offer-oct2026.png", imageW: 1536, imageH: 1024, imageFit: "contain",
  alt: "REDMI 17C 5G के Coffee Brew, Purple Dawn और front views का campaign artwork",
  body: `
<p>नया phone लेते समय कुछ बातें सबसे पहले मन में आती हैं—screen कैसी है, battery कितनी बड़ी है और अपना पसंदीदा colour कौन सा होगा। <strong>REDMI 17C 5G की sale शुरू हो चुकी है।</strong> Mobile World पर इसे जानिए और अपनी अगली पसंद की शुरुआत कीजिए।</p>

<h2 id="sale-offer">₹17 Processing Fee वाला ख़ास offer</h2>
<p><strong>IDFC FIRST Bank की 8|0 scheme पर ₹17 Customer Processing Fee</strong> का offer है। यह offer <strong>14 November 2026</strong> तक है। अपना पसंदीदा variant चुनिए; EMI plan समझने में हमारी finance team मदद करेगी।</p>
<p><a href="#store-visit">Mobile World पर मिलने आइए ↓</a></p>

<div class="specs">
<div class="spec"><span class="spec-k">Battery</span><b class="spec-v">6000<em>mAh</em></b></div>
<div class="spec"><span class="spec-k">Charging</span><b class="spec-v">33<em>W</em></b></div>
<div class="spec"><span class="spec-k">Refresh rate</span><b class="spec-v">120<em>Hz तक</em></b></div>
<div class="spec"><span class="spec-k">Main camera</span><b class="spec-v">50<em>MP</em></b></div>
</div>

<h2 id="display-battery">बड़ी screen और battery</h2>
<p>6.9-inch display, up to 120Hz refresh rate और 6000mAh battery इस phone के मुख्य highlights हैं। 33W charging support और box में 33W charger मिलता है। Videos, messages और रोज़ के इस्तेमाल के लिए screen का size हाथ में लेकर देखना अच्छा रहेगा।</p>

<h2 id="specifications">REDMI 17C की specifications</h2>
<table class="guide-spec-table"><caption>India model · मुख्य specifications</caption><tbody>
<tr><th scope="row">Processor</th><td>MediaTek Dimensity 6300 · 6nm · octa-core · up to 2.4GHz</td></tr>
<tr><th scope="row">Display</th><td>6.9-inch Dot Drop · 1600 × 720 · up to 120Hz</td></tr>
<tr><th scope="row">Brightness</th><td>660 nits typical · 810 nits HBM</td></tr>
<tr><th scope="row">Rear camera</th><td>50MP main, f/1.8 · auxiliary lens</td></tr>
<tr><th scope="row">Selfie camera</th><td>8MP, f/2.0</td></tr>
<tr><th scope="row">Video</th><td>Front और rear: 1080p, 30fps तक</td></tr>
<tr><th scope="row">Battery / Charging</th><td>6000mAh typical · 33W charging · 10W reverse charging</td></tr>
<tr><th scope="row">Memory</th><td>LPDDR4X · UFS 2.2 · microSD, 1TB तक</td></tr>
<tr><th scope="row">Software</th><td>Xiaomi HyperOS 3</td></tr>
<tr><th scope="row">Connectivity</th><td>5G · Dual SIM + microSD · dual-band Wi-Fi · Bluetooth 5.4</td></tr>
<tr><th scope="row">Audio / Unlock</th><td>3.5mm jack · FM radio · side fingerprint · face unlock</td></tr>
<tr><th scope="row">Design</th><td>171.56 × 79.47 × 7.99mm · 211g · IP64</td></tr>
</tbody></table>

<h2 id="variants-colours">RAM, storage और colours चुनिए</h2>
<p><strong>4GB + 128GB</strong> और <strong>6GB + 128GB</strong> options हैं। Colours: <strong>Dark Night, Coffee Brew और Purple Dawn</strong>। Memory extension, physical RAM से अलग है।</p>
<p>आप कई apps के बीच switch करते हैं या ज़्यादा photos सँभालते हैं? दुकान पर अपना इस्तेमाल बताइए। आपकी ज़रूरत के अनुसार variant चुनना आसान हो जाएगा।</p>

${storeVisit("REDMI 17C 5G")}

<h2 id="offer-notes">Offer की छोटी-सी जानकारी</h2>
<p>₹17 Customer Processing Fee, IDFC FIRST Bank की 8|0 scheme के लिए है। EMI, down payment, बाकी charges और approval लागू finance eligibility के अनुसार हैं। अपना plan चुनते समय पूरी payable राशि जान लीजिए। Colour और variant की उपलब्धता दुकान पर पता कर लीजिए।</p>
<p>Specifications: Xiaomi India, 7 October 2026 को जाँची गई जानकारी। Battery backup और charging इस्तेमाल के अनुसार बदलते हैं; IP64 resistance, waterproof होने का दावा नहीं है। ऊपर की तस्वीर campaign artwork है।</p>
<p><a href="/posts/vivo-v80-prebooking-offers-specifications-faridabad">vivo V80 के pre-booking benefits भी देखिए →</a></p>`,
};

export const vivoV80Post: Post = {
  slug: "vivo-v80-prebooking-offers-specifications-faridabad",
  kicker: "Tech Update", date: "7 October 2026", dateISO: "2026-10-07",
  title: "vivo V80 Pre-booking: cashback, gifts और camera की पूरी जानकारी।",
  excerpt: "vivo V80 के pre-booking benefits, ZEISS camera, 7200mAh battery, colours और variants जानिए। Live demo के लिए Mobile World, Faridabad आइए।",
  image: "/images/vivo-v80-prebooking-oct2026.png", imageW: 1536, imageH: 1024, imageFit: "contain",
  alt: "vivo V80 के Sunrise Anthem, Horizon Blue, Stellar Black और front views का campaign artwork",
  body: `
<p>परिवार की photos, दोस्तों के साथ videos या अपनी रोज़ की छोटी-छोटी यादें—phone का camera अक्सर हमारे साथ रहता है। <strong>vivo V80 की pre-booking Mobile World पर खुली है</strong> और <strong>live demo</strong> भी उपलब्ध है। पहले phone को जानिए, फिर दुकान पर अपने हाथ से आज़माइए।</p>

<h2 id="prebooking-benefits">Pre-booking के साथ चार benefits</h2>
<div class="specs">
<div class="spec"><span class="spec-k">Credit card cashback</span><b class="spec-v">10<em>%</em></b></div>
<div class="spec"><span class="spec-k">Warranty benefit</span><b class="spec-v">1 + 1<em>साल</em></b></div>
<div class="spec"><span class="spec-k">Premium backpack</span><b class="spec-v">FREE</b></div>
<div class="spec"><span class="spec-k">Down payment offer</span><b class="spec-v">₹101</b></div>
</div>
<p>अपना favourite colour और storage चुनिए। हमारी team pre-booking, benefits और delivery की जानकारी समझा देगी।</p>
<p><a href="#store-visit">Live demo देखने दुकान पर आइए ↓</a></p>

<h2 id="camera">Photos और portraits के लिए क्या मिलता है?</h2>
<p>V80 में <strong>50MP ZEISS main camera with OIS</strong>, <strong>50MP ZEISS telephoto with OIS और 3× optical zoom</strong>, 8MP ultra-wide तथा 50MP autofocus selfie camera मिलता है। Portrait, group selfie और video—दुकान पर अपनी पसंद के shots लेकर देखिए।</p>

<h2 id="display-performance">Display, battery और performance</h2>
<p>6.59-inch AMOLED में up to 144Hz refresh rate है। Snapdragon 7 Gen 4 processor, 7200mAh battery और 90W FlashCharge दिए गए हैं। एक ही phone में camera, screen और grip का अपना experience लेकर फ़ैसला कीजिए।</p>

<h2 id="specifications">vivo V80 की specifications</h2>
<table class="guide-spec-table"><caption>India model · मुख्य specifications</caption><tbody>
<tr><th scope="row">Processor</th><td>Snapdragon 7 Gen 4 · 4nm · octa-core · up to 2.8GHz</td></tr>
<tr><th scope="row">Display</th><td>6.59-inch AMOLED · 2750 × 1260 · up to 144Hz</td></tr>
<tr><th scope="row">Brightness</th><td>5000 nits local peak · P3 colour gamut</td></tr>
<tr><th scope="row">Main camera</th><td>50MP Sony LYTIA 700V · OIS</td></tr>
<tr><th scope="row">Telephoto</th><td>50MP Sony IMX882 · OIS · 3× optical zoom</td></tr>
<tr><th scope="row">Ultra-wide / Selfie</th><td>8MP ultra-wide · 50MP autofocus front</td></tr>
<tr><th scope="row">Video</th><td>4K और 1080p recording</td></tr>
<tr><th scope="row">Battery / Charging</th><td>7200mAh typical · 90W FlashCharge</td></tr>
<tr><th scope="row">Memory</th><td>LPDDR4X · UFS 3.1 · microSD support नहीं</td></tr>
<tr><th scope="row">Software</th><td>OriginOS 7 · Android 17</td></tr>
<tr><th scope="row">Connectivity</th><td>Dual nano-SIM, 5G · dual-band Wi-Fi · Bluetooth 5.4 · NFC · USB-C</td></tr>
<tr><th scope="row">Unlock / Sensors</th><td>3D ultrasonic fingerprint · infrared blaster</td></tr>
<tr><th scope="row">Design</th><td>157.52 × 74.33 × 7.69mm · 203g · glass back · IP68/IP69</td></tr>
</tbody></table>

<h2 id="variants-colours">आपका colour, आपका variant</h2>
<p>Colours में <strong>Sunrise Anthem, Horizon Blue और Stellar Black</strong> हैं। हमारे pre-booking poster में <strong>8GB + 128GB, 8GB + 256GB और 8GB + 512GB</strong> options दिए गए हैं। अपना पसंदीदा combination हमारी team को बताइए।</p>

${storeVisit("vivo V80", true)}

<h2 id="offer-notes">Booking से जुड़ी छोटी-सी जानकारी</h2>
<p>ये benefits pre-booking के लिए हैं। Cashback की card eligibility और limit, ₹101 down payment का finance approval, gift availability और delivery booking के समय तय होंगे। 1+1 साल warranty benefit संबंधित brand/programme की शर्तों के अनुसार है।</p>
<p>Specifications: vivo India, 7 October 2026 को जाँची गई जानकारी। Peak brightness पूरे display की लगातार brightness नहीं है। Battery backup और charging इस्तेमाल के अनुसार बदलते हैं; IP ratings हर परिस्थिति में water damage से सुरक्षा की guarantee नहीं हैं। ऊपर की तस्वीर campaign artwork है।</p>
<p><a href="/posts/redmi-17c-5g-sale-offer-specifications-faridabad">REDMI 17C का sale offer भी जानिए →</a></p>`,
};
