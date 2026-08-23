"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { shop } from "@/data/shop";
import { devices, finalAct } from "@/data/devices";
import { getOpenState } from "@/data/hours";

/**
 * Home page का सबसे ऊपरी हिस्सा — तीन flagship फ़ोन जो scroll करने पर
 * 3D में घूमते हैं, और Fold जो सच में खुलता है।
 *
 * तीनों फ़ोन CSS के 3D transform से बने हैं — कोई video नहीं, कोई भारी
 * 3D library नहीं। इसलिए पूरा हिस्सा कुछ ही KB का है।
 *
 * काम कैसे करता है: नीचे खाली जगह (spacer) scroll की लंबाई देती है, और
 * ऊपर की हर चीज़ टिकी रहती है। जितना scroll हुआ, उसी हिसाब से फ़ोन घूमता है।
 */

const ACTS = devices.length + 1; // तीन फ़ोन + आख़िरी बुलावा

export default function DeviceReel() {
  const rigRef = useRef<HTMLDivElement>(null);
  const devRefs = useRef<(HTMLDivElement | null)[]>([]);
  const leafRef = useRef<HTMLDivElement>(null);
  const penRef = useRef<HTMLSpanElement>(null);
  const barRef = useRef<HTMLSpanElement>(null);
  const [act, setAct] = useState(0);
  const [openLabel, setOpenLabel] = useState<string | null>(null);

  // "अभी खुला है" — भारत के समय से
  useEffect(() => {
    const tick = () => {
      const s = getOpenState(new Date());
      setOpenLabel(
        s.status === "open"
          ? `अभी खुला है · ${s.closesAt} तक`
          : s.reason === "monthly"
            ? "आज बंद है · महीने की आख़िरी तारीख़"
            : "अभी बंद है",
      );
    };
    tick();
    const t = setInterval(tick, 60_000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let target = 0;
    let shown = 0;
    let raf = 0;
    let running = false;

    const read = () => {
      // हर पड़ाव को पूरा एक screen जितना scroll मिले — इससे घुमाव इतमीनान से
      // दिखता है। नीचे spacer भी इतने ही रखे गए हैं।
      const span = ACTS * window.innerHeight;
      target = Math.min(1, Math.max(0, window.scrollY / span));
      if (!running) {
        running = true;
        raf = requestAnimationFrame(loop);
      }
    };

    const loop = () => {
      // सीधा कूदने के बजाय पीछे-पीछे आता है — इससे चाल असली लगती है
      shown += (target - shown) * (reduce ? 1 : 0.085);
      const p = shown;

      // act और उसके अंदर की प्रगति — दोनों एक ही गिनती से, वरना बीच में
      // Fold दोबारा बंद हो जाता था
      const f = p * ACTS;
      const idx = Math.min(ACTS - 1, Math.floor(f));
      const q = Math.min(1, f - idx);

      setAct(idx);
      if (barRef.current) barRef.current.style.width = `${p * 100}%`;

      if (!reduce) {
        const isFold = devices[idx]?.shape === "fold" || idx >= devices.length;
        // Fold को पूरा मत घुमाओ — घुमाने पर वो किनारे से पतला दिखता है और
        // खुलने का असर, जो उसकी सबसे बड़ी बात है, मारा जाता है
        const spin = isFold
          ? Math.sin(q * Math.PI * 2) * 22
          : q * 360 + idx * 120;
        const tilt = Math.sin(q * Math.PI) * (isFold ? 9 : 16);
        const sc = 1 + Math.sin(q * Math.PI) * (isFold ? 0.05 : 0.12);
        const ty = Math.sin(q * Math.PI * 1.3) * -18;

        const live = devRefs.current[Math.min(idx, devices.length - 1)];
        if (live) {
          live.style.transform = `translateY(${ty}px) rotateX(${tilt}deg) rotateY(${spin}deg) scale(${sc})`;
        }

        // S-Pen बाहर आता है
        if (penRef.current) {
          penRef.current.style.transform = `translateY(${q * 26}px)`;
        }

        // Fold खुलता है — खुलने के बाद खुला ही रहता है
        if (leafRef.current) {
          const foldIdx = devices.findIndex((d) => d.shape === "fold");
          const open = idx > foldIdx ? 1 : idx === foldIdx ? Math.min(1, q * 1.5) : 0;
          leafRef.current.style.transform = `rotateY(${-178 * (1 - open)}deg)`;
        }
      }

      if (Math.abs(target - shown) > 0.0004) {
        raf = requestAnimationFrame(loop);
      } else {
        running = false;
      }
    };

    window.addEventListener("scroll", read, { passive: true });
    window.addEventListener("resize", read);
    read();
    return () => {
      window.removeEventListener("scroll", read);
      window.removeEventListener("resize", read);
      cancelAnimationFrame(raf);
    };
  }, []);

  const isFinal = act >= devices.length;
  const stage = isFinal ? finalAct : devices[act];
  const foldIdx = devices.findIndex((d) => d.shape === "fold");
  // आख़िरी पड़ाव पर भी Fold ही दिखता रहे, ग़ायब न हो
  const liveIdx = isFinal ? foldIdx : act;

  return (
    <>
      {/* ── टिकी हुई परत ── */}
      <div
        ref={rigRef}
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-10 overflow-hidden"
      >
        <div
          data-reel="wash"
          className="absolute inset-0 transition-[background] duration-1000"
          style={{ background: stage.wash }}
        />
        <div
          data-reel="glowA"
          className="absolute -left-[14vmin] top-[6vmin] h-[60vmin] w-[60vmin] rounded-full opacity-60 blur-[70px] transition-[background] duration-1000"
          style={{ background: stage.glowA }}
        />
        <div
          data-reel="glowB"
          className="absolute -right-[12vmin] bottom-[8vmin] h-[52vmin] w-[52vmin] rounded-full opacity-60 blur-[70px] transition-[background] duration-1000"
          style={{ background: stage.glowB }}
        />

        {/* पीछे की विशाल लिखाई */}
        <div className="absolute inset-0 grid place-items-center px-2">
          <p
            key={isFinal ? "final" : devices[act].slug}
            data-reel="big"
            className="bigtype animate-[fadeUp_.5s_cubic-bezier(.16,1,.3,1)] text-center text-[clamp(58px,18.5vw,220px)]"
            style={{ color: stage.ink }}
          >
            {stage.bigType.split("\n").map((line, i) => (
              <span
                key={line}
                className={
                  !isFinal && devices[act].hollowSecondLine && i === 1 ? "hollow" : ""
                }
              >
                {line}
                {i === 0 && "\n"}
              </span>
            ))}
          </p>
        </div>

        {/* ── तीनों फ़ोन ── */}
        <div className="absolute inset-0 grid place-items-center [perspective:1500px]">
          {devices.map((d, i) => (
            <div
              key={d.slug}
              ref={(el) => {
                devRefs.current[i] = el;
              }}
              data-reel-device={i}
              className={`absolute [transform-style:preserve-3d] transition-opacity duration-500 ${
                i === liveIdx ? "opacity-100" : "opacity-0"
              }`}
            >
              {d.shape === "fold" ? (
                <FoldBody device={d} leafRef={leafRef} />
              ) : d.shape === "ultra" ? (
                <UltraBody device={d} penRef={penRef} />
              ) : (
                <BarBody device={d} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/*
        ── नीचे की लिखाई — टिकी रहती है ──
        फ़ोन पर नीचे contact की पट्टी चिपकी रहती है, इसलिए उससे ऊपर जगह
        छोड़नी पड़ती है — वरना card के button उसके पीछे चले जाते हैं।
      */}
      <div className="pointer-events-none fixed inset-x-0 bottom-[calc(3svh+76px)] z-30 grid place-items-center px-5 sm:bottom-[5.5svh]">
        {[...devices, null].map((d, i) => (
          <div
            key={d?.slug ?? "final"}
            data-reel-card={i}
            className={`pointer-events-auto col-start-1 row-start-1 max-w-[440px] text-center transition-all duration-500 ${
              i === act ? "opacity-100" : "pointer-events-none translate-y-4 opacity-0"
            }`}
            style={{ color: stage.ink }}
          >
            {d ? (
              <>
                <p className="text-[10px] tracking-[0.26em] uppercase opacity-70">
                  Flagship · काउंटर पर मौजूद
                </p>
                <h2 className="mt-2 font-[family-name:var(--font-head)] text-[clamp(20px,5.6vw,28px)] font-extrabold tracking-tight">
                  {d.name}
                </h2>
                <p className="mt-2 text-sm leading-relaxed opacity-80">{d.note}</p>
                <ul className="mt-3 flex flex-wrap justify-center gap-1.5">
                  {d.chips.map((c) => (
                    <li
                      key={c}
                      className="rounded-full border border-current px-2.5 py-1 text-[11px] font-semibold opacity-75"
                    >
                      {c}
                    </li>
                  ))}
                </ul>
              </>
            ) : (
              <>
                <p className="text-[10px] tracking-[0.26em] uppercase opacity-70">
                  Gurudwara Road · {shop.address.locality}
                </p>
                <h2 className="mt-2 font-[family-name:var(--font-head)] text-[clamp(20px,5.6vw,28px)] font-extrabold tracking-tight">
                  दुकान पर आ जाइए
                </h2>
                <p className="mt-2 text-sm leading-relaxed opacity-80">
                  {openLabel ?? "रोज़ सुबह 9 से रात 11 बजे तक"} · Repair, EMI और
                  exchange — तीनों यहीं।
                </p>
              </>
            )}

            <div className="mt-4 flex flex-wrap justify-center gap-2.5">
              <a
                href={shop.phone.tel}
                className="inline-flex items-center gap-2 rounded-full bg-cream px-6 py-3 text-[13px] font-extrabold text-ink shadow-[0_12px_32px_-12px_rgba(0,0,0,.65)] transition-transform hover:-translate-y-0.5"
              >
                {isFinal ? shop.phone.display : "Call करें"}
              </a>
              <a
                href={shop.phone.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border-[1.5px] border-current px-6 py-3 text-[13px] font-extrabold transition-transform hover:-translate-y-0.5"
              >
                WhatsApp
              </a>
              {isFinal && (
                <Link
                  href="/products"
                  className="inline-flex items-center gap-2 rounded-full border-[1.5px] border-current px-6 py-3 text-[13px] font-extrabold transition-transform hover:-translate-y-0.5"
                >
                  सब देखें
                </Link>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* प्रगति की लकीर */}
      <div className="fixed inset-x-0 bottom-0 z-40 h-0.5 bg-white/10">
        <span ref={barRef} data-reel="bar" className="block h-full w-0 bg-electric" />
      </div>

      {/* scroll की लंबाई — इतनी ही जगह में पूरा खेल चलता है */}
      {Array.from({ length: ACTS + 1 }).map((_, i) => (
        <div key={i} className="h-[100svh]" />
      ))}
    </>
  );
}

/* ─────────── फ़ोन के तीन आकार ─────────── */

/** iPhone जैसा — बड़ा camera square, Dynamic Island। */
function BarBody({ device }: { device: (typeof devices)[number] }) {
  return (
    <div className="relative aspect-[9/19.5] w-[min(50vw,224px)] [transform-style:preserve-3d]">
      <div className="absolute inset-0 rounded-[32px] bg-gradient-to-br from-[#c9c2b6] via-[#4a4640] to-[#a49c90] p-[5px] shadow-[0_55px_110px_-38px_rgba(0,0,0,.9)] [backface-visibility:hidden] [transform:translateZ(7px)]">
        <div className="relative h-full overflow-hidden rounded-[27px] bg-black">
          <Image
            src={device.screen}
            alt=""
            fill
            sizes="224px"
            className="object-cover"
          />
          <span className="absolute left-1/2 top-2 z-[2] h-4 w-[29%] -translate-x-1/2 rounded-[11px] bg-black" />
          <span className="pointer-events-none absolute inset-0 z-[3] bg-[linear-gradient(116deg,rgba(255,255,255,.28),transparent_34%,transparent_68%,rgba(255,255,255,.09))]" />
        </div>
      </div>
      <div className="absolute inset-0 rounded-[32px] bg-gradient-to-br from-[#cfc8bc] via-[#514c45] to-[#aaa294] [backface-visibility:hidden] [transform:translateZ(-7px)_rotateY(180deg)]">
        <div className="absolute left-[5.5%] top-[4.5%] grid aspect-square w-[36%] grid-cols-2 gap-[6%] rounded-[26px] bg-gradient-to-br from-[#b9b2a6] to-[#3b3833] p-[7.5%] shadow-[inset_0_0_0_1px_rgba(255,255,255,.2)]">
            <i className="rounded-full bg-[radial-gradient(circle_at_34%_30%,#6f7686,#080a0d_60%)] shadow-[inset_0_0_0_2px_#2a2d33]" />
            <i className="rounded-full bg-[radial-gradient(circle_at_34%_30%,#6f7686,#080a0d_60%)] shadow-[inset_0_0_0_2px_#2a2d33]" />
            <i className="rounded-full bg-[radial-gradient(circle_at_34%_30%,#6f7686,#080a0d_60%)] shadow-[inset_0_0_0_2px_#2a2d33]" />
            <i className="rounded-full bg-[radial-gradient(circle_at_40%_36%,#fff8e6,#c9bda0_70%)] opacity-85" />
        </div>
      </div>
      <span className="pointer-events-none absolute inset-0 z-[4] rounded-[32px] shadow-[inset_0_0_0_1.5px_rgba(255,255,255,.18)]" />
    </div>
  );
}

/** Samsung Ultra जैसा — तीन अलग lens, चौकोर कोने, S-Pen। */
function UltraBody({
  device,
  penRef,
}: {
  device: (typeof devices)[number];
  penRef: React.RefObject<HTMLSpanElement | null>;
}) {
  return (
    <div className="relative aspect-[9/19.6] w-[min(50vw,228px)] [transform-style:preserve-3d]">
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#5b4a86] via-[#191424] to-[#463a6b] p-[5px] shadow-[0_55px_110px_-38px_rgba(0,0,0,.9)] [backface-visibility:hidden] [transform:translateZ(6px)]">
        <div className="relative h-full overflow-hidden rounded-[11px] bg-black">
          <Image
            src={device.screen}
            alt=""
            fill
            sizes="228px"
            className="object-cover"
          />
          <span className="absolute left-1/2 top-2 z-[2] h-2.5 w-2.5 -translate-x-1/2 rounded-full bg-black" />
          <span className="pointer-events-none absolute inset-0 z-[3] bg-[linear-gradient(116deg,rgba(255,255,255,.28),transparent_34%,transparent_68%,rgba(255,255,255,.09))]" />
        </div>
      </div>
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#6a5796] via-[#1d1729] to-[#4b3d72] [backface-visibility:hidden] [transform:translateZ(-6px)_rotateY(180deg)]">
        {["top-[6%]", "top-[22%]", "top-[38%]"].map((t) => (
          <span
            key={t}
            className={`absolute ${t} left-[11%] aspect-square w-[15%] rounded-full bg-[radial-gradient(circle_at_34%_30%,#7d86a0,#06070b_62%)] shadow-[inset_0_0_0_2.5px_#2b2f3d]`}
          />
        ))}
      </div>
      <span
        ref={penRef}
        data-reel="pen"
        className="absolute -right-[3px] bottom-[8%] h-[34%] w-[6px] rounded bg-gradient-to-b from-[#8d7fc0] to-[#3a3159] transition-transform duration-500"
      />
      <span className="pointer-events-none absolute inset-0 z-[4] rounded-2xl shadow-[inset_0_0_0_1.5px_rgba(255,255,255,.18)]" />
    </div>
  );
}

/** Fold — बंद से खुलता हुआ। बाएँ पन्ना कब्ज़े पर घूमता है। */
function FoldBody({
  device,
  leafRef,
}: {
  device: (typeof devices)[number];
  leafRef: React.RefObject<HTMLDivElement | null>;
}) {
  return (
    <div className="relative aspect-[1/1.12] w-[min(76vw,300px)] [transform-style:preserve-3d]">
      <div className="absolute inset-0 flex [transform-style:preserve-3d]">
        {/* बाएँ पन्ना — यही खुलता है */}
        <div
          ref={leafRef}
          data-reel="leaf"
          className="relative h-full w-1/2 origin-right [transform-style:preserve-3d]"
        >
          <div className="absolute inset-0 overflow-hidden rounded-[9px] bg-gradient-to-br from-[#20242e] to-[#0b0d12] shadow-[inset_0_0_0_1.5px_rgba(255,255,255,.16)] [backface-visibility:hidden]">
            <Image src={device.screen} alt="" fill sizes="150px" className="object-cover" />
          </div>
          {/* बंद होने पर यही बाहर दिखता है */}
          <div className="absolute inset-0 grid place-items-center rounded-[9px] bg-gradient-to-br from-[#2a2f3b] to-[#0d1016] shadow-[inset_0_0_0_1.5px_rgba(255,255,255,.16)] [backface-visibility:hidden] [transform:rotateY(180deg)]">
            <span className="font-[family-name:var(--font-head)] text-[11px] font-extrabold tracking-[0.2em] text-[#6f7686]">
              MOBILE WORLD
            </span>
          </div>
        </div>

        {/* दायाँ पन्ना — टिका रहता है */}
        <div className="relative h-full w-1/2 [transform-style:preserve-3d]">
          <div className="absolute inset-0 overflow-hidden rounded-[9px] bg-gradient-to-br from-[#20242e] to-[#0b0d12] shadow-[inset_0_0_0_1.5px_rgba(255,255,255,.16)]">
            <Image
              src={device.screen2 ?? device.screen}
              alt=""
              fill
              sizes="150px"
              className="object-cover"
            />
          </div>
        </div>

        {/* कब्ज़ा */}
        <span className="absolute left-1/2 top-0 bottom-0 z-[5] w-[5px] -translate-x-1/2 rounded bg-[linear-gradient(90deg,#0a0c11,#3b414f,#0a0c11)] [transform:translateX(-50%)_translateZ(1px)]" />
      </div>
    </div>
  );
}
