"use client";

import { useLayoutEffect, useRef } from "react";
import { Edges, Html, RoundedBox } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import * as THREE from "three";

import { phoneParts, type PhonePart } from "@/data/deviceParts";
import { scrollState } from "./scrollStore";

/**
 * Act 2 — फ़ोन खुलकर बिखरता है।
 *
 * हर हिस्सा GSAP की timeline से चलता है और वो timeline scroll से बँधी है
 * (ScrollTrigger + scrub)। यानी scroll bar ही animation का slider है — आगे
 * scroll कीजिए तो फ़ोन खुलता है, पीछे कीजिए तो वापस जुड़ जाता है।
 *
 * ज़रूरी बात: GSAP सीधे 3D objects को नहीं छूता। वो सिर्फ़ साधारण numbers की
 * एक list को बदलता है, और हर frame हम वो numbers 3D objects पर लगा देते हैं।
 * इससे GSAP का सारा easing/stagger मिलता है, पर React दोबारा render नहीं होता।
 *
 * देखने का कोण जान-बूझकर तिरछा रखा है। सामने से देखने पर सातों परतें एक के
 * पीछे एक छुप जाती थीं और नाम आपस में टकराते थे — तिरछा करने से हर हिस्सा
 * अलग दिखता है, बिलकुल किसी असली service manual के चित्र की तरह।
 */

type PartState = {
  x: number;
  y: number;
  z: number;
  rx: number;
  ry: number;
  op: number;
};

/**
 * हिस्से का नाम — असली HTML, canvas के ऊपर।
 * हिस्से के group के अंदर है, इसलिए हिस्सा जहाँ जाए नाम साथ जाता है।
 * हिंदी असली font में लिखी जाती है, तो हमेशा साफ़ पढ़ी जाती है (CLAUDE.md §3)।
 */
function PartLabel({
  part,
  attachLabel,
  factor,
}: {
  part: PhonePart;
  attachLabel: (el: HTMLDivElement | null) => void;
  /** नाम कितना बड़ा — छोटी screen पर छोटा, वरना किनारे कट जाते हैं */
  factor: number;
}) {
  return (
    <Html
      position={part.labelAt}
      center
      /*
        drei में distanceFactor जितना बड़ा, नाम उतना बड़ा दिखता है
        (scale = distanceFactor ÷ camera की चौड़ाई)। यहाँ camera की चौड़ाई
        लगभग 5.5 है, तो 6 का मतलब "असली नाप से ज़रा सा बड़ा" — नाम पढ़ने
        लायक़ रहे, पर फ़ोन को ढँके नहीं।
      */
      distanceFactor={factor}
      zIndexRange={[30, 10]}
      pointerEvents="none"
    >
      <div
        ref={attachLabel}
        className="pointer-events-none w-28 rounded-md sm:w-32 border border-white/20 bg-black/80 px-2 py-1 text-center"
        style={{ opacity: 0 }}
      >
        <div className="text-[11px] font-semibold leading-tight text-white">{part.label}</div>
        <div className="mt-0.5 text-[9px] leading-snug text-white/70">{part.note}</div>
      </div>
    </Html>
  );
}

function Part({
  part,
  attach,
  attachLabel,
  labelFactor,
}: {
  part: PhonePart;
  attach: (g: THREE.Group | null) => void;
  attachLabel: (el: HTMLDivElement | null) => void;
  labelFactor: number;
}) {
  const [w, h, d] = part.size;

  /*
    मिड-फ़्रेम ठोस पट्टी नहीं, चारों तरफ़ का ढाँचा है — इसलिए चार पतली
    धातु की पट्टियों से बना है। ठोस बनाने पर वो एक और चपटी चादर जैसा दिखता
    था और पीछे के हिस्से ढँक देता था; खोखला होने से असली ढाँचे जैसा लगता है
    और उसमें से बैटरी-मेनबोर्ड झाँकते हैं।
  */
  if (part.id === "frame") {
    const t = 0.11; // पट्टी की मोटाई
    const bars: Array<[number, number, number, number, number]> = [
      [0, h / 2 - t / 2, w, t, 0],
      [0, -h / 2 + t / 2, w, t, 0],
      [-w / 2 + t / 2, 0, t, h - t * 2, 0],
      [w / 2 - t / 2, 0, t, h - t * 2, 0],
    ];
    return (
      <group ref={attach}>
        {bars.map(([bx, by, bw, bh], k) => (
          <RoundedBox key={k} args={[bw, bh, d]} radius={d * 0.3} smoothness={2} position={[bx, by, 0]}>
            <meshPhysicalMaterial
              color={part.color}
              metalness={1}
              roughness={part.rough}
              clearcoat={0.8}
              envMapIntensity={2.2}
            />
          </RoundedBox>
        ))}
        <PartLabel part={part} attachLabel={attachLabel} factor={labelFactor} />
      </group>
    );
  }

  return (
    <group ref={attach}>
      <RoundedBox
        args={[w, h, d]}
        radius={Math.min(w, h, d) * 0.3}
        smoothness={3}
      >
        {part.glass ? (
          /*
            पहले यहाँ transmission था। दिखने में वो सचमुच काँच जैसा है, पर
            इतनी बड़ी सतह पर पूरी screen दूधिया सफ़ेद हो जाती थी और पीछे के
            हिस्से डूब जाते थे। इसलिए सादा पारदर्शी काँच — हल्का, और पीछे
            सब कुछ साफ़ दिखता है।
          */
          <meshPhysicalMaterial
            color={part.color}
            metalness={0.1}
            roughness={0.05}
            clearcoat={1}
            transparent
            opacity={0.14}
            envMapIntensity={2.4}
          />
        ) : part.glow ? (
          <meshStandardMaterial
            color={part.color}
            emissive={part.glow}
            emissiveIntensity={0.22}
            metalness={0.1}
            roughness={part.rough}
          />
        ) : (
          <meshPhysicalMaterial
            color={part.color}
            metalness={part.metal}
            roughness={part.rough}
            clearcoat={part.metal > 0.5 ? 0.7 : 0}
            envMapIntensity={1.8}
          />
        )}
        <Edges threshold={25} color={part.glow ?? "#6f8bb5"} />
      </RoundedBox>

      {/* display की चमकती सतह — सिर्फ़ आगे की तरफ़, जैसे असली screen */}
      {part.glow && (
        <mesh position={[0, 0, d / 2 + 0.004]}>
          <planeGeometry args={[w * 0.94, h * 0.96]} />
          <meshStandardMaterial
            color="#03060c"
            emissive={part.glow}
            emissiveIntensity={0.8}
            roughness={0.1}
            metalness={0}
          />
        </mesh>
      )}

      {/* camera module पर तीन lens */}
      {part.id === "camera" &&
        [
          [-0.13, 0.13],
          [0.13, 0.13],
          [-0.13, -0.13],
        ].map(([lx, ly], k) => (
          <mesh key={k} position={[lx, ly, -d / 2 - 0.02]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.1, 0.1, 0.05, 16]} />
            <meshPhysicalMaterial color="#05070c" metalness={0.4} roughness={0.05} clearcoat={1} />
          </mesh>
        ))}

      <PartLabel part={part} attachLabel={attachLabel} factor={labelFactor} />
    </group>
  );
}

export function ExplodedPhone({ triggerId }: { triggerId: string }) {
  const rig = useRef<THREE.Group>(null);
  const inner = useRef<THREE.Group>(null);
  const partRefs = useRef<(THREE.Group | null)[]>([]);
  const labelRefs = useRef<(HTMLDivElement | null)[]>([]);
  const viewport = useThree((s) => s.viewport);
  const small = useThree((s) => s.size.width < 760);

  /**
   * GSAP जिन numbers को बदलेगा — शुरू में सब जुड़े हुए।
   * ये ref में हैं क्योंकि GSAP इन्हें हर frame बदलता है और React को
   * इसकी ख़बर नहीं होनी चाहिए (वरना हर frame पर पूरा page दोबारा बनेगा)।
   */
  const statesRef = useRef<PartState[]>(
    phoneParts.map((p) => ({ x: p.at[0], y: p.at[1], z: p.at[2], rx: 0, ry: 0, op: 0 })),
  );

  /** पूरे ढाँचे का घूमना — यह भी GSAP ही चलाता है। */
  const spinRef = useRef({ ry: -0.2, rx: 0.0, scale: 0.72 });

  useLayoutEffect(() => {
    if (typeof window === "undefined") return;
    gsap.registerPlugin(ScrollTrigger);

    const trigger = document.getElementById(triggerId);
    if (!trigger) return;

    const states = statesRef.current;
    const spin = spinRef.current;

    // animation बंद है तो कुछ मत चलाओ — सीधे खुला हुआ रूप दिखा दो
    if (scrollState.reduced) {
      phoneParts.forEach((p, i) => {
        states[i].x = p.at[0] + p.to[0];
        states[i].y = p.at[1] + p.to[1];
        states[i].z = p.at[2] + p.to[2];
        states[i].op = 1;
      });
      spin.ry = -0.78;
      spin.rx = 0.22;
      spin.scale = 1;
      return;
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.6,
          onUpdate: (self) => {
            scrollState.explode = self.progress;
          },
        },
      });

      // 0 → 0.55 : हर हिस्सा अपनी जगह से बाहर निकलता है, एक के बाद एक
      tl.to(
        states,
        {
          x: (i: number) => phoneParts[i].at[0] + phoneParts[i].to[0],
          y: (i: number) => phoneParts[i].at[1] + phoneParts[i].to[1],
          z: (i: number) => phoneParts[i].at[2] + phoneParts[i].to[2],
          rx: (i: number) => (i % 2 ? 0.1 : -0.08),
          ry: (i: number) => (i % 3 ? 0.14 : -0.18),
          duration: 0.55,
          ease: "power2.inOut",
          stagger: { each: 0.04, from: "start" },
        },
        0,
      );

      // नाम थोड़ी देर बाद उभरते हैं — पहले हिस्सा दिखे, फिर उसका नाम
      tl.to(states, { op: 1, duration: 0.2, stagger: { each: 0.04, from: "start" } }, 0.24);

      // पूरा ढाँचा तिरछा होकर सामने आता है
      tl.to(spin, { ry: -0.78, rx: 0.22, scale: 1, duration: 0.55, ease: "power2.out" }, 0);
      tl.to(spin, { ry: -1.02, duration: 0.22, ease: "none" }, 0.55);

      // 0.8 → 1 : सब वापस जुड़ जाता है, और फ़ोन एक पूरा चक्कर लगाता है
      tl.to(
        states,
        {
          x: (i: number) => phoneParts[i].at[0],
          y: (i: number) => phoneParts[i].at[1],
          z: (i: number) => phoneParts[i].at[2],
          rx: 0,
          ry: 0,
          op: 0,
          duration: 0.2,
          ease: "power3.inOut",
          stagger: { each: 0.012, from: "end" },
        },
        0.8,
      );
      tl.to(spin, { ry: -1.02 + Math.PI * 2, rx: 0, duration: 0.2, ease: "power3.inOut" }, 0.8);
    });

    return () => ctx.revert();
  }, [triggerId]);

  useFrame(() => {
    const g = rig.current;
    const inr = inner.current;
    if (!g || !inr) return;

    const states = statesRef.current;
    const spin = spinRef.current;

    /*
      पूरा ढाँचा screen में समा जाए। खुलने पर यह लगभग 3.2 unit चौड़ा और
      4.6 unit ऊँचा हो जाता है, इसलिए दोनों नाप देखकर छोटा किया जाता है —
      वरना फ़ोन पर किनारे कट जाते थे।
    */
    const fitW = viewport.width / (small ? 6.2 : 8.4);
    const fitH = viewport.height / 8.2;
    const fit = THREE.MathUtils.clamp(Math.min(fitW, fitH), 0.42, 1.15);
    g.scale.setScalar(spin.scale * fit);

    // फ़ोन पर लिखाई नीचे रहती है, इसलिए ढाँचा ऊपर;
    // बड़ी screen पर लिखाई बाएँ है, इसलिए ढाँचा दाएँ।
    g.position.y = small ? viewport.height * 0.06 : 0;
    g.position.x = small ? 0 : viewport.width * 0.15;

    inr.rotation.y = spin.ry + scrollState.px * 0.12;
    inr.rotation.x = spin.rx + scrollState.py * 0.08;

    for (let i = 0; i < phoneParts.length; i++) {
      const o = partRefs.current[i];
      const st = states[i];
      if (!o) continue;
      o.position.set(st.x, st.y, st.z);
      o.rotation.set(st.rx, st.ry, 0);
      const el = labelRefs.current[i];
      if (el) {
        el.style.opacity = String(st.op);
        el.style.transform = `translate3d(0, ${(1 - st.op) * 10}px, 0)`;
      }
    }
  });

  return (
    <group ref={rig}>
      <group ref={inner}>
        {phoneParts.map((part, i) => (
          <Part
            key={part.id}
            part={part}
            attach={(g) => {
              partRefs.current[i] = g;
            }}
            attachLabel={(el) => {
              labelRefs.current[i] = el;
            }}
            labelFactor={small ? 4 : 6}
          />
        ))}
      </group>
    </group>
  );
}
