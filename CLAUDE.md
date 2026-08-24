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

### Services — ये सब करते हैं
Repair (screen, battery, charging port, software) · EMI (cards और finance) ·
पुराना फ़ोन Exchange · Faridabad में Delivery · Installation (fitted and tested)

### Categories
Mobiles, Laptops, Televisions, Air Conditioners, Inverters & Batteries,
Washing Machines, Air Fryers, Stabilizers, अन्य home appliances

### Brands
Apple, Samsung, Xiaomi / Redmi, OnePlus, Vivo, Oppo, Motorola, Nothing,
iQOO, Realme, Tecno, Infinix, Lava, Nokia, Philips

### Social links
- YouTube: https://youtube.com/@mobileworldfaridabad
- Instagram: https://instagram.com/mobileworldfaridabad2026
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
- `sitemap.xml` और `robots.txt` generate करो
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
- [x] ~~Repair / installation service करते हैं या नहीं~~ — हाँ, दोनों
- [x] ~~EMI / exchange offer करते हैं या नहीं~~ — हाँ, दोनों
- [x] ~~Google Maps listing का exact URL~~ — `data/shop.ts` में है
- [ ] **Map के geo coordinates** (latitude, longitude) — LocalBusiness schema
      के लिए ज़रूरी। Google Maps पर दुकान पर right-click कीजिए, सबसे ऊपर जो
      दो नंबर दिखें वही हैं। `data/shop.ts` → `geo` में डालने हैं।
- [ ] **`og-image.jpg`** — 1200×630 की दुकान की एक अच्छी photo। इसके बिना
      WhatsApp / Instagram / Facebook पर link share करने पर कोई preview
      नहीं दिखती।
- [ ] **Logo file** (`logo.png`) — schema और favicon के लिए
- [ ] Shop की और असली photos

---

## 11. Images — सिर्फ़ अपनी photos

Product images किसी brand की official launch slides, ads या marketing
material से **मत** लो। वो उनका copyright है। जो चीज़ दुकान में है उसकी
अपनी photo खींचो — वो ज़्यादा भरोसेमंद भी लगती है।

जिस चीज़ की photo नहीं है, उसके लिए code वाली SVG illustration इस्तेमाल
करो (जैसे preview में `#a-phone`, `#a-tv` हैं) — placeholder या किसी और
की image नहीं।

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
