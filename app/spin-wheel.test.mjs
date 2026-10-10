// Run: node --test app/spin-wheel.test.mjs
// Tests pure server logic with an isolated test secret; no real coupons issued.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import ts from 'typescript';
import fs from 'node:fs';
import path from 'node:path';
import Module, { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { createHmac } from 'node:crypto';
const dirname = path.dirname(fileURLToPath(import.meta.url));
const cache = new Map();
function load(name) {
  if (cache.has(name)) return cache.get(name).exports;
  const filename = path.join(dirname, name + '.ts');
  const mod = new Module(filename);
  mod.filename = filename;
  const native = createRequire(filename);
  mod.require = request => request === './spin-rewards' ? load('spin-rewards') : native(request);
  cache.set(name, mod);
  const output = ts.transpileModule(fs.readFileSync(filename, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
  mod._compile(output, filename);
  return mod.exports;
}
const { spinRewards, wheelStopAngle } = load('spin-rewards');
const { rewardForRoll, normalizeSpinPhone, createSpinCoupon, verifySpinCoupon } = load('spin-core');
const secret = 'isolated-test-secret-never-used-on-the-live-website';
const phone = '9999900000';
test('All six advertised rewards are attainable and follow the campaign probabilities', () => {
  const counts = Object.fromEntries(spinRewards.map(reward => [reward.id, 0]));
  for (let roll = 0; roll < 10000; roll++) counts[rewardForRoll(roll).id]++;
  assert.deepEqual(counts, { 'discount-100': 9800, 'discount-200': 40, 'discount-500': 20, 'discount-1000': 10, neckband: 100, buds: 30 });
  assert.equal(spinRewards.length, 6);
  for (const bad of [-1, 10000, NaN, 1.5]) assert.throws(() => rewardForRoll(bad));
});
test('Existing discount and neckband outcomes stay stable, and all older signed coupons verify', () => {
  for (let roll = 0; roll < 9900; roll++) {
    assert.equal(rewardForRoll(roll).id, roll < 9800 ? 'discount-100' : 'neckband');
  }
  // Captured from the previous deployed versions with the isolated test key.
  const fixtures = [
    ['9999900219', 'discount-200', 'MW26-511939-6B0BCF-DC77BE-8AF001'],
    ['9999900341', 'mini-speaker', 'MW26-971E88-E2671A-4D4A9B-D753AA'],
    ['9999900434', 'discount-500', 'MW26-3D23F0-4A429D-6270D8-6F7895'],
    ['9999901044', 'discount-500', 'MW26-47BD39-9F3B06-ED8DBB-4F1310'],
    ['9999901695', 'discount-200', 'MW26-E08A5D-35AFF8-60B0FB-BB8120'],
    ['9999903002', 'buds', 'MW26-A3E827-3F78E5-7BA88A-2D8CCA'],
    ['9999903455', 'mini-speaker', 'MW26-9318A4-EF7E16-94DE60-B2FD03'],
    ['9999905698', 'buds', 'MW26-627F0D-49D740-766343-F4FEE5'],
    ['9999901044', 'discount-1000', 'MW26-FBF7C4-94F0E8-4C0D05-88B6B0'],
  ];
  for (const [oldPhone, rewardId, code] of fixtures) {
    assert.equal(verifySpinCoupon(code, oldPhone, secret)?.rewardId, rewardId);
    const oldSignature = createHmac('sha256', secret).update(`mw-diwali-2026-v2:coupon:${oldPhone}:discount-100`).digest('hex').slice(0, 24).toUpperCase();
    const oldDiscountCode = `MW26-${oldSignature.match(/.{6}/g).join('-')}`;
    assert.equal(verifySpinCoupon(oldDiscountCode, oldPhone, secret)?.rewardId, 'discount-100');
    assert.equal(verifySpinCoupon(code, phone, secret), null);
  }
});
test('Phone normalization handles +91 but rejects malformed or non-Indian input', () => {
  assert.equal(normalizeSpinPhone('+91 99999 00000'), phone);
  assert.equal(normalizeSpinPhone('09999900000'), phone);
  for (const bad of ['1234567890', '999999999', '9999900000<script>', null, {}, 'a'.repeat(100)]) assert.equal(normalizeSpinPhone(bad), null);
});
test('Same campaign and phone always returns identical reward and code across retries', () => {
  const first = createSpinCoupon(phone, secret);
  for (let n = 0; n < 30; n++) assert.deepEqual(createSpinCoupon(phone, secret), first);
  assert.equal(first.phoneLast4, '0000');
  assert.equal(first.code.includes(phone), false);
  assert.notEqual(createSpinCoupon('9999900001', secret).code, first.code);
});
test('Verification rejects changed codes, wrong phones and different secrets', () => {
  const coupon = createSpinCoupon(phone, secret);
  assert.deepEqual(verifySpinCoupon(coupon.code, phone, secret), coupon);
  assert.deepEqual(verifySpinCoupon(coupon.code.toLowerCase(), phone, secret), coupon);
  assert.equal(verifySpinCoupon(coupon.code, '9999900001', secret), null);
  assert.equal(verifySpinCoupon(coupon.code, phone, secret + '-different'), null);
  const forged = coupon.code.slice(0, -1) + (coupon.code.endsWith('A') ? 'B' : 'A');
  assert.equal(verifySpinCoupon(forged, phone, secret), null);
  assert.equal(verifySpinCoupon('DEMO', phone, secret), null);
  assert.throws(() => createSpinCoupon(phone, ''));
});
test('Every animated wheel stop aligns the displayed segment with the top pointer', () => {
  const step = 360 / spinRewards.length;
  for (let i = 0; i < spinRewards.length; i++) {
    for (const previous of [0, 2213, 5100]) {
      const rotation = wheelStopAngle(i, previous);
      assert.ok(rotation - previous >= 5 * 360);
      const alignment = ((i * step + rotation) % 360 + 360) % 360;
      assert.ok(alignment < 0.00001 || 360 - alignment < 0.00001);
    }
  }
});
