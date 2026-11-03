import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import Module, { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const modules = new Map(), privateFiles = new Map();
let documents = new Map(), revisionNumber = 0, authenticated = false, offline = false, failRefresh = false, writes = 0, draftOnly = false;
const clone = value => structuredClone(value);
const token = 'fixture-only-project-token-never-real';
const config = { projectId: 'test1234', dataset: 'testing', token };
process.env.BLOB_READ_WRITE_TOKEN = 'mock-provider';
const privateStore = {
  spinSecret: () => 'fixture-encryption-key-not-a-production-credential',
  readPrivate: async key => privateFiles.has(key) ? { value: clone(privateFiles.get(key)), etag: 'fixture' } : null,
  transactPrivate: async (key, initial, update) => {
    const state = clone(privateFiles.get(key) ?? initial()), result = update(state);
    if (result.changed) privateFiles.set(key, state);
    return result.value;
  },
};
function load(filename) {
  filename = path.resolve(root, filename);
  if (filename.endsWith('.json')) return JSON.parse(fs.readFileSync(filename, 'utf8'));
  if (!filename.endsWith('.ts')) filename += '.ts';
  if (modules.has(filename)) return modules.get(filename).exports;
  const mod = new Module(filename), native = createRequire(filename); mod.filename = filename; modules.set(filename, mod);
  mod.require = id => {
    if (id === 'server-only') return {};
    if (id === 'react') return { cache: fn => fn };
    if (id === '@/app/spin-store') return privateStore;
    if (id === '@/app/spin-admin-actions') return { requireOwnerAccess: async () => { if (!authenticated) throw new Error('owner login required'); } };
    if (id === 'next/cache') return { revalidatePath() {} };
    if (id.startsWith('@/')) return load(id.slice(2));
    if (id.startsWith('.')) return load(path.resolve(path.dirname(filename), id));
    return native(id);
  };
  mod._compile(ts.transpileModule(fs.readFileSync(filename, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true, resolveJsonModule: true } }).outputText, filename);
  return mod.exports;
}
global.fetch = async (url, init) => {
  const parsed = new URL(url);
  assert.equal(parsed.hostname, 'test1234.api.sanity.io');
  assert.equal(init.headers.Authorization, 'Bearer ' + token);
  assert.equal(init.cache, 'no-store');
  assert.equal(init.redirect, 'error');
  if (offline) return Response.json({}, { status: 503 });
  if (parsed.pathname.includes('/data/query/')) {
    const q = parsed.searchParams.get('query');
    const parameter = name => JSON.parse(parsed.searchParams.get('$' + name) ?? 'null');
    let result;
    if (q.startsWith('count(')) result = documents.size;
    else if (q.includes('[_id in [$draft')) result = [documents.get(parameter('draft')), documents.get(parameter('published'))].filter(Boolean);
    else if (q.includes('[_id == $id]')) result = documents.get(parameter('id')) ?? null;
    else if (parsed.searchParams.get('perspective') === 'published') {
      if (failRefresh) return Response.json({}, { status: 503 });
      result = [...documents.values()].filter(doc => doc._id.startsWith('mw-product.') && doc.verified && doc.imageVerified);
    } else result = [...documents.values()].filter(doc => doc._type === 'mwProduct');
    return Response.json({ result });
  }
  if (parsed.pathname.includes('/assets/images/')) return Response.json({ document: { url: 'https://cdn.sanity.io/images/test1234/testing/abc123-1200x1600.png' } });
  assert.ok(parsed.pathname.includes('/data/mutate/'));
  assert.equal(parsed.searchParams.get('visibility'), 'sync');
  const next = new Map([...documents].map(([id, doc]) => [id, clone(doc)]));
  for (const mutation of JSON.parse(init.body).mutations) {
    if (mutation.create) {
      if (draftOnly && !mutation.create._id.startsWith('drafts.')) return Response.json({}, { status: 403 });
      if (next.has(mutation.create._id)) return Response.json({}, { status: 409 });
      const doc = clone(mutation.create); doc._rev = 'rev' + (++revisionNumber); next.set(doc._id, doc);
    } else if (mutation.patch) {
      const patch = mutation.patch, doc = next.get(patch.id);
      if (!doc || doc._rev !== patch.ifRevisionID) return Response.json({}, { status: 409 });
      assert.equal('_type' in patch.set, false, 'immutable _type must not be patched');
      Object.assign(doc, clone(patch.set)); doc._rev = 'rev' + (++revisionNumber);
      for (const field of patch.unset ?? []) {
        if (field === 'values.spec_007') delete doc.values.spec_007;
        else delete doc[field];
      }
    } else if (mutation.delete) {
      const item = mutation.delete, doc = next.get(item.id);
      if (doc && doc._rev !== item.ifRevisionID) return Response.json({}, { status: 409 });
      next.delete(item.id);
    } else assert.fail('Unexpected mutation');
  }
  if (parsed.searchParams.get('dryRun') !== 'true') { documents = next; writes++; }
  return Response.json({ transactionId: 'fixture' });
};
const core = load('lib/catalog/core'), cms = load('lib/catalog/sanity'), actions = load('app/admin/products/actions');
function product(id = 'fixture-phone') {
  return { ...core.blankProduct(id), brand: 'Fixture brand', name: 'Fixture model', image: '/images/fixture.png', imageAlt: 'Fixture reference', imageVerified: true, verified: true, verifiedAt: '2026-10-01', sources: ['https://example.com/official-fixture'], values: { spec_007: 'PRIVATE-PRICE-456', spec_025: false, spec_026: 0 }, variants: [
    { _key: 'variant-one', ram: '8 GB', storage: '128 GB', colour: 'Black', image: '', imageVerified: false },
    { _key: 'variant-two', ram: '12 GB', storage: '256 GB', colour: 'Blue', image: '', imageVerified: false },
  ] };
}
test('86 stable fields in 11 sections; unknown stays empty; zero and No remain meaningful', () => {
  assert.equal(core.specificationSections.length, 11); assert.equal(core.specificationFields.length, 86);
  assert.deepEqual(core.specificationFields.map(f => f.key), Array.from({ length: 86 }, (_, i) => 'spec_' + String(i + 1).padStart(3, '0')));
  const p = core.normalizeProduct(product());
  assert.equal(p.values.spec_025, 'No'); assert.equal(p.values.spec_026, '0'); assert.equal(p.values.spec_086, '');
  const dto = core.publicProduct(p, '2026-10-01');
  assert.equal('sources' in dto, false); assert.equal('spec_007' in dto.values, false);
  assert.equal(JSON.stringify(dto).includes('PRIVATE-PRICE'), false);
  const rows = core.visibleSections(dto).flatMap(s => s.fields);
  assert.ok(rows.some(f => f.value === 'No')); assert.ok(rows.some(f => f.value === '0'));
  assert.ok(rows.every(f => f.value !== '' && f.id !== 7));
  assert.equal(core.visibleSections(dto, p.variants[1]).flatMap(s => s.fields).find(f => f.id === 26).value, '12 GB');
  assert.equal(dto.variants.length, 2, 'no imaginary Cartesian variants');
});
test('Invalid source/image URLs, fake placeholders, duplicate variants and unverified publication fail', () => {
  for (const src of ['javascript:alert(1)', 'https://attacker.example/file.png', '/images/../secret.png', 'https://cdn.sanity.io/images/test1234/testing/a.png?token=private'])
    assert.throws(() => core.imageUrl(src));
  assert.throws(() => core.sourceUrl('http://example.com'));
  assert.throws(() => core.normalizeProduct({ ...product(), values: { spec_030: 'N/A' } }));
  assert.throws(() => core.normalizeProduct({ ...product(), variants: [product().variants[0], product().variants[0]] }));
  assert.throws(() => core.validatePublication(core.normalizeProduct({ ...product(), verified: false })));
  assert.throws(() => core.validatePublication(core.normalizeProduct({ ...product(), verifiedAt: '2099-01-01' })));
  assert.throws(() => core.validatePublication(core.normalizeProduct({ ...product(), variants: [{ ...product().variants[0], image: '/images/fixture.png' }] })));
});
test('Every editor action authenticates before reading, uploading or writing', async () => {
  const attempts = [
    () => actions.productEditorState(), () => actions.configureSanity(config.projectId, config.dataset, token),
    () => actions.saveProductDraft(product(), ''), () => actions.publishSavedProduct('fixture-phone', 'x', ''),
    () => actions.unpublishSavedProduct('fixture-phone', 'x'), () => actions.uploadEditorImage(new FormData()),
    () => actions.productReferenceDraft('xiaomi-xiaomi-17t'),
  ];
  for (const attempt of attempts) await assert.rejects(attempt, /owner login/);
  assert.equal(writes, 0); assert.equal(privateFiles.size, 0);
});
test('Connection verifies write access without saving test documents and stores only encrypted token', async () => {
  await cms.connectSanity(config);
  assert.equal(documents.size, 0); assert.equal(writes, 0);
  assert.equal(JSON.stringify([...privateFiles.values()]).includes(token), false);
  assert.equal(JSON.stringify(await cms.connectionStatus()).includes(token), false);
  await assert.rejects(cms.connectSanity({ ...config, projectId: 'other123' }), /migration/);
});
test('Draft-only credentials cannot replace a working publish-capable connection', async () => {
  const before = clone([...privateFiles]);
  draftOnly = true;
  await assert.rejects(cms.connectSanity(config), /Editor token/);
  draftOnly = false;
  assert.deepEqual([...privateFiles], before);
  assert.equal(documents.size, 0);
  assert.equal(writes, 0);
});
test('CMS outage preserves connection identity so the owner can renew access and retry', async () => {
  authenticated = true; offline = true;
  const result = await actions.productEditorState();
  assert.equal(result.connection.configured, true);
  assert.equal(result.connection.projectId, config.projectId);
  assert.deepEqual(result.records, []);
  assert.match(result.error, /Connection settings/);
  assert.equal(JSON.stringify(result).includes(token), false);
  offline = false;
  assert.equal((await actions.productEditorState()).error, '');
  authenticated = false;
});
test('India reference keeps unconfirmed fields and colour combinations empty, with no CMS writes', async () => {
  authenticated = true;
  const before = writes, value = await actions.productReferenceDraft('xiaomi-xiaomi-17t');
  assert.equal(value.ok, true);
  const reference = value.data;
  core.validatePublication(reference);
  assert.equal(Object.keys(reference.values).length, 86);
  assert.equal(reference.values.spec_007, '');
  assert.equal(reference.values.spec_004, '');
  assert.equal(reference.values.spec_062, '', 'eSIM warning is not a confirmed India capability');
  assert.equal(reference.values.spec_050, '', 'absence of wireless charging info is not a verified No');
  assert.equal(reference.variants.length, 2);
  assert.ok(reference.variants.every(v => v.colour === '' && v.ram === '12 GB'));
  reference.values.spec_026 = 'Edited in an unsaved draft';
  assert.equal((await actions.productReferenceDraft('xiaomi-xiaomi-17t')).data.values.spec_026, '12 GB');
  for (const id of ['xiaomi-xiaomi-17-17t', 'xiaomi-xiaomi-17-ultra']) {
    const draft = (await actions.productReferenceDraft(id)).data;
    core.validatePublication(draft);
    assert.equal(Object.keys(draft.values).length, 86);
    assert.equal(draft.values.spec_007, '', 'no public/store price inferred from manufacturer pricing');
    assert.equal(draft.values.spec_083, '', 'uncertain box charger must remain unknown, not No');
    assert.equal(draft.variants.length, 1);
    assert.equal(draft.variants[0].storage, '512 GB', 'conflicting/unconfirmed storage options are excluded');
    assert.equal(draft.variants[0].colour, '', 'model colours are not proof of every SKU combination');
    draft.variants[0].storage = 'Unsaved edit';
    assert.equal((await actions.productReferenceDraft(id)).data.variants[0].storage, '512 GB');
  }
  assert.equal((await actions.productReferenceDraft('unverified-model')).data, null);
  for (const id of ['xiaomi-redmi-note-17', 'xiaomi-redmi-note-17-pro-max', 'xiaomi-redmi-note-17-pro', 'xiaomi-redmi-17', 'xiaomi-redmi-17c-5g']) {
    const draft = (await actions.productReferenceDraft(id)).data;
    core.validatePublication(draft);
    assert.equal(Object.keys(draft.values).length, 86);
    assert.equal(draft.values.spec_007, '');
    assert.equal(draft.values.spec_062, '', 'unconfirmed eSIM stays empty');
    assert.equal(draft.values.spec_067, '', 'unconfirmed NFC stays empty');
    assert.equal(draft.variants.length, 2);
    assert.ok(draft.variants.every(v => v.colour === '' && v.image === ''));
    draft.values.spec_026 = 'Unsaved edit';
    assert.notEqual((await actions.productReferenceDraft(id)).data.values.spec_026, 'Unsaved edit');
  }
  assert.equal(writes, before);
  authenticated = false;
});
test('Draft save/reload/edit is private; publication is sanitized, revision guarded and URL stable', async () => {
  await cms.saveDraft(product(), '');
  assert.deepEqual(await cms.publicProducts(), []);
  let [saved] = await cms.editorRecords(); assert.equal(saved.values.spec_007, 'PRIVATE-PRICE-456');
  const oldRev = saved.draftRevision;
  await cms.saveDraft({ ...saved, description: 'Edited fixture' }, oldRev);
  await assert.rejects(cms.saveDraft(saved, oldRev), /दूसरे tab/);
  [saved] = await cms.editorRecords();
  assert.equal((await cms.publishProduct(saved.id, saved.draftRevision, '')).backupSaved, true);
  const [publicDoc] = await cms.publicProducts();
  assert.equal(publicDoc.description, 'Edited fixture');
  assert.equal(JSON.stringify(publicDoc).includes('PRIVATE-PRICE'), false);
  assert.equal('spec_007' in documents.get('mw-product.fixture-phone').values, false);
  assert.equal('sources' in documents.get('mw-product.fixture-phone'), false);
  [saved] = await cms.editorRecords();
  await cms.saveDraft({ ...saved, description: 'Private next draft' }, saved.draftRevision);
  assert.equal((await cms.publicProducts())[0].description, 'Edited fixture');
  [saved] = await cms.editorRecords();
  await cms.saveDraft({ ...saved, slug: 'changed-url' }, saved.draftRevision);
  [saved] = await cms.editorRecords();
  await assert.rejects(cms.publishProduct(saved.id, saved.draftRevision, saved.publishedRevision), /slug/);
  await cms.saveDraft({ ...saved, slug: saved.publishedSlug }, saved.draftRevision);
});
test('Reserved slug collision cannot overwrite another product', async () => {
  await cms.saveDraft({ ...product('second-fixture'), slug: 'fixture-phone' }, '');
  const saved = (await cms.editorRecords()).find(p => p.id === 'second-fixture');
  await assert.rejects(cms.publishProduct(saved.id, saved.draftRevision, ''), /दूसरे model/);
  assert.equal((await cms.publicProducts()).length, 1);
});
test('Direct CMS records with incomplete verification or unverified variant images stay off public pages', async () => {
  for (const change of [{ verifiedAt: '' }, { imageAlt: '' }, { verifiedAt: '2099-01-01' },
    { variants: [{ ...product().variants[0], image: '/images/fixture.png', imageVerified: false }] }]) {
    documents.set('mw-product.direct-fixture', { ...product('direct-fixture'), ...change, _type: 'mwProduct', _id: 'mw-product.direct-fixture', _rev: 'external' });
    assert.equal((await cms.publicProducts()).some(p => p.id === 'direct-fixture'), false);
  }
  documents.delete('mw-product.direct-fixture');
});
test('Last good snapshot works offline; failed refresh cannot resurrect unpublished product', async () => {
  offline = true; assert.equal((await cms.publicProducts()).length, 1); offline = false;
  const saved = (await cms.editorRecords()).find(p => p.id === 'fixture-phone');
  await assert.rejects(cms.unpublishProduct(saved.id, 'stale-revision'), /दूसरे tab/);
  failRefresh = true;
  assert.equal((await cms.unpublishProduct(saved.id, saved.publishedRevision)).backupSaved, false);
  offline = true; assert.deepEqual(await cms.publicProducts(), []); offline = false; failRefresh = false;
  assert.ok(documents.has('drafts.mw-product.fixture-phone'));
  assert.equal(documents.has('mw-product.fixture-phone'), false);
});
test('Image upload rejects active content and oversized files before upload', async () => {
  await assert.rejects(cms.uploadProductImage(new File(['<svg onload="alert(1)"></svg>'], 'fake.png', { type: 'image/png' })));
  await assert.rejects(cms.uploadProductImage(new File([new Uint8Array(4 * 1024 * 1024 + 1)], 'large.png')));
  const png = new File([new Uint8Array([137,80,78,71,13,10,26,10,0,0,0,0])], 'fixture.png');
  assert.equal(await cms.uploadProductImage(png), 'https://cdn.sanity.io/images/test1234/testing/abc123-1200x1600.png');
});
test('Owner validation errors survive the production action boundary without exposing credentials', async () => {
  authenticated = true;
  const result = await actions.saveProductDraft({ ...product(), values: { spec_030: 'N/A' } }, '');
  assert.equal(result.ok, false); assert.match(result.error, /खाली/);
  assert.equal(JSON.stringify(result).includes(token), false);
  authenticated = false;
});
test('Reloading a saved shortlist preserves more than eight valid model IDs', () => {
  const catalog = load('data/catalog');
  const ids = catalog.phoneModels.slice(0, 12).map(model => model.id);
  assert.deepEqual(catalog.validModelIds(ids.join(',')), ids);
  assert.deepEqual(catalog.validModelIds([...ids, ids[0], 'not-a-real-model'].join(',')), ids);
});
