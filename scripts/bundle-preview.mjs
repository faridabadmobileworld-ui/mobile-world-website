/**
 * Static export (`out/`) ko ek hi HTML file mein bundle karta hai.
 *
 * Kyun: owner ke paas abhi server nahi hai. Ek file browser mein seedha
 * khul jaati hai aur WhatsApp par bheji bhi ja sakti hai.
 *
 * Ye asli website nahi hai — sirf dekhne ke liye. Asli site `app/` se
 * banti hai aur usme har page ka apna URL hota hai.
 *
 * Chalane ka tareeka:
 *   EXPORT_PREVIEW=1 npm run build
 *   node scripts/bundle-preview.mjs
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
  ["/privacy", "privacy/index.html"],
];

const MIME = {
  ".webp": "image/webp", ".jpg": "image/jpeg", ".jpeg": "image/jpeg",
  ".png": "image/png", ".svg": "image/svg+xml", ".woff2": "font/woff2",
};

/** Ek local file ko data: URI mein badalta hai. */
const cache = new Map();
function dataUri(urlPath) {
  if (cache.has(urlPath)) return cache.get(urlPath);
  const clean = decodeURIComponent(urlPath.split("?")[0]);
  const file = join(OUT, clean.replace(/^\//, ""));
  if (!existsSync(file)) return null;
  const mime = MIME[extname(clean).toLowerCase()];
  if (!mime) return null;
  const uri = `data:${mime};base64,${readFileSync(file).toString("base64")}`;
  cache.set(urlPath, uri);
  return uri;
}

/**
 * Har image ka data sirf EK baar file mein jaata hai.
 *
 * Pehle har page apni copy inline karta tha, to 10 pages mein wahi
 * tasveer 10 baar जाती थी — 3.3 MB. Ab सारी images ek map mein hain
 * aur page load par JS unhe lagata hai.
 */
const used = new Map();

function inlineAssets(html) {
  // srcset ki zaroorat nahi — preview mein har image apne asli size par hai
  html = html.replace(/\ssrcset="[^"]*"/g, "");
  html = html.replace(/(src|href)="(\/[^"]+\.(?:webp|jpg|jpeg|png|svg))"/g, (m, attr, p) => {
    const clean = p.split("?")[0];
    if (!dataUri(clean)) return m;
    used.set(clean, dataUri(clean));
    return attr === "src" ? `data-img="${clean}" ${attr}=""` : `${attr}="${clean}"`;
  });
  return html;
}

/** Page ka <body> ka andar ka hissa nikalta hai. */
function bodyOf(html) {
  const m = html.match(/<body[^>]*>([\s\S]*)<\/body>/i);
  return m ? m[1] : html;
}

function titleOf(html) {
  const m = html.match(/<title>([\s\S]*?)<\/title>/i);
  return m ? m[1] : "Mobile World";
}

/**
 * Next ke apne scripts hata do — bundle mein woh chal hi nahi sakte.
 *
 * Do tarah ke hote hain: bahar wali chunk files, aur inline wale jo
 * `self.__next_f` mein data daalte hain. Loader hataने ke baad inline
 * wale crash karte hain, isliye dono जाने चाहिए.
 */
function stripNextRuntime(body) {
  return body
    .replace(/<script[^>]*\ssrc="\/_next\/[^"]*"[^>]*>\s*<\/script>/g, "")
    .replace(/<script(?![^>]*\ssrc=)[^>]*>(?:(?!<\/script>)[\s\S])*?__next_f[\s\S]*?<\/script>/g, "")
    .replace(/<script[^>]*id="__NEXT_DATA__"[\s\S]*?<\/script>/g, "");
}

const home = readFileSync(join(OUT, "index.html"), "utf8");

// Saari CSS ek jagah — sab pages ek hi stylesheet use karte hain.
const cssHrefs = [...home.matchAll(/<link[^>]+rel="stylesheet"[^>]+href="([^"]+)"/g)].map((m) => m[1]);
let css = "";
for (const href of cssHrefs) {
  const f = join(OUT, decodeURIComponent(href.split("?")[0]).replace(/^\//, ""));
  if (existsSync(f)) css += readFileSync(f, "utf8") + "\n";
}
// CSS ke andar ke url(...) bhi inline karo
css = css.replace(/url\((["']?)(\/[^)"']+)\1\)/g, (m, q, p) => {
  const d = dataUri(p);
  return d ? `url(${d})` : m;
});

/**
 * SVG sprite sirf EK baar.
 *
 * Har page apni copy laata hai. Dus copies ka matlab hai `bgSlate` jaisi
 * gradient id dus baar — aur `url(#bgSlate)` sabse pehli wali uthata hai,
 * jo chhupe hue page mein hoti hai. Isse saari drawings kaali ho jaati
 * thi. Isliye sprite ko sab pages se hataकर upar ek baar rakha jaata hai.
 */
const SPRITE_RE = /<svg width="0" height="0"[\s\S]*?<\/svg>/;
let sprite = "";

const views = PAGES.map(([route, file]) => {
  const raw = readFileSync(join(OUT, file), "utf8");
  let body = stripNextRuntime(bodyOf(raw));
  const found = body.match(SPRITE_RE);
  if (found && !sprite) sprite = found[0];
  body = body.replace(SPRITE_RE, "");
  return { route, title: titleOf(raw), html: inlineAssets(body) };
});

if (!sprite) throw new Error("SVG sprite nahi mila — bundle-preview.mjs dekhiye");

const favicon = dataUri("/icon.png") ?? "";

const page = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${views[0].title}</title>
${favicon ? `<link rel="icon" href="${favicon}">` : ""}
<meta name="robots" content="noindex">
<style>${css}</style>
<style>
  .pv-view{display:none}
  .pv-view.on{display:block}
  .pv-note{position:fixed;left:50%;bottom:70px;transform:translateX(-50%);z-index:200;
    background:#14142B;color:#fff;font:600 11.5px/1.5 Inter,system-ui,sans-serif;
    padding:7px 14px;border-radius:99px;opacity:.88;pointer-events:none;white-space:nowrap}
  @media(min-width:1000px){ .pv-note{bottom:16px} }
</style>
</head>
<body>
${sprite}
${views.map((v, i) => `<div class="pv-view${i === 0 ? " on" : ""}" data-route="${v.route}" data-title="${v.title.replace(/"/g, "&quot;")}">${v.html}</div>`).join("\n")}
<div class="pv-note">Preview — asli site par har page ka apna address hoga</div>
<script>
/* Saari images ek hi jagah — har page apni copy nahi rakhta. */
var IMG = ${JSON.stringify(Object.fromEntries(used))};
document.querySelectorAll('img[data-img]').forEach(function(el){
  var u = IMG[el.getAttribute('data-img')];
  if (u) el.src = u;
});
</script>
<script>
/* Chhota sa router: andar ke links page badalte hain, bahar ke (WhatsApp,
   call, map) waise hi chalte hain. Asli site par ye zaroorat nahi —
   wahan har page alag URL par hota hai. */
(function(){
  var views = [].slice.call(document.querySelectorAll('.pv-view'));
  function norm(p){ p = p.replace(/\\/+$/,''); return p === '' ? '/' : p; }

  function show(route){
    var target = views.filter(function(v){ return v.dataset.route === norm(route); })[0] || views[0];
    views.forEach(function(v){ v.classList.toggle('on', v === target); });
    document.title = target.dataset.title;
    window.scrollTo(0, 0);
    try { history.replaceState(null, '', '#' + target.dataset.route); } catch (e) {}
  }

  document.addEventListener('click', function(e){
    var a = e.target.closest('a');
    if (!a) return;
    var href = a.getAttribute('href') || '';
    if (!href.startsWith('/')) return;          // bahar ke links chhedo mat
    e.preventDefault();
    var hash = href.indexOf('#');
    var route = hash > -1 ? href.slice(0, hash) : href;
    show(route || '/');
    if (hash > -1) {
      var el = document.getElementById(href.slice(hash + 1));
      if (el) el.scrollIntoView({ block: 'start' });
    }
  });

  addEventListener('hashchange', function(){
    var h = location.hash.replace(/^#/, '');
    if (h) show(h);
  });

  var start = location.hash.replace(/^#/, '');
  if (start) show(start);
})();
</script>
</body>
</html>`;

writeFileSync(DEST, page);
const kb = Buffer.byteLength(page) / 1024;
console.log(`${DEST} — ${views.length} pages, ${kb.toFixed(0)} KB`);
