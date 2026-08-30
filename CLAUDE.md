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
- **Model:** एक ही physical shop। कोई branch नहीं।
- **Timings:** रोज़ सुबह 10 बजे से रात 10 बजे तक, सातों दिन
- **छुट्टी:** हर महीने की आख़िरी तारीख़ (28/29/30/31 — जो भी हो)।
  कोई weekly off नहीं।

### Services — ये करते हैं
EMI (cards और finance) · पुराना फ़ोन Exchange · Faridabad में Delivery ·
Mobile Repairing

### ⛔ ये नहीं करते — कभी मत लिखो (owner, 26 Aug 2026)

- **Installation नहीं करते। Service नहीं करते। दुकान सिर्फ़ सामान बेचती है।**
  "AC fitted and tested", "लगाकर, चलाकर दिखाते हैं", "Setup", "Wall mount",
  "Load check" — ऐसा कुछ भी मत लिखो। Code में `shop.services.installation`
  अब `false` है।
- **Warranty दुकान से नहीं, brand के service centre से मिलती है।** इसलिए
  "जो यहाँ से लिया, उसकी बात यहीं होगी" या "after sales support" जैसा कोई
  वादा मत करो। *(यह वजह भी page पर मत लिखो — बस वादा मत करो।)*
- **Repairing होती है, पर उसे बढ़ा-चढ़ाकर मत लिखो।** वो अलग department है,
  अलग service है। एक लाइन काफ़ी है — "Repairing की सुविधा भी दुकान पर है।"
  Screen/battery/water damage की list मत गिनाओ।

### Categories
Smartphones, Laptops & Tablets, Televisions, Air Conditioners,
Washing Machines, Refrigerators, Inverters & Batteries, Audio & Wearables,
Kitchen Appliances (Air Fryer, Microwave, Mixer), Accessories

पूरी website की इकलौती category list `data/shop.ts` के `categories` में है।
`navCategories` उसी से बनती है — दोबारा कहीं मत लिखो।

### Brands
Apple, Samsung, Xiaomi / Redmi, OnePlus, Vivo, Oppo, Motorola, Nothing,
iQOO, Realme, Tecno, Infinix, Lava, Nokia, Philips

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
- [ ] **Domain को Vercel से जोड़ना** — Vercel → Settings → Domains में
      `www.mobileworldfaridabad.com` और `mobileworldfaridabad.com` दोनों जोड़िए,
      `www` को primary रखिए। यह owner को dashboard से करना है।
- [ ] **Privacy page** CA या वकील से DPDP Act के हिसाब से check करवाना है।
      ये बात page पर ख़ुद लिखी हुई है।
- [ ] **Google Business Profile** verify करना, और हर महीने की आख़िरी तारीख़
      को "Special hours → Closed" set करना। **Website का schema GBP के hours
      control नहीं करता** — वो अलग जगह से आते हैं। ये न किया तो customer बंद
      दुकान पर पहुँचेगा।

### Owner से जवाब चाहिए — तब तक site पर मत लिखो

- [ ] **Payment के तरीक़े** — schema में अभी `Cash, UPI, Credit Card,
      Debit Card, EMI` लिखा है। ये **मानकर** लिखा है, पूछकर नहीं।
- [ ] **Delivery** — कितनी दूर तक? सिर्फ़ NIT Faridabad या पूरा Faridabad?
      मुफ़्त है या charge? कोई minimum amount?
- [ ] **Installation** — मुफ़्त या charge? AC / washing machine / TV का
      अलग-अलग?
- [ ] **Repair** — कौन सा काम उसी दिन, कौन सा 2–3 दिन? Repair पर कोई
      warranty (जैसे नए screen पर 1 महीना)?
- [ ] **Exchange** — कौन से brands? कितना पुराना तक? टूटी screen वाला फ़ोन
      लेते हैं या नहीं?
- [ ] **EMI** — कौन से banks/cards? कोई finance company (Bajaj वग़ैरह)?
- [ ] **Daikin** — preview के AC वाले alt text में Daikin **5 जगह** है, पर
      ऊपर brand list में नहीं। या तो list में जोड़ो, या alt text बदलो।
      और भी कोई brand रखते हों (LG, Voltas, Godrej, Whirlpool…) तो बताएँ।
- [ ] **GST number** site पर दिखाना है या नहीं — owner की मर्ज़ी
- [ ] **Redmi article का दाम** (₹27,999 / ₹30,999) रहने देना है?
      साफ़ लिखा है कि ये Xiaomi का official launch price है, दुकान का rate
      नहीं — फिर भी §8 कहती है दाम owner से पूछो।

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
- **"तीन पीढ़ियाँ", "1973 से एक ही पता", "53 साल"** — ये तीनों owner ने
  confirm नहीं किए। मत लिखो।
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
