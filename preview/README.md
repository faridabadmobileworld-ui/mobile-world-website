# preview/

`index.html` — पूरी website एक ही file में, बिना server के। Browser में
double-click कीजिए; सारे pages, buttons, slider और search चलते हैं।

**यह असली website नहीं है।** असली site `app/` में है और वहाँ हर page का
अपना address होता है (`/products`, `/visit`, `/posts/ac-tonnage` …)। यह file
सिर्फ़ इसलिए बनती है ताकि domain लेने से पहले आप site चला कर देख सकें।

## दोबारा बनाने का तरीक़ा

```bash
npm run preview
```

## जाँच

```bash
npm run build && npm start         # एक terminal में
node preview/verify-site.mjs       # दूसरे में — 48 checks (असली site)
node preview/verify-preview.mjs    # 113 checks (यह file)
```

`verify-preview.mjs` हर page खोलती है, हर अंदरूनी link पर click करती है,
slider के तीनों button और चारों dot दबाती है, pause सच में रोकता है या नहीं
यह 7 second रुक कर देखती है, menu खोलती-बंद करती है (veil, Escape, link),
search चला कर नतीजा गिनती है, और हर page को 320 / 390 / 768 / 1280 पर देखती
है। एक भी fail हो तो script रुक जाती है।

## असली site और इस preview में फ़र्क़

| | असली site | यह preview |
|---|---|---|
| Pages | अलग-अलग address | एक file, hash से (`#/visit`) |
| चलाने वाला code | React (`components/`) | `scripts/preview-runtime.js` |
| Images | अलग files, cache होती हैं | file के अंदर |
| Search | `/products?q=…` | वही, पर page reload नहीं |

`preview-runtime.js` सिर्फ़ इस file को चलाने के लिए है। **कुछ बदलना हो तो
`components/` बदलिए** — असली site वही है। दोनों जगह एक ही काम दो बार लिखा
है, यह जान-बूझकर है: एक file में React नहीं चल सकता।
