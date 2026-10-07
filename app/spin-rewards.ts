export const SPIN_CAMPAIGN = "mw-diwali-2026-v1";
export const SPIN_STORAGE_KEY = "mw-diwali-2026-reward";

// Basis points: 10,000 total. The two main rewards together are exactly 99%.
// Keep order stable: the server result and the wheel use this same source.
export const spinRewards = [
  { id: "discount-100", label: "₹100 discount", wheel: "₹100", sub: "DISCOUNT", weight: 9800, odds: "98%", colour: "#7d142c", ink: "#fff5dc", kind: "discount" },
  { id: "neckband", label: "Neckband", wheel: "Neckband", sub: "GIFT", weight: 100, odds: "1%", colour: "#f4d28d", ink: "#531326", kind: "gift" },
  { id: "discount-200", label: "₹200 discount", wheel: "₹200", sub: "DISCOUNT", weight: 25, odds: "0.25%", colour: "#962542", ink: "#fff5dc", kind: "discount" },
  { id: "buds", label: "Buds", wheel: "Buds", sub: "GIFT", weight: 25, odds: "0.25%", colour: "#fae8c1", ink: "#531326", kind: "gift" },
  { id: "discount-500", label: "₹500 discount", wheel: "₹500", sub: "DISCOUNT", weight: 25, odds: "0.25%", colour: "#671429", ink: "#fff5dc", kind: "discount" },
  { id: "mini-speaker", label: "Mini Speaker", wheel: "Mini Speaker", sub: "GIFT", weight: 25, odds: "0.25%", colour: "#e6b66a", ink: "#531326", kind: "gift" },
] as const;

// Only existing coupon holders may see this retired reward. It is never drawn
// or advertised as a current wheel segment.
const retiredReward = { id: "discount-1000", label: "₹1,000 discount", kind: "discount" } as const;
export function getSpinReward(id: string | undefined) {
  return spinRewards.find(reward => reward.id === id) ?? (id === retiredReward.id ? retiredReward : undefined);
}
export type SpinRewardId = typeof spinRewards[number]["id"] | typeof retiredReward.id;
export type SpinCoupon = { campaign: string; rewardId: SpinRewardId; code: string; phoneLast4: string };
export type SpinResponse = { ok: true; coupon: SpinCoupon } | { ok: false; message: string };

export function rewardForRoll(roll: number) {
  if (!Number.isInteger(roll) || roll < 0 || roll >= 10000) throw new Error("Invalid reward roll");
  // Keep every previously active non-retired draw stable. Redistribute only
  // the old 20-basis-point retired range equally across the four other prizes.
  if (roll < 9800) return spinRewards[0];
  if (roll < 9900) return spinRewards[1];
  if (roll < 9980) return spinRewards[2 + Math.floor((roll - 9900) / 20)];
  return spinRewards[2 + Math.floor((roll - 9980) / 5)];
}

export function wheelStopAngle(index: number, previous = 0) {
  if (!Number.isInteger(index) || index < 0 || index >= spinRewards.length) throw new Error("Invalid wheel segment");
  const target = (360 - index * (360 / spinRewards.length)) % 360;
  return Math.ceil(previous / 360) * 360 + 6 * 360 + target;
}
