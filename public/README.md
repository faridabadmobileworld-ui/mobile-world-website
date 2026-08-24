# public/

Ye files domain ke root se serve hoti hain — यानी `public/og-image.jpg`
browser में `https://www.mobileworldfaridabad.com/og-image.jpg` पर मिलेगी।
Schema और meta tags इन्हीं URLs को point करते हैं, इसलिए नाम मत बदलिए।

| File | क्या है | कहाँ इस्तेमाल होती है |
|---|---|---|
| `og-image.jpg` | 1200×630 — दुकान की रात वाली photo | WhatsApp / Facebook / Instagram पर link share करने की preview, `og:image` |
| `logo.png` | 512×512 — सिर्फ़ MW mark | `LocalBusiness` schema का `logo`, favicon |
| `shop-exterior.webp` | owner की भेजी असली photo (720×340) | `og-image.jpg` इसी से बनी; preview के store gallery में भी है |
| `brand-profile-original.png` | owner का पूरा brand graphic (1254×1254) | Source file. Website पर इस्तेमाल **नहीं** होती — नीचे देखिए |

## दो बातें ध्यान देने की

**1. `og-image.jpg` की quality सीमित है.**
Owner की भेजी photo 720×340 की है। og:image के लिए 1200×630 चाहिए, इसलिए
इसे 1.85× बड़ा करना पड़ा — तस्वीर थोड़ी soft है। Facebook का minimum
(600×315) पार हो जाता है और sign साफ़ पढ़ा जाता है, पर अगर दुकान की
**1200 pixel या उससे चौड़ी** photo मिल जाए तो उससे बदल दीजिए — बस उसी नाम से।

**2. `brand-profile-original.png` website पर नहीं लगाई गई.**
उसमें तीन चीज़ें हैं जो website के logo के लिए ठीक नहीं:
- **"BEST PRICE"** और **"TRUSTED BRAND"** लिखा है। ये वैसे ही दावे हैं जैसे
  alt text वाला "best mobile shop in Faridabad" था, जिसे owner ने हटवाया।
  इन्हें साबित नहीं किया जा सकता।
- owner की photo उसमें है। Schema का `logo` सिर्फ़ logo माँगता है, आदमी की
  तस्वीर नहीं।
- Circle में है, तो favicon में 16px पर कुछ पढ़ा नहीं जाएगा।

इसलिए `logo.png` में सिर्फ़ MW वाला mark काटा गया है — कोई tagline नहीं।

वो पूरा circular graphic **social media profile picture** के लिए बढ़िया है
(WhatsApp Business, Instagram, Facebook DP) — बस website के logo के तौर पर नहीं।

अगर designer से साफ़ logo मिल जाए — सिर्फ़ MW mark, transparent PNG, 512×512
या बड़ा — तो `logo.png` उससे बदल दीजिए। अभी वाला इसी graphic से काटा गया है,
इसलिए किनारे थोड़े soft हैं।
