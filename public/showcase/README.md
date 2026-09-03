# /showcase — scroll वाला cinematic page

यह सादा HTML/CSS/JS है (कोई framework नहीं), `10k-websites` skill के
engineering standard पर बना: seek gating, वो rAF loop जो काम ख़त्म होते ही सो
जाता है, DOM पर लिखना सिर्फ़ बदलाव पर, caption की नाप scroll की दूरी में, और
पाँचों हालतों (phone, portrait tablet, coarse pointer, लेटा हुआ phone,
reduce motion) में एक ठहरी हुई तस्वीर वाला hero.

## Video — जो अभी लगी हुई है

`assets/hero-scrub.mp4` — **17 सेकंड, 1280×720, 24fps, 8.0 MB**।
Owner की भेजी तीन 6-सेकंड की clips को **एक ही encode** में जोड़कर बनी है,
हर जोड़ पर आधे सेकंड का crossfade (इसलिए जोड़ दिखता नहीं):

1. रात में दुकान के सामने — गीली सड़क, अंदर जलती रोशनी, camera पास आता हुआ
2. दरवाज़े से अंदर — TV की क़तार, counter
3. Repair की मेज़ → counter पर डिब्बा हाथ में → fridge/washing machine की
   क़तार → बाहर रात की दुकान, जहाँ सफ़र ठहर जाता है

बनाने का पूरा command (raw1/2/3 = owner की तीन files):

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
सिर्फ़ उतना हिस्सा आस-पास के रंग से भर दिया गया — frame 16:9 का ही रहा,
और वहाँ का background तीनों में धुँधला था, इसलिए कुछ पता नहीं चलता।

Poster और आख़िरी frame:

```
ffmpeg -i assets/hero-scrub.mp4 -frames:v 1 -q:v 3 assets/hero-poster.jpg
ffmpeg -sseof -0.1 -i assets/hero-scrub.mp4 -update 1 -frames:v 1 -q:v 3 assets/hero-ending.jpg
```

### Video बदलनी हो तो तीन चीज़ें साथ बदलिए

1. `index.html` में `.hero{height:1000vh}` — 17 सेकंड के सफ़र की नाप scroll
   की दूरी में यही है। Video छोटी हो तो यह भी घटाइए (6 सेकंड ≈ 400vh)।
2. उसी file में चारों `data-band="a,b"` — ये video के असली पलों पर बैठे हैं
   (0–0.27 बाहर · 0.30–0.575 अंदर · 0.60–0.81 काम · 0.835–1 विदाई)।
3. `assets/app.js` में `VIDEO_BYTES` — loading वाली अँगूठी इसी से चलती है
   जब server `Content-Length` न भेजे।

📌 **Phone पर video माँगी ही नहीं जाती।** पाँचों हालतों (छोटी screen, खड़ा
tablet, छूने वाली उँगली, लेटा हुआ phone, reduce-motion) में hero ठहरी हुई
तस्वीर बनकर रह जाता है और 8 MB कभी download नहीं होते।

## ⚠️ Assets के पते

इस page के अंदर सारे पते **जड़ से** लिखे हैं (`/showcase/assets/...`), क्योंकि
यह `/showcase` पर बिना slash के चलता है और relative पते तब site की जड़ से
ढूँढ़े जाते हैं। अगर कभी यह folder किसी और जगह **site की जड़ पर** रखा जाए
(जैसे Hostinger पर अकेले), तो एक ही काम करना है: `/showcase/assets/` को
`assets/` से बदल दीजिए (index.html और app.js दोनों में)।
