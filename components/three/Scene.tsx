"use client";

import { useRef, useState } from "react";
import {
  AdaptiveDpr,
  AdaptiveEvents,
  Environment,
  Lightformer,
  PerformanceMonitor,
  Preload,
} from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

import { ExplodedPhone } from "./ExplodedPhone";
import { MorphParticles } from "./MorphParticles";
import { PhysicsHero } from "./PhysicsHero";
import { damp, range, scrollState } from "./scrollStore";

/**
 * तीनों acts एक ही canvas में। कौन सा act दिख रहा है, यह scroll तय करता है।
 *
 * एक act ख़त्म होते ही उसका पूरा समूह screen से बाहर सरक जाता है और अगला
 * ऊपर से आ जाता है। कोई fade नहीं — चीज़ें सच में आती-जाती हैं, जैसे किसी
 * रंगमंच पर पर्दे के पीछे से।
 */

/** overall scroll में हर act की जगह। */
const ACT = {
  heroOut: [0.24, 0.34] as const,
  explodeIn: [0.26, 0.36] as const,
  explodeOut: [0.62, 0.71] as const,
  morphIn: [0.64, 0.74] as const,
};

function Acts({ explodeTriggerId }: { explodeTriggerId: string }) {
  const hero = useRef<THREE.Group>(null);
  const explode = useRef<THREE.Group>(null);
  const morph = useRef<THREE.Group>(null);
  const cam = useRef({ x: 0, y: 0 });

  // physics तभी चले जब पहला act दिख रहा हो — बाक़ी समय CPU खाली रहे
  const [physicsOn, setPhysicsOn] = useState(true);
  const wasOn = useRef(true);

  useFrame((state, dt) => {
    const p = scrollState.raw;
    const d = Math.min(dt, 0.05);

    // camera pointer के पीछे ज़रा सा घूमती है — इसी से 3D का एहसास बनता है
    cam.current.x = damp(cam.current.x, scrollState.px * 0.55, 4, d);
    cam.current.y = damp(cam.current.y, scrollState.py * 0.35, 4, d);
    state.camera.position.x = cam.current.x;
    state.camera.position.y = cam.current.y;
    state.camera.lookAt(0, 0, 0);

    const gHero = hero.current;
    const gExp = explode.current;
    const gMor = morph.current;

    if (gHero) {
      const out = range(ACT.heroOut[0], ACT.heroOut[1], p);
      gHero.position.y = -out * 15;
      gHero.visible = out < 1;
    }

    if (gExp) {
      const inn = range(ACT.explodeIn[0], ACT.explodeIn[1], p);
      const out = range(ACT.explodeOut[0], ACT.explodeOut[1], p);
      gExp.position.y = (1 - inn) * 15 - out * 15;
      gExp.visible = inn > 0 && out < 1;
    }

    if (gMor) {
      const inn = range(ACT.morphIn[0], ACT.morphIn[1], p);
      /*
        कणों से बनने वाला TV लगभग 4.6 unit चौड़ा है। फ़ोन की screen सिर्फ़
        2.5 unit चौड़ी होती है, इसलिए वहाँ पूरा बादल screen से बाहर निकल
        जाता था। इसलिए screen की चौड़ाई देखकर छोटा कर देते हैं।
      */
      const { width, height } = state.viewport;
      const fit = THREE.MathUtils.clamp(width / 5.6, 0.42, 1);
      gMor.scale.setScalar((0.35 + inn * 0.65) * fit);
      gMor.position.y = width < 5 ? height * 0.12 : 0;
      gMor.visible = inn > 0;
    }

    const on = p < ACT.heroOut[1] + 0.02;
    if (on !== wasOn.current) {
      wasOn.current = on;
      setPhysicsOn(on);
    }
  });

  return (
    <>
      <group ref={hero}>
        <PhysicsHero active={physicsOn} />
      </group>

      <group ref={explode}>
        <ExplodedPhone triggerId={explodeTriggerId} />
      </group>

      <group ref={morph}>
        <MorphParticles />
      </group>
    </>
  );
}

export default function Scene({
  explodeTriggerId,
  paused = false,
}: {
  explodeTriggerId: string;
  paused?: boolean;
}) {
  const [dpr, setDpr] = useState(1.5);

  return (
    <Canvas
      // canvas screen पर न हो तो एक भी frame मत बनाओ — battery बचती है
      frameloop={paused ? "never" : "always"}
      dpr={dpr}
      shadows={false}
      camera={{ position: [0, 0, 9], fov: 34, near: 0.1, far: 40 }}
      gl={{
        antialias: false,
        powerPreference: "high-performance",
        alpha: true,
        stencil: false,
        depth: true,
      }}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 1.05;
      }}
      style={{ touchAction: "pan-y" }}
    >
      {/*
        फ़ोन धीमा है तो resolution अपने आप घटा दो — animation रुकने से
        बेहतर है थोड़ा कम तेज़ दिखना।
      */}
      <PerformanceMonitor
        onIncline={() => {
          setDpr(Math.min(2, window.devicePixelRatio));
          scrollState.quality = 1;
        }}
        onDecline={() => {
          setDpr(1);
          scrollState.quality = 0.6;
        }}
      />
      <AdaptiveDpr pixelated />
      <AdaptiveEvents />

      {/*
        canvas का background जान-बूझकर पारदर्शी है — पीछे CSS का हल्का
        नीला gradient दिखता रहे, जिससे दृश्य में गहराई आती है।
      */}
      <fog attach="fog" args={["#080a12", 14, 30]} />

      <ambientLight intensity={1.1} />
      {/* मुख्य रौशनी — ऊपर-दाएँ से, जैसे दुकान की ceiling light */}
      <directionalLight position={[4, 8, 7]} intensity={3.2} color="#eef3ff" />
      {/* किनारों की नीली-बैंगनी झलक, जो काँच पर चमकती है */}
      <directionalLight position={[-7, 2, -3]} intensity={1.8} color="#2678ff" />
      <directionalLight position={[6, -3, -4]} intensity={1.2} color="#8b5cf6" />
      <pointLight position={[0, -1, 5]} intensity={30} distance={16} color="#4cc9f0" />

      {/*
        चमकती सतहों में जो परछाइयाँ दिखती हैं वो यहीं से आती हैं।
        कोई बाहरी HDR file नहीं — सब यहीं बनाया है, ताकि कुछ download न हो।
      */}
      <Environment resolution={192} frames={1} background={false}>
        <Lightformer form="rect" intensity={7} position={[0, 5, 3]} scale={[12, 5, 1]} color="#ffffff" />
        <Lightformer form="rect" intensity={5} position={[-6, 1, 3]} scale={[5, 10, 1]} color="#7fd8ff" />
        <Lightformer form="rect" intensity={4.5} position={[6, -1, 3]} scale={[5, 10, 1]} color="#b79bff" />
        <Lightformer form="circle" intensity={4} position={[0, -5, 4]} scale={6} color="#ff8fa3" />
        <Lightformer form="rect" intensity={3} position={[0, 0, -6]} scale={[14, 10, 1]} color="#2b3a66" />
      </Environment>

      <Acts explodeTriggerId={explodeTriggerId} />
      <Preload all />
    </Canvas>
  );
}
