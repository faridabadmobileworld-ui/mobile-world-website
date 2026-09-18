# Home page के सबसे ऊपर वाली video — दुकान बनती हुई

Owner ने 18 Sep 2026 को यह video भेजकर कहा:

> *"Website ke header me top me jo iphone 18 wala hissa h, use 100% completely
> badalkar usme ye animation daalo. full screen par aaye wo 16:9 screen ratio
> me. Scrolling me same effect aaya chahiye aage piche karte rhne par."*

इसलिए यहाँ पहले वाली iPhone वाली video की जगह **दुकान ख़ुद बनती हुई** दिखती
है — ख़ाली इमारत → brand के board → लाल "Mobile World" वाला अपना sign जलता
हुआ → जगमगाती दुकान। **कुछ भी बनाया हुआ नहीं है** — न shader, न drawing।
जो video owner ने दी, वही चलती है, उसी 16:9 नाप में, बिना काटे।

Component: `components/PhoneScrub.tsx` · दिखावट: `app/globals.css` का `.phv-` हिस्सा

| file | नाप | कब आती है |
|---|---|---|
| `shop.mp4` | 1280×720, 4.04 सेकंड, बिना आवाज़ — **1.25 MB** | बड़ी screen |
| `shop-sm.mp4` | 640×360 — **303 KB** | 860px से छोटी screen |
| `shop.jpg` | 1280×720 — 45 KB | video आने से पहले, और reduce-motion पर हमेशा |

## Owner की भेजी file से ये कैसे बनीं

Owner की file: **854×480, 4.04 सेकंड, 97 frames, 24 fps, 16:9, 1.82 MB**
(h264 + aac)। एक भी frame, नाप या रंग नहीं छुआ — सिर्फ़ तीन तकनीकी बातें:

```
ffmpeg -i raw.mp4 -vf "scale=1280:720:flags=lanczos,format=yuv420p" -r 24 \
  -c:v libx264 -crf 23 -preset slow -g 8 -keyint_min 8 -pix_fmt yuv420p \
  -movflags +faststart -an shop.mp4

ffmpeg -i raw.mp4 -vf "scale=640:360:flags=lanczos,format=yuv420p" -r 24 \
  -c:v libx264 -crf 29 -preset slow -g 8 -keyint_min 8 -pix_fmt yuv420p \
  -movflags +faststart -an shop-sm.mp4

ffmpeg -i shop.mp4 -frames:v 1 -q:v 4 shop.jpg
```

- **`scale=1280:720:flags=lanczos`** — owner की file 854×480 की थी। बड़ी screen
  पर 854px चौड़ी video धुँधली दिखती, इसलिए lanczos से 720p पर लाई गई। यह
  नई जानकारी नहीं जोड़ता, बस किनारे साफ़ रखता है।
- **`-an`** — आवाज़ हटाई। कोई scrub video आवाज़ नहीं चलाती, और वो बेवजह
  उतरती।
- **`-g 8`** — हर 8 frame पर एक पूरा frame, ताकि scroll पर seek तुरंत लगे।

⚠️ **इस video में ✦ मुहर नहीं थी।** तीन frames के नीचे-दाएँ कोने और आख़िरी
पूरे frame को खोलकर देखा गया — कहीं कुछ नहीं। इसलिए `delogo` **नहीं** लगाया।
पिछली videos में वो x 1136–1188, y 573–623 पर होती थी; नई video आए तो हर बार
वहाँ पहले जाँच लीजिए, ज़रूरी नहीं कि वही जगह हो।

📌 Video के अंदर brand के board हैं (vivo, honor, Samsung, Apple, Mi,
Motorola, Nokia) — ये दुकान के अपने board हैं, owner की अपनी भेजी file में।
Internet से उठाया हुआ कोई logo यहाँ नहीं है। कोई ऐसा दावा भी नहीं जो साबित
न हो सके — video में सिर्फ़ दुकान का अपना नाम लिखा है (§12 वाली जाँच हो चुकी)।

## जो कभी मत तोड़िएगा

1. **Video blob बनाकर चलती है, सीधे पते से नहीं।** सीधे पते से हर seek एक
   अलग range request बन जाती है — 4G पर वो अटकती है, और कई जगह video
   seekable होती ही नहीं। पूरी file एक बार उतरती है, फिर scrub बिजली जैसा।
2. **`src` लिखने के बाद `load()` मत बुलाइए।** `src` लिखते ही browser ख़ुद load
   शुरू कर देता है; `load()` उसी को रद्द कर देता है और वो request "aborted"
   गिनी जाती है (जाँच में यही `reqfail blob:` बनकर आता था)।
3. **जहाँ video पहले से खड़ी है वहीं seek मत भेजिए।** Browser तब कोई `seeked`
   नहीं भेजता और seek का दरवाज़ा हमेशा के लिए बंद रह जाता है। इसीलिए
   `Math.abs(currentTime - t) < 1/48` वाली जाँच लगी है।
4. **iPhone पर decoder जगाना पड़ता है** — load होते ही एक बार चुपचाप चलाकर
   तुरंत रोक दिया जाता है, वरना seek पर ख़ाली frame आता है। यह `loadeddata`
   के **अंदर** है, बाहर नहीं।
5. **`object-fit` बदलिए मत।** डिब्बा ख़ुद 16:9 का है और video भी — इसलिए
   न कुछ कटता है, न कोई काली पट्टी बनती है। डिब्बे की नाप का पूरा गणित
   `globals.css` के "HERO की आख़िरी और सही नाप" वाले हिस्से में लिखा है।
6. **इस हिस्से पर `content-visibility` मत लगाइए** — यह दो screen लंबा है।
7. **बड़ी screen पर भी यह चिपकता है और scroll से चलता है** (18 Sep 2026)।
   पहले वहाँ video अपने आप चलती थी; owner ने साफ़ कहा कि आगे-पीछे scroll
   करने पर वही असर हर जगह चाहिए। `globals.css` का सबसे आख़िरी block यही
   करता है — उसे ऊपर मत ले जाइएगा, वरना पहले वाला `position:static` जीत
   जाएगा।

## नई video आए तो

ऊपर वाले तीनों command दोबारा चला दीजिए, उन्हीं नामों से। Code में कुछ बदलने
की ज़रूरत नहीं। ⚠️ पहले नई video में ✦ मुहर की जगह ज़रूर जाँच लीजिए।
