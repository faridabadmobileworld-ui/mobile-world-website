# Instagram की live feed चालू कैसे करें

Website के home page पर Instagram वाली पट्टी बन चुकी है। अभी वो **दुकान की
अपनी photos** दिखा रही है। नीचे लिखा एक काम करते ही वो **आपकी असली post और
reels** दिखाने लगेगी — हर घंटे अपने आप ताज़ा।

**कुल समय: 10–15 मिनट। एक बार का काम है।**

---

## पहले यह समझ लीजिए

Instagram किसी भी website को अपनी post सीधे नहीं उठाने देता। बीच में एक
"चाबी" (token) लगती है, जो Instagram ख़ुद आपको देता है। वही चाबी Vercel में
भरनी है। चाबी सिर्फ़ आपके account की post पढ़ती है — कुछ post कर नहीं सकती।

⚠️ **चाबी किसी को मत भेजिए, और WhatsApp पर मत डालिए।** सिर्फ़ Vercel में।

---

## Step 1 — Instagram account को Professional बनाइए

Instagram app → आपकी profile → ☰ → **Settings and privacy** →
**Account type and tools** → **Switch to professional account** →
**Business** चुनिए।

(यह मुफ़्त है, आपका account वैसा ही रहता है — बस website और insights वाली
सुविधाएँ चालू हो जाती हैं।)

## Step 2 — Meta पर एक app बनाइए

1. Computer पर खोलिए: **developers.facebook.com** → ऊपर **My Apps** →
   **Create App**
2. App का नाम: `Mobile World Website` — और अपना email
3. जब पूछे "What do you want your app to do?" → **Instagram** चुनिए
4. App बन जाने के बाद बाईं तरफ़ **Instagram → API setup with Instagram login**

## Step 3 — चाबी (token) निकालिए

उसी page पर:

1. **Generate access token** दबाइए
2. Instagram से login कीजिए (वही account — mobileworldfaridabad)
3. जो अनुमति माँगे, दे दीजिए
4. एक लंबी सी लाइन मिलेगी — वही चाबी है। **Copy** कर लीजिए।

### अगर आपका Instagram, Facebook Page से जुड़ा है

तो Business Manager वाला रास्ता भी चलता है (उसकी चाबी ख़त्म नहीं होती)। उस
हालत में **दो** चीज़ें भरनी होंगी — `IG_TOKEN` के साथ `IG_USER_ID` भी
(वो 17 अंकों की एक संख्या होती है, dashboard में "Instagram account ID" के
नाम से मिलती है)। Website दोनों तरह की चाबी अपने आप पहचान लेती है।

## Step 4 — Vercel में भर दीजिए

1. **vercel.com** → project **mobile-world-website** → ऊपर **Settings**
2. बाईं तरफ़ **Environment Variables**
3. नया जोड़िए:
   - Name: `IG_TOKEN`
   - Value: वही लंबी चाबी (paste)
   - Environments: तीनों पर टिक (Production, Preview, Development)
4. **Save**
5. ऊपर **Deployments** → सबसे ऊपर वाली पर तीन बिंदु → **Redeploy**

बस। एक-दो मिनट में website पर आपकी असली post दिखने लगेंगी।

---

## चाबी 60 दिन में ख़त्म हो जाती है

Instagram की यह चाबी दो महीने चलती है। उसके बाद पट्टी अपने आप दुकान की
photos पर लौट जाती है (website टूटती नहीं, बस feed पुरानी नहीं दिखेगी)।

दो रास्ते हैं:

- **आसान:** हर दो महीने में Step 3 और 4 दोहरा दीजिए (5 मिनट का काम)।
  Calendar में reminder लगा लीजिए।
- **एक बार का पक्का इंतज़ाम:** Meta Business Manager में एक "System User"
  बनाकर उसका token लिया जाए — वो ख़त्म नहीं होता। यह थोड़ा तकनीकी है;
  कहिए तो साथ बैठकर करवा दूँगा।

---

## अगर कुछ न दिखे

पट्टी दुकान की photos पर लौट आई है, इसका मतलब चाबी काम नहीं कर रही।
आम वजहें:

| दिक़्क़त | हल |
|---|---|
| चाबी 60 दिन पुरानी हो गई | Step 3–4 दोबारा |
| Account Professional नहीं है | Step 1 |
| Redeploy नहीं किया | Vercel → Deployments → Redeploy |
| चाबी copy करते समय आधी रह गई | दोबारा पूरी copy कीजिए |

Website कभी ख़ाली नहीं दिखेगी — चाबी न चले तो दुकान की photos अपने आप आ
जाती हैं।

---

## एक और रास्ता (पैसे वाला)

EmbedSocial, Elfsight जैसी company तैयार widget देती हैं — इसमें कोई चाबी
वग़ैरह नहीं लगती, पर:

- **महीने का किराया लगता है** (लगभग $29 से शुरू)
- वो अपना script चलाती हैं जो **आपके ग्राहक को track करता है** — और हमारी
  Privacy Policy में साफ़ लिखा है कि इस website पर कोई tracking नहीं है।
  वो लगाया तो पहले Privacy page बदलना पड़ेगा।
- Page थोड़ा भारी और धीमा हो जाता है

अपना वाला तरीक़ा मुफ़्त है, तेज़ है, और सच्चा है। इसीलिए यही बनाया।

---

## Developer के लिए (तकनीकी)

- Code: `lib/instagram.ts` (fetch + fallback), `components/InstagramFeed.tsx`
  (slider), `components/InstaArrows.tsx` (तीर)
- Env: `IG_TOKEN` ज़रूरी, `IG_USER_ID` मर्ज़ी से (default `me`)
- Endpoint: `graph.instagram.com/v23.0/{user}/media`, `limit=12`,
  `next: { revalidate: 3600 }`
- Token या network fail → `apniPhotos()` लौटता है, page कभी नहीं टूटता
- तस्वीरें Instagram के CDN से सीधे आती हैं (`unoptimized`), क्योंकि उनके
  पते हर घंटे बदलते हैं। यह बात Privacy page पर लिखी हुई है।
