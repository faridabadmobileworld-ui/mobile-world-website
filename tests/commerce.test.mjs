import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import Module, { createRequire } from 'node:module';
import ts from 'typescript';

const root = path.resolve(import.meta.dirname, '..');
const modules = new Map();
function load(file) {
  file = path.resolve(root, file);
  if (file.endsWith('.json')) return JSON.parse(fs.readFileSync(file, 'utf8'));
  if (!file.endsWith('.ts')) file += '.ts';
  if (modules.has(file)) return modules.get(file).exports;
  const m = new Module(file), native = createRequire(file); m.filename = file; modules.set(file, m);
  m.require = id => id === 'server-only' ? {} : id.startsWith('@/') ? load(id.slice(2)) : id.startsWith('.') ? load(path.resolve(path.dirname(file), id)) : native(id);
  m._compile(ts.transpileModule(fs.readFileSync(file, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true } }).outputText, file);
  return m.exports;
}
const core = load('lib/commerce/core');
const { shoppingProducts: products } = load('data/commerce');
const p = products[0];
const line = { productId: p.id, variant: p.variants[0].name, colour: p.colours[0].name, quantity: 1 };
const address = { id: 'sample-address', label: 'Home', name: 'Demo Customer', phone: '9999999999', street: 'Sample Lane', city: 'Faridabad', state: 'Haryana', pin: '121001', isDefault: true };
const profile = id => ({ id, name: `Demo ${id}`, email: `${id}@example.test`, phone: '', data: core.emptyCustomer() });
const fixture = () => ({ ...core.emptyState(), activeProfile: 'one', profiles: [{ ...profile('one'), data: { ...core.emptyCustomer(), cart: [line], addresses: [address] } }, profile('two')] });
const details = { id: 'MW-DEMO-TEST-0001', createdAt: '2026-11-04T12:00:00.000Z', fulfilment: 'pickup', addressId: '', coupon: '', note: '' };

test('shopping catalogue uses 20 audited exact models with actual options and separate sample prices', () => {
  assert.equal(products.length, 20);
  assert.equal(new Set(products.map(p => p.id)).size, 20);
  for (const p of products) {
    assert.doesNotMatch(p.name, /\b(?:series|family|range)\b|\//i);
    assert.ok(fs.existsSync(path.join(root, 'public', p.image)));
    assert.ok(p.colours.length && p.variants.length);
    assert.ok(p.variants.every(v => Number.isSafeInteger(v.price) && v.price > 0));
    assert.ok(p.source.startsWith('https://'));
  }
});
test('cart ignores tampered price and unknown options, preserves colour and memory identity, clamps quantity', () => {
  const output = core.cleanCart([{ ...line, price: 1, quantity: 2.8 }, { ...line, quantity: 99 }, { ...line, colour: p.colours[1].name, quantity: 1 }, { ...line, variant: 'imaginary 99TB' }, { ...line, quantity: -5 }, { ...line, quantity: Infinity }, null], products);
  assert.equal(output.length, 2);
  assert.equal(output[0].quantity, 5);
  assert.equal(output[1].quantity, 1);
  assert.equal('price' in output[0], false);
  assert.notEqual(core.lineKey(output[0]), core.lineKey(output[1]));
});
test('integer totals apply coupon once, cap discount and charge delivery only for nonempty carts', () => {
  const total = core.cartTotals([{ ...line, quantity: 2 }], products, 'delivery', ' demo10 ');
  assert.equal(total.subtotal, p.variants[0].price * 2);
  assert.equal(total.discount, 100000);
  assert.equal(total.delivery, 9900);
  assert.equal(total.total, p.variants[0].price * 2 - 100000 + 9900);
  assert.equal(total.count, 2);
  assert.equal(core.cartTotals([line], products, 'pickup', 'BAD').discount, 0);
  assert.equal(core.cartTotals([], products, 'delivery', 'DEMO10').total, 0);
  const cheap = [{ ...p, variants: [{ name: line.variant, price: 99900 }] }];
  assert.equal(core.cartTotals([line], cheap, 'pickup', 'DEMO10').discount, 9990);
});
test('entering a profile merges guest cart and favourites without leaking another profile data', () => {
  const state = fixture(); state.activeProfile = null; state.guest = { ...core.emptyCustomer(), cart: [{ ...line, quantity: 2 }], favourites: [p.id] };
  const next = core.enterProfile(state, 'one', products);
  assert.equal(core.currentCustomer(next).cart[0].quantity, 3);
  assert.deepEqual(core.currentCustomer(next).favourites, [p.id]);
  assert.deepEqual(next.guest, core.emptyCustomer());
  const two = core.enterProfile(next, 'two', products);
  assert.deepEqual(core.currentCustomer(two), core.emptyCustomer());
  const edited = core.editCustomer(two, d => ({ ...d, favourites: [products[1].id] }));
  assert.deepEqual(edited.profiles[0].data.favourites, [p.id]);
  assert.deepEqual(edited.profiles[1].data.favourites, [products[1].id]);
  assert.equal(state.profiles[0].data.cart[0].quantity, 1);
});
test('checkout requires a profile, nonempty cart and valid delivery address', () => {
  const anonymous = { ...core.emptyState(), guest: { ...core.emptyCustomer(), cart: [line] } };
  assert.equal(core.placeDemoOrder(anonymous, products, details), anonymous);
  const state = fixture();
  assert.equal(core.placeDemoOrder(state, products, { ...details, fulfilment: 'delivery', addressId: 'missing' }), state);
  assert.equal(core.cleanAddress({ ...address, pin: '123' }), null);
  assert.equal(core.cleanAddress({ ...address, phone: '12' }), null);
  const empty = core.editCustomer(state, d => ({ ...d, cart: [] }));
  assert.equal(core.placeDemoOrder(empty, products, details), empty);
});
test('placing an order records exact variants and totals, clears only current cart and is idempotent', () => {
  const state = fixture();
  const next = core.placeDemoOrder(state, products, { ...details, fulfilment: 'delivery', addressId: address.id, coupon: 'DEMO10' });
  const d = core.currentCustomer(next), order = d.orders[0];
  assert.equal(d.cart.length, 0); assert.equal(d.orders.length, 1);
  assert.deepEqual(order.lines[0], { ...line, name: p.name, image: p.image, unitPrice: p.variants[0].price });
  assert.equal(order.payment, 'demo'); assert.equal(order.address.id, address.id);
  assert.deepEqual(order.totals, core.cartTotals([line], products, 'delivery', 'DEMO10'));
  assert.equal(next.profiles[1].data.orders.length, 0);
  assert.equal(state.profiles[0].data.cart.length, 1);
  assert.equal(core.placeDemoOrder(next, products, details), next);
  assert.deepEqual(core.restoreState(JSON.parse(JSON.stringify(next)), products), next);
});
test('a saved order survives cart edits and cancellation without mutating another account', () => {
  let state = core.placeDemoOrder(fixture(), products, details);
  state = core.editCustomer(state, d => ({ ...d, cart: [{ ...line, quantity: 3 }], orders: d.orders.map(o => ({ ...o, status: 'cancelled' })) }));
  assert.equal(core.currentCustomer(state).orders[0].lines[0].quantity, 1);
  assert.equal(core.restoreState(state, products).profiles[0].data.orders[0].status, 'cancelled');
  assert.equal(core.currentCustomer(core.enterProfile(state, 'two', products)).orders.length, 0);
});
test('restoring corrupted or obsolete browser data is bounded and strips invalid models and fabricated totals', () => {
  assert.deepEqual(core.restoreState(null, products), core.emptyState());
  assert.deepEqual(core.restoreState({ version: 9 }, products), core.emptyState());
  const state = core.placeDemoOrder(fixture(), products, details);
  state.activeProfile = 'unknown'; state.recent = ['bad', p.id, p.id];
  state.profiles[0].data.orders[0].totals.total = 1;
  state.profiles[0].data.cart = [{ ...line, quantity: 'wrong' }, { ...line, productId: 'family-series' }];
  state.profiles[0].data.addresses = [address, { ...address, id: 'second', isDefault: true }];
  const restored = core.restoreState(state, products);
  assert.equal(restored.activeProfile, null); assert.deepEqual(restored.recent, [p.id]);
  assert.equal(restored.profiles[0].data.cart.length, 0);
  assert.equal(restored.profiles[0].data.orders[0].totals.total, p.variants[0].price);
  assert.equal(restored.profiles[0].data.addresses.filter(a => a.isDefault).length, 1);
});
