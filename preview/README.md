# preview/

`index.html` — पूरी website एक ही file में, बिना server के देखने के लिए।
Browser में double-click कीजिए, सारे pages चलते हैं।

**यह असली website नहीं है।** असली site `app/` में है और वहाँ हर page का
अपना address होता है (`/products`, `/visit`, `/posts/ac-tonnage` …)। यह file
सिर्फ़ इसलिए बनती है ताकि domain और hosting लेने से पहले आप site देख सकें।

## दोबारा बनाने का तरीक़ा

```bash
npm run preview
```

यह `EXPORT_PREVIEW=1 next build` चलाकर पूरी site `out/` में static बनाती है,
फिर `scripts/bundle-preview.mjs` उसे एक file में जोड़ देती है।

## Site में कुछ बदलने के बाद जाँच

```bash
npm run build && npm start          # एक terminal में
node preview/verify-site.mjs        # दूसरे में — 48 checks
node preview/verify-preview.mjs     # bundle की जाँच — 30 checks
```

`verify-site.mjs` हर page को 320 / 390 / 768 / 1280 पर खोलकर देखती है —
console error, screen से बाहर निकलता content, टूटी images, ग़ायब alt text,
एक से ज़्यादा `h1`, header के ऊपर चढ़ती category strip, और 44px से छोटे
buttons। एक भी fail हो तो script रुक जाती है।

## असली site और इस preview में फ़र्क़

| | असली site | यह preview |
|---|---|---|
| Pages | अलग-अलग address | एक file, छोटा सा router |
| Images | अलग files, cache होती हैं | file के अंदर, हर बार साथ आती हैं |
| Size | home page ~397 KB | पूरी file 1.36 MB |
| Search | `/products?q=…` पर जाता है | बस page बदलता है |

इसीलिए preview असली site से भारी है — यह उसकी कमी नहीं, एक file में सब
कुछ डालने की क़ीमत है।
