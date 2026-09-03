/* Mobile World — scroll वाला सफ़र।
   पूरा इंजन skill के standard पर: seek gating, वो rAF loop जो काम ख़त्म होते ही
   सो जाता है, DOM पर लिखना सिर्फ़ बदलाव पर, caption की नाप scroll की दूरी में,
   और पाँचों हालतों में ठहरी हुई तस्वीर। बड़ी screen पर सफ़र video से चलता है;
   phone पर और video न आ पाने पर वही सफ़र तस्वीरों की परतों से चलता है। */
(function () {
  'use strict';

  var VIDEO_URL = '/showcase/assets/hero-scrub.mp4';
  var VIDEO_BYTES = 8026975;

  var hero = document.getElementById('hero');
  var stage = document.getElementById('stage');
  var video = document.getElementById('hero-video');
  var ring = document.getElementById('ring');
  var layers = [].slice.call(document.querySelectorAll('.layer'));
  var yr = document.getElementById('yr');
  if (yr) yr.textContent = String(new Date().getFullYear());

  /* ── caption के खाने ── */
  var bands = [].slice.call(document.querySelectorAll('.band')).map(function (el) {
    var r = (el.getAttribute('data-band') || '0,1').split(',');
    var ramp = parseFloat(el.getAttribute('data-ramp') || '0');
    return { el: el, a: parseFloat(r[0]), b: parseFloat(r[1]), ramp: ramp, op: -1, k: -1 };
  });

  /* ── अक्षरों में तोड़ना, एक ही बार, हर बार एक जैसा ── */
  function rng(seed) { var s = seed >>> 0;
    return function () { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; }; }

  /* ⚠️ देवनागरी को अक्षर-अक्षर मत तोड़िए। मात्रा और संयुक्ताक्षर अपने
     व्यंजन से जुड़े रहते हैं; एक-एक character को अलग span में डालते ही
     shaping टूट जाती है और "बजे" की जगह "बज◌े" छपने लगता है। इसलिए
     तोड़ शब्द पर होती है — animation वही रहती है, अक्षर सही रहते हैं। */
  [].slice.call(document.querySelectorAll('[data-split]')).forEach(function (el, bi) {
    var text = el.textContent.trim();
    var rand = rng(1234 + bi * 77);
    var sr = document.createElement('span');
    sr.className = 'sr'; sr.textContent = text;
    var vis = document.createElement('span');
    vis.setAttribute('aria-hidden', 'true');
    var words = text.split(' ');
    words.forEach(function (w, wi) {
      var ws = document.createElement('span');
      ws.className = 'w c';
      ws.textContent = w;
      ws.style.setProperty('--th', (wi / Math.max(1, words.length) * 0.5 + rand() * 0.06).toFixed(3));
      ws.style.setProperty('--jx', Math.round((rand() - 0.5) * 44) + 'px');
      ws.style.setProperty('--jy', Math.round((rand() - 0.5) * 30 + 16) + 'px');
      ws.style.setProperty('--jr', Math.round((rand() - 0.5) * 10) + 'deg');
      vis.appendChild(ws);
      if (wi < words.length - 1) vis.appendChild(document.createTextNode(' '));
    });
    el.textContent = '';
    el.appendChild(sr); el.appendChild(vis);
  });

  var smoothstep = function (p, e0, e1) {
    var t = Math.min(1, Math.max(0, (p - e0) / (e1 - e0)));
    return t * t * (3 - 2 * t);
  };
  var clamp = function (v, lo, hi) { return Math.min(hi, Math.max(lo, v)); };

  function heroProgress() {
    var r = hero.getBoundingClientRect();
    var range = hero.offsetHeight - window.innerHeight;
    if (range <= 0) return 0;
    return clamp(-r.top / range, 0, 1);
  }

  /* ── captions और परतें, सिर्फ़ बदलाव पर ── */
  var loadK = 0;
  function updateCaptions(p) {
    for (var i = 0; i < bands.length; i++) {
      var bd = bands[i];
      var f = Math.min(0.02, (bd.b - bd.a) / 3);
      var inRamp = i === 0 ? 1 : smoothstep(p, bd.a, bd.a + f);
      var outRamp = i === bands.length - 1 ? 1 : (1 - smoothstep(p, bd.b - f, bd.b));
      var op = inRamp * outRamp;
      var k = clamp((p - bd.a) / (bd.ramp || Math.min(0.025, (bd.b - bd.a) * 0.35)), 0, 1);
      if (i === 0) k = Math.max(k, loadK);
      if (Math.abs(op - bd.op) > 0.004) { bd.el.style.opacity = op.toFixed(3); bd.op = op; }
      if (Math.abs(k - bd.k) > 0.008) { bd.el.style.setProperty('--k', k.toFixed(3)); bd.k = k; }
    }
    if (!stage.classList.contains('video-ready')) updateLayers(p);
  }

  /* परतों वाला सफ़र: बाहर रात → अंदर → counter → लोग।
     सिर्फ़ transform और opacity, इसलिए phone पर भी हल्का रहता है। */
  var lastLayer = [];
  function updateLayers(p) {
    var n = layers.length, seg = 1 / (n - 1);
    for (var i = 0; i < n; i++) {
      var c = i * seg;
      var d = Math.abs(p - c) / seg;
      var op = clamp(1 - d, 0, 1);
      op = op * op * (3 - 2 * op);
      // सबसे नीचे वाली परत हमेशा पूरी — इसलिए दो तस्वीरों के बीच में भी
      // frame कभी काला नहीं पड़ता, बस एक तस्वीर दूसरी में घुलती है।
      if (i === 0) op = 1;
      var local = clamp((p - (c - seg)) / (seg * 2), 0, 1);
      var sc = 1.16 - 0.14 * local;
      var ty = (0.5 - local) * 5;
      if (lastLayer[i] === undefined || Math.abs(op - lastLayer[i]) > 0.004) {
        layers[i].style.opacity = op.toFixed(3);
        layers[i].style.transform = 'translate3d(0,' + ty.toFixed(2) + '%,0) scale(' + sc.toFixed(3) + ')';
        lastLayer[i] = op;
      }
    }
  }

  /* ── वो loop जो काम ख़त्म होते ही सो जाता है ── */
  var target = 0, shown = 0, rafId = null, lastTick = 0, onScreen = true;
  function tick(now) {
    var dt = Math.min(100, now - (lastTick || now));
    lastTick = now;
    var k = 0.16;
    shown += (target - shown) * (1 - Math.pow(1 - k, dt / 16.667));
    if (Math.abs(target - shown) < 0.0005) { shown = target; rafId = null; lastTick = 0; }
    else rafId = requestAnimationFrame(tick);
    if (video.duration) requestSeek(shown * video.duration);
    updateCaptions(shown);
  }
  function onScroll() {
    target = heroProgress();
    if (rafId === null && onScreen) rafId = requestAnimationFrame(tick);
  }

  /* ── seek का दरवाज़ा: एक बार में एक ही ── */
  var seekBusy = false, pendingTime = null;
  function requestSeek(t) {
    if (!video.duration) return;
    if (seekBusy) { pendingTime = t; return; }
    seekBusy = true; video.currentTime = t;
  }
  video.addEventListener('seeked', function () {
    seekBusy = false;
    if (pendingTime !== null) { var t = pendingTime; pendingTime = null; requestSeek(t); }
  });
  video.addEventListener('error', function () { seekBusy = false; pendingTime = null; failVideo(); });

  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (es) {
      onScreen = es[0].isIntersecting;
      if (onScreen) onScroll();
      else if (rafId !== null) { cancelAnimationFrame(rafId); rafId = null; }
    }, { rootMargin: '80px' }).observe(hero);
  }

  /* ── video: है तो चलेगी, नहीं है तो तस्वीरें ही सफ़र हैं ── */
  var started = false;
  function startBlobFetch() {
    if (started) return; started = true;
    // Video रखी ही नहीं गई तो माँगते भी नहीं — console में एक भी लाल line नहीं।
    if (!window.HAS_HERO_VIDEO) return;
    loadHeroBlob().catch(failVideo);
  }
  function failVideo() { if (ring) ring.classList.remove('on'); }

  function loadHeroBlob() {
    var ctrl = new AbortController();
    var watchdog = setTimeout(function () { ctrl.abort(); }, 20000);
    if (ring) ring.classList.add('on');
    return fetch(VIDEO_URL, { signal: ctrl.signal }).then(function (res) {
      if (!res.ok || !res.body) throw new Error('no video');
      var total = Number(res.headers.get('Content-Length')) || VIDEO_BYTES;
      var mime = (res.headers.get('Content-Type') || 'video/mp4').split(';')[0];
      var reader = res.body.getReader(), chunks = [], got = 0, lastRing = 0;
      function pump() {
        return reader.read().then(function (r) {
          if (r.done) return;
          clearTimeout(watchdog);
          watchdog = setTimeout(function () { ctrl.abort(); }, 20000);
          chunks.push(r.value); got += r.value.length;
          var frac = Math.min(1, got / total), now = performance.now();
          if (now - lastRing > 100 || frac === 1) {
            lastRing = now;
            if (ring) ring.style.setProperty('--ld', Math.round(126 * (1 - frac)));
          }
          return pump();
        });
      }
      return pump().then(function () {
        clearTimeout(watchdog);
        if (ring) { ring.style.setProperty('--ld', 0); ring.classList.remove('on'); }
        // Blob par MIME लिखना ज़रूरी है — बिना type के browser blob: वाली
        // video को पहचानता ही नहीं (error 4)। preload भी यहीं खोलना पड़ता है,
        // वरना 'none' रहते हुए वो एक byte भी buffer नहीं करता और canplay
        // कभी नहीं आता।
        video.preload = 'auto';
        video.src = URL.createObjectURL(new Blob(chunks, { type: mime }));
        video.load();
        video.addEventListener('canplay', function () {
          requestSeek(heroProgress() * video.duration);
          stage.classList.add('video-ready');
        }, { once: true });
      });
    });
  }

  /* ── पाँच हालतें, हमेशा ज़िंदा (CSS वाली नाप से हूबहू) ── */
  var GATES = [
    '(max-width: 720px)',
    '(orientation: portrait) and (max-width: 1024px)',
    '(orientation: portrait) and (pointer: coarse)',
    '(orientation: landscape) and (pointer: coarse) and (max-height: 560px)',
    '(prefers-reduced-motion: reduce)'
  ];
  var MQLS = GATES.map(function (q) { return matchMedia(q); });
  var scrubOn = false, inited = false;

  function initOnce() {
    if (inited) return; inited = true;
    startBlobFetch();
    var t0 = performance.now();
    (function ramp(now) {
      loadK = Math.min(1, (now - t0) / 900);
      updateCaptions(shown);
      if (loadK < 1) requestAnimationFrame(ramp);
    })(t0);
  }
  function enableScrub() {
    if (scrubOn) return; scrubOn = true;
    initOnce();
    addEventListener('scroll', onScroll, { passive: true });
    bands.forEach(function (b) { b.op = -1; b.k = -1; });
    lastLayer = [];
    updateCaptions(heroProgress());
    onScroll();
  }
  function disableScrub() {
    if (!scrubOn) return; scrubOn = false;
    removeEventListener('scroll', onScroll);
    if (rafId !== null) { cancelAnimationFrame(rafId); rafId = null; }
  }
  function applyHeroMode() {
    var still = MQLS.some(function (m) { return m.matches; });
    if (still) { disableScrub(); loadK = 1; bands.forEach(function (b) { b.el.style.removeProperty('--k'); }); }
    else enableScrub();
  }
  MQLS.forEach(function (m) { m.addEventListener('change', applyHeroMode); });
  applyHeroMode();

  /* ── नीचे के हिस्सों का आना ── */
  if ('IntersectionObserver' in window) {
    var rvo = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); rvo.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -12% 0px' });
    [].slice.call(document.querySelectorAll('.rv')).forEach(function (el) { rvo.observe(el); });
  } else {
    [].slice.call(document.querySelectorAll('.rv')).forEach(function (el) { el.classList.add('in'); });
  }

  /* ── वो लकीर जो scroll के साथ ख़ुद खिंचती है ── */
  var thread = document.querySelector('.thread i');
  if (thread) {
    var tSec = thread.closest('.sec');
    var tLast = -1;
    var drawIt = function () {
      var r = tSec.getBoundingClientRect();
      var d = clamp((window.innerHeight - r.top) / (r.height + window.innerHeight * 0.5), 0, 1);
      if (Math.abs(d - tLast) > 0.01) { thread.style.setProperty('--draw', d.toFixed(2)); tLast = d; }
    };
    addEventListener('scroll', drawIt, { passive: true });
    drawIt();
  }

  /* ── शटर: दबाकर रखिए ── */
  var hold = document.getElementById('hold');
  var holdBtn = document.getElementById('holdBtn');
  if (hold && holdBtn) {
    var h = 0, holding = false, hRaf = null, hLast = -1;
    var reduce = matchMedia('(prefers-reduced-motion: reduce)');
    function paint() {
      if (Math.abs(h - hLast) > 0.01) { hold.style.setProperty('--h', h.toFixed(2)); hLast = h; }
      if (h >= 1) hold.classList.add('done');
    }
    function loop() {
      h += holding ? 0.022 : -0.03;
      h = clamp(h, 0, 1);
      paint();
      if ((holding && h < 1) || (!holding && h > 0)) hRaf = requestAnimationFrame(loop);
      else hRaf = null;
    }
    function start(e) {
      if (e && e.cancelable) e.preventDefault();
      if (reduce.matches) { h = 1; paint(); return; }
      holding = true; if (hRaf === null) hRaf = requestAnimationFrame(loop);
    }
    function stop() { holding = false; if (hRaf === null && h > 0) hRaf = requestAnimationFrame(loop); }
    ['mousedown', 'touchstart', 'pointerdown'].forEach(function (ev) {
      holdBtn.addEventListener(ev, start, { passive: false });
    });
    ['mouseup', 'mouseleave', 'touchend', 'touchcancel', 'pointerup', 'pointercancel'].forEach(function (ev) {
      holdBtn.addEventListener(ev, stop);
    });
    holdBtn.addEventListener('keydown', function (e) {
      if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); start(); }
    });
    holdBtn.addEventListener('keyup', stop);
    if (reduce.matches) { h = 1; paint(); }
  }

  /* ── जो न देखे, वो न चले ── */
  document.addEventListener('visibilitychange', function () {
    document.body.classList.toggle('paused', document.hidden);
  });

  /* ── reduce motion बीच में चालू/बंद हो तो ── */
  matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', function () {
    applyHeroMode();
  });
})();
