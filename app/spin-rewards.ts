export const SPIN_CAMPAIGN = "mw-diwali-2026-v1";
export const SPIN_STORAGE_KEY = "mw-diwali-2026-reward";

// Basis points: 10,000 total. The two main rewards together are exactly 99%.
// Keep order stable: the server result and the wheel use this same source.
export const spinRewards = [
  { id: "discount-100", label: "₹100 discount", wheel: "₹100", sub: "DISCOUNT", weight: 9800, odds: "98%", colour: "#7d142c", ink: "#fff5dc", kind: "discount" },
  { id: "neckband", label: "Neckband", wheel: "Neckband", sub: "GIFT", weight: 100, odds: "1%", colour: "#f4d28d", ink: "#531326", kind: "gift" },
  { id: "discount-200", label: "₹200 discount", wheel: "₹200", sub: "DISCOUNT", weight: 20, odds: "0.2%", colour: "#962542", ink: "#fff5dc", kind: "discount" },
  { id: "buds", label: "Buds", wheel: "Buds", sub: "GIFT", weight: 20, odds: "0.2%", colour: "#fae8c1", ink: "#531326", kind: "gift" },
  { id: "discount-500", label: "₹500 discount", wheel: "₹500", sub: "DISCOUNT", weight: 20, odds: "0.2%", colour: "#671429", ink: "#fff5dc", kind: "discount" },
  { id: "mini-speaker", label: "Mini Speaker", wheel: "Mini Speaker", sub: "GIFT", weight: 20, odds: "0.2%", colour: "#e6b66a", ink: "#531326", kind: "gift" },
  { id: "discount-1000", label: "₹1,000 discount", wheel: "₹1,000", sub: "DISCOUNT", weight: 20, odds: "0.2%", colour: "#ad3651", ink: "#fff5dc", kind: "discount" },
] as const;

export type SpinRewardId = typeof spinRewards[number]["id"];
export type SpinCoupon = { campaign: string; rewardId: SpinRewardId; code: string; phoneLast4: string };
export type SpinResponse = { ok: true; coupon: SpinCoupon } | { ok: false; message: string };

export function rewardForRoll(roll: number) {
  if (!Number.isInteger(roll) || roll < 0 || roll >= 10000) throw new Error("Invalid reward roll");
  let cumulative = 0;
  for (const reward of spinRewards) {
    cumulative += reward.weight;
    if (roll < cumulative) return reward;
  }
  throw new Error("Reward weights must total 10000");
}

export function wheelStopAngle(index: number, previous = 0) {
  if (!Number.isInteger(index) || index < 0 || index >= spinRewards.length) throw new Error("Invalid wheel segment");
  const target = (360 - index * (360 / spinRewards.length)) % 360;
  return Math.ceil(previous / 360) * 360 + 6 * 360 + target;
}
