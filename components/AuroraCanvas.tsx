"use client";

import { useEffect, useRef } from "react";

/**
 * Hero के पीछे चलती हुई रोशनी — असली WebGL shader से बनी।
 *
 * यहाँ three.js जैसी कोई library इस्तेमाल नहीं की गई। सीधे shader लिखा है,
 * इसलिए यह कुछ ही KB का है — library होती तो 400 KB से ऊपर जाती।
 *
 * सुरक्षा के इंतज़ाम:
 * - जिस फ़ोन में WebGL न चले, वहाँ पीछे का CSS gradient ही दिखेगा
 * - जिसने animation बंद कर रखी है, उसके लिए यह चलेगा ही नहीं
 * - screen से बाहर जाते ही रुक जाता है, ताकि battery न ख़र्च हो
 * - छोटी screen पर आधे resolution में चलता है
 */

const VERT = `
attribute vec2 p;
void main() { gl_Position = vec4(p, 0.0, 1.0); }
`;

const FRAG = `
precision mediump float;
uniform vec2  u_res;
uniform float u_time;

// सादा noise
float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }

float noise(vec2 p){
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
             mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
}

// कई परतों वाला noise — इसी से बहती हुई लहरें बनती हैं
float fbm(vec2 p){
  float v = 0.0, a = 0.5;
  for (int i = 0; i < 5; i++) {
    v += a * noise(p);
    p *= 2.02;
    a *= 0.5;
  }
  return v;
}

void main(){
  vec2 uv = gl_FragCoord.xy / u_res.xy;
  vec2 q  = uv;
  q.x *= u_res.x / u_res.y;

  float t = u_time * 0.045;

  // दो परतें, अलग-अलग रफ़्तार से बहती हुई
  float f1 = fbm(q * 2.1 + vec2(t * 1.4, t * 0.7));
  float f2 = fbm(q * 3.4 - vec2(t * 0.9, t * 1.3) + f1);

  vec3 ink      = vec3(0.020, 0.027, 0.059);
  vec3 blue     = vec3(0.231, 0.510, 0.965);
  vec3 electric = vec3(0.133, 0.827, 0.933);
  vec3 violet   = vec3(0.545, 0.361, 0.965);

  // fbm ज़्यादातर 0.3–0.7 के बीच रहता है, इसलिए उसी दायरे पर रंग खोलो —
  // वरना रंग इतने मद्धम पड़ जाते हैं कि दिखते ही नहीं।
  float n1 = smoothstep(0.28, 0.62, f1);
  float n2 = smoothstep(0.26, 0.66, f2);

  vec3 col = ink;
  col = mix(col, blue,     n2 * 0.85);
  col = mix(col, violet,   n1 * 0.62);
  col = mix(col, electric, pow(n1 * n2, 1.4) * 0.75);

  // बीच-बीच में तेज़ चमक, ताकि लहरें जीवंत लगें
  col += electric * pow(n2, 5.0) * 0.35;

  // किनारों पर हल्का अँधेरा
  float vig = smoothstep(1.30, 0.20, distance(uv, vec2(0.5)));
  col *= mix(0.80, 1.0, vig);

  /*
   * सबसे ज़रूरी: लिखाई पढ़ी जानी चाहिए।
   * लिखाई नीचे-बाएँ है, इसलिए उधर रोशनी दबा दो। ऊपर-दाएँ लहरें खुलकर
   * दिखती रहें। इसके बिना रंग सुंदर तो लगते हैं पर page बेकार हो जाता है।
   */
  float textSide = smoothstep(0.05, 0.95, uv.x) * 0.55 + 0.45;
  float lower    = smoothstep(-0.15, 0.85, uv.y) * 0.60 + 0.40;
  col *= textSide * lower;

  col *= 0.92;

  gl_FragColor = vec4(col, 1.0);
}
`;

function compile(gl: WebGLRenderingContext, type: number, src: string) {
  const sh = gl.createShader(type);
  if (!sh) return null;
  gl.shaderSource(sh, src);
  gl.compileShader(sh);
  if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
    gl.deleteShader(sh);
    return null;
  }
  return sh;
}

export default function AuroraCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;

    // animation बंद है तो कुछ मत चलाओ — CSS gradient ही दिखेगा
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const gl = canvas.getContext("webgl", {
      antialias: false,
      alpha: false,
      powerPreference: "low-power",
    });
    if (!gl) return; // WebGL नहीं चला — पीछे का gradient दिख जाएगा

    const vs = compile(gl, gl.VERTEX_SHADER, VERT);
    const fs = compile(gl, gl.FRAGMENT_SHADER, FRAG);
    if (!vs || !fs) return;

    const prog = gl.createProgram();
    if (!prog) return;
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;
    gl.useProgram(prog);

    // पूरी screen ढकने वाला एक चौकोर
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 3, -1, -1, 3]),
      gl.STATIC_DRAW,
    );
    const loc = gl.getAttribLocation(prog, "p");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    const uRes = gl.getUniformLocation(prog, "u_res");
    const uTime = gl.getUniformLocation(prog, "u_time");

    const resize = () => {
      // छोटी screen पर आधा resolution — दिखने में फ़र्क़ नहीं, battery बचती है
      const scale = window.innerWidth < 768 ? 0.5 : 0.75;
      const w = Math.max(1, Math.floor(canvas.clientWidth * scale));
      const h = Math.max(1, Math.floor(canvas.clientHeight * scale));
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
        gl.viewport(0, 0, w, h);
      }
      gl.uniform2f(uRes, canvas.width, canvas.height);
    };

    let raf = 0;
    let running = true;
    let last = 0;
    const start = performance.now();

    const frame = (now: number) => {
      if (!running) return;
      // 30fps काफ़ी है — इससे ज़्यादा में फ़र्क़ दिखता नहीं, battery ज़्यादा लगती है
      if (now - last > 33) {
        last = now;
        resize();
        gl.uniform1f(uTime, (now - start) / 1000);
        gl.drawArrays(gl.TRIANGLES, 0, 3);
      }
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    // screen से बाहर या tab बदलने पर रोक दो
    const io = new IntersectionObserver(
      ([e]) => {
        running = e.isIntersecting && !document.hidden;
        if (running) raf = requestAnimationFrame(frame);
        else cancelAnimationFrame(raf);
      },
      { threshold: 0 },
    );
    io.observe(canvas);

    const onVis = () => {
      running = !document.hidden;
      if (running) raf = requestAnimationFrame(frame);
      else cancelAnimationFrame(raf);
    };
    document.addEventListener("visibilitychange", onVis);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, []);

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      className="absolute inset-0 h-full w-full"
      style={{ display: "block" }}
    />
  );
}
