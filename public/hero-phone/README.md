# Home page के सबसे ऊपर वाली video

Owner ने 7 Sep 2026 को यह video भेजकर साफ़ कहा:

> *"mujhe meri original same video chahiye yahan same to same Exactly jo maine
> di h 16:9 ratio me ye... ise exactly ise hi scrolling ke saath Animate karna
> h bina isme kuch b badli. jaise legacy ke liye 3 peedhiyo wali real video
> chalti najar aati h aage piche same waise hi."*

इसलिए यहाँ **कुछ भी बनाया हुआ नहीं है** — न shader, न drawing। जो video owner
ने दी, वही चलती है, उसी 16:9 नाप में, बिना काटे।

Component: `components/PhoneScrub.tsx` · दिखावट: `app/globals.css` का `.phv-` हिस्सा

| file | नाप | कब आती है |
|---|---|---|
| `iphone18.mp4` | 1280×720, 10 सेकंड, बिना आवाज़ — **2.4 MB** | बड़ी screen |
| `iphone18-sm.mp4` | 640×360 — **561 KB** | 860px से छोटी screen |
| `iphone18.jpg` | 1280×720 — 73 KB | video आने से पहले, और reduce-motion पर हमेशा |

## Owner की भेजी file से ये कैसे बनीं

```
ffmpeg -i raw.mp4 -filter_complex \
  "[0:v]delogo=x=1136:y=573:w=54:h=52,format=yuv420p[v]" \
  -map "[v]" -r 24 -c:v libx264 -crf 24 -preset slow -g 8 -keyint_min 8 \
  -pix_fmt yuv420p -movflags +faststart -an iphone18.mp4

ffmpeg -i iphone18.mp4 -vf scale=640:360 -c:v libx264 -crf 30 -preset slow \
  -g 8 -keyint_min 8 -pix_fmt yuv420p -movflags +faststart -an iphone18-sm.mp4

ffmpeg -ss 0.15 -i iphone18.mp4 -frames:v 1 -q:v 4 iphone18.jpg
```

Owner की भेजी file (1280×720, 10 सेकंड, आवाज़ के साथ, 3.6 MB) में **सिर्फ़ दो
चीज़ें बदलीं**, और दोनों तकनीकी हैं — video का एक भी frame, नाप या रंग नहीं छुआ:

- **`delogo`** — नीचे दाईं तरफ़ AI बनाने वाले की ✦ मुहर थी, ठीक उसी जगह जहाँ
  पिछली तीनों videos में थी (x 1136–1188, y 573–623)। सिर्फ़ उतना हिस्सा भरा गया।
  ⚠️ पहले यहाँ `boxblur` का patch भी आज़माया गया था — उससे साफ़ दिखने वाला
  धूसर चौकोर बन जाता था। सिर्फ़ `delogo` ही ठीक है।
- **`-an`** — आवाज़ हटाई। कोई scrub video आवाज़ नहीं चलाती, और वो 700 KB
  बेवजह उतरते।
- **`-g 8`** — हर 8 frame पर एक पूरा frame, ताकि scroll पर seek तुरंत लगे।

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
5. **`object-fit: contain` ही रहने दीजिए।** `cover` लगाने पर छोटी screen पर
   video के किनारे कट जाते हैं — और बाएँ कोने में ही "iPhone 18 Pro Max" लिखा है।
6. **इस हिस्से पर `content-visibility` मत लगाइए** — यह 230vh लंबा है।

## नई video आए तो

ऊपर वाले तीनों command दोबारा चला दीजिए, उन्हीं नामों से। Code में कुछ बदलने
की ज़रूरत नहीं। ⚠️ पहले नई video में ✦ मुहर की जगह जाँच लीजिए — हर बार वही
जगह हो, ज़रूरी नहीं।
