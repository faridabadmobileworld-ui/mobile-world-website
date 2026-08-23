/**
 * दुकान की भेजी हुई photos को website के लायक़ बनाता है।
 *
 * चलाने का तरीक़ा:  node scripts/prepare-photos.mjs <uploads-folder>
 *
 * यह एक बार चलाने वाली script है। नतीजा public/ में चला जाता है और
 * git में commit हो जाता है, इसलिए हर build पर दोबारा चलाने की ज़रूरत नहीं।
 */
import sharp from "sharp";
import { mkdirSync } from "node:fs";
import { join } from "node:path";

const SRC = process.argv[2];
if (!SRC) {
  console.error("uploads folder बताइए");
  process.exit(1);
}

const OUT = "public/photos";
mkdirSync(OUT, { recursive: true });

/** हर photo: कौन सी file, क्या नाम, कितनी चौड़ी। */
const photos = [
  { from: "bc5b3fd1-image.webp", to: "storefront-night", width: 1440 },
  { from: "1af0c1f3-image.webp", to: "storefront-day", width: 1088 },
  { from: "c1e54e8b-image.jpg", to: "storefront-brands", width: 1351 },
  { from: "7f33b5e0-image.webp", to: "showroom", width: 1088 },
  { from: "68f512e6-image.webp", to: "iphone-display", width: 1088 },
  { from: "46bfe85f-image.webp", to: "customers-samsung", width: 1200 },
  { from: "fddd0ebf-image.webp", to: "customers-tv", width: 1080 },
  { from: "9e582f32-image.jpg", to: "customers-redmi", width: 1226 },
  { from: "4555f4c6-image.jpg", to: "customers-frame", width: 1080 },
  { from: "dc84c3a3-image.jpg", to: "customers-earphones", width: 1080 },
  { from: "52c049b0-image.jpg", to: "customers-gifts", width: 1280 },
  { from: "73c3a7de-image.png", to: "banner-brand", width: 1983 },
  { from: "fcbdc67c-image.png", to: "banner-legacy", width: 1672 },
];

console.log("── photos ──");
for (const p of photos) {
  const src = join(SRC, p.from);
  const dest = join(OUT, `${p.to}.webp`);
  const info = await sharp(src)
    .resize({ width: p.width, withoutEnlargement: true })
    .webp({ quality: 82 })
    .toFile(dest);
  console.log(
    `${p.to}.webp`.padEnd(28),
    `${info.width}x${info.height}`.padEnd(12),
    `${(info.size / 1024).toFixed(0)}KB`,
  );
}

/* ── logo ──
 * भेजी हुई logo file एक गोल profile picture है जिसमें owner की तस्वीर भी है।
 * Header के लिए उसमें से सिर्फ़ MW वाला चिह्न काटा गया है।
 */
const LOGO_SRC = join(SRC, "f1171f9f-image.png");

console.log("\n── logo ──");

// गोल कोनों वाला mask, ताकि चिह्न साफ़ चौकोर टुकड़े जैसा न लगे
const rounded = Buffer.from(
  `<svg width="400" height="400"><rect width="400" height="400" rx="88" ry="88" fill="#fff"/></svg>`,
);

const markInfo = await sharp(LOGO_SRC)
  .extract({ left: 180, top: 170, width: 420, height: 365 })
  .resize(400, 400, { fit: "cover" })
  .composite([{ input: rounded, blend: "dest-in" }])
  .png()
  .toFile("public/logo-mark.png");
console.log("logo-mark.png".padEnd(28), `${markInfo.width}x${markInfo.height}`);

// पूरा गोल logo — social share और app icon के लिए
const fullInfo = await sharp(LOGO_SRC)
  .resize(512, 512, { fit: "cover" })
  .png()
  .toFile("public/logo.png");
console.log("logo.png".padEnd(28), `${fullInfo.width}x${fullInfo.height}`);

// browser tab का icon
await sharp(LOGO_SRC).resize(180, 180, { fit: "cover" }).png().toFile("app/icon.png");
await sharp(LOGO_SRC).resize(180, 180, { fit: "cover" }).png().toFile("app/apple-icon.png");
console.log("app/icon.png + apple-icon.png  180x180");

/* ── social share की तस्वीर ──
 * जब कोई WhatsApp या Facebook पर website का link भेजेगा, यही दिखेगी।
 * Facebook/WhatsApp 1200x630 माँगते हैं।
 *
 * ध्यान: Next.js यहाँ सिर्फ़ jpg/jpeg/png/gif मानता है — webp नहीं चलता।
 */
const ogInfo = await sharp(join(SRC, "73c3a7de-image.png"))
  .resize(1200, 630, { fit: "cover", position: "left" })
  .jpeg({ quality: 86 })
  .toFile("app/opengraph-image.jpg");
console.log(
  "app/opengraph-image.jpg".padEnd(28),
  `${ogInfo.width}x${ogInfo.height}`,
  `${(ogInfo.size / 1024).toFixed(0)}KB`,
);
