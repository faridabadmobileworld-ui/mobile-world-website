import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import { readFileSync } from 'node:fs';
// Kitni category hain ye shop.ts se ginte hain — hardcode karenge to
// nayi category jodte hi test jhootha fail dega.
const CATS = (readFileSync('data/shop.ts', 'utf8')
  .match(/export const categories: Category\[\] = \[([\s\S]*?)\];/)[1]
  .match(/slug:/g) || []).length;
const B='http://127.0.0.1:3111';
// Page ki list data/pages.ts se hi aati hai — naya page banate hi wo apne aap
// yahan jud jata hai, kisi ko yaad rakhna nahi padta.
const SITE_PAGES=[...readFileSync('data/pages.ts','utf8')
  .matchAll(/href:\s*"([^"]+)"/g)].map(m=>m[1]);
// Article ki list bhi data/content.ts se hi — nayi post apne aap jaanch mein aa jati hai.
const POST_SLUGS=[...readFileSync('data/content.ts','utf8')
  .matchAll(/^\s{4}slug:\s*"([^"]+)",$/gm)].map(m=>'/posts/'+m[1]);
const paths=[...SITE_PAGES,...POST_SLUGS];
const b=await chromium.launch(); const fail=[],ok=[];
const T=(c,l,d='')=>(c?ok:fail).push(l+(d?`  [${d}]`:''));

// every page, every width
for(const w of [320,390,768,1280]){
  for(const path of paths){
    const ctx=await b.newContext({viewport:{width:w,height:900},deviceScaleFactor:1});
    const p=await ctx.newPage(); const errs=[];
    p.on('pageerror',e=>errs.push(e.message.slice(0,70)));
    p.on('console',m=>{if(m.type()==='error')errs.push(m.text().slice(0,70))});
    p.on('requestfailed',r=>errs.push('reqfail '+r.url().replace(B,'')));
    const res=await p.goto(B+path,{waitUntil:'load'});
    await p.evaluate(()=>document.fonts.ready); await p.waitForTimeout(350);
    const r=await p.evaluate(()=>{
      // "Written by: Sachin" — har page par theek ek baar, aur page ka apna
      // content khatam hote hi (yaani "aage kya dekhna hai" waale cards se pehle)।
      const by=[...document.querySelectorAll('.byline-end')];
      const ml=document.querySelector('.mlinks');
      window.__by={n:by.length,
        pehle: by.length&&ml ? by[0].getBoundingClientRect().top<ml.getBoundingClientRect().top : true};
      const de=document.documentElement;
      // .skip aur band drawer jaanbujh kar screen ke bahar hote hain — wo bug nahi.
      const wide=[...document.querySelectorAll('body *')].filter(e=>{
        if(e.closest('.skip,.drawer')) return false;
        // side-scroll karne wale container ke andar chauda hona sahi hai (category strip, rails)
        // Jo cheez kisi scroll ya clip hone wale dabbe ke andar hai, wo page ko
        // chauda nahi karti — jaise category strip (auto) aur finance ki chalti
        // patti (hidden). Sirf wahi pakadni hai jo sach mein bahar nikal rahi ho.
        for(let n=e.parentElement;n;n=n.parentElement){
          const ox=getComputedStyle(n).overflowX;
          if(ox==='auto'||ox==='scroll'||ox==='hidden'||ox==='clip') return false;
        }
        const b=e.getBoundingClientRect();
        return b.width>0 && (b.right>innerWidth+1||b.left<-1);
      }).slice(0,3).map(e=>(e.className||e.tagName).toString().slice(0,26));
      return {by:window.__by, overflow:de.scrollWidth>de.clientWidth, wide,
        // Sirf apni website ki tasveerein — YouTube/Instagram ke CDN yahan
        // (bina internet ke) load nahi hote, wo "tooti hui" nahi hain.
        broken:[...document.querySelectorAll('img')].filter(i=>{
          if(!i.complete||i.naturalWidth!==0) return false;
          try{ return new URL(i.currentSrc||i.src,location.href).origin===location.origin }
          catch{ return true }
        }).length};
    });
    // Byline sirf ek baar, aur page ka apna content khatam hote hi
    if(w===390) T(r.by.n===1 && r.by.pehle, `byline once, at end of content — ${path}`,
      r.by.n!==1?`${r.by.n} bylines`:'byline cards ke baad hai');
    T(res.status()===200 && errs.length===0 && !r.overflow && r.wide.length===0 && r.broken===0,
      `${w}px ${path}`, [res.status()!==200&&`HTTP ${res.status()}`, errs[0], r.overflow&&'page overflow',
        r.wide.length&&('offscreen: '+r.wide.join(',')), r.broken&&`${r.broken} broken img`].filter(Boolean).join(' | '));
    await ctx.close();
  }
}

// sticky strip must not cover the header on any phone width
for(const w of [320,360,390,414,768,1280]){
  const ctx=await b.newContext({viewport:{width:w,height:800}});
  const p=await ctx.newPage();
  await p.goto(B+'/',{waitUntil:'load'});
  await p.evaluate(()=>document.fonts.ready); await p.waitForTimeout(300);
  await p.evaluate(()=>{document.documentElement.style.scrollBehavior='auto';scrollTo(0,1400)});
  await p.waitForTimeout(350);
  const o=await p.evaluate(()=>{const h=document.querySelector('.hdr').getBoundingClientRect();
    const c=document.querySelector('.cstrip').getBoundingClientRect();
    return Math.round(Math.max(0,h.bottom-c.top));});
  T(o===0,`${w}px header/strip overlap`,o+'px'); await ctx.close();
}

// tap targets on the primary actions
{
  const ctx=await b.newContext({viewport:{width:390,height:844}});
  const p=await ctx.newPage(); await p.goto(B+'/',{waitUntil:'load'});
  await p.evaluate(()=>document.fonts.ready); await p.waitForTimeout(300);
  const small=await p.evaluate(()=>[...document.querySelectorAll('.hdr a,.hdr button,.mbar a,.cstrip a')]
    .filter(e=>{const r=e.getBoundingClientRect();return r.height>0&&r.height<44})
    .map(e=>`${(e.className||e.tagName).toString().slice(0,18)}:${Math.round(e.getBoundingClientRect().height)}`));
  T(small.length===0,'primary tap targets >= 44px',small.join(', ')); await ctx.close();
}

// drawer works
// Menu — teen seedhi: pehle saare page, phir saamaan ke hisse, phir categories
{
  const ctx=await b.newContext({viewport:{width:390,height:844}});
  const p=await ctx.newPage(); await p.goto(B+'/',{waitUntil:'load'}); await p.waitForTimeout(500);
  await p.click('[aria-label="Menu kholiye"]'); await p.waitForTimeout(500);
  const d=await p.evaluate(()=>{
    const panel=document.querySelector('.drawer .panel');
    return {
      pages:panel.querySelectorAll('a.d:not(.d3)').length,
      groups:panel.querySelectorAll('.dsub').length,
      cats:panel.querySelectorAll('a.d3').length,
      visible:panel.getBoundingClientRect().x>=0,
    };
  });
  T(d.visible && d.pages===SITE_PAGES.length, `menu: ${SITE_PAGES.length} page`, `${d.pages} mile`);
  T(d.groups>=3, 'menu: saamaan ke hisse (doosri seedhi)', `${d.groups} mile`);
  T(d.cats===CATS, `menu: ${CATS} category (teesri seedhi)`, `${d.cats} mile`);
  await ctx.close();
}

// Upar wali patti mein saare page hone chahiye
{
  const ctx=await b.newContext({viewport:{width:390,height:844}});
  const p=await ctx.newPage(); await p.goto(B+'/',{waitUntil:'load'}); await p.waitForTimeout(400);
  const n=await p.$$eval('.cstrip a',a=>a.length);
  T(n===SITE_PAGES.length, `strip mein ${SITE_PAGES.length} page`, `${n} mile`);
  await ctx.close();
}
await b.close();
console.log(`PASS ${ok.length}`);
if(fail.length){console.log(`\nFAIL ${fail.length}`);fail.forEach(x=>console.log('  ✗ '+x));process.exit(1);}
else console.log('\nAll checks passed.');
