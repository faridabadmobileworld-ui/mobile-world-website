"use client";

import { useCallback, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { ContactShadows } from "@react-three/drei";
import {
  BallCollider,
  CuboidCollider,
  Physics,
  RigidBody,
  type RapierRigidBody,
} from "@react-three/rapier";
import * as THREE from "three";

import { PhoneMesh } from "./PhoneMesh";
import { scrollState } from "./scrollStore";

/**
 * Act 1 — असली गुरुत्वाकर्षण।
 *
 * ऊपर से फ़ोन गिरते हैं और ढेर बन जाता है। यह animation नहीं है — हर बार
 * ढेर अलग बनता है, क्योंकि इसे Rapier का physics engine चला रहा है।
 * उँगली या mouse हिलाइए तो फ़ोन सरकते हैं; दबाइए तो बिखर जाते हैं।
 *
 * सबसे ज़रूरी बात यहाँ framing है: ढेर हमेशा screen के ऊपरी हिस्से में बने,
 * क्योंकि नीचे का हिस्सा लिखाई और buttons के लिए रखा है (CLAUDE.md §3 —
 * लिखाई हमेशा पढ़ी जानी चाहिए)। इसलिए ज़मीन और दीवारें screen के नाप से
 * हर बार नए सिरे से गिनी जाती हैं।
 */

type Chip = {
  color: string;
  screen: string;
  size: [number, number, number];
  spin: [number, number, number];
};

/**
 * हर बार वही ढेर बने — इसलिए random नहीं, एक तय formula।
 * (Server और browser दोनों जगह एक जैसा result चाहिए।)
 */
function makeChips(count: number): Chip[] {
  const palette: Array<[string, string]> = [
    ["#1a2030", "#4cc9f0"],
    ["#241542", "#8b5cf6"],
    ["#3a121f", "#ff5470"],
    ["#122641", "#2678ff"],
    ["#2b2413", "#f5c451"],
    ["#0f2a20", "#25d366"],
  ];

  return Array.from({ length: count }, (_, i) => {
    const a = i * 2.399963; // सुनहरा कोण — चीज़ें एक ही जगह ढेर नहीं होतीं
    const [color, screen] = palette[i % palette.length];
    const big = i % 5 === 0;
    return {
      color,
      screen,
      size: big ? [0.82, 1.68, 0.095] : [0.64, 1.32, 0.08],
      spin: [Math.sin(a) * 1.4, Math.cos(a * 1.7) * 2.2, Math.sin(a * 0.7) * 1.1],
    };
  });
}

/** Mouse/उँगली के पीछे चलती अदृश्य गेंद — इसी से फ़ोन सरकते हैं। */
function PointerPusher({ scale }: { scale: number }) {
  const ref = useRef<RapierRigidBody>(null);
  const here = useRef(new THREE.Vector3(0, -30, 0));
  const target = useRef(new THREE.Vector3());

  useFrame((state, dt) => {
    const body = ref.current;
    if (!body) return;

    // pointer कहीं और हो तो गेंद को नीचे छुपा देते हैं
    const idle = state.pointer.x === 0 && state.pointer.y === 0;
    if (idle) {
      target.current.set(0, -30, 0);
    } else {
      target.current.set(
        (state.pointer.x * state.viewport.width) / 2 / scale,
        (state.pointer.y * state.viewport.height) / 2 / scale,
        0,
      );
    }

    here.current.lerp(target.current, Math.min(1, Math.min(dt, 0.05) * 9));
    body.setNextKinematicTranslation(here.current);
  });

  return (
    <RigidBody ref={ref} type="kinematicPosition" colliders={false}>
      <BallCollider args={[0.8]} />
    </RigidBody>
  );
}

export function PhysicsHero({ active }: { active: boolean }) {
  const viewport = useThree((s) => s.viewport);
  const small = useThree((s) => s.size.width < 760);

  const count = scrollState.reduced ? 6 : small ? 11 : 18;
  const chips = useMemo(() => makeChips(count), [count]);
  const bodies = useRef<RapierRigidBody[]>([]);

  /**
   * छोटी screen पर पूरा दृश्य छोटा कर देते हैं — तभी 11 फ़ोन दिखते हैं,
   * वरना एक पतली सी लाइन बनकर रह जाते।
   */
  const fit = THREE.MathUtils.clamp(viewport.width / 6.4, 0.55, 1);

  /**
   * ज़मीन कहाँ हो: screen के नीचे का हिस्सा लिखाई के लिए छोड़ना है।
   * फ़ोन पर आधे से ज़्यादा नीचे का हिस्सा card ले लेता है, इसलिए वहाँ
   * ज़मीन ऊपर उठा दी जाती है।
   */
  const reserve = small ? 0.46 : 0.13;
  const floorY = (-viewport.height / 2 + viewport.height * reserve) / fit;
  /*
    डिब्बा जान-बूझकर संकरा रखा है। चौड़ा रखने पर अठारह फ़ोन एक ही पतली
    लाइन में फैल जाते थे और "ढेर" जैसा कुछ बनता ही नहीं था।
  */
  const halfW = THREE.MathUtils.clamp(viewport.width / 2 / fit - 0.7, 1.15, 2.7);

  // गोल संख्या — ज़रा सी resize पर physics दोबारा न बने
  const wallKey = `${Math.round(halfW * 4)}-${Math.round(floorY * 4)}`;

  /**
   * Click/tap — जहाँ दबाया वहाँ से फ़ोन बाहर की तरफ़ उछलते हैं।
   * दूर वाले पर कम असर, पास वाले पर ज़्यादा।
   */
  const burst = useCallback(
    (point: THREE.Vector3) => {
      const at = point.clone().divideScalar(fit);
      for (const b of bodies.current) {
        if (!b) continue;
        const p = b.translation();
        const dx = p.x - at.x;
        const dy = p.y - at.y;
        const dz = p.z - at.z;
        const dist = Math.hypot(dx, dy, dz) || 0.001;
        if (dist > 3.2) continue;
        const power = (1 - dist / 3.2) * 2.4;
        b.wakeUp();
        b.applyImpulse(
          { x: (dx / dist) * power, y: (dy / dist) * power + 1.1, z: (dz / dist) * power * 0.35 },
          true,
        );
        b.applyTorqueImpulse({ x: dy * 0.04, y: dx * 0.04, z: (dx - dy) * 0.02 }, true);
      }
    },
    [fit],
  );

  return (
    <group>
      {/* click पकड़ने के लिए अदृश्य परदा */}
      <mesh
        position={[0, 0, -1.2]}
        onPointerDown={(e) => {
          e.stopPropagation();
          burst(e.point);
        }}
        visible={false}
      >
        <planeGeometry args={[60, 60]} />
        <meshBasicMaterial />
      </mesh>

      {/*
        बड़ी screen पर ढेर दाईं तरफ़ खिसका देते हैं — बाईं तरफ़ दुकान का नाम
        और दोनों button रहते हैं, तो दोनों एक-दूसरे के ऊपर नहीं चढ़ते।
      */}
      <group scale={fit} position-x={small ? 0 : viewport.width * 0.17}>
        <Physics
          gravity={[0, scrollState.reduced ? 0 : -26, 0]}
          paused={!active}
          timeStep={1 / 60}
          interpolate
        >
          {/* ज़मीन और अदृश्य दीवारें — फ़ोन screen से बाहर न जाएँ */}
          <RigidBody key={wallKey} type="fixed" colliders={false} friction={1}>
            <CuboidCollider args={[20, 0.5, 6]} position={[0, floorY - 0.5, 0]} />
            <CuboidCollider args={[0.5, 20, 6]} position={[-halfW - 0.5, floorY + 18, 0]} />
            <CuboidCollider args={[0.5, 20, 6]} position={[halfW + 0.5, floorY + 18, 0]} />
            <CuboidCollider args={[20, 20, 0.5]} position={[0, floorY + 18, -1.1]} />
            <CuboidCollider args={[20, 20, 0.5]} position={[0, floorY + 18, 1.1]} />
          </RigidBody>

          <PointerPusher scale={fit} />

          {chips.map((chip, i) => {
            const a = i * 2.399963;
            const x = Math.sin(a) * halfW * 0.55;
            return (
              <RigidBody
                key={`${i}-${wallKey}`}
                ref={(r) => {
                  if (r) bodies.current[i] = r;
                }}
                colliders="cuboid"
                position={[x, floorY + 3.2 + i * 1.05, Math.cos(a) * 0.55]}
                rotation={chip.spin}
                restitution={0.28}
                friction={0.95}
                linearDamping={0.2}
                angularDamping={0.4}
                canSleep
              >
                <PhoneMesh body={chip.color} screen={chip.screen} size={chip.size} glow={0.6} />
              </RigidBody>
            );
          })}
        </Physics>

        {/* ढेर के नीचे की परछाईं — इसी से लगता है कि फ़ोन ज़मीन पर हैं */}
        <ContactShadows
          position={[0, floorY + 0.02, 0]}
          opacity={0.7}
          scale={halfW * 4}
          blur={2.4}
          far={4}
          resolution={512}
          frames={scrollState.reduced ? 1 : Infinity}
        />
      </group>
    </group>
  );
}
