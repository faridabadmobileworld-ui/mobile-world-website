/**
 * पूरी website का एक ही file वाला copy बनाता है, जिसे owner खोलकर देख सके
 * और किसी को भी भेज सके।
 *
 * चलाने का तरीक़ा:  npm run start  (दूसरी terminal में), फिर
 *                  node scripts/build-preview.mjs
 *
 * यह असली website नहीं है — असली Vercel पर deploy होगी। यह सिर्फ़ दिखाने
 * और राय लेने के लिए है। इसीलिए:
 *  - React हटा दिया गया, उसकी जगह छोटा सा साधा JavaScript है
 *  - तस्वीरें file के अंदर ही घुसा दी गई हैं, ताकि link कहीं भी खुले
 */
import sharp from "sharp";
import { readFileSync, writeFileSync } from "node:fs";

const BASE = "http://localhost:3000";
const PAGES = [
  { path: "/", label: "Home" },
  { path: "/products", label: "Products" },
  { path: "/visit-us", label: "Visit Us" },
  { path: "/about", label: "About" },
  { path: "/contact", label: "Contact" },
];

const get = async (p) => {
  const r = await fetch(BASE + p);
  if (!r.ok) throw new Error(`${p} → ${r.status}`);
  return r.text();
};

/* ── तस्वीरें ──
 * असली website पर हर फ़ोन को उसके नाप की तस्वीर मिलती है। यहाँ सब एक ही
 * file में हैं, इसलिए छोटी बनाकर डाली गई हैं — वरना link भारी हो जाएगा।
 */
const imgCache = new Map();
async function toDataUri(publicPath) {
  if (imgCache.has(publicPath)) return imgCache.get(publicPath);
  const file = `public${publicPath}`;
  const isLogo = publicPath.includes("logo");
  const buf = await sharp(file)
    .resize({ width: isLogo ? 200 : 900, withoutEnlargement: true })
    .webp({ quality: isLogo ? 85 : 72 })
    .toBuffer();
  const uri = `data:image/webp;base64,${buf.toString("base64")}`;
  imgCache.set(publicPath, uri);
  return uri;
}

/**
 * next/image वाले <img> पर सिर्फ़ एक नाम का निशान लगाता है।
 *
 * तस्वीर ख़ुद यहाँ नहीं डाली जाती — वो नीचे एक ही बार सूची में जाती है और
 * JavaScript उसे लगा देता है। वजह: एक ही तस्वीर कई pages पर आती है, और हर
 * बार पूरी डालने से file तीन गुना भारी हो जाती थी।
 */
function markImages(html) {
  const names = new Set();
  for (const m of html.matchAll(/\/_next\/image\?url=([^"'&\s]+)/g)) {
    names.add(decodeURIComponent(m[1]));
  }
  for (const publicPath of names) {
    const enc = encodeURIComponent(publicPath).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    html = html.replace(
      new RegExp(`srcSet="[^"]*${enc}[^"]*"`, "g"),
      `data-img="${publicPath}"`,
    );
    html = html.replace(
      new RegExp(`src="/_next/image\\?url=${enc}[^"]*"`, "g"),
      `data-img="${publicPath}"`,
    );
  }
  // srcSet और src दोनों बदले जाते हैं, इसलिए एक ही tag पर निशान दो बार लग
  // जाता है — दूसरा हटा दो
  html = html.replace(/(data-img="[^"]*")\s+data-img="[^"]*"/g, "$1");
  return { html, names: [...names] };
}

const strip = (html) => html.replace(/<script[^>]*>[\s\S]*?<\/script>/g, "");

/* ── पेज इकट्ठे करो ── */
const first = await get("/");
const cssPath = first.match(/\/_next\/static\/[\w/.-]+\.css/)[0];
let css = await get(cssPath);

const bodyOf = (h) => h.split("<body", 1).length && h.split(/<body[^>]*>/)[1].split("</body>")[0];

// header, footer और नीचे की पट्टी हर page पर एक जैसे हैं — एक ही बार लो
const firstBody = bodyOf(first);
let header = firstBody.slice(firstBody.indexOf("<header"), firstBody.indexOf("</header>") + 9);

/*
 * फ़ोन का menu React तभी बनाता है जब वो खुला हो — इसलिए ऊपर से लिए गए HTML
 * में वो होता ही नहीं। यहाँ उसे ख़ुद जोड़ना पड़ता है, वरना menu button
 * दबाने पर कुछ नहीं होता।
 */
const menuLinks = PAGES.map(
  (p) =>
    `<li><a href="${p.path}" class="block rounded-lg px-3 py-3 text-base font-medium text-cream/90">${p.label}</a></li>`,
).join("");
header = header.replace(
  "</header>",
  `<nav id="mobile-menu" hidden class="border-t border-line/60 px-5 pb-4 sm:hidden"><ul class="pt-2">${menuLinks}</ul></nav></header>`,
);
const footerStart = firstBody.indexOf("<footer");
const tail = firstBody.slice(footerStart); // footer + sticky bar

const sections = [];
for (const page of PAGES) {
  const body = bodyOf(await get(page.path));
  const inner = body.slice(body.indexOf("</header>") + 9, body.indexOf("<footer"));
  sections.push(
    `<div class="mw-page" data-path="${page.path}"${page.path === "/" ? "" : " hidden"}>${inner}</div>`,
  );
  process.stdout.write(`${page.label} ✓  `);
}
console.log();

let html = [header, ...sections, tail].join("\n");
html = strip(html);

const marked = markImages(html);
html = marked.html;

// हर तस्वीर सिर्फ़ एक बार, एक सूची में
const imageMap = {};
for (const name of marked.names) imageMap[name] = await toDataUri(name);

/* ── अब वो सब जो React करता था, साधे JavaScript में ── */
const shader = readFileSync("components/AuroraCanvas.tsx", "utf8");
const VERT = shader.match(/const VERT = `([\s\S]*?)`;/)[1];
const FRAG = shader.match(/const FRAG = `([\s\S]*?)`;/)[1];

const js = `
(function(){
  var RM = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ── तस्वीरें लगाओ ── */
  var IMG = ${JSON.stringify(imageMap)};
  document.querySelectorAll('img[data-img]').forEach(function(el){
    var u = IMG[el.dataset.img];
    if (u) el.src = u;
  });

  /* ── page बदलना ── */
  var pages = [].slice.call(document.querySelectorAll('.mw-page'));
  function show(path){
    pages.forEach(function(p){ p.hidden = p.dataset.path !== path; });
    document.querySelectorAll('a[href]').forEach(function(a){
      var h = a.getAttribute('href');
      var on = h === path;
      if (h && h.charAt(0) === '/' && h.indexOf('//') !== 0) {
        a.setAttribute('aria-current', on ? 'page' : 'false');
        if (a.closest('nav')) {
          a.className = a.className
            .replace(/bg-electric\\/10|text-electric|text-muted|text-cream\\/90/g,'').trim()
            + (on ? ' bg-electric/10 text-electric' : ' text-muted');
        }
      }
    });
    window.scrollTo(0,0);
    setTimeout(reveal, 60);
  }
  document.addEventListener('click', function(e){
    var a = e.target.closest && e.target.closest('a[href^="/"]');
    if (!a) return;
    var h = a.getAttribute('href');
    if (h.indexOf('//') === 0 || h.indexOf('.') > -1) return;
    e.preventDefault();
    show(h);
    var m = document.getElementById('mobile-menu');
    if (m) m.hidden = true;
  });

  /* ── फ़ोन का menu ── */
  var btn = document.querySelector('button[aria-controls="mobile-menu"]');
  if (btn) btn.addEventListener('click', function(){
    var m = document.getElementById('mobile-menu');
    if (!m) return;
    m.hidden = !m.hidden;
    btn.setAttribute('aria-expanded', String(!m.hidden));
  });

  /* ── scroll पर उभरना ── */
  function reveal(){
    document.querySelectorAll('.mw-page:not([hidden]) .reveal').forEach(function(el, i){
      var r = el.getBoundingClientRect();
      if (r.top < window.innerHeight - 40) {
        if (!el.classList.contains('is-visible')) {
          el.style.transitionDelay = Math.min(i,6)*70 + 'ms';
          el.classList.add('is-visible');
        }
      }
    });
  }
  window.addEventListener('scroll', reveal, {passive:true});
  window.addEventListener('resize', reveal);
  reveal();

  /* ── "अभी खुला है" — भारत के समय से ── */
  function openState(now){
    var f = new Intl.DateTimeFormat('en-US',{timeZone:'Asia/Kolkata',year:'numeric',
      month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',hour12:false}).formatToParts(now);
    function g(t){ var p=f.find(function(x){return x.type===t}); return p?p.value:''; }
    var y=+g('year'), mo=+g('month'), d=+g('day');
    var mins=(+g('hour')%24)*60 + (+g('minute'));
    var t=new Date(y,mo-1,d); t.setDate(d+1);
    if (t.getMonth() !== mo-1) return {open:false, why:'monthly'};
    if (mins >= 540 && mins < 1380) return {open:true};
    return {open:false, why:'hours'};
  }
  function paintStatus(){
    var s = openState(new Date());
    document.querySelectorAll('[data-open-status]').forEach(function(el){
      el.innerHTML = '<span class="relative flex h-2 w-2">'
        + (s.open ? '<span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-whatsapp opacity-75"></span>' : '')
        + '<span class="relative inline-flex h-2 w-2 rounded-full ' + (s.open?'bg-whatsapp':'bg-muted') + '"></span></span>'
        + (s.open ? 'अभी खुला है · 11:00 PM तक'
                  : s.why === 'monthly' ? 'आज बंद है · महीने की आख़िरी तारीख़' : 'अभी बंद है');
      el.className = 'inline-flex items-center gap-2.5 rounded-full border px-4 py-1.5 text-sm font-medium backdrop-blur-sm '
        + (s.open ? 'border-whatsapp/40 bg-whatsapp/10 text-whatsapp' : 'border-line bg-surface/60 text-muted');
    });
  }
  paintStatus(); setInterval(paintStatus, 60000);

  /* ── 3D झुकाव ── */
  document.addEventListener('mousemove', function(e){
    if (RM) return;
    var c = e.target.closest && e.target.closest('.tilt-card');
    if (!c) return;
    var r = c.getBoundingClientRect();
    var x = (e.clientX-r.left)/r.width-0.5, y=(e.clientY-r.top)/r.height-0.5;
    c.style.transform = 'rotateY('+(x*12)+'deg) rotateX('+(-y*12)+'deg) translateZ(10px)';
  });
  document.addEventListener('mouseout', function(e){
    var c = e.target.closest && e.target.closest('.tilt-card');
    if (c) c.style.transform = '';
  });

  /* ── पीछे चलती हुई रोशनी (असली website वाला ही shader) ── */
  var VERT = ${JSON.stringify(VERT)};
  var FRAG = ${JSON.stringify(FRAG)};
  function startAurora(canvas){
    if (RM || canvas.dataset.on) return;
    canvas.dataset.on = '1';
    var gl = canvas.getContext('webgl',{antialias:false,alpha:false,powerPreference:'low-power'});
    if (!gl) return;
    function sh(t,s){ var o=gl.createShader(t); gl.shaderSource(o,s); gl.compileShader(o);
      return gl.getShaderParameter(o,gl.COMPILE_STATUS) ? o : null; }
    var v=sh(gl.VERTEX_SHADER,VERT), f=sh(gl.FRAGMENT_SHADER,FRAG);
    if(!v||!f) return;
    var pr=gl.createProgram(); gl.attachShader(pr,v); gl.attachShader(pr,f); gl.linkProgram(pr);
    if(!gl.getProgramParameter(pr,gl.LINK_STATUS)) return;
    gl.useProgram(pr);
    var b=gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER,b);
    gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,3,-1,-1,3]),gl.STATIC_DRAW);
    var loc=gl.getAttribLocation(pr,'p'); gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc,2,gl.FLOAT,false,0,0);
    var uRes=gl.getUniformLocation(pr,'u_res'), uTime=gl.getUniformLocation(pr,'u_time');
    var start=performance.now(), last=0;
    (function frame(now){
      requestAnimationFrame(frame);
      if (now-last < 33) return; last=now;
      if (!canvas.offsetParent) return;
      var s = innerWidth < 768 ? 0.5 : 0.75;
      var w=Math.max(1,(canvas.clientWidth*s)|0), h=Math.max(1,(canvas.clientHeight*s)|0);
      if (canvas.width!==w||canvas.height!==h){ canvas.width=w; canvas.height=h; gl.viewport(0,0,w,h); }
      gl.uniform2f(uRes,canvas.width,canvas.height);
      gl.uniform1f(uTime,(now-start)/1000);
      gl.drawArrays(gl.TRIANGLES,0,3);
    })(performance.now());
  }
  document.querySelectorAll('canvas').forEach(startAurora);
})();
`;

/* ── आख़िरी file ── */
// OpenStatus वाले खाली डिब्बों पर निशान लगाओ ताकि JavaScript उन्हें भर सके
html = html.replace(/<span class="block h-8" aria-hidden="true"><\/span>/g, '<span data-open-status></span>');

const out = `<title>Mobile World Faridabad</title>
<style>${css}</style>
<style>
  /* इस copy के लिए: असली website पर header fixed है, यहाँ भी वैसा ही रहे */
  .mw-page[hidden]{display:none}
  .mw-note{position:fixed;left:0;right:0;bottom:0;z-index:60;background:#0b1220;
    border-top:1px solid #1c2740;color:#8fa0bd;font-size:11px;line-height:1.5;
    padding:6px 14px calc(6px + env(safe-area-inset-bottom));text-align:center}
  @media (max-width:639px){ .mw-note{bottom:64px} }
</style>
${html}
<p class="mw-note">यह website का दिखाने वाला copy है — असली site Vercel पर live होगी</p>
<script>${js}</script>
`;

writeFileSync("/tmp/mobile-world-preview.html", out);
console.log(`बन गया: ${(Buffer.byteLength(out) / 1024 / 1024).toFixed(2)} MB`);
console.log(`तस्वीरें: ${imgCache.size}`);
