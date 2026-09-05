# public/

ये files domain के root से serve होती हैं — यानी `public/og-image.jpg`
browser में `https://www.mobileworldfaridabad.com/og-image.jpg` पर मिलेगी।
Schema और meta tags इन्हीं URLs को point करते हैं, इसलिए नाम मत बदलिए।

| File | क्या है | कहाँ इस्तेमाल होती है |
|---|---|---|
| `logo.png` | 512×512 — owner का असली mark, पारदर्शी | `LocalBusiness` schema का `logo` |
| `favicon-64.png` · `favicon-32.png` | 64px / 32px square icon | Browser tab |
| `apple-touch-icon.png` | 180×180 | iPhone में "Add to Home Screen" |
| `og-image.jpg` | 1200×630 — दुकान की रात वाली photo | WhatsApp / Facebook / Instagram पर link की preview, `og:image` |
| `logo-source.png` | 1254×1254 — owner की भेजी असली file (काले background पर) | Source file — इसी से बाक़ी सब बनीं |
| `shop-exterior.webp` | owner की भेजी photo (720×340) | `og-image.jpg` इसी से बनी; preview के gallery में भी है |
| `brand-profile-original.png` | owner का circular brand graphic | Source file. Website पर **नहीं** — नीचे देखिए |

## तीन बातें ध्यान देने की

**1. Logo का background काटकर पारदर्शी किया गया है.**
Owner ने 3 Sep 2026 को असली logo वापस भेजा — लाल phone और globe वाला mark,
**काले background पर**। Website का header सफ़ेद है, इसलिए काला चौकोर वहाँ
नहीं चल सकता।

काटने का तरीक़ा: alpha चमक से बनाई गई (`alpha = चमक / 46`, ऊपर 1 पर रुकी),
और किनारे के pixel का रंग वापस खोला गया (`रंग ÷ alpha`) — वरना हर किनारे पर
काली झालर रह जाती। नतीजा सफ़ेद, हल्के धूसर और गहरे — तीनों background पर
जाँचा गया, कहीं झालर नहीं।

📌 **छोटे icon (favicon, iOS) काले गोल-किनारे वाले tile पर हैं।** 16px पर
पारदर्शी लाल mark browser की tab पट्टी में घुल जाता है; काले tile पर वो साफ़
दिखता है — और owner का अपना logo भी इसी रूप में है। iOS पारदर्शी icon को
वैसे भी काला कर देता है, इसलिए वहाँ यही सही है.

**2. `og-image.jpg` की quality सीमित है.**
Owner की भेजी दुकान की photo 720×340 की है। og:image के लिए 1200×630 चाहिए,
इसलिए इसे 1.85× बड़ा करना पड़ा — तस्वीर थोड़ी soft है। Facebook का minimum
(600×315) पार हो जाता है और sign साफ़ पढ़ा जाता है, पर अगर दुकान की
**1200 pixel या उससे चौड़ी** photo मिल जाए तो उससे बदल दीजिए — बस उसी नाम से।

**3. `brand-profile-original.png` website पर नहीं लगाई गई.**
उसमें "**BEST PRICE**" और "**TRUSTED BRAND**" लिखा है। ये वैसे ही दावे हैं
जैसे alt text वाला "best mobile shop in Faridabad" था, जिसे owner ने ख़ुद
हटवाया। इन्हें साबित नहीं किया जा सकता। उसमें owner की photo भी है और वो
circle में है — दोनों ही schema logo और favicon के लिए ठीक नहीं।

वो graphic **social media profile picture** के लिए बढ़िया है (WhatsApp
Business, Instagram, Facebook DP) — बस website के logo के तौर पर नहीं।
Website अब owner की भेजी साफ़ logo file (`logo-source.png`) इस्तेमाल करती है,
जिसमें कोई tagline नहीं है।

⚠️ 3 Sep 2026 को owner ने नया brand graphic भेजा — उसमें भी **"TRUSTED
BRAND", "BEST PRICE", "BETTER SERVICE"** लिखा है, और owner की photo भी है।
इसलिए वही नियम अब भी लागू है: file यहाँ रखी है, website पर नहीं लगती।
