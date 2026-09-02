# /showcase — scroll वाला cinematic page

यह सादा HTML/CSS/JS है (कोई framework नहीं), `10k-websites` skill के
engineering standard पर बना: seek gating, वो rAF loop जो काम ख़त्म होते ही सो
जाता है, DOM पर लिखना सिर्फ़ बदलाव पर, caption की नाप scroll की दूरी में, और
पाँचों हालतों (phone, portrait tablet, coarse pointer, लेटा हुआ phone,
reduce motion) में एक ठहरी हुई तस्वीर वाला hero.

## Video आने पर क्या करना है

1. मंज़ूर हुई video को इस command से encode कीजिए और `assets/hero-scrub.mp4`
   के नाम से यहीं रखिए:

   ```
   ffmpeg -i raw.mp4 -c:v libx264 -crf 18 -preset slow -g 8 -keyint_min 8 \
     -pix_fmt yuv420p -movflags +faststart -an assets/hero-scrub.mp4
   ```

2. `index.html` में एक line बदलिए:
   `window.HAS_HERO_VIDEO = false` को `true` कर दीजिए।

3. Poster और आख़िरी frame निकाल लीजिए:

   ```
   ffmpeg -i assets/hero-scrub.mp4 -frames:v 1 -q:v 2 assets/hero-poster.jpg
   ffmpeg -sseof -0.1 -i assets/hero-scrub.mp4 -update 1 -frames:v 1 -q:v 2 assets/hero-ending.jpg
   ```

बाक़ी कुछ नहीं बदलना। वही caption, वही पट्टियाँ, वही सफ़र, बस अब video पर।

## ⚠️ Assets के पते

इस page के अंदर सारे पते **जड़ से** लिखे हैं (`/showcase/assets/...`), क्योंकि
यह `/showcase` पर बिना slash के चलता है और relative पते तब site की जड़ से
ढूँढ़े जाते हैं। अगर कभी यह folder किसी और जगह **site की जड़ पर** रखा जाए
(जैसे Hostinger पर अकेले), तो एक ही काम करना है: `/showcase/assets/` को
`assets/` से बदल दीजिए (index.html और app.js दोनों में)।
