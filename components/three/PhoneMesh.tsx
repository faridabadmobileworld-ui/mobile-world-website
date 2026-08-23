"use client";

import { RoundedBox } from "@react-three/drei";
import type { ThreeElements } from "@react-three/fiber";

export type PhoneMeshProps = {
  /** शरीर का रंग */
  body?: string;
  /** screen की रौशनी का रंग */
  screen?: string;
  /** कितनी तेज़ रौशनी */
  glow?: number;
  /** नाप: चौड़ाई × ऊँचाई × मोटाई */
  size?: [number, number, number];
} & ThreeElements["group"];

/**
 * एक फ़ोन — असली जैसा दिखने के लिए तीन हिस्सों से बना है:
 * गोल किनारों वाला शरीर, थोड़ा अंदर धँसी चमकती screen, और पीछे camera का उभार।
 *
 * यह जान-बूझकर किसी brand का फ़ोन नहीं है। CLAUDE.md §8 कहता है कि जो पक्का
 * नहीं पता वो मत दिखाओ — तो यह एक आम smartphone है, किसी model की नक़ल नहीं।
 */
export function PhoneMesh({
  body = "#12161f",
  screen = "#4cc9f0",
  glow = 0.5,
  size = [0.62, 1.28, 0.075],
  ...group
}: PhoneMeshProps) {
  const [w, h, d] = size;

  return (
    <group {...group}>
      {/* शरीर */}
      <RoundedBox args={[w, h, d]} radius={Math.min(w, h) * 0.13} smoothness={3} castShadow receiveShadow>
        <meshPhysicalMaterial
          color={body}
          metalness={0.55}
          roughness={0.3}
          clearcoat={1}
          clearcoatRoughness={0.1}
          envMapIntensity={1.9}
        />
      </RoundedBox>

      {/* screen — शरीर से ज़रा सा आगे, ताकि वो साफ़ दिखे */}
      <mesh position={[0, 0, d / 2 + 0.002]}>
        <planeGeometry args={[w * 0.9, h * 0.93]} />
        <meshStandardMaterial
          color="#05080f"
          emissive={screen}
          emissiveIntensity={glow}
          roughness={0.12}
          metalness={0}
        />
      </mesh>

      {/* पीछे camera का उभार */}
      <RoundedBox
        args={[w * 0.42, w * 0.42, d * 0.7]}
        radius={w * 0.07}
        smoothness={2}
        position={[-w * 0.24, h * 0.32, -d * 0.62]}
        castShadow
      >
        <meshStandardMaterial color="#161b27" metalness={0.8} roughness={0.25} envMapIntensity={1.6} />
      </RoundedBox>
    </group>
  );
}
