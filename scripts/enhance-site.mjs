/**
 * Owner की भेजी हुई website में 3D और motion जोड़ता है।
 *
 * चलाने का तरीक़ा:  node scripts/enhance-site.mjs <input.html> <output.html>
 *
 * नियम: owner का design, content और JavaScript कुछ नहीं हटाया जाता। सिर्फ़
 * जोड़ा जाता है — एक नया 3D section, और बाक़ी page पर animation।
 * साथ में कुछ तथ्य की गलतियाँ ठीक की जाती हैं (नीचे FIXES देखिए)।
 */
import { readFileSync, writeFileSync } from "node:fs";
import sharp from "sharp";

const [src, out] = process.argv.slice(2);
if (!src || !out) {
  console.error("इस्तेमाल: node scripts/enhance-site.mjs <input> <output>");
  process.exit(1);
}
let html = readFileSync(src, "utf8");
const before = html.length;

/* ─────────── 1. तथ्य की गलतियाँ ───────────
 * ये owner की अपनी CLAUDE.md और बाद में दी गई जानकारी से मेल नहीं खा रही थीं।
 */
const FIXES = [
  // "Mobile World est. 1973" — CLAUDE.md साफ़ मना करती है। Mobile World 2016 से है;
  // 1973 परिवार के किराना business की शुरुआत है।
  [/Est\. 1973\./g, "Family business since 1973 · Mobile World since 2016."],
  [/"foundingDate":"1973"/g, '"foundingDate":"2016"'],
  // दुकान का समय — owner ने 9 से 11 बताया, page पर 10 से 10 लिखा था
  [/"opens":"10:00","closes":"22:00"/g, '"opens":"09:00","closes":"23:00"'],
  [/रोज़ सुबह 10 से रात 10 बजे तक/g, "रोज़ सुबह 9 से रात 11 बजे तक"],
  [/सुबह 10 से रात 10/g, "सुबह 9 से रात 11"],
  [/10 AM\s*[–-]\s*10 PM/g, "9 AM – 11 PM"],
  [/10:00\s*[–-]\s*22:00/g, "09:00 – 23:00"],
  // Instagram — owner ने बाद में सही link भेजा
  [/instagram\.com\/mobileworldfaridabad2026/g, "instagram.com/mobileworldfaridabad"],
];
let fixCount = 0;
for (const [re, to] of FIXES) {
  const n = (html.match(re) || []).length;
  if (n) {
    html = html.replace(re, to);
    fixCount += n;
    console.log(`  ठीक किया ×${n}: ${String(re).slice(0, 46)}`);
  }
}

/* ─────────── 2. तस्वीरें ───────────
 * 3D फ़ोन की screen पर दुकान की असली तस्वीरें।
 */
const shots = {
  s1: "public/photos/iphone-display.webp",
  s2: "public/photos/showroom.webp",
  s3: "public/photos/storefront-night.webp",
  s4: "public/photos/customers-redmi.webp",
};
const IMG = {};
for (const [k, f] of Object.entries(shots)) {
  const buf = await sharp(f).resize({ width: 400 }).webp({ quality: 66 }).toBuffer();
  IMG[k] = `data:image/webp;base64,${buf.toString("base64")}`;
}

/* ─────────── 3. नया CSS ─────────── */
const CSS = `
/* ══════════════════════════════════════════════════════
   जोड़ा गया — 3D और motion
   Owner का मौजूदा CSS ऊपर जस का तस है, कुछ हटाया नहीं गया।
   ══════════════════════════════════════════════════════ */

/* ── scroll पर उभरना ── */
.mw-rise{opacity:0;transform:translateY(26px);
  transition:opacity .75s var(--ease),transform .75s var(--ease);will-change:opacity,transform}
.mw-rise.in{opacity:1;transform:none}

/* ── 3D झुकाव ── */
.mw-tilt{transform-style:preserve-3d;transition:transform .4s var(--ease)}

/* ── गिरते हुए टुकड़े ── */
.mw-fall{position:absolute;top:-8%;border-radius:50%;pointer-events:none;
  will-change:transform;opacity:.55}

/* ══ 3D flagship reel ══
 * ⚠ .reel पर overflow:hidden मत लगाना। वो अंदर की position:sticky को तोड़
 * देता है और पूरा हिस्सा काला डिब्बा बनकर रह जाता है। clipping सिर्फ़
 * .reel-sticky पर है। हल्के page के बीच यह गाढ़ा band जान-बूझकर full-width
 * रखा है — उसी से यह अलग दिखता है।
 */
.reel{position:relative;background:#0B0722;color:#EFEAFF;margin:26px 0;
  /* .wrap की चौड़ाई से बाहर निकलकर पूरे परदे पर फैलता है */
  margin-inline:calc(50% - 50vw);width:100vw}
.reel-sticky{position:sticky;top:0;height:100svh;overflow:hidden}
.reel-wash{position:absolute;inset:0;transition:background 1s var(--ease)}
.reel-orb{position:absolute;border-radius:50%;filter:blur(74px);opacity:.55;
  transition:background 1s var(--ease);will-change:transform}
.reel-orb.a{width:58vmin;height:58vmin;left:-13vmin;top:5vmin}
.reel-orb.b{width:50vmin;height:50vmin;right:-11vmin;bottom:6vmin}
.reel-big{position:absolute;inset:0 0 30svh;display:grid;place-items:center;padding:0 8px;
  font-family:'Inter',system-ui,sans-serif;font-weight:900;text-transform:uppercase;
  font-size:clamp(52px,17vw,200px);line-height:.82;letter-spacing:-.045em;
  text-align:center;white-space:pre-line;transition:opacity .45s,transform .45s var(--ease)}
.reel-big.out{opacity:0;transform:translateY(20px) scale(.97)}
.reel-big .hol{color:transparent;-webkit-text-stroke:2px currentColor}
/* फ़ोन ऊपर की तरफ़, ताकि नीचे लिखाई के लिए जगह बचे */
.reel-stage{position:absolute;inset:0 0 34svh;display:grid;place-items:center;perspective:1500px}
@media(min-width:768px){ .reel-stage{inset:0 0 28svh} }
/* बड़ी screen पर नीचे की पट्टी नहीं होती, इसलिए इतनी जगह नहीं चाहिए */
@media(min-width:768px){ .reel-copy{bottom:5svh} }
.reel-dev{position:absolute;transform-style:preserve-3d;opacity:0;
  transition:opacity .5s var(--ease);will-change:transform}
.reel-dev.live{opacity:1}
.reel-copy{position:absolute;left:0;right:0;bottom:calc(3svh + 62px + env(safe-area-inset-bottom));
  display:grid;place-items:center;padding:0 18px;z-index:5}
.reel-card{grid-area:1/1;max-width:440px;text-align:center;
  transition:opacity .45s var(--ease),transform .45s var(--ease)}
.reel-card.off{opacity:0;transform:translateY(14px);pointer-events:none}
.reel-card .kk{font-size:10px;font-weight:800;letter-spacing:.24em;text-transform:uppercase;opacity:.7}
.reel-card h3{font-size:clamp(20px,5.4vw,30px);font-weight:900;letter-spacing:-.03em;margin:7px 0 0}
.reel-card p{margin:8px 0 0;font-size:14px;line-height:1.6;opacity:.82}
.reel-chips{display:flex;gap:6px;justify-content:center;flex-wrap:wrap;margin-top:11px}
.reel-chips span{border:1px solid currentColor;opacity:.7;border-radius:99px;
  padding:4px 10px;font-size:11px;font-weight:700}
.reel-btns{display:flex;gap:8px;justify-content:center;flex-wrap:wrap;margin-top:15px}
.reel-btns a{display:inline-flex;align-items:center;gap:6px;padding:11px 22px;border-radius:99px;
  font-size:13px;font-weight:800;transition:transform .22s var(--ease)}
.reel-btns a:hover{transform:translateY(-2px)}
.reel-btns .f{background:#fff;color:#14142B}
.reel-btns .o{border:1.5px solid currentColor}
.reel-bar{position:absolute;left:0;right:0;bottom:0;height:3px;background:rgba(255,255,255,.14);z-index:6}
.reel-bar i{display:block;height:100%;width:0;background:linear-gradient(90deg,#7B5CF0,#4CC9F0)}
.reel-scroll{height:400svh}

/* ── फ़ोन के हिस्से ── */
.dv{position:relative;transform-style:preserve-3d}
.dv .fc{position:absolute;inset:0;border-radius:var(--dr,30px);
  transform-style:preserve-3d;backface-visibility:hidden}
.dv .fr{transform:translateZ(var(--dt,7px));padding:5px;
  box-shadow:0 52px 104px -36px rgba(0,0,0,.9)}
.dv .bk{transform:translateZ(calc(var(--dt,7px) * -1)) rotateY(180deg)}
.dv .sc{position:relative;height:100%;overflow:hidden;background:#000;
  border-radius:calc(var(--dr,30px) - 5px)}
.dv .sc img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
.dv .gl{position:absolute;inset:0;z-index:3;pointer-events:none;
  background:linear-gradient(116deg,rgba(255,255,255,.3),transparent 34%,transparent 68%,rgba(255,255,255,.1))}
.dv .rm{position:absolute;inset:0;border-radius:var(--dr,30px);z-index:4;pointer-events:none;
  box-shadow:inset 0 0 0 1.5px rgba(255,255,255,.2)}

/* 1 · Pro Max जैसा */
#dvA{width:min(38vw,168px);aspect-ratio:9/19.5;--dr:32px;--dt:7px}
#dvA .fr{background:linear-gradient(150deg,#cdc6ba,#4a4640 44%,#a8a094)}
#dvA .bk{background:linear-gradient(150deg,#d3ccc0,#514c45 46%,#aea695);border-radius:32px}
#dvA .isl{position:absolute;top:7px;left:50%;transform:translateX(-50%);
  width:29%;height:15px;background:#000;border-radius:11px;z-index:2}
#dvA .cam{position:absolute;top:4.5%;left:5.5%;width:36%;aspect-ratio:1;border-radius:26px;
  background:linear-gradient(150deg,#bdb6aa,#3b3833);padding:7.5%;
  display:grid;grid-template-columns:1fr 1fr;gap:6%;box-shadow:inset 0 0 0 1px rgba(255,255,255,.22)}
#dvA .cam i{border-radius:50%;background:radial-gradient(circle at 34% 30%,#727a8a,#080a0d 60%);
  box-shadow:inset 0 0 0 2px #2a2d33}
#dvA .cam i:nth-child(4){background:radial-gradient(circle at 40% 36%,#fff8e6,#c9bda0 70%);opacity:.85}

/* 2 · Ultra जैसा */
#dvB{width:min(38vw,170px);aspect-ratio:9/19.6;--dr:16px;--dt:6px}
#dvB .fr{background:linear-gradient(150deg,#5f4d8c,#1a1526 46%,#493c70)}
#dvB .bk{background:linear-gradient(150deg,#6e5a9c,#1e182b 48%,#4e3f77);border-radius:16px}
#dvB .lens{position:absolute;left:11%;width:15%;aspect-ratio:1;border-radius:50%;
  background:radial-gradient(circle at 34% 30%,#818aa4,#06070b 62%);box-shadow:inset 0 0 0 2.5px #2b2f3d}
#dvB .pen{position:absolute;right:-3px;bottom:8%;width:6px;height:34%;border-radius:4px;
  background:linear-gradient(180deg,#9384c6,#3c335c);transition:transform .5s var(--ease)}
#dvB .pun{position:absolute;top:9px;left:50%;transform:translateX(-50%);
  width:9px;height:9px;border-radius:50%;background:#000;z-index:2}

/* 3 · Fold — scroll पर खुलता है */
#dvC{width:min(62vw,250px);aspect-ratio:1/1.12;transform-style:preserve-3d}
#dvC .bk2{position:absolute;inset:0;display:flex;transform-style:preserve-3d}
#dvC .lf{position:relative;width:50%;height:100%;transform-style:preserve-3d}
#dvC .lfL{transform-origin:right center;will-change:transform}
#dvC .pn{position:absolute;inset:0;border-radius:9px;overflow:hidden;backface-visibility:hidden;
  background:linear-gradient(150deg,#20242e,#0b0d12);box-shadow:inset 0 0 0 1.5px rgba(255,255,255,.18)}
#dvC .pn img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
#dvC .pnB{transform:rotateY(180deg);background:linear-gradient(150deg,#2b3040,#0d1016)}
#dvC .cov{position:absolute;inset:0;display:grid;place-items:center;
  font-size:11px;font-weight:900;letter-spacing:.2em;color:#7d8495}
#dvC .hg{position:absolute;left:50%;top:0;bottom:0;width:5px;z-index:5;
  transform:translateX(-50%) translateZ(1px);border-radius:3px;
  background:linear-gradient(90deg,#0a0c11,#3f4757,#0a0c11)}

/* ── तस्वीर बड़ी करके देखना ── */
.mw-lens{position:fixed;inset:0;z-index:200;background:rgba(11,7,34,.94);
  display:grid;place-items:center;padding:20px;opacity:0;pointer-events:none;
  transition:opacity .3s var(--ease)}
.mw-lens.on{opacity:1;pointer-events:auto}
.mw-lens img{max-width:100%;max-height:86vh;border-radius:var(--r-lg);
  transform:scale(.94);transition:transform .35s var(--ease)}
.mw-lens.on img{transform:none}
.mw-lens .x{position:absolute;top:16px;right:16px;width:42px;height:42px;border-radius:50%;
  background:rgba(255,255,255,.14);color:#fff;display:grid;place-items:center;font-size:20px}

/* ── जिनके फ़ोन में animation बंद है ── */
@media(prefers-reduced-motion:reduce){
  .mw-rise{opacity:1;transform:none;transition:none}
  .mw-tilt,.reel-dev,.reel-big,.reel-card,#dvC .lfL,#dvB .pen{transition:none!important}
  .mw-fall{display:none}
}
`;

/* ─────────── 4. नया HTML — 3D reel ─────────── */
const REEL_HTML = `
<!-- ══ जोड़ा गया: 3D flagship reel ══ -->
<section class="reel" id="flagships" aria-label="Flagship phones in 3D">
  <div class="reel-scroll">
    <div class="reel-sticky">
      <div class="reel-wash" id="rw"></div>
      <div class="reel-orb a" id="ro1"></div>
      <div class="reel-orb b" id="ro2"></div>
      <p class="reel-big" id="rb" aria-hidden="true"></p>

      <div class="reel-stage">
        <div class="reel-dev live" id="dvA">
          <div class="dv" style="position:absolute;inset:0">
            <div class="fc fr"><div class="sc"><img src="${IMG.s1}" alt=""><span class="isl"></span><span class="gl"></span></div></div>
            <div class="fc bk"><span class="cam"><i></i><i></i><i></i><i></i></span></div>
            <span class="rm"></span>
          </div>
        </div>

        <div class="reel-dev" id="dvB">
          <div class="dv" style="position:absolute;inset:0">
            <div class="fc fr"><div class="sc"><img src="${IMG.s2}" alt=""><span class="pun"></span><span class="gl"></span></div></div>
            <div class="fc bk"><span class="lens" style="top:6%"></span><span class="lens" style="top:22%"></span><span class="lens" style="top:38%"></span></div>
            <span class="pen" id="rpen"></span>
            <span class="rm"></span>
          </div>
        </div>

        <div class="reel-dev" id="dvC">
          <div class="bk2">
            <div class="lf lfL" id="rleaf">
              <div class="pn"><img src="${IMG.s3}" alt=""></div>
              <div class="pn pnB"><span class="cov">MOBILE WORLD</span></div>
            </div>
            <div class="lf"><div class="pn"><img src="${IMG.s4}" alt=""></div></div>
            <span class="hg"></span>
          </div>
        </div>
      </div>

      <div class="reel-copy" id="rc"></div>
      <div class="reel-bar"><i id="rbar"></i></div>
    </div>
  </div>
</section>
`;

/* ─────────── 5. नया JavaScript ─────────── */
const JS = `
<script>
/* ══════════════════════════════════════════════════════
   जोड़ा गया — 3D reel, scroll animation, tilt, गिरते टुकड़े
   Owner का अपना JavaScript ऊपर जस का तस है।
   ══════════════════════════════════════════════════════ */
(function(){
var RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
var TEL='tel:+919315212131', WA='https://wa.me/919315212131';

/* ── scroll पर उभरना ── */
(function(){
  var sel='.sec > .wrap > *, .pc, .ct, .post, .ptile, .lrow, .shot, .pmini, .panel, .cband, .strip';
  var els=[].slice.call(document.querySelectorAll(sel)).filter(function(e){
    return !e.closest('.reel') && !e.closest('.hdr') && !e.closest('.drawer');
  });
  els.forEach(function(e){ e.classList.add('mw-rise'); });
  if (RM){ els.forEach(function(e){ e.classList.add('in'); }); return; }
  var io=new IntersectionObserver(function(en){
    en.forEach(function(x,n){
      if(x.isIntersecting){
        x.target.style.transitionDelay=Math.min(n,6)*65+'ms';
        x.target.classList.add('in'); io.unobserve(x.target);
      }
    });
  },{threshold:.08,rootMargin:'0px 0px -50px 0px'});
  els.forEach(function(e){ io.observe(e); });
})();

/* ── cards पर 3D झुकाव ── */
(function(){
  if(RM) return;
  document.querySelectorAll('.pc, .ct, .post, .ptile').forEach(function(c){ c.classList.add('mw-tilt'); });
  document.addEventListener('mousemove',function(e){
    var c=e.target.closest && e.target.closest('.mw-tilt'); if(!c) return;
    var r=c.getBoundingClientRect();
    var x=(e.clientX-r.left)/r.width-.5, y=(e.clientY-r.top)/r.height-.5;
    c.style.transform='perspective(800px) rotateY('+(x*9)+'deg) rotateX('+(-y*9)+'deg) translateY(-3px)';
  });
  document.addEventListener('mouseout',function(e){
    var c=e.target.closest && e.target.closest('.mw-tilt'); if(c) c.style.transform='';
  });
})();

/* ── तस्वीर पर click — बड़ी करके देखिए ── */
(function(){
  var box=document.createElement('div');
  box.className='mw-lens'; box.innerHTML='<button class="x" aria-label="बंद करें">&times;</button><img alt="">';
  document.body.appendChild(box);
  var im=box.querySelector('img');
  function shut(){ box.classList.remove('on'); document.body.style.overflow=''; }
  box.addEventListener('click',shut);
  addEventListener('keydown',function(e){ if(e.key==='Escape') shut(); });
  document.querySelectorAll('.shot img, .post .m img, #store-photos img').forEach(function(g){
    g.style.cursor='zoom-in';
    g.addEventListener('click',function(e){
      e.preventDefault(); e.stopPropagation();
      im.src=g.currentSrc||g.src; im.alt=g.alt||'';
      box.classList.add('on'); document.body.style.overflow='hidden';
    });
  });
})();

/* ══ 3D flagship reel ══ */
(function(){
  var wash=document.getElementById('rw'); if(!wash) return;
  var big=document.getElementById('rb'), o1=document.getElementById('ro1'),
      o2=document.getElementById('ro2'), bar=document.getElementById('rbar'),
      leaf=document.getElementById('rleaf'), pen=document.getElementById('rpen'),
      copy=document.getElementById('rc'),
      sec=document.getElementById('flagships'),
      devs=[document.getElementById('dvA'),document.getElementById('dvB'),document.getElementById('dvC')];

  var ACTS=[
    { w:'radial-gradient(125% 95% at 50% 6%,#2a2540 0%,#120d2c 58%,#0B0722 100%)',
      a:'#C9A227', b:'#5B6472', ink:'#F6F2E8', big:'PRO\\nMAX', hol:1,
      k:'Flagship · काउंटर पर मौजूद', t:'iPhone 17 Pro Max',
      p:'Titanium बनावट और बड़ा camera square। रंग और variant देखकर चुनिए।',
      c:['Apple','Pro Max','availability पूछें'] },
    { w:'radial-gradient(125% 95% at 50% 6%,#4B31C4 0%,#1e1240 62%,#0B0722 100%)',
      a:'#7B5CF0', b:'#E8542F', ink:'#F1EAFF', big:'S26\\nULTRA', hol:0,
      k:'Flagship · काउंटर पर मौजूद', t:'Galaxy S26 Ultra',
      p:'तीन अलग lens और अंदर ही S-Pen। हाथ में लेकर देखिए, फिर तय कीजिए।',
      c:['Samsung','S-Pen','availability पूछें'] },
    { w:'radial-gradient(125% 95% at 50% 6%,#0a4f8c 0%,#05213f 60%,#0B0722 100%)',
      a:'#4CC9F0', b:'#2678FF', ink:'#E8F4FF', big:'FOLD', hol:0,
      k:'Foldable · scroll करके खोलिए', t:'Galaxy Z Fold',
      p:'बंद हो तो फ़ोन, खुल जाए तो tablet। दुकान पर आकर खोलकर देखिए।',
      c:['Samsung','Foldable','model confirm करें'] },
    { w:'radial-gradient(125% 95% at 50% 6%,#E8542F 0%,#5c1a0a 64%,#0B0722 100%)',
      a:'#E8542F', b:'#FFA45B', ink:'#FFF1EC', big:'आ\\nजाइए', hol:0,
      k:'Gurudwara Road · Jawahar Colony', t:'दुकान पर आ जाइए',
      p:'रोज़ सुबह 9 से रात 11 बजे तक। Repair, EMI और exchange — तीनों यहीं।',
      c:[] }
  ];

  /* cards एक बार बनाओ */
  copy.innerHTML = ACTS.map(function(a,i){
    return '<div class="reel-card'+(i?' off':'')+'" data-i="'+i+'">'
      + '<p class="kk">'+a.k+'</p><h3>'+a.t+'</h3><p>'+a.p+'</p>'
      + (a.c.length?'<div class="reel-chips">'+a.c.map(function(c){return '<span>'+c+'</span>'}).join('')+'</div>':'')
      + '<div class="reel-btns"><a class="f" href="'+TEL+'">'+(i===3?'+91 93152 12131':'Call करें')+'</a>'
      + '<a class="o" href="'+WA+'" target="_blank" rel="noopener">WhatsApp</a></div></div>';
  }).join('');
  var cards=[].slice.call(copy.querySelectorAll('.reel-card'));

  /* गिरते हुए टुकड़े */
  var falls=[];
  if(!RM){
    for(var i=0;i<15;i++){
      var f=document.createElement('span'); f.className='mw-fall';
      var s=4+Math.random()*11; f.style.width=f.style.height=s+'px';
      f.style.left=(Math.random()*100)+'%';
      f.style.background=['#ffffff33','#4CC9F066','#E8542F55','#7B5CF066'][i%4];
      sec.querySelector('.reel-sticky').appendChild(f);
      falls.push({el:f, sp:.5+Math.random()*1.5, dx:(Math.random()-.5)*70, r:Math.random()*360});
    }
  }

  var cur=-1, target=0, shown=0, tick=false;

  function paint(i){
    if(i===cur) return; cur=i;
    var a=ACTS[i];
    wash.style.background=a.w; o1.style.background=a.a; o2.style.background=a.b;
    big.style.color=a.ink; copy.style.color=a.ink;
    big.classList.add('out');
    setTimeout(function(){
      big.innerHTML=a.big.split('\\n').map(function(l,n){
        return (a.hol&&n===1)?'<span class="hol">'+l+'</span>':'<span>'+l+'</span>';
      }).join('\\n');
      big.classList.remove('out');
    },210);
    var liveIdx=Math.min(i,devs.length-1);
    devs.forEach(function(d,n){ d.classList.toggle('live', n===liveIdx); });
    cards.forEach(function(c,n){ c.classList.toggle('off', n!==i); });
  }

  function loop(){
    shown += (target-shown)*(RM?1:.085);
    var p=shown, f=p*ACTS.length,
        idx=Math.min(ACTS.length-1,Math.floor(f)), q=Math.min(1,f-idx);
    paint(idx);
    bar.style.width=(p*100)+'%';

    if(!RM){
      var foldIdx=devs.length-1, isFold=idx>=foldIdx;
      /* Fold को पूरा मत घुमाओ — घुमाने पर वो किनारे से पतला दिखता है और
         खुलने का असर, जो उसकी सबसे बड़ी बात है, मारा जाता है */
      var spin=isFold?Math.sin(q*Math.PI*2)*22:(q*360+idx*120);
      var tilt=Math.sin(q*Math.PI)*(isFold?9:16);
      var sc=1+Math.sin(q*Math.PI)*(isFold?.05:.12);
      var ty=Math.sin(q*Math.PI*1.3)*-18;
      var live=devs[Math.min(idx,foldIdx)];
      if(live) live.style.transform='translateY('+ty+'px) rotateX('+tilt+'deg) rotateY('+spin+'deg) scale('+sc+')';
      if(pen) pen.style.transform='translateY('+(q*26)+'px)';
      if(leaf){
        var open = idx>foldIdx ? 1 : (idx===foldIdx ? Math.min(1,q*1.5) : 0);
        leaf.style.transform='rotateY('+(-178*(1-open))+'deg)';
      }
      o1.style.transform='translate3d('+(p*64)+'px,'+(p*-46)+'px,0)';
      o2.style.transform='translate3d('+(p*-72)+'px,'+(p*38)+'px,0)';
      falls.forEach(function(o){
        o.el.style.transform='translate3d('+(o.dx*p*3)+'px,'+(p*o.sp*118)+'vh,0) rotate('+(o.r+p*420)+'deg)';
      });
    }
    if(Math.abs(target-shown)>.0004) requestAnimationFrame(loop); else tick=false;
  }

  function read(){
    var r=sec.getBoundingClientRect();
    var span=sec.offsetHeight - innerHeight;
    target=Math.min(1,Math.max(0,(-r.top)/(span||1)));
    if(!tick){ tick=true; requestAnimationFrame(loop); }
  }
  addEventListener('scroll',read,{passive:true});
  addEventListener('resize',read);
  paint(0); read();
})();
})();
<\/script>
`;

/* ─────────── 6. जोड़ो ─────────── */
if (!html.includes("</style>")) throw new Error("</style> नहीं मिला");
html = html.replace("</style>", CSS + "\n</style>");

const anchor = '<section class="sec" id="topsell">';
if (!html.includes(anchor)) throw new Error("topsell section नहीं मिला");
html = html.replace(anchor, REEL_HTML + "\n  " + anchor);

if (!html.includes("</body>")) throw new Error("</body> नहीं मिला");
html = html.replace("</body>", JS.replace("<\\/script>", "</script>") + "\n</body>");

writeFileSync(out, html);
console.log(`\n${fixCount} तथ्य ठीक किए`);
console.log(`${(before / 1048576).toFixed(2)} MB → ${(html.length / 1048576).toFixed(2)} MB`);
