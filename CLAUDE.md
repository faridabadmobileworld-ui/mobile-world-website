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
- **Grievance नंबर:** +91 99533 35535 — यह **Tarun Gupta जी का सीधा नंबर** है,
  सिर्फ़ शिकायत के लिए। Owner ने 1 Sep 2026 को इसे Contact page पर डालने को कहा।
  ⚠️ यह दुकान का आम नंबर **नहीं** है — ग्राहक को हमेशा ऊपर वाला 93152 12131 ही
  दिखाइए। यह सिर्फ़ `/contact` के grievance वाले हिस्से में आता है।
  ⚠️ 31 Aug को इसे "बंद नंबर" समझकर एक banner से हटाया गया था — वो banner फिर भी
  ग़लत था (उसमें यह दुकान के मुख्य नंबर की तरह छपा था)।
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
**Finance और EMI** · **हमारी Team** · About · **Tech Blog & Guides** (posts) · Contact ·
दुकान पर आइए · **Privacy Policy** · **Terms & Conditions** ·
**Return और Exchange**

तीन नए page owner ने 1 Sep 2026 को Sachin का लिखा content देकर बनवाए —
`/repairing`, `/after-sales-support`, `/team`. उसी दिन शाम को
`/returns` भी जुड़ा — Return, Refund और Exchange के नियम।

📌 **Exchange और return की बात अब सिर्फ़ `/returns` पर है।** `/terms` पर सिर्फ़
उसका link है — दो जगह मत लिखिए।

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
   Phone पर ये cards **दो-दो की grid** में हैं (सिर्फ़ नाम), बड़ी screen पर
   तीन/चार की grid और नाम के नीचे एक line का परिचय — owner ने 2 Sep 2026 को
   कहा था कि list में ये बहुत बड़े लग रहे हैं।

📌 **ऊपर वाली strip का पहला button — "सारे Page"** (`.cs-pages`)। वही menu
खोलता है जिसमें सारे page हैं। Owner ने 2 Sep 2026 को कहा: home page पर कहीं
दिखता ही नहीं था कि और page भी हैं। यह button strip खिसकाने पर भी बाएँ चिपका
रहता है।

### हर page पर ये तीन चीज़ें ज़रूरी हैं (owner, 1 Sep 2026)

1. **Table of contents** — `<TableOfContents>` component. यह server पर ही
   बन जाती है (JavaScript से headings नहीं ढूँढ़ती), इसलिए Google को पहली
   बार में दिख जाती है। हर heading पर वही `id` लगाइए जो TOC की list में है।
2. **Author का नाम — `Written by: Sachin`।** `shop.authorName` से आता है।
   (हिन्दी "लिखा —" नहीं, owner ने 1 Sep 2026 को साफ़ कहा।)
   ⚠️ यह **page के सबसे आख़िर में** आता है, ऊपर नहीं — `<PageFoot>` ख़ुद लगा
   देता है। किसी page पर अलग से `<Byline>` मत लिखिए, वरना दो बार दिखेगा। Article के schema में भी यही author जाता है।
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
- [x] ~~**Delivery**~~ — owner ने 1 Sep 2026 को बताया: **delivery करते हैं, पर
      मुफ़्त नहीं।** भाड़ा ग्राहक देता है। Auto-rickshaw वग़ैरह का इंतज़ाम दुकान
      करवा देती है। *(कितनी दूर तक और कितना भाड़ा — यह अब भी नहीं पूछा गया।)*
- [ ] **Repair** — कौन सा काम उसी दिन, कौन सा 2–3 दिन? Repair पर कोई
      warranty (जैसे नए screen पर 1 महीना)?
- [x] ~~**KYC के नियम**~~ — owner ने 1 Sep 2026 को Sachin का लिखा content भेजा:
      Aadhaar, PAN, bank details के साथ **वही mobile number चालू हालत में** चाहिए
      जो दोनों से जुड़ा हो (OTP के लिए), और **जिसके documents लग रहे हैं उनका ख़ुद
      आना ज़रूरी है** (live photo + biometric)। `/finance` पर लिखा है।
- [ ] **Exchange पर पहचान पत्र** — Sachin के content में लिखा है कि Aadhaar
      ज़रूरी है। Owner ने ख़ुद यह नहीं कहा था, पर उन्हीं का भेजा content है, इसलिए
      `/returns` पर "साथ रखिए" के तौर पर लिखा है। Owner से एक बार पक्का कर लीजिए।
- [x] ~~**Exchange**~~ — owner ने 1 Sep 2026 को पूरी शर्त बताई: phone चेक करके
      उसकी **हालत के हिसाब से** value लगती है, और वो नए के दाम में से कम हो जाती
      है। **Bill या original डिब्बा — दोनों में से एक होना ज़रूरी है। दोनों न हों
      तो phone नहीं लेंगे।** यह `/terms` पर लिखा है।
- [x] ~~**EMI किन कंपनियों से**~~ — owner ने 1 Sep 2026 को list दी:
      **Bajaj, IDFC, TVS, HDB, Home Credit, Axio (Xiaomi Easy Finance), DMI।**
      `data/finance.ts` में हैं, home page के बीच में चलती हुई पट्टी बनती है।
- [x] ~~**Finance companies के असली logo**~~ — owner ने 1 Sep 2026 को ख़ुद भेज
      दिए, और सातों लग चुके हैं (`public/images/finance/`)। Home Credit, Axio और
      DMI अलग file के रूप में आए; Bajaj, IDFC, TVS और HDB **दुकान के अपने poster**
      में से काटे गए — इसलिए वो poster जितने ही साफ़ हैं। Brand kit से बेहतर file
      मिल जाए तो उसी नाम, उसी नाप में बदल दीजिए, code छूने की ज़रूरत नहीं।
      ⚠️ Logo internet से उठाकर कभी मत लगाइए — वो उनका trademark है, file
      owner से या company के brand kit से ही आनी चाहिए।
      पूरा तरीक़ा `public/images/finance/README.md` में है।
      📌 Owner के poster में **Samsung Finance, benow और pine labs** भी छपे हैं।
      वो owner की बताई सात वाली list में नहीं हैं, इसलिए site पर नहीं डाले —
      चाहिए हों तो पहले owner से पूछिए।

      **नाप का नियम:** हर logo 420×132 की सफ़ेद canvas पर बीच में बैठा है और
      website उसे 140×44 पर दिखाती है। CSS में नाप पक्की (`width`/`height`) रखी
      गई है — `max-width` से 2x/3x वाले phone पर logo अपने आप छोटा हो जाता था।

### 🎨 दिखावट और animation — 2 Sep 2026

Owner ने कहा: *"har jagah animations add karo... buttons ko thode designs do,
colours do, subtle sa hover... images me frames... 2 layers ho, ek background
wali aur ek scrolling wali."*

सब कुछ `app/globals.css` के आख़िरी हिस्से में है ("चमक-दमक वाली परत")।
**कोई नई library नहीं जोड़ी** — पूरा काम सिर्फ़ CSS से हुआ, इसलिए page भारी
नहीं हुआ (slow 4G पर home का LCP अब भी 1.8 सेकंड)।

तीन नियम जो इस हिस्से पर हमेशा लागू रहेंगे:

1. **कुछ भी छुपना नहीं चाहिए।** Scroll वाली animation सिर्फ़ उन browsers में
   चलती है जिनमें `animation-timeline: view()` है (Chrome, Edge, Safari) —
   इसीलिए वो पूरा हिस्सा `@supports` के अंदर है। Firefox में सब सीधा दिखता है।
2. **`prefers-reduced-motion` पर सब रुक जाता है।**
3. **Animation सिर्फ़ `main` के अंदर।** ⚠️ पहले `.panel` बिना `main` के लिखा
   था और animation का `transform:none` **drawer** पर भी लग गया — menu हर वक़्त
   खुला दिखने लगा था। नया selector लिखते समय `main` लगाना मत भूलिए।

क्या-क्या है: पीछे एक ठहरी हुई रंगीन परत (`.bgfx`, layout में) जो धीरे-धीरे
हिलती है · ऊपर पढ़ाई की पट्टी (`.prog`) · header, category strip, footer और
mobile bar अब अलग-अलग तैरते डिब्बे (काँच जैसा blur) · buttons पर gradient,
गहराई और hover पर चमक · तस्वीरों पर सफ़ेद frame और hover पर हल्का zoom ·
scroll पर text और cards का उभरना · heading के नीचे रंगीन धार (जिस heading के
साथ दाईं तरफ़ link नहीं है, वो बीच में — बाक़ी बाएँ)।

⚠️ **पढ़ने वाला पैराग्राफ़ कभी बीच में मत कीजिए** — heading बीच में ठीक लगती
है, पूरा पैराग्राफ़ नहीं।

### 📸 Instagram वाली पट्टी — home page पर

`components/InstagramFeed.tsx`, तस्वीरें `data/content.ts` के `instaTiles` में।

⚠️ **यह दुकान की अपनी photos दिखाती है, Instagram की live feed नहीं** — और
page पर कहीं यह दावा भी नहीं किया गया। असली feed के दो ही रास्ते हैं:
Meta का embed script (वो ग्राहक को track करता है — और हमारी Privacy Policy
में साफ़ लिखा है कि इस website पर कोई tracking नहीं है, तो पहले वो page
बदलना पड़ेगा) या Instagram का API token (owner के account से बनता है, समय-समय
पर बदलना पड़ता है)। Owner जो कहें, वो लगेगा।

Banner वाली तस्वीरें इसमें जान-बूझकर नहीं लीं — उनके अंदर के दावे और पुराना
नंबर अब भी ठीक नहीं हुए हैं।

### 📝 Tech Blog & Guides — `/posts`

Owner ने 2 Sep 2026 को कहा: *"nai jaankari, iske badalkar ye kardo. Tech Blog
& Guides."* इसलिए menu, footer, home page और hub — हर जगह अब यही नाम है।

अभी सात article हैं (`data/content.ts` के `posts` में):
`phone-exchange-guide` · `best-laptops-students` · `smart-tv-guide` ·
`inverter-vs-non-inverter-ac` · `ac-tonnage` · `new-phones` · `monthly-closure`

नया article जोड़ना हो तो सिर्फ़ दो जगह — `data/content.ts` में एक entry, और
`scripts/bundle-preview.mjs` में एक line। Sitemap, TOC, "और भी पढ़िए" और
verify script — सब अपने आप जुड़ जाते हैं (TOC article के `<h2 id="">` से बनती है)।

⚠️ इन articles में जो बातें **जान-बूझकर नहीं लिखीं**: AC/TV लगाना (installation
दुकान नहीं करती — बल्कि यह साफ़ लिखा है कि नहीं करते), "zero down payment",
"सबसे best value", और laptop/TV/AC के brand के नाम (owner से confirm नहीं हैं —
पूछकर जोड़े जा सकते हैं, SEO के लिए अच्छे रहेंगे)।

### 📄 Sachin के भेजे content में से जो जान-बूझकर नहीं लिया गया

Owner 1 Sep 2026 को pages का एक और draft लाए। उसमें कुछ बातें ऐसी थीं जो इस
site के अपने नियमों से टकराती हैं। ये **जान-बूझकर छोड़ी गई हैं** — दोबारा
"रह गई होंगी" समझकर मत जोड़िए:

- **"सबसे भरोसेमंद", "best mobile shop", "सबसे trusted destination"** — §12।
- **"1973 से Mobile World"** — Mobile World 2016 से है, §13।
- **Google Analytics और cookies वाली बात** (Privacy page के draft में थी) —
  site पर न analytics है, न cookies। झूठ लिखना privacy policy में सबसे
  ख़तरनाक है। लगाएँ तो पहले page बदलिए, फिर code।
- **"Zero down payment"** और **"No Cost EMI"** — owner से confirm नहीं।
- **"हम सभी finance companies के authorized merchant हैं"** — साबित नहीं कर सकते।
- **"Life-Long Support"** — इतना बड़ा वादा नहीं करना। जो सच में करते हैं वो
  `/after-sales-support` पर लिखा है।

### ⚖️ Trademark वाली बात — सिर्फ़ `/finance` पर

Owner ने 1 Sep 2026 को कहा: *"legal policies se bachne ke liye jahan b ye sab
likha jana chahiye wahan us page pe likh dena. but jahan zaroori ho only wahin,
sab jagah bina baat ke mat ghusana."*

इसलिए trademark वाला disclaimer **सिर्फ़ `/finance` page पर** है — वही इकलौता
page है जहाँ दूसरी कंपनियों के नाम और logo आते हैं। बाक़ी किसी page पर मत डालिए।
Logo लगने के बाद यह disclaimer और भी ज़रूरी हो जाता है — हटाइए मत।
- [ ] **"No Cost EMI" और tenure** — कितने महीने का plan मिलता है, no-cost सच
      में है या नहीं — यह अब भी confirm नहीं। इसलिए site पर नहीं लिखा।
- [x] ~~**ग्राहकों की photos**~~ — owner ने 1 Sep 2026 को confirm किया:
      *"हाँ, ग्राहकों से पूछकर ही डालते हैं photos या नाम वग़ैरह सब।"*
      यानी consent पहले से लिया जाता है। नई photo लगाते समय भी यही नियम रखिए।
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
