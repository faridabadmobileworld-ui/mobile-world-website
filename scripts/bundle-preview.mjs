/**
 * Static export (`out/`) ko ek hi HTML file mein badalta hai.
 *
 * Kyun: owner ke paas abhi domain aur hosting nahi hai. Ek file browser
 * mein seedha khulti hai aur WhatsApp par bheji bhi ja sakti hai.
 *
 * Kaise: header, footer aur menu EK baar rakhe jaate hain; sirf har page
 * ka <main> badalta hai. Interactivity `scripts/preview-runtime.js` se
 * aati hai kyunki ek file mein React nahi chal sakta.
 *
 * Ye asli website nahi hai. Asli site `app/` se banti hai aur usme har
 * page ka apna address hota hai.
 *
 * Chalane ka tareeka:  npm run preview
 */

import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { join, extname } from "node:path";

const OUT = "out";
const DEST = "preview/index.html";

const PAGES = [
  ["/", "index.html"],
  ["/products", "products/index.html"],
  ["/about", "about/index.html"],
  ["/contact", "contact/index.html"],
  ["/visit", "visit/index.html"],
  ["/posts", "posts/index.html"],
  ["/posts/ac-tonnage", "posts/ac-tonnage/index.html"],
  ["/posts/new-phones", "posts/new-phones/index.html"],
  ["/posts/monthly-closure", "posts/monthly-closure/index.html"],
  ["/team", "team/index.html"],
  ["/repairing", "repairing/index.html"],
  ["/after-sales-support", "after-sales-support/index.html"],
  ["/privacy", "privacy/index.html"],
  ["/terms", "terms/index.html"],
];

const MIME = {
  ".webp": "image/webp", ".jpg": "image/jpeg", ".jpeg": "image/jpeg",
  ".png": "image/png", ".svg": "image/svg+xml", ".woff2": "font/woff2",
};

const cache = new Map();
function dataUri(urlPath) {
  if (cache.has(urlPath)) return cache.get(urlPath);
  const clean = decodeURIComponent(urlPath.split("?")[0]);
  const file = join(OUT, clean.replace(/^\//, ""));
  const mime = MIME[extname(clean).toLowerCase()];
  if (!existsSync(file) || !mime) return null;
  const uri = `data:${mime};base64,${readFileSync(file).toString("base64")}`;
  cache.set(urlPath, uri);
  return uri;
}

/**
 * Har image ka data sirf EK baar file mein jaata hai.
 * Warna wahi tasveer har page ke saath dobara jaati hai.
 */
const used = new Map();

function rewriteAssets(html) {
  html = html.replace(/\ssrcset="[^"]*"/g, "");
  return html.replace(/src="(\/[^"]+\.(?:webp|jpg|jpeg|png|svg))"/g, (m, p) => {
    const clean = p.split("?")[0];
    if (!dataUri(clean)) return m;
    used.set(clean, dataUri(clean));
    return `data-img="${clean}" src=""`;
  });
}

/** `/products/` jaise link ko `/products` bana deta hai. */
function tidyLinks(html) {
  return html.replace(/href="(\/[^"]*)"/g, (m, href) => {
    const [path, hash] = href.split("#");
    const clean = path.replace(/\/+$/, "") || "/";
    return `href="${clean}${hash ? "#" + hash : ""}"`;
  });
}

/**
 * Next ke apne scripts hata do.
 * Do tarah ke hote hain: bahar wali chunk files, aur inline wale jo
 * `self.__next_f` mein data daalte hain. Loader hatane ke baad inline
 * wale crash karte hain, isliye dono jaane chahiye.
 */
function stripNextRuntime(html) {
  return html
    .replace(/<script[^>]*\ssrc="\/_next\/[^"]*"[^>]*>\s*<\/script>/g, "")
    .replace(/<script(?![^>]*\ssrc=)[^>]*>(?:(?!<\/script>)[\s\S])*?__next_f[\s\S]*?<\/script>/g, "")
    .replace(/<script[^>]*id="__NEXT_DATA__"[\s\S]*?<\/script>/g, "")
    .replace(/<div hidden=""><!--\$--><!--\/\$--><\/div>/g, "");
}

const bodyOf = (h) => (h.match(/<body[^>]*>([\s\S]*)<\/body>/i) || [, h])[1];
const titleOf = (h) => (h.match(/<title>([\s\S]*?)<\/title>/i) || [, "Mobile World"])[1];
const mainOf = (h) => {
  const m = h.match(/<main id="main"[^>]*>([\s\S]*?)<\/main>/i);
  if (!m) throw new Error("<main> nahi mila — bundle-preview.mjs dekhiye");
  return m[1];
};

const homeRaw = readFileSync(join(OUT, "index.html"), "utf8");

// ── CSS ek jagah ────────────────────────────────────────────────────
let css = "";
for (const href of [...homeRaw.matchAll(/<link[^>]+rel="stylesheet"[^>]+href="([^"]+)"/g)].map((m) => m[1])) {
  const f = join(OUT, decodeURIComponent(href.split("?")[0]).replace(/^\//, ""));
  if (existsSync(f)) css += readFileSync(f, "utf8") + "\n";
}
css = css.replace(/url\((["']?)(\/[^)"']+)\1\)/g, (m, q, p) => dataUri(p) ? `url(${dataUri(p)})` : m);

// ── Har page ka <main> ──────────────────────────────────────────────
const views = {};
for (const [route, file] of PAGES) {
  const raw = readFileSync(join(OUT, file), "utf8");
  views[route] = {
    title: titleOf(raw),
    html: rewriteAssets(tidyLinks(stripNextRuntime(mainOf(raw)))),
  };
}

// ── Shell: header, footer, menu — sirf ek baar ──────────────────────
let shell = rewriteAssets(tidyLinks(stripNextRuntime(bodyOf(homeRaw))));
shell = shell.replace(/(<main id="main"[^>]*>)[\s\S]*?(<\/main>)/i, "$1$2");

/** JSON ko <script> ke andar surakshit rakhta hai. */
const js = (v) => JSON.stringify(v).replace(/</g, "\\u003c");

const runtime = readFileSync("scripts/preview-runtime.js", "utf8");
const favicon = dataUri("/icon.png") ?? "";

const page = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${views["/"].title}</title>
${favicon ? `<link rel="icon" href="${favicon}">` : ""}
<meta name="robots" content="noindex">
<style>${css}</style>
<style>
  /* Jis page par abhi hain, uska link nav mein highlight ho. */
  .cstrip a.pv-active,.drawer a.d.pv-active{background:var(--brand-soft);color:var(--brand)}
  .mbar a.pv-active{color:var(--brand)}
  .ftr a.pv-active{color:var(--ink);font-weight:700}
  .pv-searchnote{display:flex;flex-wrap:wrap;align-items:center;gap:10px;margin:0 0 16px;
    padding:12px 15px;background:var(--brand-soft);border-radius:var(--r);
    font-size:14px;font-weight:600;color:var(--ink)}
  .pv-clear{font:inherit;font-size:13px;color:var(--brand);text-decoration:underline;
    min-height:44px;display:inline-flex;align-items:center}
  .pv-note{position:fixed;left:50%;bottom:70px;transform:translateX(-50%);z-index:200;
    background:#14142B;color:#fff;font:600 11.5px/1.5 Inter,system-ui,sans-serif;
    padding:7px 14px;border-radius:99px;opacity:.86;pointer-events:none;white-space:nowrap}
  @media(min-width:1000px){ .pv-note{bottom:16px} }
  @media(prefers-reduced-motion:reduce){ .hs-s{transition:none} }
</style>
</head>
<body>
${shell}
<div class="pv-note">Preview — असली site पर हर page का अपना address होगा</div>
<script>
/* JSON ke andar "<" escape hota hai — page ke HTML mein JSON-LD ka
   closing script tag hota hai, jo warna is script ko jaldi band kar
   deta aur poora page toot jaata. */
window.__PV_IMG = ${js(Object.fromEntries(used))};
window.__PV_VIEWS = ${js(views)};
</script>
<script>
${runtime}
</script>
</body>
</html>`;

writeFileSync(DEST, page);
console.log(`${DEST} — ${Object.keys(views).length} pages, ${(Buffer.byteLength(page) / 1024).toFixed(0)} KB`);
