# mobile-world-website

Official website of Mobile World, NIT Faridabad.

Next.js (App Router) + TypeScript + Tailwind CSS. Vercel पर deploy होती है।

## Local पर चलाने के लिए

```bash
npm install
npm run dev
```

फिर browser में http://localhost:3000 खोलिए।

## दुकान की जानकारी कहाँ बदलें

नाम, पता, phone number, categories, brands, social links — सब कुछ एक ही file में:

**`data/shop.ts`**

वहाँ बदलने से पूरी website में अपने आप बदल जाएगा। किसी और file में इन्हें
मत लिखिए।

## बाक़ी commands

```bash
npm run typecheck   # TypeScript की गलतियाँ जाँचें
npm run lint        # code style जाँचें
npm run build       # production build (जैसा Vercel बनाता है)
```
