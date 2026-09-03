# हमारा सफ़र — तीन ज़माने की videos

Home page (और `/showcase`) पर "हमारा सफ़र" वाला हिस्सा इन्हीं तीन videos से
चलता है। Component: `components/JourneyScroll.tsx`, दिखावट: `app/globals.css`
का `.jrn-` वाला हिस्सा।

| file | कौन सा ज़माना | क्या दिखता है |
|---|---|---|
| `era-1973.mp4` | 1973 | Aggarwal Kiryana — किराना दुकान, अनाज के मर्तबान, बही-खाता |
| `era-2006.mp4` | 2006 | Aggarwal Kiryana & Communication — किराने के साथ recharge |
| `era-2016.mp4` | 2016 | Mobile World — आज का showroom, ग्राहकों से भरा |

तीनों **1120×630, 6 सेकंड, बिना आवाज़**। हर एक की एक **हल्की जुड़वाँ file**
भी है — `era-XXXX-sm.mp4`, 640×360 — वो छोटी screen पर आती है (कुल 1.6 MB,
बड़ी screen पर 5.3 MB)। साथ में उसी नाम की `.jpg`, जो video आने से पहले दिखती है।

```
ffmpeg -i era-XXXX.mp4 -vf scale=640:-2 -c:v libx264 -crf 30 -preset slow \
  -g 8 -keyint_min 8 -pix_fmt yuv420p -movflags +faststart -an era-XXXX-sm.mp4
```

## Owner की भेजी videos से ये कैसे बनीं

Owner ने 10-10 सेकंड की तीन videos भेजीं (1280×720, आवाज़ के साथ)।

```
ffmpeg -i raw.mp4 -filter_complex \
  "[0:v]delogo=x=1130:y=567:w=64:h=62,setpts=0.6*PTS,scale=1120:-2,format=yuv420p[v]" \
  -map "[v]" -r 24 -c:v libx264 -crf 25 -preset slow -g 8 -keyint_min 8 \
  -pix_fmt yuv420p -movflags +faststart -an era-XXXX.mp4

ffmpeg -ss 2.4 -i era-XXXX.mp4 -frames:v 1 -vf scale=1120:-2 -q:v 4 era-XXXX.jpg
```

- `delogo` — तीनों के नीचे दाईं तरफ़ AI बनाने वाले की ✦ मुहर थी, ठीक उसी
  जगह जहाँ पिछली बार थी (x 1136–1188, y 573–623)।
- `setpts=0.6*PTS` — 10 सेकंड को 6 सेकंड कर दिया। Scroll से चलने वाली video
  में "सेकंड" का मतलब नहीं होता, नाप scroll की दूरी में होती है — छोटी video
  का मतलब है कम download और कम scroll में पूरा सफ़र।
- `-an` — आवाज़ हटा दी। कोई scrub video आवाज़ नहीं चलाती।

## जो कभी मत तोड़िएगा

1. **Video blob बनाकर चलती है, सीधे पते से नहीं।** सीधे पते से हर seek एक
   अलग range request बन जाती है — 4G पर वो अटकती है, और कई जगह video
   seekable होती ही नहीं। पूरी file एक बार उतरती है, फिर scrub बिजली जैसा।
2. **जहाँ video पहले से खड़ी है वहीं seek मत भेजिए।** Browser तब कोई
   `seeked` नहीं भेजता और seek का दरवाज़ा हमेशा के लिए बंद रह जाता है।
   इसीलिए `Math.abs(currentTime - t) < 1/48` वाली जाँच लगी है।
3. **पहली video आते ही तस्वीर हटा दीजिए, तीनों का इंतज़ार मत कीजिए।**
   पहली परत ही पूरा frame ढकती है। पहले तीनों का इंतज़ार होता था और 5 MB
   उतरने तक ग्राहक को ठहरी हुई तस्वीर दिखती रहती थी।
4. **iPhone पर decoder जगाना पड़ता है।** जो video कभी चली ही नहीं, उसे seek
   करने पर कई बार ख़ाली frame आता है — इसलिए load होते ही एक बार चुपचाप
   चलाकर तुरंत रोक दिया जाता है।
5. **ठहरी हुई तस्वीरों वाला रूप सिर्फ़ दो हालतों में** — reduce-motion और
   बहुत छोटी लेटी हुई screen। ⚠️ ये नाप दो जगह लिखी हैं —
   `JourneyScroll.tsx` की `GATES` और `globals.css` का media query।
6. **इस हिस्से पर `content-visibility` मत लगाइए।** यह 540vh लंबा है; टलने पर
   page इसे 420px का समझता है और पास आते ही scrollbar हज़ारों pixel उछलता है।
