import { test } from 'node:test';
import assert from 'node:assert/strict';
import ts from 'typescript';
import fs from 'node:fs';
import path from 'node:path';
import Module, { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
const dir = path.dirname(fileURLToPath(import.meta.url));
const files = new Map();
const cache = new Map();
let writes = 0;
const cookieJar = new Map();
const mockBlob = {
  async get(key, options) { assert.equal(options.access, 'private'); assert.equal(options.useCache, false); const item = files.get(key); if (!item) return null; return { statusCode: 200, stream: new Response(item.content).body, blob: { etag: item.etag } }; },
  async put(key, content, options) {
    assert.equal(options.access, 'private'); assert.equal(options.addRandomSuffix, false);
    // Yield to force collisions between concurrent transactions.
    await new Promise(resolve => setTimeout(resolve, 2));
    const old = files.get(key);
    if (old && (!options.allowOverwrite || old.etag !== options.ifMatch)) { const error = new Error('Conflict'); error.name = options.allowOverwrite ? 'BlobPreconditionFailedError' : 'BlobAlreadyExistsError'; throw error; }
    files.set(key, { content, etag: String(++writes) }); return {};
  },
};
function load(name) {
  if (cache.has(name)) return cache.get(name).exports;
  const filename = path.join(dir, name + '.ts'); const mod = new Module(filename); mod.filename = filename;
  const native = createRequire(filename);
  mod.require = id => id === 'server-only' ? {} : id === '@vercel/blob' ? mockBlob : id === 'next/headers' ? { cookies: async () => ({ get: name => cookieJar.get(name), set: (name, value, options) => { assert.equal(options.httpOnly, true); assert.equal(options.sameSite, 'strict'); cookieJar.set(name, { value }); }, delete: name => cookieJar.delete(name) }), headers: async () => new Headers({ 'x-forwarded-for': 'test-only' }) } : id.startsWith('./spin-') ? load(id.slice(2)) : native(id);
  cache.set(name, mod); mod._compile(ts.transpileModule(fs.readFileSync(filename, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText, filename); return mod.exports;
}
process.env.SPIN_WHEEL_SECRET = 'isolated-test-private-secret-never-in-production';
process.env.BLOB_READ_WRITE_TOKEN = 'test-provider-mock';
const crypto = await import('node:crypto');
const setupKey = 'test-only-setup-key';
process.env.SPIN_ADMIN_SETUP_HASH = crypto.createHash('sha256').update(setupKey).digest('hex');
const core = load('spin-core'), ledger = load('spin-ledger-core'), store = load('spin-store'), admin = load('spin-admin-actions');
const secret = process.env.SPIN_WHEEL_SECRET;
const phone = '9999900000';
const coupon = core.createSpinCoupon(phone, secret);
const sale = { bill: 'TEST-BILL-1', line: 1, product: 'Test phone', category: 'mobile', amount: 5001 };

test('Concurrent entries persist once; phone is encrypted at rest', async () => {
  const results = await Promise.all(Array.from({ length: 5 }, () => store.saveSpin(phone, coupon)));
  for (const result of results) assert.deepEqual(result, coupon);
  assert.equal(Object.keys((await store.getLedger()).entries).length, 1);
  const stored = files.get(store.LEDGER_PATH).content;
  assert.equal(stored.includes(phone), false);
  assert.equal(ledger.decryptPhone(Object.values((await store.getLedger()).entries)[0].phone, secret), phone);
});
test('Below-threshold purchase is rejected without changing the record', () => {
  const state = ledger.emptyLedger(); assert.throws(() => ledger.redeemEntry(state, phone, coupon, { ...sale, amount: 5000 }, secret)); assert.equal(Object.keys(state.entries).length, 0);
});
test('Two concurrent redemption attempts produce exactly one success', async () => {
  const attempt = () => store.transactPrivate(store.LEDGER_PATH, ledger.emptyLedger, state => ({ value: ledger.redeemEntry(state, phone, coupon, sale, secret), changed: true }));
  const results = await Promise.allSettled([attempt(), attempt()]);
  assert.equal(results.filter(r => r.status === 'fulfilled').length, 1);
  const another = '9999900001';
  await assert.rejects(store.transactPrivate(store.LEDGER_PATH, ledger.emptyLedger, state => ({ value: ledger.redeemEntry(state, another, core.createSpinCoupon(another, secret), sale, secret), changed: true })), /bill line/);
});
test('Anonymous dashboard, inspection and redemption reveal no customer data', async () => {
  assert.deepEqual(await admin.adminSnapshot(), { state: 'setup' });
  assert.equal((await admin.inspectAdminCoupon(coupon.code, phone)).ok, false);
  assert.equal((await admin.redeemAdminCoupon(coupon.code, phone, sale)).ok, false);
});
test('Owner setup is single-use; password login controls private records', async () => {
  assert.equal((await admin.setupAdmin('wrong', 'long-password-for-tests')).ok, false);
  assert.equal((await admin.setupAdmin(setupKey, 'short')).ok, false);
  assert.equal((await admin.setupAdmin(setupKey, 'long-password-for-tests')).ok, true);
  assert.equal((await admin.adminSnapshot()).state, 'ready');
  assert.equal((await admin.setupAdmin(setupKey, 'another-long-password')).ok, false);
  assert.equal(files.get('spin/admin-owner.json').content.includes('long-password-for-tests'), false);
  await admin.adminLogout(); assert.equal((await admin.adminSnapshot()).state, 'login');
  assert.equal((await admin.adminLogin('wrong')).ok, false);
  assert.equal((await admin.adminLogin('long-password-for-tests')).ok, true);
  const snapshot = await admin.adminSnapshot(); assert.equal(snapshot.state, 'ready'); assert.equal(snapshot.entries[0].phone, phone); assert.ok(snapshot.entries[0].redeemedAt);
  await admin.adminLogout();
});
