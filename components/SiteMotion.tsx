'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

const cards = '.mw-model-card,.mw-featured,.pc,.shopping-category,.mw-brand-logo,.mw-service-card,.mw-guide,.post,.festival-card,.mw-latest-link,.mw-related a,.mw-about-timeline li';
const headings = 'h1,h2,h3';
const images = 'img';
const content = 'p,.shopping-overline,.campaign-eyebrow,.mp-spec-section dl>div,.mp-prices dl>div,details,.btns,.campaign-actions,.campaign-social-links>a,.mw-footer-top>div';
const candidates = [cards, headings, images, content].join(',');
const exclude = '.sr,.sr-only,[inert],[aria-hidden="true"],dialog,[role="dialog"],.festival-flight,.festival-flight-landscape,.mp-thumbnails,.mp-zoom,.mw-home-video,.av,.shopping-drawer,.mw-compare-tray,[data-motion="off"]';
const ease = 'cubic-bezier(.22,1,.36,1)';

/** One observer and one event-driven cursor for all public routes, including filtered cards. */
export function SiteMotion() {
  const pathname = usePathname();
  const cursor = useRef<HTMLDivElement>(null);
  const seen = useRef(new WeakSet<Element>());

  useEffect(() => {
    const root = document.documentElement;
    if (pathname.startsWith('/admin')) {
      root.dataset.siteMotion = 'paused';
      return () => { delete root.dataset.siteMotion; };
    }
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    const pointer = matchMedia('(hover: hover) and (pointer: fine)');
    const animations = new Map<Animation, Element>();
    const observed = new Set<Element>();
    let scanFrame = 0;
    let cursorFrame = 0;
    let pointerX = 0;
    let pointerY = 0;
    let enabled = false;
    const dot = cursor.current;
    const pendingRoots = new Set<Element>();

    function cancelAnimations(within?: Element) {
      for (const [animation, element] of animations) {
        if (!within || within.contains(element) || element.contains(within)) {
          animation.cancel();
          animations.delete(animation);
        }
      }
    }
    function syncMotion() {
      enabled = !reduced.matches && root.dataset.festivalMotion !== 'paused' && !document.hidden;
      root.dataset.siteMotion = enabled ? 'playing' : 'paused';
      if (!enabled) cancelAnimations();
      if (!enabled || !pointer.matches) dot?.classList.remove('is-visible');
    }
    syncMotion();

    function animate(element: Element, frames: Keyframe[], options: KeyframeAnimationOptions) {
      if (!(element instanceof HTMLElement) && !(element instanceof SVGElement)) return;
      if (!element.animate) return;
      // The default HTML/CSS is visible. A cancelled/failed animation never conceals content.
      const animation = element.animate(frames, { duration: 700, easing: ease, ...options });
      animations.set(animation, element);
      animation.onfinish = () => { animations.delete(animation); animation.cancel(); };
      animation.oncancel = () => animations.delete(animation);
    }

    const observer = typeof IntersectionObserver === 'undefined' ? null : new IntersectionObserver((entries) => {
      let stagger = 0;
      for (const entry of entries) {
        const element = entry.target;
        if (!entry.isIntersecting || element.closest(exclude)) continue;
        observer?.unobserve(element);
        observed.delete(element);
        if (seen.current.has(element)) continue;
        seen.current.add(element);
        if (!enabled || entry.boundingClientRect.bottom < 0 || element.contains(document.activeElement)) continue;
        // Hash navigation must reveal its destination immediately, without delaying reading.
        const target = document.querySelector(':target');
        if (target && (target.contains(element) || element.contains(target))) continue;
        if (element.matches(headings)) {
          const glyphs = element.querySelectorAll<HTMLElement>('.mw-motion-glyph');
          if (glyphs.length) {
            glyphs.forEach((glyph, index) => animate(glyph,
              [{ opacity: .15, transform: 'translate3d(32px,0,0)' }, { opacity: 1, transform: 'translate3d(0,0,0)' }],
              { duration: 850, delay: Math.min(index * 20, 380), easing: 'cubic-bezier(.2,.9,.25,1.12)', fill: 'backwards' }));
          } else animate(element, [{ opacity: .2, translate: '20px 0' }, { opacity: 1, translate: '0 0' }], { duration: 850 });
        } else if (element.matches(images)) {
          // Above-the-fold product/hero imagery is immediately visible (LCP), never masked.
          if (element.getAttribute('fetchpriority') === 'high' || element.closest('.campaign-art,.mp-main-image')) continue;
          animate(element, [{ clipPath: 'inset(0 90% 0 0)', opacity: .4 }, { clipPath: 'inset(0 0% 0 0)', opacity: 1 }], { duration: 1200 });
        } else {
          const row = element.matches('.mp-spec-section dl>div,.mp-prices dl>div');
          const delay = row ? 0 : Math.min(stagger++ * 70, 210);
          animate(element, [{ opacity: .2, translate: row ? '0 9px' : '0 26px' }, { opacity: 1, translate: '0 0' }], { duration: row ? 380 : 700, delay, fill: 'backwards' });
        }
      }
    }, { rootMargin: '0px 0px -7% 0px', threshold: .01 });

    function register(scope: Element) {
      const elements = scope.matches(candidates) ? [scope, ...scope.querySelectorAll(candidates)] : [...scope.querySelectorAll(candidates)];
      for (const element of elements) {
        if (seen.current.has(element) || observed.has(element) || element.closest(exclude)) continue;
        if (!element.closest('#main,.mw-footer')) continue;
        // Cards move as a single unit; their images can still reveal/zoom independently.
        if (!element.matches(images) && element.parentElement?.closest(cards)) continue;
        if (element.matches('p') && element.parentElement?.closest('details,.mp-spec-section,.mp-prices,.mw-footer-top>div')) continue;
        if (element.classList.contains('mw-motion-glyph') || !element.getClientRects().length) continue;
        observed.add(element);
        observer?.observe(element);
      }
    }
    function scan() {
      scanFrame = 0;
      for (const scope of pendingRoots) if (scope.isConnected) register(scope);
      pendingRoots.clear();
      for (const element of observed) if (!element.isConnected) { observer?.unobserve(element); observed.delete(element); }
      for (const [animation, element] of animations) if (!element.isConnected) { animation.cancel(); animations.delete(animation); }
    }
    if (observer) register(document.body);
    const mutations = new MutationObserver((records) => {
      for (const record of records) {
        if (record.type === 'attributes' && record.target instanceof Element) pendingRoots.add(record.target);
        else for (const node of record.addedNodes) if (node instanceof Element) pendingRoots.add(node);
      }
      if (pendingRoots.size && !scanFrame) scanFrame = requestAnimationFrame(scan);
    });
    // Attribute changes cover carousel slides and native disclosure content, not our own styles.
    mutations.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['inert', 'aria-hidden', 'open'] });

    function move(event: PointerEvent) {
      if (!enabled || !pointer.matches || event.pointerType !== 'mouse' || !dot) return;
      const target = event.target instanceof Element ? event.target : null;
      if (target?.closest('input,textarea,select,[contenteditable="true"],iframe,video,dialog,[role="dialog"]')) { dot.classList.remove('is-visible'); return; }
      pointerX = event.clientX;
      pointerY = event.clientY;
      dot.classList.add('is-visible');
      dot.classList.toggle('is-link', !!target?.closest('a,button,summary'));
      if (!cursorFrame) cursorFrame = requestAnimationFrame(() => {
        cursorFrame = 0;
        dot.style.translate = `${pointerX}px ${pointerY}px`;
      });
    }
    const hideCursor = () => dot?.classList.remove('is-visible');
    const focus = (event: FocusEvent) => { hideCursor(); if (event.target instanceof Element) cancelAnimations(event.target); };
    const hash = () => { const target = document.querySelector(':target'); if (target) cancelAnimations(target); };
    const beforePrint = () => cancelAnimations();
    window.addEventListener('mw-festival-motion', syncMotion);
    document.addEventListener('visibilitychange', syncMotion);
    reduced.addEventListener('change', syncMotion);
    pointer.addEventListener('change', syncMotion);
    document.addEventListener('pointermove', move, { passive: true });
    document.addEventListener('pointerleave', hideCursor);
    document.addEventListener('keydown', hideCursor);
    document.addEventListener('focusin', focus);
    window.addEventListener('hashchange', hash);
    window.addEventListener('blur', hideCursor);
    window.addEventListener('beforeprint', beforePrint);
    return () => {
      observer?.disconnect(); mutations.disconnect(); cancelAnimations();
      cancelAnimationFrame(scanFrame); cancelAnimationFrame(cursorFrame); hideCursor();
      window.removeEventListener('mw-festival-motion', syncMotion);
      document.removeEventListener('visibilitychange', syncMotion);
      reduced.removeEventListener('change', syncMotion); pointer.removeEventListener('change', syncMotion);
      document.removeEventListener('pointermove', move); document.removeEventListener('pointerleave', hideCursor);
      document.removeEventListener('keydown', hideCursor); document.removeEventListener('focusin', focus);
      window.removeEventListener('hashchange', hash); window.removeEventListener('blur', hideCursor);
      window.removeEventListener('beforeprint', beforePrint);
      delete root.dataset.siteMotion;
    };
  }, [pathname]);

  return <div ref={cursor} className="mw-motion-cursor" aria-hidden="true" />;
}
