/**
 * preview/index.html ki poori jaanch — har link, har button, har slide.
 *
 * Chalaiye:  node preview/verify-preview.mjs
 * Ek bhi fail hui to script exit code 1 deti hai.
 */
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';

const F = 'file://' + process.cwd() + '/preview/index.html';
const ROUTES = ['/', '/products', '/about', '/contact', '/visit', '/posts',
  '/posts/ac-tonnage', '/posts/new-phones', '/posts/monthly-closure', '/privacy'];

const b = await chromium.launch();
const pass = [], fail = [];
const T = (c, l, d = '') => (c ? pass : fail).push(l + (d ? `  [${d}]` : ''));

const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
const p = await ctx.newPage();
const errs = [];
p.on('pageerror', e => errs.push(e.message.slice(0, 90)));
p.on('console', m => { if (m.type() === 'error') errs.push(m.text().slice(0, 90)); });
p.on('requestfailed', r => errs.push('reqfail ' + r.url().slice(0, 60)));

await p.goto(F, { waitUntil: 'load' });
await p.waitForTimeout(900);
T(errs.length === 0, 'koi console error nahi', errs.slice(0, 2).join('; '));

// ── har page khulta hai ─────────────────────────────────────────────
for (const route of ROUTES) {
  await p.evaluate(r => { location.hash = r; }, route);
  await p.waitForTimeout(320);
  const r = await p.evaluate(() => {
    const m = document.getElementById('main');
    return {
      title: document.title,
      h1: [...m.querySelectorAll('h1')].filter(x => x.getBoundingClientRect().height > 0).length,
      text: m.textContent.trim().length,
      broken: [...m.querySelectorAll('img')].filter(i => i.complete && i.naturalWidth === 0).length,
      blank: [...m.querySelectorAll('img')].filter(i => !i.getAttribute('src')).length,
    };
  });
  T(r.text > 400, `${route} content dikha`, `${r.text} chars`);
  T(r.h1 === 1, `${route} ek h1`, String(r.h1));
  T(r.broken === 0 && r.blank === 0, `${route} images load hui`, `${r.broken} broken, ${r.blank} blank`);
  T(/\S/.test(r.title), `${route} title set hua`, r.title);
}

// ── andar ke saare links kaam karte hain ────────────────────────────
await p.evaluate(() => { location.hash = '/'; });
await p.waitForTimeout(300);
const internal = await p.evaluate(() =>
  [...new Set([...document.querySelectorAll('a[href^="/"]')].map(a => a.getAttribute('href')))]);
let deadLinks = [];
for (const href of internal) {
  const route = href.split('#')[0] || '/';
  const ok = await p.evaluate(r => !!window.__PV_VIEWS[r], route);
  if (!ok) deadLinks.push(href);
}
T(deadLinks.length === 0, `saare ${internal.length} andar ke links kisi page par jaate hain`, deadLinks.join(', '));

// ── click karke sach mein page badalta hai ──────────────────────────
for (const route of ['/products', '/visit', '/about', '/contact', '/posts', '/privacy']) {
  await p.evaluate(() => { location.hash = '/'; });
  await p.waitForTimeout(280);
  const clicked = await p.evaluate(r => {
    const a = [...document.querySelectorAll('a[href]')]
      .find(x => (x.getAttribute('href') || '').split('#')[0] === r);
    if (!a) return false;
    a.click(); return true;
  }, route);
  await p.waitForTimeout(340);
  const now = await p.evaluate(() => location.hash.replace(/^#/, '').split('#')[0]);
  T(clicked && now === route, `click se ${route} khula`, now);
}

// ── bahar ke links: WhatsApp, call, map, social ─────────────────────
await p.evaluate(() => { location.hash = '/'; });
await p.waitForTimeout(300);
const ext = await p.evaluate(() => {
  const all = [...document.querySelectorAll('a[href]')].map(a => a.getAttribute('href'));
  const kind = (re) => all.filter(h => re.test(h));
  return {
    whatsapp: kind(/^https:\/\/wa\.me\/919315212131\?text=/).length,
    badWa: kind(/^https:\/\/wa\.me\//).filter(h => /%26amp%3B|%26Prime%3B|&amp;/.test(h)).length,
    tel: kind(/^tel:\+919315212131$/).length,
    maps: kind(/^https:\/\/maps\.app\.goo\.gl\//).length,
    youtube: kind(/youtube\.com/).length,
    instagram: kind(/instagram\.com/).length,
    facebook: kind(/facebook\.com/).length,
    noopener: [...document.querySelectorAll('a[target="_blank"]')].filter(a => !/noopener/.test(a.rel)).length,
    emptyHref: all.filter(h => !h || h === '#').length,
  };
});
T(ext.whatsapp > 0, 'WhatsApp links maujood', String(ext.whatsapp));
T(ext.badWa === 0, 'WhatsApp text theek encode hua', String(ext.badWa));
T(ext.tel > 0, 'call links maujood', String(ext.tel));
T(ext.maps > 0, 'map links maujood', String(ext.maps));
T(ext.youtube > 0 && ext.instagram > 0 && ext.facebook > 0, 'teeno social links maujood',
  `yt ${ext.youtube}, ig ${ext.instagram}, fb ${ext.facebook}`);
T(ext.noopener === 0, 'har _blank par rel=noopener');
T(ext.emptyHref === 0, 'koi khaali link nahi', String(ext.emptyHref));

// ── hero slider ─────────────────────────────────────────────────────
const slide = () => p.evaluate(() =>
  [...document.querySelectorAll('.hs-s')].findIndex(s => s.classList.contains('on')));

await p.evaluate(() => document.querySelectorAll('.hs-ar button')[2].click());   // next
await p.waitForTimeout(320);
T(await slide() === 1, 'slider: next button chala', String(await slide()));

await p.evaluate(() => document.querySelectorAll('.hs-ar button')[1].click());   // prev
await p.waitForTimeout(320);
T(await slide() === 0, 'slider: prev button chala', String(await slide()));

await p.evaluate(() => document.querySelectorAll('.hs-ui button')[2].click());   // dot 3
await p.waitForTimeout(320);
T(await slide() === 2, 'slider: dot se slide badli', String(await slide()));

const dotAria = await p.evaluate(() =>
  document.querySelectorAll('.hs-ui button')[2].getAttribute('aria-current'));
T(dotAria === 'true', 'slider: dot par aria-current lagta hai', String(dotAria));

await p.evaluate(() => document.querySelectorAll('.hs-ar button')[0].click());   // pause
await p.waitForTimeout(150);
const beforePause = await slide();
await p.waitForTimeout(7000);
T(await slide() === beforePause, 'slider: pause se rukta hai', `${beforePause} → ${await slide()}`);

const pauseLabel = await p.evaluate(() => document.querySelectorAll('.hs-ar button')[0].getAttribute('aria-label'));
T(pauseLabel === 'Play slideshow', 'slider: pause button ka label badalta hai', String(pauseLabel));

await p.evaluate(() => document.querySelectorAll('.hs-ar button')[0].click());   // play
await p.waitForTimeout(6600);
T(await slide() !== beforePause, 'slider: play se apne aap badalta hai');

// ── menu drawer ─────────────────────────────────────────────────────
await p.click('[aria-label="Menu kholiye"]');
await p.waitForTimeout(420);
const d1 = await p.evaluate(() => {
  const panel = document.querySelector('.drawer .panel');
  const heads = [...panel.querySelectorAll('h2')];
  let n = 0, el = heads[0]?.nextElementSibling;
  while (el && el.tagName !== 'H2') { if (el.tagName === 'A') n++; el = el.nextElementSibling; }
  return { open: document.querySelector('.drawer').classList.contains('open'),
           onScreen: panel.getBoundingClientRect().x >= 0, catLinks: n,
           expanded: document.querySelector('[aria-label="Menu kholiye"]').getAttribute('aria-expanded') };
});
T(d1.open && d1.onScreen, 'menu khulta hai');
T(d1.catLinks === 10, 'menu mein 10 category links', String(d1.catLinks));
T(d1.expanded === 'true', 'menu button ka aria-expanded sahi');

await p.evaluate(() => document.querySelector('.drawer .veil').click());
await p.waitForTimeout(420);
T(await p.evaluate(() => !document.querySelector('.drawer').classList.contains('open')),
  'menu bahar click se band hota hai');

await p.click('[aria-label="Menu kholiye"]'); await p.waitForTimeout(350);
await p.keyboard.press('Escape'); await p.waitForTimeout(350);
T(await p.evaluate(() => !document.querySelector('.drawer').classList.contains('open')),
  'menu Escape se band hota hai');

// menu ke link se page badalta hai aur menu band hota hai
await p.click('[aria-label="Menu kholiye"]'); await p.waitForTimeout(350);
await p.evaluate(() => [...document.querySelectorAll('.drawer a.d')]
  .find(a => a.getAttribute('href') === '/visit').click());
await p.waitForTimeout(400);
T(await p.evaluate(() => location.hash.includes('/visit')
  && !document.querySelector('.drawer').classList.contains('open')),
  'menu ke link se page khulta hai aur menu band ho jaata hai');

// ── search ──────────────────────────────────────────────────────────
await p.evaluate(() => { location.hash = '/'; }); await p.waitForTimeout(320);
await p.click('[aria-label="Menu kholiye"]'); await p.waitForTimeout(350);
await p.fill('.drawer input[type="search"]', 'laptop');
await p.press('.drawer input[type="search"]', 'Enter');
await p.waitForTimeout(600);
const s = await p.evaluate(() => {
  const cards = [...document.querySelectorAll('#main .pc')];
  return { route: location.hash.replace(/^#/, '').split('#')[0],
           shown: cards.filter(c => !c.hidden).length,
           hidden: cards.filter(c => c.hidden).length,
           note: (document.querySelector('.pv-searchnote')?.textContent || '').slice(0, 40) };
});
T(s.route === '/products', 'search products page par le jaata hai', s.route);
T(s.shown > 0 && s.hidden > 0, 'search sirf milte-julte cards dikhata hai',
  `${s.shown} dikhe, ${s.hidden} chhupe`);
T(/laptop/i.test(s.note), 'search ka natija likha aata hai', s.note);

await p.evaluate(() => document.querySelector('.pv-clear').click());
await p.waitForTimeout(400);
T(await p.evaluate(() => [...document.querySelectorAll('#main .pc')].every(c => !c.hidden)),
  'search saaf karne par sab cards wapas');

// ── dukaan ka status ────────────────────────────────────────────────
const st = await p.evaluate(() => {
  const live = document.querySelector('.live span:last-child');
  return { label: live ? live.textContent.trim() : '' };
});
T(/खुली है|बंद है|आज बंद/.test(st.label), 'dukaan ka status bharta hai', st.label);

// ── har width par layout ────────────────────────────────────────────
await ctx.close();
for (const w of [320, 390, 768, 1280]) {
  const c = await b.newContext({ viewport: { width: w, height: 900 } });
  const q = await c.newPage();
  await q.goto(F, { waitUntil: 'load' }); await q.waitForTimeout(600);
  for (const route of ROUTES) {
    await q.evaluate(r => { location.hash = r; }, route);
    await q.waitForTimeout(220);
    const bad = await q.evaluate(() => {
      const de = document.documentElement;
      const off = [...document.querySelectorAll('#main *, .hdr *, .ftr *, .mbar *')].filter(e => {
        if (e.closest('.skip,.drawer')) return false;
        for (let n = e.parentElement; n; n = n.parentElement) {
          const ox = getComputedStyle(n).overflowX;
          if (ox === 'auto' || ox === 'scroll') return false;
        }
        const r = e.getBoundingClientRect();
        return r.width > 0 && (r.right > innerWidth + 1 || r.left < -1);
      }).length;
      return { overflow: de.scrollWidth > de.clientWidth, off };
    });
    T(!bad.overflow && bad.off === 0, `${w}px ${route} layout theek`,
      bad.overflow ? 'page overflow' : `${bad.off} elements bahar`);
  }
  await c.close();
}

await b.close();
console.log(`PASS ${pass.length}`);
if (fail.length) {
  console.log(`\nFAIL ${fail.length}`);
  fail.forEach(x => console.log('  x ' + x));
  process.exit(1);
}
console.log('\nSab kuch chal raha hai.');
