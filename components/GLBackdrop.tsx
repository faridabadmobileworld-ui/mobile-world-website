"use client";

import { useEffect, useRef } from "react";

/**
 * असली 3D का हिस्सा — WebGL से, home page पर अपनी जगह।
 *
 * ⚠️ पहले यह पूरी site के पीछे `position:fixed` परत थी। **वो बेकार था** —
 * site का content edge-to-edge है, इसलिए 3D कभी दिखता ही नहीं था। नापकर
 * देखा: canvas चल रहा था, GPU काम कर रहा था, और ग्राहक को एक pixel भी
 * नज़र नहीं आता था। अब यह अपने section के अंदर है, जहाँ यही मुख्य चीज़ है।
 *
 * यह कोई तस्वीर या video नहीं है। हर frame **GPU पर उसी वक़्त बनता है**:
 * तीन काँच जैसे गोले हवा में तैरते हैं, आपस में पिघलकर जुड़ते हैं, उन पर
 * असली रोशनी पड़ती है और उनके पीछे से रंग छनकर आता है (raymarching)।
 * उँगली या mouse हिलाने पर पूरा दृश्य ज़रा सा घूम जाता है — जैसे आप उसे
 * किसी और कोण से देख रहे हों।
 *
 * ⛔ **कोई library नहीं जोड़ी।** Three.js लगभग 150 KB का होता, और उसकी
 *    ज़रूरत सिर्फ़ तब पड़ती जब हमारे पास असली 3D model की file होती। यहाँ
 *    पूरा दृश्य गणित से बनता है — shader में लिखा हुआ, कुछ हज़ार अक्षर।
 *    ⇒ download में **एक भी नई file नहीं**।
 *
 * ⚠️ पाँच बातें जान-बूझकर ऐसी हैं — इन्हें बदलने से पहले नाप लीजिए:
 *
 *  1. **असली नाप का आधा (या उससे भी कम) ही बनता है**, फिर CSS उसे बड़ा
 *     कर देती है। दृश्य वैसे भी धुँधला है, इसलिए फ़र्क़ दिखता नहीं — पर GPU
 *     का काम चौथाई रह जाता है। Phone पर चौड़ाई 480 px पर बाँध दी गई है।
 *  2. **दिखे नहीं तो चले नहीं।** Tab पीछे जाते ही loop रुक जाता है।
 *  3. **`prefers-reduced-motion` पर चलता ही नहीं** — canvas बनता भी नहीं,
 *     नीचे वाली CSS परत (`.bgfx`) जस की तस दिखती रहती है।
 *  4. **WebGL न हो तो चुपचाप हट जाता है।** पुराने phone पर कुछ टूटता नहीं,
 *     बस पहले जैसा background दिखता है।
 *  5. **`z-index: -1`** — यह हमेशा सबसे पीछे है, इसलिए LCP (page कितनी
 *     जल्दी दिखा) पर इसका असर नहीं पड़ता; text और तस्वीरें इसके ऊपर पहले
 *     ही रँग जाती हैं।
 */

/* ── Vertex: पूरी screen ढकने वाला एक चौकोर ─────────────────────────── */
const VERT = `#version 300 es
in vec2 p;
void main(){ gl_Position = vec4(p, 0.0, 1.0); }`;

/* ── Fragment: यहीं असली 3D बनता है ──────────────────────────────────
   sdf  = किसी बिंदु से आकार की दूरी
   smin = दो आकारों को पिघलाकर जोड़ना (इसी से वो "काँच की बूँद" वाला रूप
          आता है, जो अलग-अलग गोलों से नहीं आता)                          */
const FRAG = `#version 300 es
precision highp float;
out vec4 outColor;

uniform vec2  uRes;    // canvas ki naap
uniform float uT;      // shuru se ab tak ka samay (second)
uniform vec2  uM;      // ungli/mouse -1..1

// do doori ko pighlakar jodna
float smin(float a, float b, float k){
  float h = clamp(0.5 + 0.5*(b-a)/k, 0.0, 1.0);
  return mix(b, a, h) - k*h*(1.0-h);
}

// poora drishya: teen tairte hue gole
float scene(vec3 q){
  float t = uT * 0.28;
  vec3 a = vec3( sin(t*0.9)*1.25,  cos(t*0.7)*0.75, 0.0);
  vec3 b = vec3( cos(t*0.6)*1.45,  sin(t*1.1)*0.60, sin(t*0.5)*0.7);
  vec3 c = vec3( sin(t*1.3)*0.85,  cos(t*0.4)*1.05, cos(t*0.8)*0.6);
  float d = length(q-a) - 1.18;
  d = smin(d, length(q-b) - 1.02, 0.95);
  d = smin(d, length(q-c) - 0.88, 0.95);
  return d;
}

// satah ka rukh — chaaron taraf zara sa chalkar dhalaan naapna
vec3 normalAt(vec3 q){
  vec2 e = vec2(0.0025, 0.0);
  return normalize(vec3(
    scene(q+e.xyy) - scene(q-e.xyy),
    scene(q+e.yxy) - scene(q-e.yxy),
    scene(q+e.yyx) - scene(q-e.yyx)));
}

void main(){
  vec2 uv = (gl_FragCoord.xy*2.0 - uRes) / min(uRes.x, uRes.y);

  // camera — ungli ke saath zara sa ghoomta hua
  vec3 ro = vec3(uM.x*0.62, uM.y*0.42, 3.5);
  vec3 rd = normalize(vec3(uv, -1.45));

  // raymarch
  float dist = 0.0;
  float hit  = 0.0;
  vec3  q    = ro;
  for (int i = 0; i < 46; i++){
    q = ro + rd*dist;
    float d = scene(q);
    if (d < 0.004){ hit = 1.0; break; }
    dist += d*0.85;
    if (dist > 9.0) break;
  }

  // hamare apne rang — brand ka baingani, hara aur naarangi
  vec3 lav = vec3(0.482, 0.361, 0.941);
  vec3 mint= vec3(0.145, 0.827, 0.400);
  vec3 hot = vec3(0.910, 0.329, 0.184);

  vec3 col = vec3(0.0);
  float a = 0.0;

  if (hit > 0.5){
    vec3 n = normalAt(q);
    vec3 l = normalize(vec3(0.55, 0.85, 0.62));

    float diff = max(dot(n, l), 0.0);
    float rim  = pow(1.0 - max(dot(n, -rd), 0.0), 2.4);   // kinare ki chamak
    float spec = pow(max(dot(reflect(-l, n), -rd), 0.0), 26.0);

    // rang satah ke rukh se badalta hai — isi se "kaanch" jaisa lagta hai
    vec3 base = mix(lav, mint, smoothstep(-0.7, 0.9, n.y));
    base = mix(base, hot, smoothstep(0.25, 1.0, rim) * 0.55);

    col = base * (0.46 + diff*0.85) + spec*0.55;
    a   = 0.78 + rim*0.22;
  }

  // peechhe ka naram ujala — jahan aakar nahi hai wahan bhi rang rahe
  float glow = exp(-dist*0.26) * 0.30;
  col += mix(lav, hot, uv.x*0.5 + 0.5) * glow;
  a   = max(a, glow*1.9);

  outColor = vec4(col, clamp(a, 0.0, 0.97));
}`;

export function GLBackdrop({ kicker, heading, body }:
  { kicker: string; heading: string; body: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    // जिसे कम animation चाहिए, उसके लिए यह चलता ही नहीं।
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const cv = ref.current;
    if (!cv) return;

    const gl = cv.getContext("webgl2", {
      alpha: true, antialias: false, depth: false, stencil: false,
      premultipliedAlpha: false, powerPreference: "low-power",
    });
    // WebGL2 न हो तो चुपचाप हट जाइए — CSS वाला background पहले से वहीं है।
    if (!gl) return;

    /* ── shader जोड़ना ── */
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
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;
    gl.useProgram(prog);

    // पूरी screen ढकने वाले दो त्रिकोण
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, "p");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    const uRes = gl.getUniformLocation(prog, "uRes");
    const uT = gl.getUniformLocation(prog, "uT");
    const uM = gl.getUniformLocation(prog, "uM");

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    /* ── नाप ── */
    // ⚠️ असली screen का आधा ही बनाते हैं (phone पर और भी कम)। दृश्य धुँधला
    //    है इसलिए फ़र्क़ दिखता नहीं, पर GPU का काम चौथाई रह जाता है।
    function size() {
      const r = cv!.getBoundingClientRect();
      const small = r.width < 700;
      // असली नाप का आधा ही बनता है — दृश्य धुँधला है, फ़र्क़ दिखता नहीं,
      // पर GPU का काम चौथाई रह जाता है।
      const scale = Math.min(small ? 0.6 : 0.72, 900 / Math.max(r.width, 1));
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

    /* ── उँगली/mouse ── */
    const m = { x: 0, y: 0, tx: 0, ty: 0 };
    const move = (e: PointerEvent) => {
      const r = cv!.getBoundingClientRect();
      m.tx = ((e.clientX - r.left) / Math.max(r.width, 1)) * 2 - 1;
      m.ty = 1 - ((e.clientY - r.top) / Math.max(r.height, 1)) * 2;
    };
    addEventListener("pointermove", move, { passive: true });

    /* ── चलाना ── */
    // ⚠️ सबसे बड़ी बचत: यह तभी चलता है जब screen पर दिख रहा हो। ग्राहक
    //    नीचे scroll कर गया — GPU का काम तुरंत बंद।
    let onScreen = false;
    const io = new IntersectionObserver(
      (es) => { onScreen = es[0].isIntersecting; },
      { rootMargin: "120px 0px" });
    io.observe(cv);

    let raf = 0;
    let alive = true;
    const t0 = performance.now();
    let last = 0;
    const gap = innerWidth < 700 ? 1000 / 30 : 1000 / 60;  // phone par 30fps kaafi

    function frame(now: number) {
      if (!alive) return;
      raf = requestAnimationFrame(frame);
      // Tab पीछे हो तो कुछ मत बनाइए।
      if (document.hidden || !onScreen) return;
      if (now - last < gap) return;
      last = now;

      // उँगली के पीछे नरमी से — झटके में नहीं
      m.x += (m.tx - m.x) * 0.045;
      m.y += (m.ty - m.y) * 0.045;

      gl!.uniform1f(uT, (now - t0) / 1000);
      gl!.uniform2f(uM, m.x, m.y);
      gl!.drawArrays(gl!.TRIANGLES, 0, 3);
    }
    raf = requestAnimationFrame(frame);

    // GPU का context खो जाए (कुछ phone पर होता है) तो चुपचाप रुक जाइए।
    const lost = (e: Event) => { e.preventDefault(); alive = false; cancelAnimationFrame(raf); };
    cv.addEventListener("webglcontextlost", lost);

    document.documentElement.classList.add("gl-on");

    return () => {
      alive = false;
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      removeEventListener("pointermove", move);
      cv.removeEventListener("webglcontextlost", lost);
      document.documentElement.classList.remove("gl-on");
      gl.deleteProgram(prog);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
      gl.deleteBuffer(buf);
    };
  }, []);

  return (
    <section className="glstage" aria-labelledby="glstage-h">
      <canvas className="glbg" ref={ref} aria-hidden="true" />
      <div className="glstage-c">
        <span className="glstage-k">{kicker}</span>
        <h2 className="glstage-h" id="glstage-h">{heading}</h2>
        <p className="glstage-p">{body}</p>
      </div>
    </section>
  );
}
