"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { shop } from "@/data/shop";
import { IconArrow, IconWhatsApp } from "./Icons";

/**
 * Header का 3D phone — scroll के साथ खुलता और वापस जुड़ता हुआ।
 *
 * Owner ने अपनी भेजी video का ठीक वही क्रम माँगा था:
 *   जुड़ा हुआ phone → scroll → पीछे का panel और camera अलग होते हैं →
 *   अंदर का board, chip और battery दिखते हैं → आगे scroll पर सब वापस
 *   अपनी जगह जुड़ जाता है।
 *
 * यह कोई video या तस्वीर नहीं है। हर frame **GPU पर उसी वक़्त बनता है** —
 * phone का हर हिस्सा गणित से बना है (raymarching + SDF), और उस पर असली
 * रोशनी पड़ती है। इसीलिए यह हर screen पर उतना ही साफ़ है और scroll के हर
 * बिंदु पर रुक सकता है, जो किसी video से नहीं हो सकता।
 *
 * ⛔ **कोई library नहीं।** Three.js ~150 KB का होता और उसके लिए एक असली
 *    3D model file भी चाहिए होती। यहाँ download में एक भी नई file नहीं।
 *
 * उँगली से पकड़कर घुमाइए भी — scroll वाली चाल के ऊपर।
 *
 * ⚠️ **पीछे brand का निशान अभी सिर्फ़ उभार (emboss) है, असली नहीं।**
 *    Owner ने 7 Sep 2026 को कहा कि brand से permission वो ख़ुद ले लेंगे —
 *    इसलिए यह मना नहीं, सिर्फ़ file का इंतज़ार है। किसी logo को हाथ से
 *    बनाकर लगाना दो वजहों से ग़लत है: (क) §11 — logo हमेशा brand kit की
 *    असली file से आता है, नक़ल से नहीं; (ख) इस fidelity पर हाथ की बनाई
 *    नक़ल भद्दी दिखेगी और पूरा phone सस्ता लगने लगेगा।
 *    Owner असली file दें → `back` वाले हिस्से में उसी जगह texture लग जाएगी,
 *    बाक़ी कुछ बदलना नहीं पड़ेगा।
 */

const VERT = `#version 300 es
in vec2 p;
void main(){ gl_Position = vec4(p, 0.0, 1.0); }`;

const FRAG = `#version 300 es
precision highp float;
out vec4 outColor;

uniform vec2  uRes;
uniform float uT;
uniform vec2  uRot;   // ungli se ghumaav
uniform float uEx;    // 0 = poora juda hua, 1 = poora khula hua

/* ── aakar ───────────────────────────────────────────────────────────── */
float sdBox(vec3 p, vec3 b, float r){
  vec3 q = abs(p) - b + r;
  return length(max(q, 0.0)) + min(max(q.x, max(q.y, q.z)), 0.0) - r;
}
float sdCyl(vec3 p, float h, float r){
  vec2 d = abs(vec2(length(p.xy), p.z)) - vec2(r, h);
  return min(max(d.x, d.y), 0.0) + length(max(d, 0.0));
}
mat3 rotY(float a){ float c=cos(a), s=sin(a); return mat3(c,0.0,-s, 0.0,1.0,0.0, s,0.0,c); }
mat3 rotX(float a){ float c=cos(a), s=sin(a); return mat3(1.0,0.0,0.0, 0.0,c,s, 0.0,-s,c); }

/* Har hisse ka apna naam:
   1 peechhe ka panel · 2 kinare ki dhaatu · 3 screen · 4 camera ka dibba
   5 lens · 6 andar ka board · 7 chip · 8 battery                        */
vec2 uni(vec2 a, vec2 b){ return a.x < b.x ? a : b; }

vec2 map(vec3 p){
  vec3 q = rotX(uRot.y) * rotY(uRot.x) * (p - vec3(0.0, 0.46, 0.0));
  float e = uEx;

  // ── peechhe ka panel — sabse peechhe khisakta hai
  vec3 bp = q - vec3(0.0, 0.0, -0.052 - e*1.75);
  vec2 back = vec2(sdBox(bp, vec3(0.585, 1.215, 0.030), 0.155), 1.0);

  // logo ki jagah — halka sa ubhaar (asli logo brand kit se aayega)
  float logo = sdCyl(bp - vec3(0.0, -0.06, 0.028), 0.006, 0.135);
  back.x = min(back.x, logo);

  // ── camera ka dibba aur teen lens — peechhe aur upar ki taraf
  vec3 cp = q - vec3(-0.235, 0.735, -0.118 - e*2.35) - vec3(0.0, e*0.32, 0.0);
  vec2 cam = vec2(sdBox(cp, vec3(0.315, 0.375, 0.040), 0.13), 4.0);
  vec3 lp = cp - vec3(0.0, 0.0, -0.032);
  float l1 = sdCyl(lp - vec3(-0.118,  0.150, 0.0), 0.030, 0.110);
  float l2 = sdCyl(lp - vec3( 0.118,  0.010, 0.0), 0.036, 0.128);
  float l3 = sdCyl(lp - vec3(-0.118, -0.122, 0.0), 0.030, 0.110);
  float fl = sdCyl(lp - vec3( 0.145,  0.252, 0.0), 0.022, 0.052);
  vec2 lens = vec2(min(min(l1,l2), min(l3,fl)), 5.0);

  // ── andar ka board — daayen khiskta hai
  vec3 lb = q - vec3(e*0.62, 0.30, -0.010 - e*0.55);
  vec2 board = vec2(sdBox(lb, vec3(0.30, 0.66, 0.016), 0.03), 6.0);
  // chip — board ke beech mein
  vec2 chip = vec2(sdBox(lb - vec3(0.0, 0.05, 0.020), vec3(0.115, 0.115, 0.012), 0.012), 7.0);

  // ── battery — baayen khiskti hai
  vec3 bt = q - vec3(-e*0.62, -0.42, -0.010 - e*0.42);
  vec2 batt = vec2(sdBox(bt, vec3(0.36, 0.60, 0.024), 0.05), 8.0);

  // ── kinare ki dhaatu — apni jagah rehti hai, isi par sab judta hai
  float outer = sdBox(q, vec3(0.605, 1.245, 0.090), 0.175);
  float inner = sdBox(q, vec3(0.560, 1.200, 0.140), 0.140);
  vec2 rail = vec2(max(outer, -inner), 2.0);

  // ── screen — aage ki taraf
  vec3 sp = q - vec3(0.0, 0.0, 0.055 + e*1.45);
  vec2 scr = vec2(sdBox(sp, vec3(0.558, 1.198, 0.028), 0.145), 3.0);

  vec2 r = back;
  r = uni(r, cam); r = uni(r, lens);
  r = uni(r, board); r = uni(r, chip);
  r = uni(r, batt); r = uni(r, rail); r = uni(r, scr);
  return r;
}

vec3 normalAt(vec3 p){
  vec2 e = vec2(0.0013, 0.0);
  return normalize(vec3(
    map(p+e.xyy).x - map(p-e.xyy).x,
    map(p+e.yxy).x - map(p-e.yxy).x,
    map(p+e.yyx).x - map(p-e.yyx).x));
}

void main(){
  vec2 uv = (gl_FragCoord.xy*2.0 - uRes) / min(uRes.x, uRes.y);

  vec3 ro = vec3(0.0, 0.0, 3.95);
  vec3 rd = normalize(vec3(uv * 0.70, -1.0));

  float t = 0.0; float id = 0.0; vec3 p = ro;
  for (int i = 0; i < 96; i++){
    p = ro + rd*t;
    vec2 h = map(p);
    if (h.x < 0.0016){ id = h.y; break; }
    t += h.x * 0.90;
    if (t > 9.0) break;
  }

  vec3 col = vec3(0.0);
  float a = 0.0;

  if (id > 0.5){
    vec3 n = normalAt(p);
    vec3 v = -rd;
    vec3 k1 = normalize(vec3(-0.50, 0.88, 0.72));   // tez roshni, upar-baayen
    vec3 k2 = normalize(vec3( 0.86, 0.10, 0.50));   // naram roshni, daayen

    float d1 = max(dot(n, k1), 0.0);
    float d2 = max(dot(n, k2), 0.0);
    float fres = pow(1.0 - max(dot(n, v), 0.0), 3.0);
    float s1 = pow(max(dot(reflect(-k1, n), v), 0.0), 66.0);
    float s2 = pow(max(dot(reflect(-k2, n), v), 0.0), 28.0);

    // video wala gehra laal-baingani
    vec3 wine = vec3(0.352, 0.075, 0.126);
    vec3 rail = vec3(0.520, 0.238, 0.268);

    if (id < 1.5){                    // peechhe ka panel
      col = mix(wine, rail, fres*0.75) * (0.30 + d1*0.80 + d2*0.34);
      col += s1*0.95 + s2*0.34;
    } else if (id < 2.5){             // kinare ki dhaatu — sabse zyada chamak
      col = mix(rail, vec3(0.78,0.56,0.58), fres*0.9) * (0.38 + d1*0.92 + d2*0.40);
      col += s1*1.5 + s2*0.6;
    } else if (id < 3.5){             // screen — kaala kaanch
      col = vec3(0.030,0.024,0.040) * (0.5 + d1*0.5);
      col += s1*1.45 + s2*0.55;
      col += vec3(0.42,0.16,0.24) * fres * 0.62;
    } else if (id < 4.5){             // camera ka dibba
      col = mix(wine*1.12, rail, fres*0.7) * (0.30 + d1*0.76 + d2*0.30);
      col += s1*0.80;
    } else if (id < 5.5){             // lens
      col = vec3(0.026,0.030,0.052) * (0.4 + d1*0.5);
      col += s1*1.9 + s2*0.8;
      col += vec3(0.20,0.36,0.66) * fres * 0.95;
    } else if (id < 6.5){             // andar ka board
      col = vec3(0.055,0.105,0.085) * (0.34 + d1*0.80);
      col += s1*0.40;
      col += vec3(0.55,0.42,0.14) * fres * 0.40;   // sone jaisi patrian
    } else if (id < 7.5){             // chip
      col = vec3(0.24,0.52,0.72) * (0.42 + d1*0.85);
      col += s1*0.9 + vec3(0.35,0.62,0.85)*fres*0.6;
    } else {                          // battery
      col = vec3(0.085,0.082,0.098) * (0.36 + d1*0.72);
      col += s1*0.34 + vec3(0.30,0.26,0.32)*fres*0.5;
    }
    a = 1.0;
  }

  // neeche sunehri chhalla, jaisa owner ki video mein hai
  float ring = exp(-abs(uv.y + 0.42)*9.0) * exp(-abs(uv.x)*0.9);
  col += vec3(0.92, 0.66, 0.30) * ring * 0.55;
  a = max(a, ring*0.85);

  // chaaron taraf naram ujala
  float glow = exp(-t*0.44) * 0.13;
  col += mix(vec3(0.45,0.16,0.24), vec3(0.72,0.36,0.30), uv.x*0.5+0.5) * glow;
  a = max(a, glow*2.2);

  outColor = vec4(col, clamp(a, 0.0, 1.0));
}`;

export function GLPhone() {
  const ref = useRef<HTMLCanvasElement>(null);
  const wrap = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cv = ref.current;
    const box = wrap.current;
    if (!cv || !box) return;

    const soft = matchMedia("(prefers-reduced-motion: reduce)").matches;

    const gl = cv.getContext("webgl2", {
      alpha: true, antialias: false, depth: false, stencil: false,
      premultipliedAlpha: false, powerPreference: "high-performance",
    });
    if (!gl) return;

    function make(type: number, src: string) {
      const s = gl!.createShader(type)!;
      gl!.shaderSource(s, src);
      gl!.compileShader(s);
      return gl!.getShaderParameter(s, gl!.COMPILE_STATUS) ? s : null;
    }
    const vs = make(gl.VERTEX_SHADER, VERT);
    const fs = make(gl.FRAGMENT_SHADER, FRAG);
    if (!vs || !fs) return;

    const prog = gl.createProgram()!;
    gl.attachShader(prog, vs); gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 3,-1, -1,3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, "p");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    const uRes = gl.getUniformLocation(prog, "uRes");
    const uT = gl.getUniformLocation(prog, "uT");
    const uRot = gl.getUniformLocation(prog, "uRot");
    const uEx = gl.getUniformLocation(prog, "uEx");

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    function size() {
      const r = cv!.getBoundingClientRect();
      // ⚠️ Phone के किनारे तीखे हैं — नाप बहुत कम रखने पर वो सीढ़ीदार दिखते
      //    हैं। इसलिए यहाँ पूरी नाप के क़रीब रखा है, पर 900px पर बाँधा हुआ।
      const scale = Math.min(r.width < 700 ? 0.9 : 1.0, 900 / Math.max(r.width, 1));
      const w = Math.max(2, Math.round(r.width * scale));
      const h = Math.max(2, Math.round(r.height * scale));
      if (cv!.width !== w || cv!.height !== h) {
        cv!.width = w; cv!.height = h;
        gl!.viewport(0, 0, w, h);
      }
      gl!.uniform2f(uRes, w, h);
    }
    size();
    const ro = new ResizeObserver(size);
    ro.observe(cv);

    /* ── scroll से खुलना-जुड़ना ──────────────────────────────────────────
       0 → आधा  : जुड़ा हुआ phone धीरे-धीरे खुलता है
       आधा → 1  : सारे हिस्से वापस अपनी जगह जुड़ जाते हैं
       यही owner की video का क्रम है।                                    */
    let ex = 0, yaw = -0.5, pitch = 0.14;
    let vYaw = 0, vPitch = 0, drag = false, lastX = 0, lastY = 0, pid = -1;
    let scrollYaw = 0;

    function readScroll() {
      const r = box!.getBoundingClientRect();
      const span = Math.max(1, r.height - innerHeight);
      const k = Math.min(1, Math.max(0, -r.top / span));
      // ऊपर-नीचे वाला आधा-आधा सफ़र
      ex = k < 0.5 ? k * 2 : (1 - k) * 2;
      scrollYaw = k * Math.PI * 1.6;   // scroll के साथ ख़ुद भी घूमता है
      box!.style.setProperty("--k", k.toFixed(3));
    }
    readScroll();
    addEventListener("scroll", readScroll, { passive: true });
    addEventListener("resize", readScroll, { passive: true });

    /* ── उँगली से घुमाना ── */
    const down = (e: PointerEvent) => {
      drag = true; pid = e.pointerId;
      lastX = e.clientX; lastY = e.clientY;
      vYaw = 0; vPitch = 0;
      cv!.setPointerCapture(pid);
    };
    const move = (e: PointerEvent) => {
      if (!drag || e.pointerId !== pid) return;
      const dx = e.clientX - lastX, dy = e.clientY - lastY;
      lastX = e.clientX; lastY = e.clientY;
      vYaw = dx * 0.011;
      // ⚠️ छूने वाले phone पर ऊपर-नीचे का drag page scroll के लिए है
      //    (CSS में `touch-action: pan-y`), वरना ग्राहक यहीं फँस जाता।
      vPitch = e.pointerType === "touch" ? 0 : dy * 0.009;
      yaw += vYaw; pitch += vPitch;
      pitch = Math.max(-1.1, Math.min(1.1, pitch));
    };
    const up = (e: PointerEvent) => {
      if (e.pointerId !== pid) return;
      drag = false;
      if (cv!.hasPointerCapture(pid)) cv!.releasePointerCapture(pid);
      pid = -1;
    };
    cv.addEventListener("pointerdown", down);
    cv.addEventListener("pointermove", move);
    cv.addEventListener("pointerup", up);
    cv.addEventListener("pointercancel", up);

    /* ── चलाना ── */
    let onScreen = false;
    const io = new IntersectionObserver((es) => { onScreen = es[0].isIntersecting; },
      { rootMargin: "160px 0px" });
    io.observe(cv);

    let raf = 0, alive = true, last = 0;
    const t0 = performance.now();
    const gap = innerWidth < 700 ? 1000 / 30 : 1000 / 60;

    function frame(now: number) {
      if (!alive) return;
      raf = requestAnimationFrame(frame);
      if (document.hidden || !onScreen) return;
      if (now - last < gap) return;
      last = now;

      if (!drag) {
        yaw += vYaw; pitch += vPitch;
        vYaw *= 0.94; vPitch *= 0.94;
        pitch = Math.max(-1.1, Math.min(1.1, pitch));
        if (!soft) yaw += 0.0022;   // हमेशा हल्का सा घूमता रहता है
      }

      gl!.uniform1f(uT, (now - t0) / 1000);
      gl!.uniform2f(uRot, yaw + scrollYaw, pitch);
      gl!.uniform1f(uEx, soft ? 0.42 : ex);
      gl!.drawArrays(gl!.TRIANGLES, 0, 3);
    }
    raf = requestAnimationFrame(frame);

    const lost = (e: Event) => { e.preventDefault(); alive = false; cancelAnimationFrame(raf); };
    cv.addEventListener("webglcontextlost", lost);
    document.documentElement.classList.add("gl-on");

    return () => {
      alive = false;
      cancelAnimationFrame(raf);
      ro.disconnect(); io.disconnect();
      removeEventListener("scroll", readScroll);
      removeEventListener("resize", readScroll);
      cv.removeEventListener("pointerdown", down);
      cv.removeEventListener("pointermove", move);
      cv.removeEventListener("pointerup", up);
      cv.removeEventListener("pointercancel", up);
      cv.removeEventListener("webglcontextlost", lost);
      document.documentElement.classList.remove("gl-on");
      gl.deleteProgram(prog); gl.deleteShader(vs); gl.deleteShader(fs);
      gl.deleteBuffer(buf);
    };
  }, []);

  return (
    <section className="phero" ref={wrap} aria-labelledby="phero-h">
      <div className="phero-pin">
        <canvas className="phero-gl" ref={ref} aria-hidden="true" />

        <div className="phero-c">
          <span className="phero-soon">Coming Soon</span>
          <h1 className="phero-h" id="phero-h">
            नया iPhone जल्दी ही — <span>{shop.name}</span> पर
          </h1>
          <p className="phero-p">
            {shop.address.locality}, {shop.address.city} — {shop.tagline}
          </p>
          <p className="phero-hint" aria-hidden="true">
            Scroll कीजिए — phone खुलेगा · उँगली से घुमाइए ↻
          </p>

          <div className="phero-cta">
            <Link className="btn btn-h" href="/products">
              सारा सामान देखिए <IconArrow />
            </Link>
            <a className="btn btn-w" target="_blank" rel="noopener"
               href={`${shop.phone.whatsapp}?text=${encodeURIComponent(
                 "Namaste Mobile World! नया iPhone आने पर मुझे बता दीजिएगा।")}`}>
              <IconWhatsApp /> आने पर बता दीजिए
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
