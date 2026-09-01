# Finance companies के logo

Owner ने 1 Sep 2026 को कहा: EMI वाली पट्टी में असली logo लगें — और उसी दिन
logo भेज भी दिए। **सातों लग चुके हैं।**

| File | कहाँ से आई |
|---|---|
| `bajaj-finserv.webp` | दुकान के अपने poster में से काटी गई |
| `idfc-first-bank.webp` | दुकान के अपने poster में से काटी गई |
| `tvs-credit.webp` | दुकान के अपने poster में से काटी गई |
| `hdb-financial-services.webp` | दुकान के अपने poster में से काटी गई |
| `home-credit.webp` | owner ने अलग file भेजी |
| `axio.webp` | owner ने अलग file भेजी |
| `dmi-finance.webp` | owner ने अलग file भेजी |

## नाप — सातों एक जैसी हैं

हर file **420×132 px, सफ़ेद background** की है और logo उसके बीच में बैठा है।
एक ही नाप इसलिए रखी है कि चलती पट्टी में सब एक कतार में, एक जैसे दिखें।
Website उन्हें 140×44 पर दिखाती है — यानी नाप तीन गुनी है, ताकि आजकल के
phone (2x–3x screen) पर भी logo साफ़ रहे। सातों मिलाकर 45 KB से कम हैं।

## बेहतर file मिल जाए तो

Poster में से काटे गए चार logo उतने ही साफ़ हैं जितना poster था। अगर finance
company के brand kit से असली file मिल जाए, तो उसी नाम से, उसी 420×132 नाप में
बनाकर यहाँ रख दीजिए — और कहीं कुछ नहीं बदलना।

## नई company जोड़नी हो

1. logo इसी 420×132 नाप में बनाइए और यहाँ रखिए
2. `data/finance.ts` में एक line जोड़िए:
   ```ts
   { name: "XYZ Finance", logo: "/images/finance/xyz.webp" },
   ```

`logo` न लिखें तो पट्टी में उस company का **नाम** दिखने लगेगा — `FinanceStrip`
दोनों सँभाल लेती है। Component या CSS में कुछ नहीं बदलना पड़ता।

⚠️ Logo लगे होने की वजह से `/finance` page पर trademark वाली बात ज़रूरी है।
वो पहले से लिखी हुई है (`app/finance/page.tsx` का disclaimer वाला हिस्सा) —
उसे हटाइए मत।
