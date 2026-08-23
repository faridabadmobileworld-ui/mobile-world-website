"use client";

import { useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

import { scrollState, clamp01 } from "./scrollStore";

/**
 * Act 3 — हज़ारों रौशनी के कण, जो एक सामान से दूसरा सामान बन जाते हैं।
 *
 * फ़ोन → laptop → television → air conditioner। ये चारों वही चीज़ें हैं जो
 * दुकान पर सच में मिलती हैं (data/shop.ts की categories से)।
 *
 * यह पूरा काम GPU पर होता है। हर कण की चारों जगहें पहले से GPU में भर दी
 * जाती हैं, और shader हर frame सिर्फ़ चार numbers (weights) देखकर तय करता है
 * कि कण अभी कहाँ रहेगा। CPU हर frame सिर्फ़ चार numbers भेजता है — बस।
 */

const SHAPES = ["mobile", "laptop", "television", "air-conditioner"] as const;

/** हर shape का अपना रंग — dark background पर साफ़ दिखने वाले। */
const SHAPE_COLORS = ["#4cc9f0", "#8b5cf6", "#ff5470", "#f5c451"];

/** सादा seeded random — हर बार वही point cloud बने। */
function seeded(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

/** एक चपटे डिब्बे की सतह पर एक point। */
function onBox(
  r: () => number,
  w: number,
  h: number,
  d: number,
  out: THREE.Vector3,
) {
  const face = r();
  const u = r() - 0.5;
  const v = r() - 0.5;
  if (face < 0.42) out.set(u * w, v * h, d / 2); // आगे
  else if (face < 0.84) out.set(u * w, v * h, -d / 2); // पीछे
  else if (face < 0.92) out.set((r() < 0.5 ? -1 : 1) * (w / 2), v * h, (r() - 0.5) * d);
  else out.set(u * w, (r() < 0.5 ? -1 : 1) * (h / 2), (r() - 0.5) * d);
  return out;
}

/** एक कण की जगह, shape के हिसाब से। */
function samplePoint(shape: (typeof SHAPES)[number], r: () => number, out: THREE.Vector3) {
  switch (shape) {
    case "mobile":
      return onBox(r, 1.45, 3.0, 0.16, out);

    case "laptop": {
      if (r() < 0.5) {
        // खुली हुई screen — पीछे की तरफ़ झुकी
        onBox(r, 3.4, 2.2, 0.08, out);
        const a = -0.32;
        const y = out.y + 1.1;
        const z = out.z;
        out.y = y * Math.cos(a) - z * Math.sin(a) - 0.35;
        out.z = y * Math.sin(a) + z * Math.cos(a) - 0.75;
      } else {
        // keyboard वाला निचला हिस्सा — लेटा हुआ
        onBox(r, 3.4, 2.3, 0.12, out);
        const z = out.z;
        out.z = out.y * 0.98;
        out.y = z - 1.45;
      }
      return out;
    }

    case "television": {
      if (r() < 0.86) {
        onBox(r, 4.6, 2.65, 0.1, out);
        out.y += 0.45;
      } else if (r() < 0.94) {
        // गर्दन
        out.set((r() - 0.5) * 0.3, -1.15 + r() * 0.45, (r() - 0.5) * 0.2);
      } else {
        // पैर
        out.set((r() - 0.5) * 2.6, -1.45, (r() - 0.5) * 0.7);
      }
      return out;
    }

    case "air-conditioner": {
      onBox(r, 4.2, 1.25, 0.85, out);
      // नीचे की तरफ़ हवा वाली झिरी
      if (r() < 0.18) out.y = -0.62 + r() * 0.06;
      return out;
    }
  }
}

const vertexShader = /* glsl */ `
  uniform vec4  uW;        // चारों shapes का वज़न, जोड़ हमेशा 1
  uniform float uTime;
  uniform float uSpread;   // बदलते वक़्त कण कितने बिखरें
  uniform float uSize;
  uniform float uPixelRatio;

  attribute vec3  aP0;
  attribute vec3  aP1;
  attribute vec3  aP2;
  attribute vec3  aP3;
  attribute float aSeed;

  varying float vSeed;
  varying float vDepth;

  // हल्का सा curl — कण सीधी लकीर में नहीं, घूमते हुए जाते हैं
  vec3 swirl(vec3 p, float t, float seed) {
    float a = t * 0.6 + seed * 6.2831;
    return vec3(
      sin(p.y * 1.3 + a) * 0.9 + cos(p.z * 0.9 - a) * 0.4,
      cos(p.x * 1.1 - a) * 0.9 + sin(p.z * 1.4 + a) * 0.4,
      sin(p.x * 0.8 + a) * 0.7 + cos(p.y * 1.2 - a) * 0.5
    );
  }

  void main() {
    vec3 pos = aP0 * uW.x + aP1 * uW.y + aP2 * uW.z + aP3 * uW.w;

    // uSpread सिर्फ़ बदलाव के बीच में ऊँचा होता है — रुकने पर शक्ल साफ़ बनती है
    pos += swirl(pos, uTime, aSeed) * uSpread;

    // हमेशा एक हल्की साँस, ताकि shape जमी हुई न लगे
    pos += swirl(pos, uTime * 0.35, aSeed) * 0.02;

    vec4 mv = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mv;

    vSeed = aSeed;
    vDepth = -mv.z;

    // दूर के कण छोटे — यही असली गहराई का एहसास देता है
    gl_PointSize = uSize * uPixelRatio * (1.0 + aSeed * 0.8) * (7.0 / max(vDepth, 0.6));
  }
`;

const fragmentShader = /* glsl */ `
  precision mediump float;

  uniform vec3  uCA;      // अभी वाला रंग
  uniform vec3  uCB;      // अगला रंग
  uniform float uMix;
  uniform float uFade;    // पूरे बादल का उभरना/मिटना

  varying float vSeed;
  varying float vDepth;

  void main() {
    // चौकोर point को गोल बनाना
    vec2 c = gl_PointCoord - 0.5;
    float d = dot(c, c);
    if (d > 0.25) discard;

    float soft = smoothstep(0.25, 0.02, d);

    vec3 col = mix(uCA, uCB, uMix);
    // कुछ कण सफ़ेद चमकते हैं — चमक जीवित लगती है
    col = mix(col, vec3(1.0), step(0.93, fract(vSeed * 17.13)) * 0.75);

    float far = smoothstep(14.0, 4.0, vDepth);
    gl_FragColor = vec4(col, soft * uFade * (0.35 + far * 0.65));
  }
`;

export function MorphParticles() {
  const points = useRef<THREE.Points>(null);
  const mat = useRef<THREE.ShaderMaterial>(null);
  const dpr = useThree((s) => s.viewport.dpr);
  const small = useThree((s) => s.size.width < 760);

  const count = scrollState.reduced ? 4000 : small ? 9000 : 24000;

  const geometry = useMemo(() => {
    const g = new THREE.BufferGeometry();
    const tmp = new THREE.Vector3();
    const seeds = new Float32Array(count);
    const buffers = SHAPES.map(() => new Float32Array(count * 3));

    for (let i = 0; i < count; i++) {
      // हर shape के लिए एक ही seed — इससे कण अपनी "जगह" याद रखता है
      // और बदलाव उलझन जैसा नहीं, सिलसिलेवार लगता है
      SHAPES.forEach((shape, s) => {
        const r = seeded(i * 7919 + s * 104729 + 12345);
        samplePoint(shape, r, tmp);
        buffers[s][i * 3] = tmp.x;
        buffers[s][i * 3 + 1] = tmp.y;
        buffers[s][i * 3 + 2] = tmp.z;
      });
      seeds[i] = (i % 997) / 997;
    }

    // position सिर्फ़ इसलिए कि three.js को geometry का हिसाब चाहिए
    g.setAttribute("position", new THREE.BufferAttribute(buffers[0].slice(), 3));
    buffers.forEach((b, s) => g.setAttribute(`aP${s}`, new THREE.BufferAttribute(b, 3)));
    g.setAttribute("aSeed", new THREE.BufferAttribute(seeds, 1));
    g.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 5);
    return g;
  }, [count]);

  const uniforms = useMemo(
    () => ({
      uW: { value: new THREE.Vector4(1, 0, 0, 0) },
      uTime: { value: 0 },
      uSpread: { value: 0 },
      uSize: { value: 2.4 },
      uPixelRatio: { value: 1 },
      uCA: { value: new THREE.Color(SHAPE_COLORS[0]) },
      uCB: { value: new THREE.Color(SHAPE_COLORS[1]) },
      uMix: { value: 0 },
      uFade: { value: 0 },
    }),
    [],
  );

  const colors = useMemo(() => SHAPE_COLORS.map((c) => new THREE.Color(c)), []);

  useFrame((state, dt) => {
    const m = mat.current;
    const p = points.current;
    if (!m || !p) return;

    const u = m.uniforms;
    u.uTime.value += Math.min(dt, 0.05);
    u.uPixelRatio.value = dpr;

    // scroll 0..1 को चार shapes में बाँटना: हर shape थोड़ी देर रुकती है,
    // फिर अगली में बदलती है
    const legs = SHAPES.length - 1; // तीन बदलाव
    const f = clamp01(scrollState.morph) * legs;
    const i = Math.min(legs - 1, Math.floor(f));
    const raw = f - i;

    // 0–0.35 रुकना, 0.35–0.85 बदलना, 0.85–1 फिर रुकना
    const t = THREE.MathUtils.smoothstep(raw, 0.28, 0.86);

    const w = u.uW.value as THREE.Vector4;
    w.set(0, 0, 0, 0);
    w.setComponent(i, 1 - t);
    w.setComponent(i + 1, t);

    // बीच में सबसे ज़्यादा बिखराव — यही "टूटकर बनना" वाला असर है
    u.uSpread.value = Math.sin(t * Math.PI) * (scrollState.reduced ? 0 : 0.55);
    u.uMix.value = t;
    (u.uCA.value as THREE.Color).copy(colors[i]);
    (u.uCB.value as THREE.Color).copy(colors[i + 1]);

    // शुरू और आख़िर में पूरा बादल नरमी से आता-जाता है
    const fade =
      THREE.MathUtils.smoothstep(scrollState.morph, 0.0, 0.12) *
      (1 - THREE.MathUtils.smoothstep(scrollState.morph, 0.93, 1.0) * 0.85);
    u.uFade.value += (fade - u.uFade.value) * Math.min(1, dt * 6);

    p.rotation.y = scrollState.morph * 0.9 - 0.45 + scrollState.px * 0.25;
    p.rotation.x = scrollState.py * 0.15;
  });

  return (
    <points ref={points} geometry={geometry} frustumCulled={false}>
      <shaderMaterial
        ref={mat}
        uniforms={uniforms}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

export { SHAPES, SHAPE_COLORS };
