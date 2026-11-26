import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import Module, { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

const filename = fileURLToPath(new URL('../components/MotionHeading.tsx', import.meta.url));
const mod = new Module(filename);
mod.filename = filename;
mod.require = createRequire(filename);
mod._compile(ts.transpileModule(fs.readFileSync(filename, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true } }).outputText, filename);
const { MotionHeading } = mod.exports;
const render = (children, props = {}) => renderToStaticMarkup(React.createElement(MotionHeading, props, children));

test('Mixed Hindi/English headings retain one complete accessible name and readable no-JS HTML', () => {
  const text = 'ख़ुशियों की शुरुआत। Xiaomi 17T ❤️';
  const html = render(text, { as: 'h1', id: 'model' });
  assert.match(html, /<h1[^>]*id="model"/);
  assert.ok(html.includes('aria-label="' + text + '"'));
  assert.match(html, /mw-motion-glyph">ख़ुशियों<\/span>/);
  assert.match(html, /mw-motion-glyph">शुरुआत।<\/span>/);
  assert.equal(html.replace(/<[^>]+>/g, ''), text);
  assert.ok(!html.includes('opacity:0') && !html.includes('hidden=""'));
});

test('Existing line breaks, semantic levels, emphasis and caller accessible labels survive', () => {
  const html = render(['पूरी ', React.createElement('br', { key: 'br' }), React.createElement('span', { key: 'line', className: 'accent' }, 'Specifications')], { as: 'h2', 'aria-label': 'पूरी Specifications' });
  assert.match(html, /^<h2/);
  assert.match(html, /<br\/>/);
  assert.match(html, /<span class="accent">/);
  assert.ok(html.includes('aria-label="पूरी Specifications"'));
});

test('Links inside headings remain keyboard accessible and keep their link name', () => {
  const html = render(React.createElement('a', { href: '/phones/xiaomi-17t' }, 'Xiaomi 17T'), { as: 'h3' });
  assert.ok(html.includes('<a href="/phones/xiaomi-17t">Xiaomi 17T</a>'));
  assert.ok(!html.includes('aria-hidden') && !html.includes('aria-label'));
});

test('Screen-reader-only headings and long editorial headings stay unsplit', () => {
  const hidden = render('Mobile World, Faridabad', { className: 'sr', as: 'h1' });
  const longText = 'एक पूरा article title '.repeat(20);
  assert.ok(!hidden.includes('mw-motion-glyph') && !hidden.includes('aria-hidden'));
  assert.equal(render(longText).replace(/<[^>]+>/g, ''), longText);
  assert.ok(!render(longText).includes('mw-motion-glyph'));
});

test('Device reduced motion, manual pause and tab visibility govern the same observer and clean up on navigation', async () => {
  const { runInNewContext } = await import('node:vm');
  const media = Object.assign(new EventTarget(), { matches: true });
  const pointer = Object.assign(new EventTarget(), { matches: true });
  const root = { dataset: {} };
  const dom = Object.assign(new EventTarget(), { documentElement: root, body: { matches: () => false, querySelectorAll: () => [] }, hidden: false });
  const win = new EventTarget();
  let cleanup, disconnected = false;
  const source = fs.readFileSync(new URL('../components/SiteMotion.tsx', import.meta.url), 'utf8');
  const compiled = ts.transpileModule(source, { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX } }).outputText;
  const exports = {};
  runInNewContext(compiled, {
    exports, window: win, document: dom, matchMedia: query => query.includes('reduced-motion') ? media : pointer,
    IntersectionObserver: class { disconnect() { disconnected = true; } }, MutationObserver: class { observe() {} disconnect() {} },
    cancelAnimationFrame() {},
    require(id) {
      if (id === 'react') return { useRef: current => ({ current }), useEffect: effect => { cleanup = effect(); } };
      if (id === 'next/navigation') return { usePathname: () => '/phones/xiaomi-17t' };
      return createRequire(filename)(id);
    },
  });
  exports.SiteMotion();
  assert.equal(root.dataset.siteMotion, 'paused');
  media.matches = false;
  media.dispatchEvent(new Event('change'));
  assert.equal(root.dataset.siteMotion, 'playing');
  root.dataset.festivalMotion = 'paused';
  win.dispatchEvent(new Event('mw-festival-motion'));
  assert.equal(root.dataset.siteMotion, 'paused');
  root.dataset.festivalMotion = 'playing';
  dom.hidden = true;
  dom.dispatchEvent(new Event('visibilitychange'));
  assert.equal(root.dataset.siteMotion, 'paused');
  dom.hidden = false;
  dom.dispatchEvent(new Event('visibilitychange'));
  assert.equal(root.dataset.siteMotion, 'playing');
  cleanup();
  assert.equal(disconnected, true);
  media.matches = true;
  media.dispatchEvent(new Event('change'));
  assert.equal(root.dataset.siteMotion, undefined);
});
