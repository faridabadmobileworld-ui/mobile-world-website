"use server";

import { createHmac } from "node:crypto";
import { headers } from "next/headers";
import { createSpinCoupon, normalizeSpinPhone, verifySpinCoupon } from "./spin-core";
import { saveSpin } from "./spin-store";
import type { SpinResponse } from "./spin-rewards";

// Best-effort abuse throttling per running server instance. Not a global
// redemption database. The shop must record redeemed codes at the counter.
const attempts = new Map<string, { count: number; expires: number }>();
async function withinLimit(secret: string, action: string) {
  const requestHeaders = await headers();
  const ip = requestHeaders.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const key = createHmac("sha256", secret).update(`${action}:${ip}`).digest("hex");
  const now = Date.now();
  for (const [id, item] of attempts) if (item.expires <= now) attempts.delete(id);
  const previous = attempts.get(key);
  if (previous && previous.count >= 20) return false;
  if (!previous && attempts.size >= 5000) return false;
  attempts.set(key, { count: (previous?.count || 0) + 1, expires: previous?.expires || now + 60000 });
  return true;
}

export async function playSpin(rawPhone: unknown, accepted: unknown): Promise<SpinResponse> {
  const secret = process.env.SPIN_WHEEL_SECRET;
  if (!secret || secret.length < 32) return { ok: false, message: "Spin अभी उपलब्ध नहीं है। थोड़ी देर बाद फिर कोशिश कीजिए।" };
  if (accepted !== true) return { ok: false, message: "Spin के लिए अपना number और Privacy की सहमति दीजिए।" };
  const phone = normalizeSpinPhone(rawPhone);
  if (!phone) return { ok: false, message: "अपना सही 10-digit Indian mobile number लिखिए।" };
  if (!(await withinLimit(secret, "spin"))) return { ok: false, message: "कई requests आ चुकी हैं। एक मिनट बाद फिर कोशिश कीजिए।" };
  try {
    const coupon = await saveSpin(phone, createSpinCoupon(phone, secret));
    return { ok: true, coupon };
  } catch {
    return { ok: false, message: "Code सुरक्षित नहीं हो पाया। उसी number से फिर कोशिश कीजिए।" };
  }
}

export async function verifySpin(rawCode: unknown, rawPhone: unknown): Promise<SpinResponse> {
  const secret = process.env.SPIN_WHEEL_SECRET;
  if (!secret || secret.length < 32) return { ok: false, message: "Verification अभी उपलब्ध नहीं है। बाद में फिर कोशिश कीजिए।" };
  const phone = normalizeSpinPhone(rawPhone);
  if (!phone) return { ok: false, message: "Code के साथ वही 10-digit mobile number लिखिए जिससे spin किया था।" };
  if (!(await withinLimit(secret, "verify"))) return { ok: false, message: "एक मिनट बाद फिर जाँच कीजिए।" };
  const coupon = verifySpinCoupon(rawCode, phone, secret);
  return coupon ? { ok: true, coupon } : { ok: false, message: "Code और mobile number मेल नहीं खाते। दोनों दोबारा जाँचिए।" };
}
