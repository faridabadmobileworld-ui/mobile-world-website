# `/showcase` की तस्वीरें और video

⚠️ **यह folder अब सिर्फ़ assets रखता है।** Page ख़ुद यहाँ नहीं है।

3 Sep 2026 को owner ने कहा:
*"Ye showcase hamari existing home page par jo b kuch h usi ko copy karke, fir
usi ko aisa 3d Scroll wala feel do na... yahan is showcase me kuch b nhi h."*

इसलिए `/showcase` अब सादा HTML नहीं, **एक असली Next.js route** है, और उस पर
**हूबहू वही home page** दिखता है — बस ऊपर scroll वाला video hero और पूरे page
पर गहराई वाली 3D चाल।

## कहाँ क्या है

| चीज़ | file |
|---|---|
| Route और metadata | `app/showcase/page.tsx` |
| Video वाला hero (scrub engine) | `components/CineHero.tsx` |
| Home page का पूरा content | `components/HomeBody.tsx` |
| दिखावट और 3D चाल | `app/globals.css` का आख़िरी हिस्सा (`.cine`) |
| Video, poster और तस्वीरें | यही folder (`assets/`) |

📌 **Content कभी दो जगह मत लिखिए।** `/` और `/showcase` दोनों `HomeBody` ही
दिखाते हैं। Home page पर कोई नई section जोड़िए — showcase पर अपने आप आ जाएगी।

## Video — जो लगी हुई है

`assets/hero-scrub.mp4` — **17 सेकंड, 1280×720, 24fps, 8.0 MB**।
Owner की भेजी तीन 6-सेकंड की clips को **एक ही encode** में जोड़कर बनी है,
हर जोड़ पर आधे सेकंड का crossfade:

1. रात में दुकान के सामने — गीली सड़क, अंदर जलती रोशनी, camera पास आता हुआ
2. दरवाज़े से अंदर — TV की क़तार, counter
3. Repair की मेज़ → counter पर डिब्बा हाथ में → fridge/washing machine →
   बाहर रात की दुकान, जहाँ सफ़र ठहर जाता है

```
ffmpeg -i raw1.mp4 -i raw2.mp4 -i raw3.mp4 -filter_complex "\
[0:v]delogo=x=1130:y=567:w=64:h=62,format=yuv420p,settb=AVTB,setpts=PTS-STARTPTS[a];\
[1:v]delogo=x=1130:y=567:w=64:h=62,format=yuv420p,settb=AVTB,setpts=PTS-STARTPTS[b];\
[2:v]delogo=x=1130:y=567:w=64:h=62,format=yuv420p,settb=AVTB,setpts=PTS-STARTPTS[c];\
[a][b]xfade=transition=fade:duration=0.5:offset=5.516[ab];\
[ab][c]xfade=transition=fade:duration=0.5:offset=11.032[v]" \
-map "[v]" -r 24 -c:v libx264 -crf 18 -preset slow -g 8 -keyint_min 8 \
-pix_fmt yuv420p -movflags +faststart -an assets/hero-scrub.mp4
```

`delogo` वाला हिस्सा क्यों: तीनों clips के नीचे दाईं तरफ़ (x 1136–1188,
y 573–623) AI बनाने वाले की ✦ वाली मुहर छपी थी। पूरी चौड़ाई काटने के बजाय
सिर्फ़ उतना हिस्सा आस-पास के रंग से भर दिया गया — frame 16:9 का ही रहा।

Poster और आख़िरी frame:

```
ffmpeg -i assets/hero-scrub.mp4 -frames:v 1 -q:v 3 assets/hero-poster.jpg
ffmpeg -sseof -0.1 -i assets/hero-scrub.mp4 -update 1 -frames:v 1 -q:v 3 assets/hero-ending.jpg
```

### Video बदलनी हो तो तीन चीज़ें साथ बदलिए

1. `app/globals.css` में `.sc-hero{height:1000vh}` — 17 सेकंड के सफ़र की नाप
   scroll की दूरी में यही है (6 सेकंड ≈ 400vh)।
2. `components/CineHero.tsx` के चारों `data-band="a,b"` — ये video के असली
   पलों पर बैठे हैं (0–0.27 बाहर · 0.30–0.575 अंदर · 0.60–0.81 काम ·
   0.835–1 विदाई)।
3. उसी file में `VIDEO_BYTES` — loading वाली अँगूठी इसी से चलती है जब server
   `Content-Length` न भेजे।

## भाषा

Hero की चारों caption **English** में हैं (owner ने 3 Sep 2026 को कहा था) और
नीचे का पूरा page हिन्दी में — क्योंकि वो home page ही है।

## जो कभी मत तोड़िएगा

- **Phone पर video माँगी ही नहीं जाती।** पाँचों हालतों (छोटी screen, खड़ा
  tablet, छूने वाली उँगली, लेटा हुआ phone, reduce-motion) में hero एक ठहरी
  हुई तस्वीर बन जाता है, और 8 MB कभी download नहीं होते।
  ⚠️ ये नाप **दो जगह** लिखी हैं — `CineHero.tsx` की `GATES` और `globals.css`
  का media query। एक बदले तो दूसरी भी बदलिए।
- **`.sc-` वाले नाम मत बदलिए।** पहले hero की classes `.cband`, `.ch1` वग़ैरह
  थीं और site की अपनी `.cband` (दुकान पर आइए वाला सफ़ेद card) से टकरा गईं —
  caption की जगह एक सादा भूरा डिब्बा दिखने लगा था।
- **3D चाल की नाप px में रखिए, % में नहीं।** % लंबे section के साथ बढ़ जाता है
  और आधा page viewport के बीच में भी मद्धम पड़ा रह जाता है।
- **Page के आख़िर वाले sections को पूरी entry दूरी मिलती ही नहीं** (नीचे scroll
  बचता नहीं)। इसीलिए नाप 200px रखी है और verify script page के बिलकुल नीचे
  जाकर जाँचती है कि कुछ मद्धम न रह जाए।
