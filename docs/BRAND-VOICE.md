# MOBILE WORLD — Brand Voice & Copy Standard

**Owner ने 25 Aug 2026 को approve किया। यही पूरी website की master voice है।**
नई copy लिखने से पहले यह पूरा पढ़िए। CLAUDE.md §13 इसी की तरफ़ इशारा करती है।

---

## 0. Master voice — reference post

यह owner का अपना approved post है। हर page इसी आवाज़ में बोलना चाहिए:

> हर सफ़र की शुरुआत एक भरोसे से होती है। ❤️
>
> हमारे परिवार का business सफ़र 1973 में Aggarwal Kiryana Store से शुरू हुआ।
> 2006 में यह सफ़र Aggarwal Kiryana & Communication के रूप में आगे बढ़ा और
> 2016 में इसी विरासत को आगे बढ़ाते हुए MOBILE WORLD की शुरुआत हुई।
>
> तब से लेकर आज तक, हमारे साथ जुड़े हर ग्राहक ने इस सफ़र को आगे बढ़ाने में अपना
> योगदान दिया है। हम उन सभी ग्राहकों का दिल से धन्यवाद करते हैं, जिन्होंने
> वर्षों से हम पर अपना भरोसा बनाए रखा और MOBILE WORLD को अपने परिवार का
> हिस्सा माना।
>
> आज भी हमारा प्रयास वही है — Genuine Products, सही Guidance और भरोसेमंद
> Customer Experience के साथ अपने ग्राहकों को बेहतर experience देना।

---

## 1. भाषा

- **हिन्दी main भाषा है, और हमेशा देवनागरी में।**
- Roman Hinglish में हिन्दी वाक्य **मत** लिखो — "Aaj ka rate poochiye" ग़लत है।
- जो English business/technical शब्द रोज़ बोले जाते हैं, वो English में ही रहें:
  business · products · service · experience · brand · model · stock · rate ·
  WhatsApp · Smartphone · Laptop · TV · AC · Refrigerator · Washing Machine ·
  Inverter & Batteries · Kitchen Appliances · GST Bill · Warranty · Exchange ·
  EMI · Installation · Support
- इन्हें ज़बरदस्ती हिन्दी में मत बदलो ("मूल्य दर", "प्रशीतक" — ऐसा कुछ नहीं)।

| | |
|---|---|
| ✅ सही | आज का rate WhatsApp पर पूछिए। |
| ❌ ग़लत | आज की मूल्य दर के संबंध में WhatsApp के माध्यम से जानकारी प्राप्त करें। |

---

## 2. Tone

ऐसा लगे जैसे **MOBILE WORLD ख़ुद ग्राहक से बात कर रही है** — गर्मजोशी से,
इज़्ज़त से, सादगी से, बिना शेखी के।

**कभी ऐसा मत लगने दो:** advertising agency · SEO agency · corporate brochure ·
generic ecommerce site · ज़बरदस्ती बेचता हुआ salesman।

ग्राहक को यह महसूस होना चाहिए:
*"ये लोग सिर्फ़ सामान बेचने की बात नहीं कर रहे। ये अपनी दुकान और अपने रिश्ते
की बात कर रहे हैं।"*

---

## 3. कहानी — तीन पड़ाव (यह कभी मत गड़बड़ाओ)

```
1973 — Aggarwal Kiryana Store               ← परिवार के business की शुरुआत
2006 — Aggarwal Kiryana & Communication
2016 — MOBILE WORLD                          ← MOBILE WORLD की शुरुआत
```

**1973 परिवार के सफ़र की शुरुआत है। MOBILE WORLD 2016 में शुरू हुई।**

❌ "Mobile World started in 1973."
❌ "Aggarwal Kiryana & Communication opened in 1973."
❌ "तीन पीढ़ियाँ" — owner ने generations की गिनती confirm नहीं की
❌ "1973 से एक ही पते पर" — यह भी confirm नहीं हुआ
❌ "53 साल" / "पचास साल" — जब तक सही context में गिना न गया हो

Code में यह `data/shop.ts` से आता है:
`shop.foundingYear = 2016` (schema की foundingDate यही है) और
`shop.legacyStartYear = 1973` (सिर्फ़ कहानी के लिए)। तीनों पड़ाव `legacy` में हैं।

---

## 4. दावे — जो साबित न हो सके वो मत लिखो

भरोसा adjectives से नहीं, **ठोस बातों** से आता है।

| ✅ लिखो | ❌ मत लिखो |
|---|---|
| पक्का GST Bill | 100% trusted |
| Brand Warranty | Best service |
| ख़रीदने से पहले product हाथ में लेकर देखिए | Unmatched quality |
| Stock और आज का rate पहले पूछ लीजिए | Number one store |
| Exchange valuation आपके सामने | Best in class / World class |
| | Unbeatable prices · One stop shop · Wide range |
| | Trusted by thousands · Customer satisfaction is our priority |

---

## 5. Products — कैसे लिखें

सीधे, बिना शोर के। उदाहरण:

> **📱 Smartphones**
>
> Apple, Samsung, OnePlus, Vivo, Oppo, Xiaomi और दूसरे leading brands के
> Smartphones।
>
> कौन सा model आपके लिए सही रहेगा, यह आपके budget और ज़रूरत पर depend करता है।
>
> दुकान पर आकर phone हाथ में लेकर देखिए। Display, weight और grip — ये photo में
> पूरी तरह समझ नहीं आते।
>
> 💬 Model बताइए, stock और आज का rate बता देंगे।

❌ "सबसे बेहतरीन Smartphones की शानदार range!"

---

## 6. सलाह — जानकार दुकानदार की तरह

- "Gaming के लिए सिर्फ़ RAM मत देखिए। Processor और cooling भी उतने ही important हैं।"
- "AC का tonnage सिर्फ़ कमरे के size से तय नहीं होता। धूप, floor और room की
  condition भी देखनी पड़ती है।"
- "TV बड़ा होना हमेशा बेहतर नहीं होता। Viewing distance के हिसाब से size चुनना
  ज़्यादा सही रहता है।"

कमज़ोरी छुपाओ मत:

- "इस model की battery अच्छी है, लेकिन heavy gaming के लिए यह हमारी पहली
  choice नहीं होगी।"
- "अगर आपकी priority camera है तो यह option देखिए। अगर gaming priority है तो
  दूसरा model बेहतर रहेगा।"

मक़सद **guidance** है, sale नहीं।

---

## 7. WhatsApp CTA

- 💬 आज का Rate पूछें
- 💬 दुकान को Message करें
- 💬 Model बताइए, Rate बता देंगे

Corporate CTA ("Enquire now", "Submit your requirement") मत लिखो।

---

## 8. Service

> "जो यहाँ से लिया, उसकी ज़रूरत पड़ने पर guidance भी यहीं मिलेगी।"

फिर सिर्फ़ वो services बताओ जो सच में हैं (`shop.services` देखो)। Repair,
Installation, Exchange, EMI, Delivery — इनमें से कोई भी promise सिर्फ़ इसलिए
मत लिखो कि marketing में अच्छा लगता है।

---

## 9. कभी मत बनाओ

- ग्राहकों की गिनती · सालों का तजुर्बा (confirmed timeline से बाहर)
- awards · authorization · dealership status
- service, delivery, installation या warranty का कोई वादा जो confirm नहीं हुआ
- **Tarun Gupta के नाम से कोई quote**
- "तीन पीढ़ियाँ" · "1973 से एक ही पता" · "53 साल"

जो confirm नहीं है, उसे छोड़ दो या owner से पूछने के लिए mark कर दो।

---

## 10. लिखने से पहले हर बार यह पूछो

> **"क्या यह MOBILE WORLD की उसी आवाज़ में है जिसमें यह लिखा गया था —**
> **'हर सफ़र की शुरुआत एक भरोसे से होती है। ❤️' ?"**

अगर नहीं, तो दोबारा लिखो।

पूरी website ऐसी लगनी चाहिए जैसे **एक ही brand ने हर page लिखा है** — अलग-अलग
SEO writers ने अलग-अलग हिस्से नहीं।
