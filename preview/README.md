# Preview build

`index.html` एक ही file में पूरी website का preview है — इसे browser में
सीधे खोल कर देखा जा सकता है। ये **असली site नहीं** है; असली site Next.js
में बन रही है (`app/`)। ये सिर्फ़ design और content का reference है।

## इस file में क्या-क्या ठीक किया गया (24 Aug 2026 audit)

**Business facts**
- दुकान का registered नाम तीन अलग spelling में लिखा था → अब हर जगह
  "Aggarwal Kiryana And Communication"
- Phone number confirm हुआ: +91 93152 12131
- Schema में हर महीने की आख़िरी तारीख़ की छुट्टी जुड़ी (18 महीने आगे तक)

**Bugs**
- "Next closure" की date कभी आगे नहीं बढ़ती थी — condition dead code थी।
  अब closure वाले दिन अगले महीने की तारीख़ दिखती है।
- Open/closed का हिसाब visitor के phone की घड़ी से बनता था → अब
  Asia/Kolkata पर fixed
- Mobile menu का "Shop by category" section खाली था → 10 category links
- Category strip scroll पर header के ऊपर चढ़ जाती थी (phone पर 13px) →
  header की असली height अब JS नापता है
- 9 WhatsApp links customer को `&amp;` और `&Prime;` भेज रहे थे
- Mobile पर search box था ही नहीं → अब drawer में आ जाता है
- Article खुलने पर page पर कोई `h1` नहीं बचता था

**Copyright**
- Xiaomi की 15 official launch slides हटाई गईं (हमारा copyright नहीं था)।
  उनकी जगह page की अपनी coded SVG illustration है।
- Alt text से "best mobile shop in Faridabad" हटाया — unverifiable claim
  + keyword stuffing

**SEO**
- FAQ schema page पर दिखने वाले 6 सवालों से exactly match करता है
  (पहले 5 में से 4 match नहीं करते थे, और एक सवाल page पर था ही नहीं)
- Review schema → BlogPosting (Review में `reviewRating` ज़रूरी है, वो था नहीं)
- `og:image`, `og:url`, `twitter:image`, favicon, robots meta जोड़े

**Speed**
- 2.75 MB → 1.25 MB. Slow 4G पर load 14.3s → 6.6s
- Images WebP में, उतने ही size पर जितने दिखते हैं
- Font अब file के अंदर है — Google Fonts का blocking request हटा।
  पहले Google Fonts न पहुँचे तो page 15.9s तक सफ़ेद रहता था; अब 0.12s।

**Accessibility**
- Carousel में pause button (WCAG 2.2.2), dots पर `aria-current`,
  auto-rotate से screen reader पर होने वाला शोर बंद
- Call / WhatsApp / menu buttons 34–38px से 44px
- तीन जगह text contrast AA से नीचे था → अब पास

## अभी भी owner से चाहिए
- `geo` coordinates (Google Maps पर right-click → दो नंबर)
- `og-image.jpg` — 1200×630 दुकान की photo
- `logo.png`

---

## इस folder की बाक़ी files

| File | क्या है |
|---|---|
| `verify-suite.mjs` | 29 automated checks — Playwright से browser में चलते हैं |
| `apply-audit-fixes.py` | जिस script ने ये सारे fixes लगाए। Original upload से `fixed.html` बनाती है |

### Checks चलाने का तरीक़ा

```bash
npx http-server preview -p 8899 -s     # एक terminal में
node preview/verify-suite.mjs           # दूसरे में
```

29 में से एक भी fail हो तो script exit code 1 देती है। Preview में कुछ भी
बदलें तो ये चला लीजिए — पुरानी ग़लतियाँ चुपचाप वापस नहीं आएँगी।

`apply-audit-fixes.py` हर replacement का count check करती है। कुछ मैच न हुआ
तो वो साफ़ बताकर रुक जाती है, चुपचाप छोड़ती नहीं।
