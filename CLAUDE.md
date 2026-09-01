# CLAUDE.md — Mobile World Website

यह file हर Claude Code session में automatically load होती है।
जो यहाँ लिखा है, वो हर बार दोहराना नहीं पड़ेगा।

---

## 1. Project

Mobile World की official website।
Live domain (आने वाला): `www.mobileworldfaridabad.com`

**Primary goal:** Faridabad के local customers को shop तक लाना — phone call,
WhatsApp message, या physical visit।

**यह e-commerce site नहीं है।** अभी online payment, cart या checkout नहीं
बनाना है। यह एक भरोसेमंद local business website है जो enquiry generate करे।

**Secondary goal:** YouTube और Instagram audience को एक official landing page देना।

---

## 2. Business facts — इन्हें कभी बदलकर मत लिखो

- **Shop name (public):** Mobile World
- **Board/tagline:** Mobile • Laptop • Electronics • Home Appliances
  *(owner ने 27 Aug 2026 को final किया — bullet `•` समेत, बिलकुल ऐसे ही)*
  — owner हर जगह (Google, Instagram, Facebook, YouTube) यही रख रहे हैं।
  Code में `shop.name` और `shop.tagline`.
- **Registered name:** Aggarwal Kiryana And Communication
- **Owner:** Tarun Gupta
- **Address:** Shop No. 3896/661/29, Gurudwara Road, Block F,
  Near Bada Gurudwara and Disposal Chowk, Jawahar Colony,
  NIT Faridabad, Haryana – 121005
- **Phone / WhatsApp:** +91 93152 12131
  ⚠️ पुराना नंबर **+91 99533 35535 अब बंद है** (owner, 31 Aug 2026)। वो एक
  banner की तस्वीर में छपा रह गया था। कहीं भी दिखे तो तुरंत हटाइए।
- **Model:** एक ही physical shop। कोई branch नहीं।
- **Timings:** रोज़ सुबह 10 बजे से रात 10 बजे तक, सातों दिन
- **छुट्टी:** हर महीने की आख़िरी तारीख़ (28/29/30/31 — जो भी हो)।
  कोई weekly off नहीं।

### Services — ये करते हैं
EMI (cards और finance) · पुराना फ़ोन Exchange · Faridabad में Delivery ·
Mobile Repairing · बेचने के बाद ग्राहक की मदद (after-sale support)

### Payment — ये पाँचों चलते हैं (owner, 31 Aug 2026)
Cash · UPI · Credit Card · Debit Card · EMI
`data/shop.ts` के `paymentMethods` में हैं। Schema और `/visit` page दोनों
वहीं से बनते हैं — दोबारा कहीं मत लिखो।

### ⛔ ये नहीं करते — कभी मत लिखो

- **Installation नहीं करते। दुकान सामान बेचती है, लगाने नहीं आती।**
  (owner, 26 Aug 2026) — "AC fitted and tested", "लगाकर, चलाकर दिखाते हैं",
  "Setup", "Wall mount", "Load check" — ऐसा कुछ भी मत लिखो।
  Code में `shop.services.installation` = `false`.
- **Warranty या guarantee दुकान से नहीं मिलती।** वो brand के service centre
  से आती है। "हमारी warranty", "जो यहाँ से लिया उसकी guarantee यहीं" —
  ऐसा कोई वादा कभी मत करो।
- **कोई ऐसा दावा नहीं जो साबित न हो सके** — §12 पढ़िए।

### ✅ ये करते हैं — owner ने 31 Aug 2026 को साफ़ किया

ये तीन बातें पहले ग़लत समझी गई थीं। अब owner के अपने शब्दों में:

- **After-sale support — हाँ, यह करते हैं।**
  Owner: *"ग्राहक product लेकर गया, अब उसे data transfer चाहिए, settings
  समझनी हैं, कोई दिक़्क़त आ गई, service centre पर बात नहीं बन रही — वो आमने-सामने
  आकर बात कर सकता है। Amazon-Flipkart पर customer और service centre के बीच
  कोई नहीं होता। यहाँ हम ख़ुद सामान देते हैं और आगे सुनते भी हैं।"*
  Code में `shop.services.afterSaleSupport` = `true`.
  ⚠️ यह **मदद** है, **warranty नहीं**। दोनों को कभी मत मिलाओ।
- **Repairing — हाँ, यह दुकान retail shop भी है और repairing shop भी।**
  Owner: *"कोई पूछता है भाई मेरे phone में ये दिक़्क़त है, आपके यहाँ repairing
  होती है क्या? तो हाँ, हमारे यहाँ वो भी होता है।"*
  ⚠️ नए device का **warranty वाला काम service centre पर ही होता है** —
  उसका दावा मत करो।

  📌 **1 Sep 2026 को यह नियम बदला:** पहले लिखा था "पूरी list मत गिनाओ"।
  Owner ने उस दिन Sachin का लिखा पूरा **Repairing Services page** भेजा जिसमें
  screen, battery, charging port, speaker/mic, camera, IC-level motherboard
  और software — सब गिनाए हुए हैं। यानी अब **detail लिखनी है**, वो page
  `/repairing` पर है। Home page पर फिर भी एक ही line रखिए।
- **Exchange — पुराने phone की value लगाकर नए के दाम में से कम कर देते हैं।**
  Owner: *"उसके पुराने phone की value लगाते हैं, और उस value को नए phone में
  कम करके बचे हुए पैसे लेते हैं।"* बाक़ी शर्तें (कौन से brand, टूटी screen वाला
  लेते हैं या नहीं) अभी owner से पूछनी बाक़ी हैं।

### 🖼️ तस्वीरों का नियम — 31 Aug 2026 के audit के बाद बना

**तस्वीर के अंदर कोई दावा, कोई फ़ोन नंबर, कोई timing मत छपने दो।**

उस दिन के audit में पकड़ा गया कि sample banners के अंदर छपा हुआ था —
"BEST PRICES GUARANTEED", "TRUSTED SINCE 1973", "Three Generations of
Service", "AFTER SALES SERVICE YOU CAN RELY ON", "No Cost EMI",
और **एक पुराना बंद हो चुका फ़ोन नंबर (99533 35535) + ग़लत timing
(10 AM–9 PM, All Days Open)**। वो सारी तस्वीरें हटा दी गईं।

तस्वीर के अंदर का text किसी scan में नहीं पकड़ा जाता, Google उसे पढ़ नहीं
सकता, और phone पर वो पढ़ने लायक़ भी नहीं रहता। इसलिए:
जो कहना है वो **असली HTML text में लिखो**, तस्वीर सिर्फ़ दिखाने के लिए हो।
कोई नई banner जोड़ने से पहले उसे खोलकर पढ़ो — हर शब्द।

### Categories
Smartphones, Laptops & Tablets, Televisions, Air Conditioners,
Washing Machines, Refrigerators, Inverters & Batteries, Audio & Wearables,
Kitchen Appliances (Air Fryer, Microwave, Mixer), Accessories

पूरी website की इकलौती category list `data/shop.ts` के `categories` में है।
`navCategories` उसी से बनती है — दोबारा कहीं मत लिखो।

⚠️ **Cameras और Lens दुकान नहीं बेचती** (owner, 31 Aug 2026)। ये code में
ग़लती से जुड़ गए थे और menu + `/products` दोनों पर दिख रहे थे — हटा दिए गए।
ऊपर वाली list ही आख़िरी सच है। उसमें जो नहीं है, वो website पर नहीं आएगा।

### Brands
Apple, Samsung, Xiaomi / Redmi, OnePlus, Vivo, Oppo, Motorola, Nothing,
iQOO, Realme, Tecno, Infinix, Lava, Nokia, Philips

### Pages — website पर कौन-कौन से page हैं

Home · Products · **Repairing Services** · **After Sales Support** ·
**हमारी Team** · About · नई जानकारी (posts) · Contact · दुकान पर आइए · Privacy

तीन नए page owner ने 1 Sep 2026 को Sachin का लिखा content देकर बनवाए —
`/repairing`, `/after-sales-support`, `/team`.

⚠️ **नया page बनाओ तो पाँच जगह जोड़ना ज़रूरी है:** `data/pages.ts`
(interlinking), `app/sitemap.ts`, drawer (`SiteHeader.tsx`),
footer (`SiteFooter.tsx`) और `scripts/bundle-preview.mjs`.
एक भी छूटी तो verify script पकड़ लेगी।

### हर page अपने आप में पूरा हो — 1 Sep 2026

Owner: *"sabhi pages ko separately banao. Ek page me dusra page mix na ho.
But interlinking karni h sabhi ki yahan se wahan direct one click pe."*

इसलिए दो नियम:

1. **एक page का content दूसरे page पर मत दोहराओ।** Team की बात सिर्फ़
   `/team` पर, repairing सिर्फ़ `/repairing` पर, पता और Google listing
   सिर्फ़ `/contact` पर। दूसरे page पर ज़रूरत हो तो **link दो, नक़ल मत करो**।
   *(Home page अपवाद है — वो पूरी दुकान की झलक है।)*
2. **हर page पर `<MoreLinks current="/...">`** — `data/pages.ts` से बाक़ी
   सारे pages के cards अपने आप बन जाते हैं। एक click में कहीं भी।

### हर page पर ये तीन चीज़ें ज़रूरी हैं (owner, 1 Sep 2026)

1. **Table of contents** — `<TableOfContents>` component. यह server पर ही
   बन जाती है (JavaScript से headings नहीं ढूँढ़ती), इसलिए Google को पहली
   बार में दिख जाती है। हर heading पर वही `id` लगाइए जो TOC की list में है।
2. **Author का नाम — `Written by: Sachin`।** `shop.authorName` से आता है,
   `<Byline>` component दिखाता है। (हिन्दी "लिखा —" नहीं, owner ने 1 Sep 2026
   को साफ़ कहा।) Article के schema में भी यही author जाता है।
3. **सारे social buttons + WhatsApp** — `<PageFoot>` और `<FollowUs>`
   दोनों page के आख़िर में। पता, फ़ोन और चारों links वहीं से आते हैं।

### Social links
- YouTube: https://youtube.com/@mobileworldfaridabad
- Instagram: https://www.instagram.com/mobileworldfaridabad
- Facebook: https://facebook.com/mobileworldfaridabad
- Google Maps: (owner भरेगा)

---

## 3. Audience — और उसका design पर असर

- ज़्यादातर visitors **Faridabad से, mobile phone पर, 4G/5G data पर**
- कई users English से ज़्यादा Hindi पढ़ने में सहज हैं
- इसलिए **mobile-first design अनिवार्य है**
- Pages हल्के रखो — heavy animations और बड़ी unoptimized images मत डालो
- हर page पर call और WhatsApp button आसानी से पहुँच में हो
- Text सरल रखो। Corporate jargon नहीं।

---

## 4. Tech stack

- Framework: **Next.js (App Router) + TypeScript**
- Styling: **Tailwind CSS**
- Hosting: **Vercel** (हर PR पर preview URL, main पर production)
- Phase 2 से: **Supabase** (Auth + Postgres + Storage)
- `main` branch हमेशा deployable रहनी चाहिए

**Rule:** बिना पूछे कोई नई dependency मत जोड़ो। पहले बताओ क्यों चाहिए।

---

## 5. Phases — इसी क्रम में

**Phase 1 — Static site (पहले यही पूरा करो)**
Home, Products, About, Contact, Visit Us.
कोई database नहीं, कोई login नहीं। सारा content code में।

**Phase 2 — Admin dashboard**
Supabase Auth से सिर्फ़ owner login कर सके।
Owner बिना developer के text, images, articles और About edit कर सके।

**Phase 3 — Customer accounts + lead capture**
Visitor details save करना, customer login।

**Phase 1 live हुए बिना Phase 2 शुरू मत करो।**

---

## 6. Code conventions

- हर component अपनी file में, `PascalCase.tsx`
- सारा business data **एक ही जगह**: `/data/shop.ts`
  किसी component में phone number या address hardcode मत करो
- हर image `next/image` से, हमेशा meaningful `alt` text के साथ
- हर page पर proper `<title>` और meta description
- Folder structure साफ़ रखो, nesting कम रखो

---

## 7. SEO — इस business के लिए सबसे ज़रूरी

- हर page पर unique title + meta description
- Local SEO: "Faridabad", "NIT Faridabad", "Jawahar Colony" naturally
  content में आएँ — keyword stuffing नहीं
- **LocalBusiness JSON-LD schema** home page पर: name, address, phone,
  opening hours, geo coordinates
  — हो चुका: `data/schema.ts` सारा schema `data/shop.ts` से बनाता है।
  कोई जानकारी दोबारा मत लिखो, `shop.ts` बदलो — schema अपने आप बदल जाएगा।
  महीने की आख़िरी तारीख़ वाली छुट्टियाँ हर build पर आगे तक गिन ली जाती हैं,
  hardcode नहीं हैं।
- `sitemap.xml` और `robots.txt` generate करो
  — हो चुका: `app/robots.ts`, `app/sitemap.ts`. **नया page बनाओ तो
  `app/sitemap.ts` में उसका URL जोड़ना मत भूलो**, वरना Google उसे ढूँढ़ेगा नहीं।
- Images optimized और सही size में
- Page speed को हर feature से ऊपर रखो

---

## 8. Security और सच्चाई — सख़्त नियम

- कोई API key, password या secret कभी code में मत लिखो।
  सिर्फ़ environment variables में, और `.env*` हमेशा `.gitignore` में
- Contact form पर spam protection और rate limiting
- Owner का personal data (Aadhaar, bank details) कभी site पर नहीं
- **Fake reviews, fake testimonials, fake customer counts, fake ratings
  कभी मत बनाओ।** Google इन्हें पकड़ता है और local ranking गिरा देता है
- Product prices, offers, stock, timings — ये owner से पूछो, ख़ुद मत लिखो

---

## 9. Claude के लिए working rules

1. कोई भी बड़ा change करने से पहले **plan बताओ, फिर पूछो**
2. एक बार में एक feature। 5 चीज़ें एक साथ मत बनाओ
3. हर change के बाद बताओ उसे कैसे test करना है
4. कुछ भी assume मत करो — जो नहीं पता, पूछो
5. Owner developer नहीं है। जो भी समझाओ, सरल भाषा में समझाओ
6. अगर कोई काम इस stack में ठीक से नहीं हो सकता, साफ़ बोलो।
   Workaround मत बनाओ

---

## 10. Pending — owner भरेगा

- [x] ~~Opening / closing timings और weekly off~~ — confirmed 24 Aug 2026
- [x] ~~Repair / installation service करते हैं या नहीं~~ — Repairing हाँ,
      **Installation और service नहीं** (owner ने 26 Aug 2026 को साफ़ किया)
- [x] ~~EMI / exchange offer करते हैं या नहीं~~ — हाँ, दोनों
- [x] ~~Google Maps listing का exact URL~~ — `data/shop.ts` में है
- [x] ~~Map के geo coordinates~~ — 28.36249, 77.28786 (24 Aug 2026)
- [x] ~~`og-image.jpg`~~ — बन गई, पर source photo 720×340 की थी।
      अगर दुकान की **1200px या चौड़ी** photo मिले तो बदल दीजिए।
- [x] ~~Logo file~~ — owner ने साफ़ logo भेज दी (24 Aug 2026)।
      `public/logo.png`, favicon और apple-touch-icon सब इसी से बने।

### Site live करने से पहले — ये चारों ज़रूरी हैं

- [x] ~~**Domain**~~ — `mobileworldfaridabad.com` owner ने 30 Aug 2026 को
      ख़रीद लिया। Code अब सीधे `https://www.mobileworldfaridabad.com` इस्तेमाल
      करता है (`data/shop.ts` का `SITE_URL`)। बदलना हो तो Vercel में
      `NEXT_PUBLIC_SITE_URL` भर दीजिए — code छूने की ज़रूरत नहीं।
- [x] ~~**Vercel account**~~ — project `mobile-world-website`, team
      `faridabadmobileworld-2892`
- [x] ~~**Domain को Vercel से जोड़ना**~~ — 31 Aug 2026 को हो गया।
      GoDaddy में `A @ → 216.198.79.1` और
      `CNAME www → 8013409ecfeaa2f5.vercel-dns-017.com` लगे हैं।
      बिना www वाला पता अपने आप www पर चला जाता है (308)। HTTPS चालू है।
- [ ] **Privacy page** CA या वकील से DPDP Act के हिसाब से check करवाना है।
      ⚠️ पहले यह reminder page पर ही छपा हुआ था और हर ग्राहक को दिख रहा था —
      31 Aug 2026 को हटा दिया गया। **यह note अब सिर्फ़ यहाँ है, site पर नहीं।**
      Owner के लिए लिखी कोई बात कभी page पर मत छोड़ो।
- [ ] **Google Business Profile** verify करना, और हर महीने की आख़िरी तारीख़
      को "Special hours → Closed" set करना। **Website का schema GBP के hours
      control नहीं करता** — वो अलग जगह से आते हैं। ये न किया तो customer बंद
      दुकान पर पहुँचेगा।

### Owner से जवाब चाहिए — तब तक site पर मत लिखो

- [x] ~~**Payment के तरीक़े**~~ — owner ने 31 Aug 2026 को confirm किया:
      **Cash, UPI, Credit Card, Debit Card, EMI — पाँचों चलते हैं।**
      अब `shop.paymentMethods` में हैं, schema और `/visit` वहीं से बनते हैं।
- [x] ~~**Cameras**~~ — दुकान camera/lens नहीं बेचती (31 Aug 2026)। हटा दिए गए।
- [x] ~~**Installation**~~ — करते ही नहीं, इसलिए दाम का सवाल ही नहीं।
- [x] ~~**Daikin**~~ — alt text से हट चुका है, अब कहीं नहीं।
- [x] ~~**Redmi article का दाम**~~ — कोई दाम अब पूरी site पर नहीं है।
- [ ] **Delivery** — कितनी दूर तक? सिर्फ़ NIT Faridabad या पूरा Faridabad?
      मुफ़्त है या charge? कोई minimum amount?
- [ ] **Repair** — कौन सा काम उसी दिन, कौन सा 2–3 दिन? Repair पर कोई
      warranty (जैसे नए screen पर 1 महीना)?
- [ ] **Exchange** — कौन से brands? कितना पुराना तक? टूटी screen वाला फ़ोन
      लेते हैं या नहीं? *(तरीक़ा owner ने समझा दिया — पुराने की value लगाकर
      नए के दाम में से कम — पर ये शर्तें अभी बाक़ी हैं।)*
- [ ] **EMI की शर्तें** — कौन से banks/cards? कोई finance company
      (Bajaj वग़ैरह)? "No Cost EMI" सच में है? कितने महीने का tenure?
      *(Owner ने कहा था "सभी EMI वालों के logo लगाओ" — पर बिना पक्की
      जानकारी के bank/finance company के logo लगाना ग़लत दावा बन जाता है,
      इसलिए अभी सिर्फ़ text है: "Credit card, debit card और finance पर EMI"।)*
- [ ] **ग्राहकों की photos** — `customers-with-the-mobile-world-thank-you-bo`
      में एक ग्राहक का नाम (Manohar Jha) लिखा है, और दो photos में **बच्चे**
      पहचान में आते हैं। Instagram पर डालना और website पर डालना अलग बात है
      (DPDP Act, बच्चों के मामले में और सख़्त)। इन ग्राहकों से एक बार पूछ लीजिए,
      या चेहरे न दिखने वाली photo लगा दीजिए।
- [ ] **GST number** site पर दिखाना है या नहीं — owner की मर्ज़ी

### बाद के लिए

- [ ] दुकान की और असली photos — ख़ास तौर पर **1200px या चौड़ी** एक बाहर की
      photo, ताकि `og-image.jpg` sharp हो जाए। अभी वाली 720×340 की है और
      1.85× बड़ी करनी पड़ी।
- [ ] अपनी product photos — Redmi article से Xiaomi की slides हटाई गईं,
      वहाँ अभी code वाली drawing है
- [ ] Logo का transparent background वाला version (सफ़ेद header के लिए)
- [ ] हर category में क्या-क्या रखते हैं (दाम नहीं — बस सूची)
- [ ] दुकान की कहानी — 1973 से आज तक, दो-तीन सच्ची बातें

---

## 11. Images — सिर्फ़ अपनी photos

Product images किसी brand की official launch slides, ads या marketing
material से **मत** लो। वो उनका copyright है। जो चीज़ दुकान में है उसकी
अपनी photo खींचो — वो ज़्यादा भरोसेमंद भी लगती है।

जिस चीज़ की photo नहीं है, उसके लिए code वाली SVG illustration इस्तेमाल
करो (जैसे preview में `#a-phone`, `#a-tv` हैं) — placeholder या किसी और
की image नहीं।

---

## 12. दावे — जो साबित न हो सके, वो मत लिखो

"Best price", "trusted brand", "सबसे अच्छी दुकान", "No.1" — ये सब मत लिखो।
न page पर, न alt text में, न meta description में। Google इन्हें spam मानता
है, और भारत में consumer law भी ऐसे दावों पर लागू होता है।

इनकी जगह वो लिखो जो customer ख़ुद जाँच सके — 1973 से चला आ रहा परिवार का
business और 2016 से Mobile World, GST bill,
brand warranty, दुकान पर ही repair, एक ही address। ये सब सच है और इसीलिए
ज़्यादा भरोसा दिलाता है।

यही बात owner के brand graphic पर भी लागू है (`public/brand-profile-original.png`)
— उसमें "BEST PRICE" और "TRUSTED BRAND" लिखा है, इसलिए वो website के logo
की तरह इस्तेमाल नहीं होता। `public/README.md` में पूरी बात लिखी है।

---

## 13. आवाज़ — पूरी website एक ही आवाज़ में बोले

**कोई भी copy लिखने से पहले `docs/BRAND-VOICE.md` पढ़ो।** वो owner का approve
किया हुआ standard है, और उसी में पूरी बात लिखी है। यहाँ सिर्फ़ सबसे ज़रूरी बातें:

- **हिन्दी main भाषा है, हमेशा देवनागरी में।** Roman Hinglish में हिन्दी
  वाक्य मत लिखो। रोज़ बोले जाने वाले English शब्द (rate, stock, model, GST
  Bill, Warranty, EMI, WhatsApp…) English में ही रहने दो।
- ऐसा लगे जैसे दुकान ख़ुद ग्राहक से बात कर रही है — गर्मजोशी से, इज़्ज़त से,
  बिना शेखी के। Advertising agency या corporate brochure जैसा कभी नहीं।
- **कहानी कभी मत गड़बड़ाओ:**
  1973 = परिवार के business की शुरुआत (Aggarwal Kiryana Store) ·
  2006 = Aggarwal Kiryana & Communication ·
  **2016 = Mobile World की शुरुआत**।
  "Mobile World 1973 में शुरू हुई" लिखना ग़लत है। Code में यह
  `shop.foundingYear` (2016), `shop.legacyStartYear` (1973) और `legacy`
  से आता है — दोबारा मत लिखो।
- **"तीन पीढ़ियाँ" सच है, पर website पर अभी नहीं लिखनी।**
  Owner ने 31 Aug 2026 को बताया कि तीन पीढ़ियाँ असल में हैं —
  **दादा → Tarun Gupta → Sarthak** (अभी college में है, रोज़ दुकान पर बैठता है,
  आगे यही सँभालेगा)। फिर भी उन्होंने कहा *"generation भी हटा देते हैं चलो"* —
  इसलिए यह दावा **site से हटा दिया गया है**। बाद में owner कहें तो लगा दीजिए,
  तब तक नहीं। यह बात यहाँ इसलिए लिखी है ताकि दोबारा "confirm नहीं है" न समझा जाए।
- **"1973 से एक ही पता", "53 साल"** — ये अब भी confirm नहीं हैं। मत लिखो।
- **⛔ "आज का rate पूछिए" कभी मत लिखो** — न button पर, न meta description
  में, न कहीं और। Owner के शब्दों में: *"ये कोई सब्ज़ी मंडी नहीं है जो rate
  पता करने के लिए बोले website पे।"* दाम की बात counter पर होती है। इसकी
  जगह **stock और सलाह** की बात करो — "बता देंगे कि दुकान पर मौजूद है या
  नहीं", "आपके काम का कौन सा model रहेगा"।
- लिखने के बाद ख़ुद से पूछो: *"क्या यह उसी आवाज़ में है — 'हर सफ़र की शुरुआत
  एक भरोसे से होती है' ?"* अगर नहीं, दोबारा लिखो।

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
