import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const B='http://127.0.0.1:3111';
const paths=['/','/products','/about','/contact','/visit','/posts','/posts/ac-tonnage','/posts/new-phones','/posts/monthly-closure','/privacy'];
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
      const de=document.documentElement;
      // .skip aur band drawer jaanbujh kar screen ke bahar hote hain — wo bug nahi.
      const wide=[...document.querySelectorAll('body *')].filter(e=>{
        if(e.closest('.skip,.drawer')) return false;
        // side-scroll karne wale container ke andar chauda hona sahi hai (category strip, rails)
        for(let n=e.parentElement;n;n=n.parentElement){
          const ox=getComputedStyle(n).overflowX;
          if(ox==='auto'||ox==='scroll') return false;
        }
        const b=e.getBoundingClientRect();
        return b.width>0 && (b.right>innerWidth+1||b.left<-1);
      }).slice(0,3).map(e=>(e.className||e.tagName).toString().slice(0,26));
      return {overflow:de.scrollWidth>de.clientWidth, wide,
        broken:[...document.querySelectorAll('img')].filter(i=>i.complete&&i.naturalWidth===0).length};
    });
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
{
  const ctx=await b.newContext({viewport:{width:390,height:844}});
  const p=await ctx.newPage(); await p.goto(B+'/',{waitUntil:'load'}); await p.waitForTimeout(500);
  await p.click('[aria-label="Open menu"]'); await p.waitForTimeout(500);
  const d=await p.evaluate(()=>{
    const panel=document.querySelector('.drawer .panel');
    const first=[...panel.querySelectorAll('h2')][0];
    let n=0,el=first.nextElementSibling;
    while(el&&el.tagName!=='H2'){if(el.tagName==='A')n++;el=el.nextElementSibling;}
    return {links:n, visible:panel.getBoundingClientRect().x>=0};
  });
  T(d.links===10 && d.visible,'drawer has 10 category links',`${d.links} links`);
  await ctx.close();
}
await b.close();
console.log(`PASS ${ok.length}`);
if(fail.length){console.log(`\nFAIL ${fail.length}`);fail.forEach(x=>console.log('  ✗ '+x));process.exit(1);}
else console.log('\nAll checks passed.');
