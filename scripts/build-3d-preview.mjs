/**
 * पूरी website को एक ही HTML file में पैक करता है — 3D समेत।
 *
 * चलाने का तरीक़ा:
 *   1) एक terminal में:  npm run build && npm start
 *   2) दूसरे में:        node scripts/build-3d-preview.mjs
 *
 * नतीजा: `preview/mobile-world.html` — एक अकेली file जो किसी भी फ़ोन या
 * laptop में खुल जाती है। न internet चाहिए, न server।
 *
 * यह असली website नहीं है (असली Vercel पर जाएगी) — यह सिर्फ़ दिखाने और
 * राय लेने के लिए है। इसीलिए तीन चीज़ें अलग हैं:
 *   • हर page का पता "#" के बाद आता है — ...html#/products
 *   • तस्वीरें और fonts file के अंदर ही घुसे हैं
 *   • Google को दिखने वाली असली addresses नहीं बनतीं
 *
 * बाक़ी सब असली है — वही components, वही 3D, वही physics।
 */

import { build } from "esbuild";
import sharp from "sharp";
import { mkdirSync, readFileSync, writeFileSync, statSync } from "node:fs";
import { readdir } from "node:fs/promises";
import path from "node:path";

const BASE = "http://localhost:3000";
const OUT_DIR = "preview";
const OUT_FILE = path.join(OUT_DIR, "mobile-world.html");

const kb = (n) => `${Math.round(n / 1024)} KB`;

/* ─────────────────────────────────────────────────────────────
   1. चलती हुई website से CSS और font के नाम लेना
   ───────────────────────────────────────────────────────────── */

async function fetchText(url) {
  const r = await fetch(url);
  if (!r.ok) throw new Error(`${url} → ${r.status}`);
  return r.text();
}

async function fetchBuffer(url) {
  const r = await fetch(url);
  if (!r.ok) throw new Error(`${url} → ${r.status}`);
  return Buffer.from(await r.arrayBuffer());
}

async function collectCss() {
  let html;
  try {
    html = await fetchText(`${BASE}/`);
  } catch {
    throw new Error(
      `${BASE} पर website नहीं चल रही।\n` +
        `पहले दूसरी terminal में चलाइए:  npm run build && npm start`,
    );
  }

  // <html class="..."> — font के नाम इसी में हैं
  const htmlClass = html.match(/<html[^>]*class="([^"]*)"/)?.[1] ?? "";
  const bodyClass = html.match(/<body[^>]*class="([^"]*)"/)?.[1] ?? "";

  const hrefs = [...new Set([...html.matchAll(/href="([^"]*\.css)"/g)].map((m) => m[1]))];
  let css = "";
  for (const href of hrefs) css += await fetchText(BASE + href);

  /*
    Font की files भी file के अंदर डालनी हैं, वरना preview में हिंदी टूट जाएगी।
    CSS में इनका पता "../media/..." लिखा होता है — यानी /_next/static/chunks/
    से एक क़दम पीछे। इसलिए पहले उसे पूरा पता बनाना पड़ता है।
  */
  const fontUrls = [
    ...new Set([...css.matchAll(/url\((\.\.\/media\/[^)"']+)\)/g)].map((m) => m[1])),
  ];
  let fontBytes = 0;
  for (const u of fontUrls) {
    const clean = `/_next/static/${u.replace(/^\.\.\//, "")}`;
    const buf = await fetchBuffer(BASE + clean);
    fontBytes += buf.length;
    const type = clean.endsWith(".woff2") ? "font/woff2" : "font/woff";
    css = css.split(u).join(`data:${type};base64,${buf.toString("base64")}`);
  }

  console.log(`  CSS ${kb(css.length)} · ${fontUrls.length} fonts (${kb(fontBytes)})`);
  return { css, htmlClass, bodyClass };
}

/* ─────────────────────────────────────────────────────────────
   2. तस्वीरें — सब file के अंदर
   ───────────────────────────────────────────────────────────── */

async function collectImages() {
  const map = {};
  let total = 0;

  const walk = async (dir, prefix) => {
    for (const name of await readdir(dir)) {
      const full = path.join(dir, name);
      if (statSync(full).isDirectory()) {
        await walk(full, `${prefix}/${name}`);
        continue;
      }
      if (!/\.(webp|png|jpe?g)$/i.test(name)) continue;
      const publicPath = `${prefix}/${name}`;

      // preview हल्का रखने के लिए तस्वीरें छोटी कर दी जाती हैं
      const isLogo = /logo/i.test(name);
      const buf = await sharp(full)
        .resize({ width: isLogo ? 240 : 1000, withoutEnlargement: true })
        .webp({ quality: isLogo ? 88 : 70 })
        .toBuffer();

      map[publicPath] = `data:image/webp;base64,${buf.toString("base64")}`;
      total += buf.length;
    }
  };

  await walk("public", "");
  console.log(`  तस्वीरें: ${Object.keys(map).length} (${kb(total)})`);
  return map;
}

/* ─────────────────────────────────────────────────────────────
   3. असली React + 3D को एक JavaScript file में बाँधना
   ───────────────────────────────────────────────────────────── */

/** next/* को preview वाले shims पर मोड़ने वाला plugin। */
const nextShims = {
  name: "next-shims",
  setup(b) {
    const to = (file) => path.resolve("scripts/preview/shims", file);
    const table = {
      "next/image": "image.tsx",
      "next/link": "link.tsx",
      "next/dynamic": "dynamic.tsx",
      "next/navigation": "navigation.ts",
    };
    b.onResolve({ filter: /^next\/(image|link|dynamic|navigation)$/ }, (args) => ({
      path: to(table[args.path]),
    }));

    /*
      Rapier अपनी .wasm file को package के बाहर नहीं निकलने देता, इसलिए
      एक बनावटी नाम से उसे सीधे disk से उठा लेते हैं।
    */
    b.onResolve({ filter: /^mw:rapier-wasm$/ }, () => ({
      path: path.resolve("node_modules/@dimforge/rapier3d-compat/rapier_wasm3d_bg.wasm"),
    }));
    // सिर्फ़ types के लिए है, चलने में कोई काम नहीं
    b.onResolve({ filter: /^next$/ }, () => ({ path: "next", namespace: "empty" }));
    b.onLoad({ filter: /.*/, namespace: "empty" }, () => ({ contents: "export default {}" }));
  },
};

async function bundleApp() {
  const result = await build({
    entryPoints: ["scripts/preview/entry.tsx"],
    bundle: true,
    minify: true,
    format: "iife",
    target: ["es2020"],
    platform: "browser",
    write: false,
    logLevel: "warning",
    jsx: "automatic",
    loader: { ".wasm": "binary" },
    plugins: [nextShims],
    define: {
      "process.env.NODE_ENV": '"production"',
      "process.env": "{}",
    },
    alias: { "@": path.resolve(".") },
  });

  const js = result.outputFiles[0].text;
  console.log(`  JavaScript: ${kb(js.length)} (three.js + physics + GSAP समेत)`);
  return js;
}

/* ─────────────────────────────────────────────────────────────
   4. सब जोड़कर एक file
   ───────────────────────────────────────────────────────────── */

const banner = `
<!--
  Mobile World — दिखाने के लिए बनाई गई एक ही file वाली copy.
  यह असली website नहीं है; असली www.mobileworldfaridabad.com पर जाएगी।
  यहाँ हर page का पता "#" के बाद आता है, जैसे  ...html#/products
-->`.trim();

async function main() {
  console.log("Mobile World — preview बना रहा हूँ\n");

  const [{ css, htmlClass, bodyClass }, images, js] = await Promise.all([
    collectCss(),
    collectImages(),
    bundleApp(),
  ]);

  /*
    <title> सबसे ऊपर रहना ज़रूरी है। जो जगहें इस file को दिखाती हैं, वो
    शुरू के कुछ हज़ार अक्षरों में ही नाम ढूँढ़ती हैं — और नीचे CSS इतनी लंबी
    है कि नाम कहीं दब जाता।
  */
  const html = `<title>Mobile World Faridabad</title>
${banner}
<style>${css}</style>

<div id="mw-root"></div>

<noscript>
  <div style="padding:2rem;color:#e8ecf5;font-family:system-ui;line-height:1.7">
    <h1 style="font-size:1.5rem;margin:0 0 .75rem">Mobile World</h1>
    <p>यह पन्ना देखने के लिए browser में JavaScript चालू होना चाहिए।</p>
    <p>दुकान पर बात करने के लिए: <a href="tel:+919315212131" style="color:#4cc9f0">+91 93152 12131</a></p>
  </div>
</noscript>

<script>
/*
  Font के नाम असली website पर <html> पर लगते हैं और वहीं से नीचे तक
  पहुँचते हैं। Preview में <html> हमारे हाथ में नहीं होता, इसलिए वो
  दोनों class body पर लगाई जाती हैं — किसी अंदर वाले div पर लगाने से
  body का अपना font पीछे छूट जाता है और हिंदी दूसरे font में दिखती है।
*/
document.body.className = (document.body.className + " " + ${JSON.stringify(`${htmlClass} ${bodyClass}`.trim())}).trim();
/* file के अंदर घुसी हुई तस्वीरें */
window.__MW_IMG = ${JSON.stringify(images)};
</script>

<script>${js}</script>
`;

  mkdirSync(OUT_DIR, { recursive: true });
  writeFileSync(OUT_FILE, html);

  const size = readFileSync(OUT_FILE).length;
  console.log(`\n✓ ${OUT_FILE} — ${(size / 1024 / 1024).toFixed(2)} MB`);
}

main().catch((err) => {
  console.error("\n✗", err.message);
  process.exit(1);
});
