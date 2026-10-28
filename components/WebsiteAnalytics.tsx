'use client';
import { useEffect, useSyncExternalStore } from 'react';
import { usePathname } from 'next/navigation';
import { safeLabel, searchTopic, publicPath, istDay, type Visit, type EventType } from '@/lib/analytics/core';

const preferenceKey = 'mw-analytics-optout';
const preferenceEvent = 'mw-analytics-preference';
const actionEvent = 'mw-website-action';
const uuid = () => crypto.randomUUID();
const subscribe = (fn: () => void) => { window.addEventListener(preferenceEvent, fn); window.addEventListener('storage', fn); return () => { window.removeEventListener(preferenceEvent, fn); window.removeEventListener('storage', fn); }; };
function disabled() { try { return localStorage.getItem(preferenceKey) === '1' || navigator.doNotTrack === '1' || Boolean((navigator as Navigator & { globalPrivacyControl?: boolean }).globalPrivacyControl); } catch { return true; } }
export function trackAction(type: EventType, label: string) { window.dispatchEvent(new CustomEvent(actionEvent, { detail: { type, label } })); }
export function AnalyticsPrivacy() {
  const off = useSyncExternalStore(subscribe, disabled, () => true);
  return <div className="mw-privacy-choice"><p>इस browser में website analytics: <strong>{off ? 'बंद' : 'चालू'}</strong></p><button className="btn btn-o" onClick={() => { try { localStorage.setItem(preferenceKey, off ? '0' : '1'); if (!off) { localStorage.removeItem('mw-visitor-v1'); localStorage.removeItem('mw-session-v1'); } window.dispatchEvent(new Event(preferenceEvent)); } catch { /* Browser storage may be disabled. */ } }}>{off ? 'Analytics की अनुमति दीजिए' : 'Analytics बंद कीजिए'}</button><p className="mw-small">Browser का Do Not Track या Global Privacy Control चालू हो, तो analytics बंद ही रहेगा।</p></div>;
}
export function WebsiteAnalytics() {
  const pathname = usePathname();
  const off = useSyncExternalStore(subscribe, disabled, () => true);
  useEffect(() => {
    if (off || pathname.startsWith('/admin') || pathname.startsWith('/api') || navigator.webdriver) return;
    const now = Date.now();
    let visitor: { id: string; until: number }, session: { id: string; last: number };
    try {
      visitor = JSON.parse(localStorage.getItem('mw-visitor-v1') ?? 'null');
      if (!visitor || visitor.until < now || !/^[a-z0-9-]{36}$/i.test(visitor.id)) visitor = { id: uuid(), until: now + 90 * 86400_000 };
      localStorage.setItem('mw-visitor-v1', JSON.stringify(visitor));
      session = JSON.parse(localStorage.getItem('mw-session-v1') ?? 'null');
      if (!session || now - session.last > 30 * 60_000 || !/^[a-z0-9-]{36}$/i.test(session.id)) session = { id: uuid(), last: now };
      localStorage.setItem('mw-session-v1', JSON.stringify({ ...session, last: now }));
    } catch { return; }
    const url = new URL(window.location.href);
    let source = 'direct', medium = 'none', campaign = 'none';
    try {
      const ref = document.referrer ? new URL(document.referrer) : null;
      if (ref && ref.origin !== location.origin) { source = ref.hostname; medium = /google|bing|duckduckgo|yahoo/.test(source) ? 'organic' : 'referral'; }
      source = url.searchParams.get('utm_source') || source;
      medium = url.searchParams.get('utm_medium') || medium;
      campaign = url.searchParams.get('utm_campaign') || campaign;
      const saved = JSON.parse(sessionStorage.getItem('mw-attribution-v1') ?? 'null');
      if (!url.searchParams.has('utm_source') && source === 'direct' && saved?.session === session.id) ({ source, medium, campaign } = saved);
      sessionStorage.setItem('mw-attribution-v1', JSON.stringify({ session: session.id, source, medium, campaign }));
    } catch { /* Referrers and storage may be unavailable. */ }
    const state: Visit = { id: uuid(), visitor: visitor.id, session: session.id, started: now, updated: now, path: publicPath(pathname), source, medium, campaign,
      device: /ipad|tablet/i.test(navigator.userAgent) ? 'tablet' : /mobile|android/i.test(navigator.userAgent) ? 'mobile' : 'desktop', country: '', active: 0, depth: 0, sections: {}, counts: {}, events: [] };
    let lastTick = performance.now(), lastActivity = Date.now(), sessionActivity = now, dirty = true, disposed = false, pending = false;
    let clickTimer: ReturnType<typeof setTimeout> | undefined, searchTimer: ReturnType<typeof setTimeout> | undefined;
    const sentSearches = new Set<string>();
    function currentSection() {
      const nodes = [...document.querySelectorAll<HTMLElement>('main section, main article[data-analytics-section], main [data-analytics-section]')];
      const center = window.innerHeight / 2;
      return nodes.filter(el => { const b = el.getBoundingClientRect(); return b.top <= center && b.bottom > center; }).at(-1);
    }
    function tick() {
      const t = performance.now(); const seconds = Math.min(5, Math.max(0, (t - lastTick) / 1000)); lastTick = t;
      const videoPlaying = [...document.querySelectorAll('video')].some(v => !v.paused && v.getBoundingClientRect().bottom > 0 && v.getBoundingClientRect().top < innerHeight);
      if (document.visibilityState !== 'visible' || !document.hasFocus() || (Date.now() - lastActivity > 60_000 && !videoPlaying)) return;
      // Resume after a long idle period in the same page without carrying the old session.
      const current = Date.now();
      if (current - sessionActivity > 30 * 60_000 || istDay(state.started) !== istDay(current)) {
        flush(true, false);
        let nextSession = uuid();
        try { const saved = JSON.parse(localStorage.getItem('mw-session-v1') ?? 'null'); if (saved?.last > current - 30 * 60_000 && /^[a-z0-9-]{36}$/i.test(saved.id)) nextSession = saved.id; } catch { /* A new anonymous session is safe. */ }
        Object.assign(state, { id: uuid(), session: nextSession, started: current, updated: current, active: 0, depth: 0, sections: {}, counts: {}, events: [] });
        sentSearches.clear();
      }
      sessionActivity = current;
      state.active += seconds; dirty = true;
      const element = currentSection();
      if (element) { const key = safeLabel(element.dataset.analyticsSection || element.id || element.querySelector('h2,h3')?.textContent || 'Page content'); if (Object.keys(state.sections).length < 40 || key in state.sections) state.sections[key] = (state.sections[key] ?? 0) + seconds; }
      const height = document.documentElement.scrollHeight;
      state.depth = Math.max(state.depth, Math.min(100, Math.round((window.scrollY + window.innerHeight) / Math.max(height, window.innerHeight) * 100)));
      try { localStorage.setItem('mw-session-v1', JSON.stringify({ id: state.session, last: Date.now() })); } catch { /* Analytics never blocks browsing. */ }
    }
    function flush(beacon = false, countTime = true) {
      if (!dirty || disabled()) return;
      if (countTime) tick();
      const body = JSON.stringify(state);
      if (beacon) { const accepted = navigator.sendBeacon('/api/analytics/collect', new Blob([body], { type: 'application/json' })); if (accepted) dirty = false; return; }
      if (pending) return;
      pending = true; dirty = false;
      void fetch('/api/analytics/collect', { method: 'POST', body, headers: { 'Content-Type': 'application/json' }, keepalive: true, credentials: 'same-origin' })
        .then(r => { if (!r.ok) dirty = true; }).catch(() => { dirty = true; }).finally(() => { pending = false; });
    }
    function action(type: EventType, raw: string) {
      lastActivity = Date.now(); tick();
      const label = type === 'search' ? searchTopic(raw) : safeLabel(raw);
      const key = `${type}|${label}`;
      if (Object.keys(state.counts).length < 100 || key in state.counts) state.counts[key] = Math.min(500, (state.counts[key] ?? 0) + 1);
      state.events.push({ id: uuid(), at: Date.now(), type, label }); state.events = state.events.slice(-40); dirty = true; lastActivity = Date.now();
      clearTimeout(clickTimer); clickTimer = setTimeout(() => flush(), 1200);
    }
    function click(event: MouseEvent) {
      const element = event.target instanceof Element ? event.target.closest<HTMLElement>('a,button') : null;
      if (!element) return;
      const text = safeLabel(element.getAttribute('aria-label') || element.textContent || element.tagName.toLowerCase());
      if (element instanceof HTMLAnchorElement) {
        const href = element.getAttribute('href') || '';
        if (href.startsWith('tel:')) action('call', text);
        else if (/wa\.me\/|api\.whatsapp\.com|web\.whatsapp\.com/.test(href)) action('whatsapp', text);
        else if (/maps\.app\.goo\.gl|google\.[^/]+\/maps|goo\.gl\/maps/.test(href)) action('directions', text);
        else { try { const next = new URL(href, location.href); action('navigation', next.origin === location.origin ? publicPath(next.pathname) : next.hostname); } catch { action('click', text); } }
      } else action('click', text);
    }
    function search(event: Event) {
      const input = event.target;
      if (!(input instanceof HTMLInputElement) || input.type !== 'search') return;
      clearTimeout(searchTimer); searchTimer = setTimeout(() => { if (input.value.trim().length < 2) return; const topic = searchTopic(input.value); if (!sentSearches.has(topic)) { sentSearches.add(topic); action('search', topic); } }, 1200);
    }
    function submitSearch(event: Event) {
      const form = event.target;
      if (!(form instanceof HTMLFormElement)) return;
      const input = form.querySelector<HTMLInputElement>('input[type="search"]');
      if (!input || input.value.trim().length < 2) return;
      clearTimeout(searchTimer); const topic = searchTopic(input.value);
      if (!sentSearches.has(topic)) { sentSearches.add(topic); action('search', topic); }
      flush(true);
    }
    const custom = (event: Event) => { const d = (event as CustomEvent<{ type: EventType; label: string }>).detail; if (d) action(d.type, d.label); };
    const activity = () => { lastActivity = Date.now(); };
    const leave = () => { tick(); flush(true); };
    const visibility = () => { tick(); if (document.hidden) flush(true); else { lastTick = performance.now(); lastActivity = Date.now(); } };
    const start = setTimeout(() => flush(), 1500);
    const ticker = setInterval(tick, 2000), sender = setInterval(() => { if (!disposed) flush(); }, 30_000);
    document.addEventListener('click', click, true); document.addEventListener('input', search); document.addEventListener('submit', submitSearch, true); document.addEventListener('visibilitychange', visibility);
    window.addEventListener(actionEvent, custom); window.addEventListener('pagehide', leave);
    const activities = ['pointerdown', 'keydown', 'scroll', 'touchstart'] as const;
    activities.forEach(name => window.addEventListener(name, activity, { passive: true }));
    return () => { leave(); disposed = true; clearTimeout(start); clearTimeout(clickTimer); clearTimeout(searchTimer); clearInterval(ticker); clearInterval(sender);
      document.removeEventListener('click', click, true); document.removeEventListener('input', search); document.removeEventListener('submit', submitSearch, true); document.removeEventListener('visibilitychange', visibility);
      window.removeEventListener(actionEvent, custom); window.removeEventListener('pagehide', leave); activities.forEach(name => window.removeEventListener(name, activity)); };
  }, [off, pathname]);
  return null;
}
