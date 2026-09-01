# Finance companies के logo यहाँ रखिए

Owner ने 1 Sep 2026 को कहा: EMI वाली पट्टी में असली logo लगें।

**अभी logo यहाँ नहीं हैं** — इस environment से internet बंद है, इसलिए कोई
logo download नहीं किया जा सकता। और किसी company का logo internet से उठाकर
लगाना उनका trademark इस्तेमाल करना होता है — file उन्हीं से या owner से आनी
चाहिए (finance company अपने merchant को brand kit देती है)।

## File कैसी हो
- नाप: चौड़ाई 240px तक (ऊँचाई अपने आप)
- Background: पारदर्शी (transparent) या सफ़ेद
- Format: `.png` या `.webp`
- हर file 50 KB से कम

## नाम इसी तरह रखिए
```
bajaj.png · idfc.png · tvs.png · hdb.png · home-credit.png · axio.png · dmi.png
```

## फिर एक ही file बदलनी है
`data/finance.ts` में हर entry में logo का पता जोड़ दीजिए:

```ts
{ name: "Bajaj Finserv", logo: "/images/finance/bajaj.png" },
```

`FinanceStrip` अपने आप नाम की जगह logo दिखाने लगेगी — component या CSS में
कुछ नहीं बदलना पड़ेगा।

⚠️ Logo लगाते ही `/finance` page पर trademark वाली बात ज़रूरी हो जाती है।
वो पहले से लिखी हुई है (`app/finance/page.tsx` का disclaimer वाला हिस्सा) —
उसे हटाइए मत।
