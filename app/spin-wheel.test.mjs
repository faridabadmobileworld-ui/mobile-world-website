// Run: node --test app/spin-wheel.test.mjs
// Tests pure server logic with an isolated test secret; no real coupons issued.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import ts from 'typescript';
import fs from 'node:fs';
import path from 'node:path';
import Module, { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
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
const { spinRewards, rewardForRoll, wheelStopAngle } = load('spin-rewards');
const { normalizeSpinPhone, createSpinCoupon, verifySpinCoupon } = load('spin-core');
const secret = 'isolated-test-secret-never-used-on-the-live-website';
const phone = '9999900000';
test('Every possible draw gives the declared probabilities, totaling exactly 100%', () => {
  const counts = Object.fromEntries(spinRewards.map(reward => [reward.id, 0]));
  for (let roll = 0; roll < 10000; roll++) counts[rewardForRoll(roll).id]++;
  for (const reward of spinRewards) assert.equal(counts[reward.id], reward.weight);
  assert.equal(counts['discount-100'] + counts.neckband, 9900);
  assert.equal(spinRewards.length, 6);
  assert.equal(counts['discount-1000'], undefined);
  for (const bad of [-1, 10000, NaN, 1.5]) assert.throws(() => rewardForRoll(bad));
});
test('Retiring a reward preserves other existing outcomes and old signed coupons', () => {
  const originalIds = ['discount-100', 'neckband', 'discount-200', 'buds', 'discount-500', 'mini-speaker'];
  for (let roll = 0; roll < 9980; roll++) {
    const index = roll < 9800 ? 0 : roll < 9900 ? 1 : 2 + Math.floor((roll - 9900) / 20);
    assert.equal(rewardForRoll(roll).id, originalIds[index]);
  }
  // A fixture signed by the previous version, using the isolated test key.
  const oldPhone = '9999901044';
  const oldCode = 'MW26-FBF7C4-94F0E8-4C0D05-88B6B0';
  assert.equal(verifySpinCoupon(oldCode, oldPhone, secret)?.rewardId, 'discount-1000');
  assert.notEqual(createSpinCoupon(oldPhone, secret).rewardId, 'discount-1000');
  assert.equal(verifySpinCoupon(oldCode, phone, secret), null);
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
