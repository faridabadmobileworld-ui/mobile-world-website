// Server cryptography only. The secret is supplied by spin-actions, never by a client.
import { createHmac, timingSafeEqual } from "node:crypto";
import { SPIN_CAMPAIGN, LEGACY_SPIN_CAMPAIGN, spinRewards, type SpinCoupon, type SpinRewardId } from "./spin-rewards";

export function rewardForRoll(roll: number) {
  if (!Number.isInteger(roll) || roll < 0 || roll >= 10000) throw new Error("Invalid reward roll");
  // 99% combined for ₹100 / Neckband; the other four rewards share 1%.
  // Keep the existing ₹100 and Neckband ranges stable.
  if (roll < 9800) return spinRewards[0];
  if (roll < 9900) return spinRewards[4];
  if (roll < 9940) return spinRewards[1];
  if (roll < 9970) return spinRewards[5];
  if (roll < 9990) return spinRewards[2];
  return spinRewards[3];
}

function previousRewardsForRoll(roll: number): SpinRewardId[] {
  if (roll < 9900) return [];
  const previous = ["discount-200", "buds", "discount-500", "mini-speaker"] as const;
  if (roll < 9980) return [previous[Math.floor((roll - 9900) / 20)]];
  return [previous[Math.floor((roll - 9980) / 5)], "discount-1000"];
}

export function normalizeSpinPhone(input: unknown): string | null {
  if (typeof input !== "string" || input.length > 30 || !/^[+\d\s()-]+$/.test(input)) return null;
  let phone = input.replace(/\D/g, "");
  if (phone.length === 12 && phone.startsWith("91")) phone = phone.slice(2);
  if (phone.length === 11 && phone.startsWith("0")) phone = phone.slice(1);
  return /^[6-9]\d{9}$/.test(phone) ? phone : null;
}

function digest(secret: string, purpose: string, value: string, campaign: string = LEGACY_SPIN_CAMPAIGN) {
  if (secret.length < 32) throw new Error("Wheel signing secret is unavailable");
  return createHmac("sha256", secret).update(`${campaign}:${purpose}:${value}`).digest();
}

function drawForPhone(phone: string, secret: string) {
  if (normalizeSpinPhone(phone) !== phone) throw new Error("Invalid normalized phone");
  // A keyed, pseudorandom draw is stable for this campaign + phone. A new
  // browser, cleared storage, concurrent calls or a refresh cannot reroll it.
  const limit = Math.floor(0x100000000 / 10000) * 10000;
  let value = 0;
  for (let round = 0; ; round++) {
    value = digest(secret, `draw:${round}`, phone).readUInt32BE(0);
    if (value < limit) break; // Rejection sampling removes modulo bias.
  }
  return value % 10000;
}

function signCoupon(phone: string, rewardId: SpinRewardId, secret: string, campaign: string = SPIN_CAMPAIGN): SpinCoupon {
  const signature = digest(secret, "coupon", `${phone}:${rewardId}`, campaign).toString("hex").slice(0, 24).toUpperCase();
  return { campaign, rewardId, code: `MW26-${signature.match(/.{6}/g)!.join("-")}`, phoneLast4: phone.slice(-4) };
}

export function createSpinCoupon(phone: string, secret: string): SpinCoupon {
  return signCoupon(phone, rewardForRoll(drawForPhone(phone, secret)).id, secret);
}

export function verifySpinCoupon(code: unknown, phone: string, secret: string): SpinCoupon | null {
  if (typeof code !== "string" || code.length > 70) return null;
  const normalized = code.trim().toUpperCase();
  if (!/^MW26-(?:[A-F0-9]{6}-){3}[A-F0-9]{6}$/.test(normalized)) return null;
  const expected = createSpinCoupon(phone, secret);
  if (timingSafeEqual(Buffer.from(normalized), Buffer.from(expected.code))) return expected;
  // The previous two-reward version issued ₹100 for the last 1% of draws.
  // Those genuinely signed codes remain valid after restoring all six rewards.
  const roll = drawForPhone(phone, secret);
  if (roll >= 9900) {
    const previous = signCoupon(phone, "discount-100", secret);
    if (timingSafeEqual(Buffer.from(normalized), Buffer.from(previous.code))) return previous;
  }
  // Preserve authenticity checks for codes genuinely signed before the reward
  // was retired. This path cannot issue a new coupon or redeem an existing one.
  for (const rewardId of [expected.rewardId, ...previousRewardsForRoll(roll)]) {
    const legacy = signCoupon(phone, rewardId, secret, LEGACY_SPIN_CAMPAIGN);
    if (timingSafeEqual(Buffer.from(normalized), Buffer.from(legacy.code))) return legacy;
  }
  return null;
}
