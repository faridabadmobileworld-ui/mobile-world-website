"use client";

import { Suspense, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { IconArrow, IconWhatsApp } from "@/components/Icons";
import { shop } from "@/data/shop";
import { playSpin } from "./spin-actions";
import { SPIN_CAMPAIGN, LEGACY_SPIN_CAMPAIGN, SPIN_STORAGE_KEY, spinRewards, getSpinReward, wheelStopAngle, type SpinCoupon, type SpinResponse } from "./spin-rewards";
import "./spin-wheel.css";

const segmentAngle = 360 / spinRewards.length;
const radians = (degrees: number) => (degrees * Math.PI) / 180;
function point(angle: number, radius: number) { return [250 + radius * Math.sin(radians(angle)), 250 - radius * Math.cos(radians(angle))]; }
function sector(index: number) {
  const start = point(index * segmentAngle - segmentAngle / 2, 222);
  const end = point(index * segmentAngle + segmentAngle / 2, 222);
  return `M250 250 L${start.join(" ")} A222 222 0 0 1 ${end.join(" ")} Z`;
}

function subscribeToCoupon(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener("mw-spin-change", callback);
  return () => { window.removeEventListener("storage", callback); window.removeEventListener("mw-spin-change", callback); };
}
function couponSnapshot() { try { return localStorage.getItem(SPIN_STORAGE_KEY); } catch { return null; } }
function storedCoupon(raw: string | null): SpinCoupon | null {
  try {
    if (!raw) return null;
    const value = JSON.parse(raw);
    return [SPIN_CAMPAIGN, LEGACY_SPIN_CAMPAIGN].includes(value.campaign) && getSpinReward(value.rewardId) && /^MW26-(?:[A-F0-9]{6}-){3}[A-F0-9]{6}$/.test(value.code) && /^\d{4}$/.test(value.phoneLast4) ? value : null;
  } catch { return null; }
}

function WheelGraphic({ rotation, moving, onEnd }: { rotation: number; moving: boolean; onEnd: () => void }) {
  return <div className={`spin-machine${moving ? " is-spinning" : ""}`}>
    <div className="spin-pointer" aria-hidden="true" />
    <svg viewBox="0 0 500 500" className="spin-dial" aria-hidden="true">
      <defs><radialGradient id="mw-wheel-gold"><stop offset="0%" stopColor="#fff8df"/><stop offset="75%" stopColor="#e5b264"/><stop offset="100%" stopColor="#8f612d"/></radialGradient></defs>
      <circle cx="250" cy="250" r="248" fill="url(#mw-wheel-gold)"/>
      <circle cx="250" cy="250" r="235" fill="#541222"/>
      <g className="spin-dial-rotor" style={{ transform: `rotate(${rotation}deg)` }} onTransitionEnd={event => { if (event.propertyName === "transform") onEnd(); }}>
        {spinRewards.map((reward, index) => <g key={reward.id}>
          <path d={sector(index)} fill={reward.colour} stroke="#f3d193" strokeWidth="1.5"/>
          <g transform={`rotate(${index * segmentAngle} 250 250)`} fill={reward.ink} textAnchor="middle">
            <text x="250" y="102" fontSize={reward.wheel.length > 9 ? 22 : reward.kind === "gift" ? 25 : 34} fontWeight="750">{reward.wheel}</text>
            <text x="250" y="128" fontSize="11" letterSpacing="2">{reward.sub}</text>
          </g>
        </g>)}
      </g>
      {Array.from({ length: 28 }, (_, index) => { const [x, y] = point(index * (360 / 28), 240); return <circle key={index} cx={x} cy={y} r="3.2" fill="#fff6d9"/>; })}
      <circle cx="250" cy="250" r="65" fill="url(#mw-wheel-gold)" stroke="#fff1ce" strokeWidth="3"/>
      <circle cx="250" cy="250" r="54" fill="#74162c"/>
      <text x="250" y="245" textAnchor="middle" fill="#fff2ca" fontSize="26" fontWeight="750">MW</text>
      <text x="250" y="267" textAnchor="middle" fill="#edc989" fontSize="9" letterSpacing="2">DIWALI 2026</text>
    </svg>
    <div className="spin-plinth" aria-hidden="true" />
  </div>;
}

function SpinWheelContent() {
  const isDemo = useSearchParams().get("wheelPreview") === "1";
  const saved = useSyncExternalStore(subscribeToCoupon, couponSnapshot, () => null);
  const remembered = isDemo ? null : storedCoupon(saved);
  const [phone, setPhone] = useState("");
  const [phase, setPhase] = useState<"idle" | "loading" | "spinning" | "result">("idle");
  const [rotation, setRotation] = useState(0);
  const [coupon, setCoupon] = useState<SpinCoupon | null>(null);
  const [error, setError] = useState("");
  const [copyStatus, setCopyStatus] = useState("");
  const pending = useRef<SpinCoupon | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const requestActive = useRef(false);
  const resultHeading = useRef<HTMLHeadingElement>(null);
  const demoRound = useRef(0);
  const busy = phase === "loading" || phase === "spinning";
  const shownCoupon = busy ? null : coupon || remembered;
  const reward = getSpinReward(shownCoupon?.rewardId);

  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);
  useEffect(() => { if (phase === "result") resultHeading.current?.focus({ preventScroll: true }); }, [phase]);

  function finishSpin() {
    if (!pending.current) return;
    const completed = pending.current;
    pending.current = null;
    if (timer.current) { clearTimeout(timer.current); timer.current = null; }
    setCoupon(completed); setPhase("result"); requestActive.current = false;
    if (!isDemo) {
      try { localStorage.setItem(SPIN_STORAGE_KEY, JSON.stringify(completed)); window.dispatchEvent(new Event("mw-spin-change")); } catch { /* The displayed code still works without browser storage. */ }
    }
  }

  async function startSpin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (requestActive.current) return;
    requestActive.current = true; setError(""); setCopyStatus(""); setPhase("loading");
    try {
      const response: SpinResponse = isDemo
        ? { ok: true, coupon: { campaign: "demo", code: "DEMO — claim के लिए नहीं", phoneLast4: "0000", rewardId: spinRewards[demoRound.current++ % spinRewards.length].id } }
        : await playSpin(phone, true);
      if (!response.ok) { setError(response.message); setPhase("idle"); requestActive.current = false; return; }
      pending.current = response.coupon;
      const index = spinRewards.findIndex(item => item.id === response.coupon.rewardId);
      setRotation(previous => wheelStopAngle(index, previous)); setPhase("spinning");
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      timer.current = setTimeout(finishSpin, reduced ? 80 : 5600);
    } catch {
      setError("Connection में दिक़्क़त आई। उसी number से फिर कोशिश कीजिए—आपका reward नहीं बदलेगा।"); setPhase("idle"); requestActive.current = false;
    }
  }

  function clearSaved() {
    if (busy) return;
    try { localStorage.removeItem(SPIN_STORAGE_KEY); window.dispatchEvent(new Event("mw-spin-change")); } catch { /* Storage may be disabled. */ }
    setCoupon(null); setPhase("idle"); setPhone(""); setCopyStatus(""); setError("");
  }

  return <section id="spin-wheel" className="spin-section" aria-labelledby="spin-title">
    {isDemo && <div className="spin-demo-notice" role="status">DEMO MODE · Animation की जाँच। कोई असली reward या claim code जारी नहीं होगा।</div>}
    <div className="spin-intro"><p className="spin-eyebrow">MOBILE WORLD · DIWALI SPIN &amp; WIN</p><h2 id="spin-title">एक Spin.<br/><span>आपकी ख़ुशी का एक मौक़ा।</span></h2><p>अपना number डालिए। Wheel घुमाइए। अपना reward code दुकान पर दिखाइए।</p><div className="spin-pills"><span>Free Spin</span><span>एक number · एक reward</span><span>दुकान पर Claim</span></div></div>
    <div className="spin-play-area">
      <div className="spin-visual">{shownCoupon && !spinRewards.some(item => item.id === shownCoupon.rewardId) ? <div className="spin-archived"><span>✦</span><h3>आपका पहले का reward</h3><p>अपना सुरक्षित code दुकान पर दिखाइए।</p></div> : <><WheelGraphic rotation={shownCoupon ? Math.floor(rotation / 360) * 360 + ((360 - spinRewards.findIndex(item => item.id === shownCoupon.rewardId) * segmentAngle) % 360) : rotation} moving={busy} onEnd={finishSpin}/><p className="spin-wheel-caption">ऊपर का pointer आपका reward दिखाएगा।</p></>}</div>
      <div className="spin-control">
        {shownCoupon && reward ? <div className="spin-result" aria-live="polite">
          <span className="spin-result-spark" aria-hidden="true">✦</span><p className="spin-eyebrow">{isDemo ? "DEMO RESULT" : "आपका DIWALI REWARD"}</p><h3 ref={resultHeading} tabIndex={-1}>{reward.label}</h3><p>{isDemo ? "यह सिर्फ़ preview है। इसे दुकान पर redeem नहीं किया जा सकता।" : reward.kind === "discount" ? "अपना code दुकान पर दिखाइए और ख़रीदारी पर discount पाइए।" : "अपनी ख़रीदारी के साथ gift लेने के लिए यह code दुकान पर दिखाइए।"}</p>
          <div className="spin-coupon"><span>{isDemo ? "DEMO" : `Mobile number · ••••••${shownCoupon.phoneLast4}`}</span><code>{shownCoupon.code}</code><small>{isDemo ? "कोई claim code जारी नहीं हुआ" : "यह code रखें या screenshot ले लें।"}</small></div>
          {!isDemo && <div className="spin-result-actions"><button type="button" className="spin-secondary" onClick={async () => { try { await navigator.clipboard.writeText(shownCoupon.code); setCopyStatus("Code copy हो गया।"); } catch { setCopyStatus("Code select करके copy कीजिए या screenshot ले लीजिए।"); } }}>Code copy कीजिए</button><a className="spin-whatsapp" href={`${shop.phone.whatsapp}?text=${encodeURIComponent(`नमस्ते Mobile World! मेरा Diwali Spin reward ${reward.label} है।\nCode: ${shownCoupon.code}\nMobile number के आख़िरी अंक: ${shownCoupon.phoneLast4}\nमैं इसे दुकान पर claim करना चाहता/चाहती हूँ।`)}`} target="_blank" rel="noopener noreferrer"><IconWhatsApp/> WhatsApp पर दिखाइए</a></div>}
          {copyStatus && <p className="spin-small" role="status">{copyStatus}</p>}
          <button type="button" className="spin-clear" onClick={clearSaved}>{isDemo ? "अगला demo spin" : "इस browser से result हटाएँ"}</button>
        </div> : <form className="spin-form" onSubmit={startSpin}>
          <p className="spin-eyebrow">आपकी बारी</p><h3>{busy ? "आपका wheel घूम रहा है…" : "देखें, आपके लिए क्या है?"}</h3>
          {!isDemo && <><label htmlFor="spin-phone">आपका mobile number</label><div className="spin-phone-field"><span>+91</span><input id="spin-phone" type="tel" inputMode="tel" autoComplete="tel-national" maxLength={16} placeholder="10-digit mobile number" value={phone} onChange={event => setPhone(event.target.value)} required disabled={busy} aria-describedby="spin-phone-help"/></div><p id="spin-phone-help" className="spin-small">अपना reward code इसी number से दुकान पर दिखाइए।</p><p className="spin-privacy-note">Spin करने पर आपका number और reward हमारे private store record में सुरक्षित होंगे। <Link href="/privacy#spin-wheel-privacy">Privacy</Link></p></>}
          <button type="submit" className="spin-primary" disabled={busy || (!isDemo && (phone.replace(/\D/g, "").length < 10))}>{busy ? "थोड़ा इंतज़ार कीजिए…" : isDemo ? "Demo wheel घुमाइए" : "अपना Wheel घुमाइए"}<IconArrow/></button>
          <p className="spin-free-note">Spin के लिए कोई payment या ख़रीदारी ज़रूरी नहीं।</p><p className="spin-progress" role="status" aria-live="polite">{phase === "loading" ? "आपका reward तय हो रहा है…" : phase === "spinning" ? "Wheel रुकने पर result दिखाई देगा।" : ""}</p>{error && <p className="spin-error" role="alert">{error}</p>}
        </form>}
      </div>
    </div>
    <p className="spin-eligibility">नए codes: ₹5,000 से अधिक के Mobile, Laptop, Electronics या Home Appliance पर · एक product, एक code।</p>
  </section>;
}

export function SpinWheel() {
  return <Suspense fallback={<section className="spin-section spin-loading" id="spin-wheel"><p className="spin-eyebrow">MOBILE WORLD · DIWALI SPIN &amp; WIN</p><h2>आपका Spin Wheel तैयार हो रहा है…</h2><p>₹100 discount · Neckband gift</p></section>}><SpinWheelContent/></Suspense>;
}
