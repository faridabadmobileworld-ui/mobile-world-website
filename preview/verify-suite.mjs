import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const b=await chromium.launch(); const fail=[]; const ok=[];
const T=(cond,label,detail='')=> (cond?ok:fail).push(label+(detail?`  [${detail}]`:''));

const ctx=await b.newContext({viewport:{width:390,height:844},deviceScaleFactor:2});
const p=await ctx.newPage(); const errs=[];
p.on('pageerror',e=>errs.push(e.message)); p.on('console',m=>{if(m.type()==='error')errs.push(m.text())});
p.on('requestfailed',r=>errs.push('reqfail '+r.url().slice(0,50)));
await p.goto('http://127.0.0.1:8899/fixed.html',{waitUntil:'load'});
await p.evaluate(()=>document.fonts.ready); await p.waitForTimeout(1100);
T(errs.length===0,'no console/network errors',errs.join('; ').slice(0,80));

const r=await p.evaluate(()=>{
  const H=document.documentElement.innerHTML;
  const imgs=[...document.querySelectorAll('img')];
  return {
    ext:performance.getEntriesByType('resource').filter(e=>!e.name.startsWith('http://127.0.0.1')).length,
    overflow:document.documentElement.scrollWidth>document.documentElement.clientWidth,
    badName:/Kriyana|Kiryana &amp;|&amp; Kiryana/.test(H),
    goodName:(H.match(/Aggarwal Kiryana And Communication/g)||[]).length,
    badWa:[...document.querySelectorAll('a[href*="wa.me"]')].filter(a=>/%26amp%3B|%26Prime%3B/.test(a.href)).length,
    waTotal:document.querySelectorAll('a[href*="wa.me"]').length,
    blankTargetNoOpener:[...document.querySelectorAll('a[target=_blank]')].filter(a=>!/noopener/.test(a.rel)).length,
    altMissing:imgs.filter(i=>!i.hasAttribute('alt')||!i.alt.trim()).length,
    altSuperlative:imgs.filter(i=>/\bbest\b|no\.?\s*1|cheapest/i.test(i.alt)).length,
    dimsMissing:imgs.filter(i=>!i.width||!i.height).length,
    lazyData:imgs.filter(i=>i.loading==='lazy'&&i.src.startsWith('data:')).length,
    typo:/चipset/.test(document.body.textContent),
    afig:document.querySelectorAll('.afig').length,
    xiaomiCredit:/official launch slide/.test(H),
    h4:document.querySelectorAll('footer h4,.drawer h4').length,
    dupIds:(()=>{const m={};document.querySelectorAll('[id]').forEach(e=>m[e.id]=(m[e.id]||0)+1);
                 return Object.entries(m).filter(([,v])=>v>1).length})(),
    hindiLang:document.getElementById('art-redmi-note-17').getAttribute('lang'),
    icons:document.querySelectorAll('link[rel*=icon]').length,
    ogImage:!!document.querySelector('meta[property="og:image"]'),
    shots:document.querySelectorAll('.shots .shot').length,
    captionBlock:getComputedStyle(document.querySelector('.shot .t')).display,
    liveFallbackHonest:!/Open now/.test(document.querySelector('.ann [data-live] span:last-child').dataset.raw||''),
    carouselLive:document.getElementById('hsT').getAttribute('aria-live'),
    pauseBtn:!!document.getElementById('hsPause'),
    ariaCurrent:[...document.getElementById('hsD').children].filter(c=>c.hasAttribute('aria-current')).length,
  };
});
T(r.ext===0,'zero external requests',String(r.ext));
T(!r.overflow,'no horizontal overflow');
T(!r.badName && r.goodName>=7,'registered name unified',`${r.goodName} uses`);
T(r.badWa===0,'no double-encoded WhatsApp links',`${r.waTotal} links`);
T(r.blankTargetNoOpener===0,'every _blank has rel=noopener');
T(r.altMissing===0,'every image has alt text');
T(r.altSuperlative===0,'no superlative claims in alt');
T(r.dimsMissing===0,'every image has width/height');
T(r.lazyData===0,'no pointless lazy-loading on data URIs');
T(!r.typo,'chipset typo fixed');
T(r.afig===0 && !r.xiaomiCredit,'Xiaomi slides and credit removed');
T(r.h4===0,'no skipped heading levels');
T(r.dupIds===0,'no duplicate ids');
T(r.hindiLang==='hi','Hindi article tagged lang=hi');
T(r.icons>=2,'favicon + apple-touch-icon',String(r.icons));
T(r.ogImage,'og:image present');
T(r.shots===4,'four store photographs');
T(r.captionBlock==='block','captions render as blocks');
T(r.carouselLive===null,'aria-live removed from carousel');
T(r.pauseBtn,'carousel pause control');
T(r.ariaCurrent===4,'dots expose aria-current');

// article h1
await p.evaluate(()=>document.querySelector('[data-article="redmi-note-17"]').click());
await p.waitForTimeout(500);
const h1=await p.evaluate(()=>[...document.querySelectorAll('h1')].filter(x=>x.getBoundingClientRect().height>0).length);
T(h1===1,'article view has exactly one h1',String(h1));
await ctx.close();

// sticky overlap across widths
for(const w of [320,360,390,414,768,1280]){
  const c=await b.newContext({viewport:{width:w,height:800}});
  const q=await c.newPage();
  await q.goto('http://127.0.0.1:8899/fixed.html',{waitUntil:'load'});
  await q.evaluate(()=>document.fonts.ready); await q.waitForTimeout(350);
  await q.evaluate(()=>{document.documentElement.style.scrollBehavior='auto';window.scrollTo(0,1500)});
  await q.waitForTimeout(400);
  const o=await q.evaluate(()=>{const h=document.querySelector('.hdr').getBoundingClientRect();
    const s=document.querySelector('.cstrip').getBoundingClientRect();
    return Math.round(Math.max(0,h.bottom-s.top));});
  T(o===0,`no header/strip overlap at ${w}px`,o+'px');
  await c.close();
}
await b.close();
console.log(`PASS ${ok.length}`); ok.forEach(x=>console.log('  ✓ '+x));
if(fail.length){console.log(`\nFAIL ${fail.length}`); fail.forEach(x=>console.log('  ✗ '+x)); process.exit(1);}
else console.log('\nAll checks passed.');
