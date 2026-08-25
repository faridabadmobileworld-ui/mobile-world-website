/* ═══════════════════════════════════════════════════════════════════
   PREVIEW RUNTIME — sirf `preview/index.html` ke liye.

   Asli website React se chalti hai (components/ folder). Preview ek hi
   file hai, isliye usme React nahi ja sakta — ye chhota sa vanilla JS
   wahi kaam karta hai: menu, slider, search, dukaan ka status, aur
   pages ke beech aana-jaana.

   Yaad rakhiye: kuch badalna ho to `components/` badaliye — asli site
   wahi hai. Ye file sirf preview ko chalane ke liye hai.
   ═══════════════════════════════════════════════════════════════════ */
(function () {
  "use strict";

  var VIEWS = window.__PV_VIEWS || {};
  var main = document.getElementById("main");

  /* ── 1. Pages ke beech aana-jaana ─────────────────────────────── */

  function norm(p) {
    p = (p || "/").split("?")[0].replace(/\/+$/, "");
    return p === "" ? "/" : p;
  }

  function markActive(route) {
    document.querySelectorAll("a[href]").forEach(function (a) {
      var href = a.getAttribute("href") || "";
      if (!href.startsWith("/")) return;
      var same = norm(href.split("#")[0]) === route;
      a.classList.toggle("pv-active", same);
      if (same) a.setAttribute("aria-current", "page");
      else a.removeAttribute("aria-current");
    });
  }

  function show(route, hash) {
    route = norm(route);
    var view = VIEWS[route];
    if (!view) { route = "/"; view = VIEWS["/"]; }

    main.innerHTML = view.html;
    document.title = view.title;
    markActive(route);
    applyImages(main);
    startCarousel();

    try {
      history.replaceState(null, "", "#" + route + (hash ? "#" + hash : ""));
    } catch { /* file:// par kabhi mana kar deta hai — koi baat nahi */ }

    if (hash) {
      var el = document.getElementById(hash);
      if (el) { el.scrollIntoView({ block: "start" }); return; }
    }
    window.scrollTo(0, 0);
  }

  document.addEventListener("click", function (e) {
    var a = e.target.closest("a");
    if (!a) return;
    var href = a.getAttribute("href") || "";

    // Bahar ke links (WhatsApp, call, map, YouTube…) waise hi chalein.
    if (!href.startsWith("/")) return;

    e.preventDefault();
    closeDrawer();
    var i = href.indexOf("#");
    show(i > -1 ? href.slice(0, i) : href, i > -1 ? href.slice(i + 1) : "");
  });

  addEventListener("hashchange", function () {
    var h = location.hash.replace(/^#/, "");
    if (!h) return;
    var parts = h.split("#");
    show(parts[0], parts[1] || "");
  });

  /* ── 2. Images ─────────────────────────────────────────────────── */

  var IMG = window.__PV_IMG || {};
  function applyImages(root) {
    (root || document).querySelectorAll("img[data-img]").forEach(function (el) {
      var u = IMG[el.getAttribute("data-img")];
      if (u && el.src !== u) el.src = u;
    });
  }

  /* ── 3. Menu drawer ───────────────────────────────────────────── */

  var drawer = document.getElementById("drawer");
  var menuBtn = document.querySelector('[aria-label="Open menu"]');

  function setDrawer(open) {
    if (!drawer) return;
    drawer.classList.toggle("open", open);
    if (menuBtn) menuBtn.setAttribute("aria-expanded", String(open));
    document.body.style.overflow = open ? "hidden" : "";
  }
  function closeDrawer() { setDrawer(false); }

  if (menuBtn) menuBtn.addEventListener("click", function () {
    setDrawer(!drawer.classList.contains("open"));
  });
  if (drawer) drawer.addEventListener("click", function (e) {
    if (e.target.classList.contains("veil")) closeDrawer();
  });
  addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeDrawer();
  });

  /* ── 4. Hero slider ───────────────────────────────────────────── */

  var timer = null;

  function startCarousel() {
    if (timer) { clearInterval(timer); timer = null; }

    var box = main.querySelector(".hs");
    if (!box) return;

    var slides = [].slice.call(box.querySelectorAll(".hs-s"));
    var dots = [].slice.call(box.querySelectorAll(".hs-ui button"));
    var btns = [].slice.call(box.querySelectorAll(".hs-ar button"));
    if (slides.length < 2) return;

    var reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    var i = slides.findIndex(function (s) { return s.classList.contains("on"); });
    if (i < 0) i = 0;
    var paused = reduce;

    // Teen buttons: pause/play, pichhla, agla. Reduced-motion par pause chhupa hota hai.
    var pauseBtn = btns.length === 3 ? btns[0] : null;
    var prevBtn = btns[btns.length - 2];
    var nextBtn = btns[btns.length - 1];

    var ICO_PAUSE = '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">'
      + '<rect x="6" y="5" width="4" height="14" rx="1"></rect><rect x="14" y="5" width="4" height="14" rx="1"></rect></svg>';
    var ICO_PLAY = '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">'
      + '<path d="M8 5l11 7-11 7z"></path></svg>';

    function go(n) {
      i = (n + slides.length) % slides.length;
      slides.forEach(function (s, k) {
        s.classList.toggle("on", k === i);
        s.setAttribute("aria-hidden", k === i ? "false" : "true");
      });
      dots.forEach(function (d, k) {
        d.classList.toggle("on", k === i);
        d.setAttribute("aria-current", k === i ? "true" : "false");
      });
      restart();
    }
    function restart() {
      if (timer) clearInterval(timer);
      timer = paused ? null : setInterval(function () { go(i + 1); }, 6000);
    }

    dots.forEach(function (d, k) { d.onclick = function () { go(k); }; });
    if (prevBtn) prevBtn.onclick = function () { go(i - 1); };
    if (nextBtn) nextBtn.onclick = function () { go(i + 1); };

    if (pauseBtn) {
      pauseBtn.onclick = function () {
        paused = !paused;
        pauseBtn.setAttribute("aria-pressed", String(paused));
        pauseBtn.setAttribute("aria-label", paused ? "Play slideshow" : "Pause slideshow");
        pauseBtn.innerHTML = paused ? ICO_PLAY : ICO_PAUSE;
        restart();
      };
    }

    box.onmouseenter = function () { if (!reduce && timer) clearInterval(timer); };
    box.onmouseleave = function () { if (!reduce && !paused) restart(); };
    box.onkeydown = function (e) {
      if (e.key === "ArrowRight") { e.preventDefault(); go(i + 1); }
      if (e.key === "ArrowLeft") { e.preventDefault(); go(i - 1); }
    };

    var x0 = 0;
    box.addEventListener("touchstart", function (e) { x0 = e.touches[0].clientX; }, { passive: true });
    box.addEventListener("touchend", function (e) {
      var dx = e.changedTouches[0].clientX - x0;
      if (Math.abs(dx) > 45) go(i + (dx < 0 ? 1 : -1));
    }, { passive: true });

    document.addEventListener("visibilitychange", function () {
      if (document.hidden) { if (timer) clearInterval(timer); }
      else restart();
    });

    go(i);
  }

  /* ── 5. Dukaan khuli hai ya band ──────────────────────────────── */

  var MONTHS = ["January", "February", "March", "April", "May", "June",
                "July", "August", "September", "October", "November", "December"];

  function istNow() {
    try {
      var p = {};
      new Intl.DateTimeFormat("en-GB", {
        timeZone: "Asia/Kolkata", year: "numeric", month: "numeric", day: "numeric",
        hour: "numeric", minute: "numeric", hour12: false,
      }).formatToParts(new Date()).forEach(function (x) { p[x.type] = x.value; });
      return new Date(+p.year, +p.month - 1, +p.day, +p.hour % 24, +p.minute);
    } catch { return new Date(); }
  }

  function paintStatus() {
    var now = istNow();
    var last = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    var closedToday = now.getDate() === last.getDate();
    var h = now.getHours() + now.getMinutes() / 60;
    var open = !closedToday && h >= 10 && h < 22;
    // Aaj hi aakhri tareekh hai to agli chhutti agle mahine ki aakhri tareekh.
    var next = closedToday ? new Date(now.getFullYear(), now.getMonth() + 2, 0) : last;

    var label = closedToday ? "Closed today — last date of the month"
      : open ? "Open now · until 10 PM" : "Closed · opens 10 AM";

    document.querySelectorAll(".live").forEach(function (el) {
      var dot = el.querySelector("i"), txt = el.querySelector("span");
      if (dot) dot.classList.toggle("shut", !open);
      if (txt) txt.textContent = label;
    });
    document.querySelectorAll("[data-nc], .cband b, footer b").forEach(function (el) {
      if (/^\s*[—-]\s*$/.test(el.textContent)) {
        el.textContent = next.getDate() + " " + MONTHS[next.getMonth()];
      }
    });
  }

  /* ── 6. Search ─────────────────────────────────────────────────── */

  document.addEventListener("submit", function (e) {
    var form = e.target.closest(".searchbox");
    if (!form) return;
    e.preventDefault();
    var input = form.querySelector('input[type="search"]');
    var q = (input && input.value || "").trim();
    closeDrawer();
    show("/products");
    if (q) filterProducts(q);
  });

  function filterProducts(q) {
    var needle = q.toLowerCase();
    var cards = [].slice.call(main.querySelectorAll(".pc"));
    var hits = 0;

    cards.forEach(function (c) {
      var match = c.textContent.toLowerCase().indexOf(needle) > -1;
      c.hidden = !match;
      if (match) hits++;
    });

    // Jis category mein kuch nahi bacha, uska heading bhi hata do.
    main.querySelectorAll("section.sec").forEach(function (sec) {
      var inSec = [].slice.call(sec.querySelectorAll(".pc"));
      if (inSec.length) sec.hidden = !inSec.some(function (c) { return !c.hidden; });
    });

    var note = document.createElement("p");
    note.className = "pv-searchnote";
    note.innerHTML = hits
      ? hits + ' cheez' + (hits === 1 ? "" : "ein") + ' mili "' + esc(q) + '" ke liye. '
        + '<button type="button" class="pv-clear">Saaf kijiye</button>'
      : 'Kuch nahi mila "' + esc(q) + '" ke liye. WhatsApp par pooch lijiye. '
        + '<button type="button" class="pv-clear">Saaf kijiye</button>';

    var old = main.querySelector(".pv-searchnote");
    if (old) old.remove();
    var head = main.querySelector(".sec");
    if (head) head.insertAdjacentElement("afterbegin", note);

    note.querySelector(".pv-clear").onclick = function () { show("/products"); };
    note.scrollIntoView({ block: "center" });
  }

  function esc(s) {
    return s.replace(/[&<>"]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
    });
  }

  /* ── 7. Header ki asli height ─────────────────────────────────── */

  var hdr = document.querySelector(".hdr");
  function syncHeader() {
    if (!hdr) return;
    document.documentElement.style.setProperty(
      "--hdr", Math.round(hdr.getBoundingClientRect().height) + "px");
  }

  /* ── Shuruaat ─────────────────────────────────────────────────── */

  applyImages(document);
  syncHeader();
  addEventListener("resize", syncHeader, { passive: true });
  if (window.ResizeObserver && hdr) new ResizeObserver(syncHeader).observe(hdr);

  paintStatus();
  setInterval(paintStatus, 60000);

  var start = location.hash.replace(/^#/, "");
  if (start) {
    var parts = start.split("#");
    show(parts[0], parts[1] || "");
  } else {
    markActive("/");
    startCarousel();
  }
})();
