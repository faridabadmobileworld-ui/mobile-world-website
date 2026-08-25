import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const F='file:///home/user/mobile-world-website/preview/index.html';
const b=await chromium.launch(); const fail=[],ok=[];
const T=(c,l,d='')=>(c?ok:fail).push(l+(d?`  [${d}]`:''));
const ctx=await b.newContext({viewport:{width:390,height:844},deviceScaleFactor:2});
const p=await ctx.newPage(); const errs=[];
p.on('pageerror',e=>errs.push(e.message.slice(0,80)));
p.on('console',m=>{if(m.type()==='error')errs.push(m.text().slice(0,80))});
p.on('requestfailed',r=>errs.push('reqfail '+r.url().slice(0,50)));
await p.goto(F,{waitUntil:'load'}); await p.waitForTimeout(1200);
T(errs.length===0,'no console errors',errs.slice(0,2).join('; '));

const base=await p.evaluate(()=>({
  views:document.querySelectorAll('.pv-view').length,
  visible:document.querySelectorAll('.pv-view.on').length,
  imgs:document.querySelectorAll('img').length,
  broken:[...document.querySelectorAll('img')].filter(i=>i.complete&&i.naturalWidth===0).length,
  external:performance.getEntriesByType('resource').filter(e=>e.name.startsWith('http')).length,
}));
T(base.views===10,'10 pages bundled',String(base.views));
T(base.visible===1,'exactly one page visible',String(base.visible));
T(base.broken===0,'no broken images',`${base.broken}/${base.imgs}`);
T(base.external===0,'no external requests',String(base.external));

// navigate through every internal page
const routes=['/products','/about','/contact','/visit','/posts','/posts/ac-tonnage','/privacy','/'];
for(const r of routes){
  await p.evaluate((rt)=>{
    const norm=(s)=>{s=(s||'').replace(/\/+$/,'');return s===''?'/':s};
    const a=[...document.querySelectorAll('.pv-view.on a')].find(x=>norm(x.getAttribute('href'))===norm(rt));
    if(a) a.click(); else location.hash=rt;
  },r);
  await p.waitForTimeout(450);
  const cur=await p.evaluate(()=>{
    const on=document.querySelector('.pv-view.on');
    return {route:on.dataset.route,title:document.title,
      h1:[...on.querySelectorAll('h1')].filter(x=>x.getBoundingClientRect().height>0).length,
      broken:[...on.querySelectorAll('img')].filter(i=>i.complete&&i.naturalWidth===0).length};
  });
  T(cur.route===r,`navigate to ${r}`,cur.route);
  T(cur.h1===1,`${r} has one h1`,String(cur.h1));
  T(cur.broken===0,`${r} images load`,String(cur.broken));
}
// external links untouched
const ext=await p.evaluate(()=>{
  const a=[...document.querySelectorAll('.pv-view.on a')].filter(x=>/wa\.me|tel:|maps\./.test(x.href));
  return a.length;
});
T(ext>0,'WhatsApp / call / map links still work',String(ext));
await b.close();
console.log(`PASS ${ok.length}`);
if(fail.length){console.log(`\nFAIL ${fail.length}`);fail.forEach(x=>console.log('  ✗ '+x));process.exit(1);}
else console.log('\nBundled preview: all checks passed.');
