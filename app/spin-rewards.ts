export const SPIN_CAMPAIGN = "mw-diwali-2026-v2";
export const LEGACY_SPIN_CAMPAIGN = "mw-diwali-2026-v1";
export const SPIN_STORAGE_KEY = "mw-diwali-2026-reward";

// Display data only. Reward selection stays in the server-only crypto module.
export const spinRewards = [
  { id: "discount-100", label: "₹100 discount", wheel: "₹100", sub: "DISCOUNT", colour: "#7d142c", ink: "#fff5dc", kind: "discount" },
  { id: "neckband", label: "Neckband", wheel: "Neckband", sub: "GIFT", colour: "#f4d28d", ink: "#531326", kind: "gift" },
] as const;

// Previously issued signed coupons retain their original label and validity.
// These rewards are never issued or advertised in the current promotion.
const retiredRewards = [
  { id: "discount-200", label: "₹200 discount", kind: "discount" },
  { id: "buds", label: "Buds", kind: "gift" },
  { id: "discount-500", label: "₹500 discount", kind: "discount" },
  { id: "mini-speaker", label: "Mini Speaker", kind: "gift" },
  { id: "discount-1000", label: "₹1,000 discount", kind: "discount" },
] as const;
export function getSpinReward(id: string | undefined) {
  return spinRewards.find(reward => reward.id === id) ?? retiredRewards.find(reward => reward.id === id);
}
export type SpinRewardId = typeof spinRewards[number]["id"] | typeof retiredRewards[number]["id"];
export type SpinCoupon = { campaign: string; rewardId: SpinRewardId; code: string; phoneLast4: string };
export type SpinResponse = { ok: true; coupon: SpinCoupon } | { ok: false; message: string };

export function wheelStopAngle(index: number, previous = 0) {
  if (!Number.isInteger(index) || index < 0 || index >= spinRewards.length) throw new Error("Invalid wheel segment");
  const target = (360 - index * (360 / spinRewards.length)) % 360;
  return Math.ceil(previous / 360) * 360 + 6 * 360 + target;
}
