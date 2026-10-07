// Server cryptography only. The secret is supplied by spin-actions, never by a client.
import { createHmac, timingSafeEqual } from "node:crypto";
import { SPIN_CAMPAIGN, rewardForRoll, type SpinCoupon } from "./spin-rewards";

export function normalizeSpinPhone(input: unknown): string | null {
  if (typeof input !== "string" || input.length > 30 || !/^[+\d\s()-]+$/.test(input)) return null;
  let phone = input.replace(/\D/g, "");
  if (phone.length === 12 && phone.startsWith("91")) phone = phone.slice(2);
  if (phone.length === 11 && phone.startsWith("0")) phone = phone.slice(1);
  return /^[6-9]\d{9}$/.test(phone) ? phone : null;
}

function digest(secret: string, purpose: string, value: string) {
  if (secret.length < 32) throw new Error("Wheel signing secret is unavailable");
  return createHmac("sha256", secret).update(`${SPIN_CAMPAIGN}:${purpose}:${value}`).digest();
}

export function createSpinCoupon(phone: string, secret: string): SpinCoupon {
  if (normalizeSpinPhone(phone) !== phone) throw new Error("Invalid normalized phone");
  // A keyed, pseudorandom draw is stable for this campaign + phone. A new
  // browser, cleared storage, concurrent calls or a refresh cannot reroll it.
  const limit = Math.floor(0x100000000 / 10000) * 10000;
  let value = 0;
  for (let round = 0; ; round++) {
    value = digest(secret, `draw:${round}`, phone).readUInt32BE(0);
    if (value < limit) break; // Rejection sampling removes modulo bias.
  }
  const reward = rewardForRoll(value % 10000);
  const signature = digest(secret, "coupon", `${phone}:${reward.id}`).toString("hex").slice(0, 24).toUpperCase();
  return { campaign: SPIN_CAMPAIGN, rewardId: reward.id, code: `MW26-${signature.match(/.{6}/g)!.join("-")}`, phoneLast4: phone.slice(-4) };
}

export function verifySpinCoupon(code: unknown, phone: string, secret: string): SpinCoupon | null {
  if (typeof code !== "string" || code.length > 70) return null;
  const normalized = code.trim().toUpperCase();
  if (!/^MW26-(?:[A-F0-9]{6}-){3}[A-F0-9]{6}$/.test(normalized)) return null;
  const expected = createSpinCoupon(phone, secret);
  return timingSafeEqual(Buffer.from(normalized), Buffer.from(expected.code)) ? expected : null;
}
