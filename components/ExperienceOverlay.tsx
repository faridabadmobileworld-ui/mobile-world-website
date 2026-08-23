"use client";

import { useState } from "react";
import {
  motion,
  useMotionValueEvent,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";

import CallButton from "@/components/CallButton";
import WhatsAppButton from "@/components/WhatsAppButton";
import OpenStatus from "@/components/OpenStatus";
import { explodedHeading } from "@/data/deviceParts";
import { categories, shop } from "@/data/shop";

/**
 * 3D के ऊपर की लिखाई।
 *
 * यह canvas के अंदर नहीं है — यह असली HTML है, canvas के ऊपर तैरता हुआ।
 * इसकी दो वजहें हैं: हिंदी हमेशा साफ़ पढ़ी जाती है, और Google को असली text
 * मिलता है (canvas के अंदर की लिखाई Google नहीं पढ़ पाता)।
 *
 * हर हिस्सा scroll के हिसाब से आता-जाता है — Framer Motion से।
 */

/** Act 3 में जो चार सामान बनते हैं, उन्हीं के नाम — shop.ts से। */
const MORPH_SLUGS = ["mobiles", "laptops", "televisions", "air-conditioners"];

function useActOpacity(p: MotionValue<number>, a: number, b: number, c: number, d: number) {
  return useTransform(p, [a, b, c, d], [0, 1, 1, 0]);
}

export function ExperienceOverlay({
  progress,
  lite = false,
}: {
  progress: MotionValue<number>;
  /**
   * धीमे connection पर 3D उतरा ही नहीं। ऐसे में scroll से चलने वाली कहानी
   * का कोई मतलब नहीं — इसलिए सिर्फ़ पहला हिस्सा दिखता है, स्थिर।
   */
  lite?: boolean;
}) {
  const heroOpacity = useActOpacity(progress, 0, 0.02, 0.16, 0.26);
  const heroY = useTransform(progress, [0, 0.26], ["0%", "-14%"]);

  const explodeOpacity = useActOpacity(progress, 0.3, 0.37, 0.58, 0.66);
  const morphOpacity = useActOpacity(progress, 0.7, 0.77, 0.93, 0.985);

  // particles जिस सामान की शक्ल बना रहे हैं, वही नाम नीचे लिखा जाता है
  const [shapeIndex, setShapeIndex] = useState(0);
  useMotionValueEvent(progress, "change", (v) => {
    // यही 0.74 और 0.25 Experience.tsx में भी हैं — नाम और शक्ल एक साथ बदलें,
    // इसलिए दोनों जगह गिनती एक जैसी रखी है।
    const local = Math.min(1, Math.max(0, (v - 0.74) / 0.25));
    const i = Math.min(3, Math.floor(local * 3 + 0.4));
    setShapeIndex((prev) => (prev === i ? prev : i));
  });

  const shapeName =
    categories.find((c) => c.slug === MORPH_SLUGS[shapeIndex])?.name ?? "Mobiles";

  return (
    <div className="pointer-events-none absolute inset-0 z-10">
      {/* Act 1 — दुकान का नाम और दोनों button */}
      <motion.div
        style={lite ? undefined : { opacity: heroOpacity, y: heroY }}
        className="absolute inset-x-0 bottom-0 flex flex-col items-center px-5 pb-[calc(5.75rem+env(safe-area-inset-bottom))] text-center sm:bottom-auto sm:top-1/2 sm:w-[min(34rem,46vw)] sm:-translate-y-1/2 sm:items-start sm:pb-0 sm:pl-10 sm:text-left lg:pl-16"
      >
        {/*
          फ़ोन पर ढेर ऊपर और लिखाई नीचे — इसलिए नीचे एक गहरा card चाहिए।
          बड़ी screen पर लिखाई बाएँ और ढेर दाएँ रहता है, वहाँ card की
          ज़रूरत नहीं; सिर्फ़ हल्का सा अँधेरा काफ़ी है।
        */}
        <div className="pointer-events-auto w-full max-w-2xl rounded-3xl bg-black/45 px-5 py-5 backdrop-blur-md sm:bg-transparent sm:px-0 sm:py-0 sm:backdrop-blur-none">
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.6 }}
            className="text-[11px] font-semibold uppercase tracking-[0.28em] text-electric sm:text-xs"
          >
            {shop.address.locality} · {shop.address.city}
          </motion.p>

          <h2 className="bigtype mt-2 text-[clamp(2.4rem,11vw,4.8rem)] leading-[0.86] text-white">
            {"MOBILE".split("").map((ch, i) => (
              <motion.span
                key={`m${i}`}
                initial={{ opacity: 0, y: 40, rotateX: -60 }}
                animate={{ opacity: 1, y: 0, rotateX: 0 }}
                transition={{ delay: 0.2 + i * 0.045, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                className="inline-block"
              >
                {ch}
              </motion.span>
            ))}
            <br />
            {"WORLD".split("").map((ch, i) => (
              <motion.span
                key={`w${i}`}
                initial={{ opacity: 0, y: 40, rotateX: -60 }}
                animate={{ opacity: 1, y: 0, rotateX: 0 }}
                transition={{ delay: 0.45 + i * 0.045, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                className="inline-block bg-gradient-to-b from-white to-electric bg-clip-text text-transparent"
              >
                {ch}
              </motion.span>
            ))}
          </h2>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.75, duration: 0.6 }}
            className="mx-auto mt-3 max-w-md text-sm text-white/85 sm:mx-0 sm:text-base"
          >
            Mobiles, laptops, TV और घर के appliances — एक ही दुकान पर।
            Repair, EMI और exchange की सुविधा भी।
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.6 }}
            className="mt-5 flex flex-col items-center gap-3 sm:items-start"
          >
            <OpenStatus />
            {/*
              फ़ोन पर नीचे चिपकी पट्टी में Call और WhatsApp पहले से हैं,
              इसलिए यहाँ दोबारा नहीं दिखाते — जगह बचती है और ढेर दिखता है।
            */}
            <div className="hidden gap-3 sm:flex sm:flex-row">
              <CallButton />
              <WhatsAppButton />
            </div>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.4, duration: 0.8 }}
            className="mt-4 text-[11px] text-white/45"
          >
            ढेर को छूकर हिलाइए · scroll कीजिए
          </motion.p>
        </div>
      </motion.div>

      {/* Act 2 — repair */}
      {!lite && (
      <motion.div
        style={{ opacity: explodeOpacity }}
        className="absolute inset-x-0 bottom-0 flex justify-center px-5 pb-[calc(5.75rem+env(safe-area-inset-bottom))] sm:bottom-auto sm:left-0 sm:top-1/2 sm:w-[min(28rem,42vw)] sm:-translate-y-1/2 sm:justify-start sm:pb-0 sm:pl-10"
      >
        <div className="pointer-events-auto max-w-md rounded-3xl bg-black/45 p-5 text-center backdrop-blur-md sm:bg-transparent sm:p-0 sm:text-left sm:backdrop-blur-none">
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-electric">
            {explodedHeading.kicker}
          </p>
          <h2 className="bigtype mt-2 whitespace-pre-line text-[clamp(1.7rem,6.5vw,3.4rem)] leading-[0.92] text-white">
            {explodedHeading.title}
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-white/80 sm:text-base">
            {explodedHeading.body}
          </p>
        </div>
      </motion.div>
      )}

      {/* Act 3 — categories */}
      {!lite && (
      <motion.div
        style={{ opacity: morphOpacity }}
        className="absolute inset-x-0 bottom-0 flex flex-col items-center px-5 pb-[calc(5.75rem+env(safe-area-inset-bottom))] text-center sm:pb-12"
      >
        <div className="pointer-events-auto w-full max-w-xl rounded-3xl bg-black/35 px-5 py-5 backdrop-blur-md sm:px-8">
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-electric">
            एक ही दुकान, पूरी लिस्ट
          </p>
          <div className="mt-2 h-[clamp(2.2rem,9vw,4rem)]">
            <motion.h2
              key={shapeName}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="bigtype text-[clamp(1.9rem,8vw,3.6rem)] leading-none text-white"
            >
              {shapeName}
            </motion.h2>
          </div>
          <p className="mt-2 text-sm text-white/75">
            और {categories.length - 4} और categories — stock और क़ीमत के लिए एक call
            कीजिए।
          </p>
          <div className="mt-4 hidden gap-3 sm:flex sm:flex-row sm:justify-center">
            <CallButton label={shop.phone.display} />
            <WhatsAppButton />
          </div>
        </div>
      </motion.div>
      )}
    </div>
  );
}

export function useOverlayProgress(ref: React.RefObject<HTMLElement | null>) {
  return useScroll({ target: ref, offset: ["start start", "end end"] }).scrollYProgress;
}
