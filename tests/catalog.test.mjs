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
test('Publication requires an exact model while allowing a separate series grouping', () => {
  for (const name of ['Galaxy A Series', 'Reno family', 'V range', 'Galaxy S26/S26+']) {
    assert.throws(() => core.validatePublication(core.normalizeProduct({ ...product(), name })), /exact model/);
  }
  core.validatePublication(core.normalizeProduct({ ...product(), name: 'Galaxy A57 5G', series: 'Galaxy A Series' }));
});
test('Samsung A families resolve to six distinct selectable India models', () => {
  const { phoneModels, searchPhoneModels, legacyGuideGroups, validModelIds, modelEnquiry } = load('data/catalog');
  const models = phoneModels.filter(model => model.brandSlug === 'samsung' && /^Galaxy A/.test(model.name));
  assert.deepEqual(models.map(model => model.name), ['Galaxy A57 5G', 'Galaxy A37 5G', 'Galaxy A27 5G', 'Galaxy A17 5G', 'Galaxy A08 LTE', 'Galaxy A07 5G']);
  assert.equal(new Set(models.map(model => model.id)).size, 6);
  assert.deepEqual(searchPhoneModels('Galaxy A').map(model => model.id), models.map(model => model.id));
  assert.ok(!searchPhoneModels('5G').some(model => model.id === 'samsung-galaxy-a08-lte'));
  for (const id of ['samsung-galaxy-a-series-2026', 'samsung-galaxy-a-series-2025']) {
    assert.deepEqual(legacyGuideGroups[id], { brand: 'samsung', query: 'Galaxy A' });
    assert.deepEqual(validModelIds(id), [], 'never silently replace a saved family with an arbitrary model');
  }
  assert.deepEqual(models[0].variants, ['8GB / 256GB', '12GB / 256GB']);
  const message = new URL(modelEnquiry([models[4]], 'Colour preference: Dark Blue। Variant preference: 4GB / 64GB।')).searchParams.get('text');
  assert.match(message, /Samsung Galaxy A08 LTE/);
  assert.match(message, /4GB \/ 64GB/);
  assert.doesNotMatch(message, /5G|Series/);
});
test('Samsung India references keep model-specific facts, unknowns and no-write behavior', async () => {
  authenticated = true;
  const before = writes;
  for (const code of ['a57', 'a37', 'a27', 'a17', 'a08', 'a07']) {
    const id = `samsung-galaxy-${code}-${code === 'a08' ? 'lte' : '5g'}`;
    const result = await actions.productReferenceDraft(id);
    assert.equal(result.ok, true, result.error);
    const draft = result.data;
    core.validatePublication(draft);
    assert.equal(Object.keys(draft.values).length, 86);
    assert.equal(draft.values.spec_007, '');
    assert.equal(draft.values.spec_050, '', 'omitted wireless charging is not a confirmed No');
    assert.ok(draft.variants.every(v => v.colour === '' && v.image === ''));
    if (code === 'a08') {
      assert.equal(draft.values.spec_060, '');
      assert.doesNotMatch(draft.values.spec_059, /5G/);
      assert.equal(draft.variants.length, 1);
    }
    if (code === 'a27') {
      assert.match(draft.values.spec_015, /^IP64/);
      assert.equal(draft.values.spec_022, 'Snapdragon 6 Gen 3');
      assert.equal(draft.values.spec_027, 'LPDDR5X');
      assert.match(draft.extraValues.ram_performance, /limited to LPDDR5/);
    }
    if (['a57', 'a37', 'a27'].includes(code)) assert.doesNotMatch(draft.values.spec_056, /first global launch/);
    draft.values.spec_026 = 'Unsaved edit';
    assert.notEqual((await actions.productReferenceDraft(id)).data.values.spec_026, 'Unsaved edit');
  }
  assert.equal(writes, before);
  authenticated = false;
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
    assert.equal(draft.variants.length, id === 'xiaomi-xiaomi-17-17t' ? 2 : 1);
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
  for (const id of ['apple-iphone-18-pro', 'apple-iphone-18-pro-max']) {
    const result = await actions.productReferenceDraft(id);
    assert.equal(result.ok, true, result.error);
    const draft = result.data;
    core.validatePublication(draft);
    assert.equal(Object.keys(draft.values).length, 86);
    for (const key of ['spec_007', 'spec_024', 'spec_026', 'spec_046', 'spec_056', 'spec_057']) assert.equal(draft.values[key], '');
    assert.equal(draft.values.spec_083, 'No');
    assert.equal(draft.extraValues.power_adapter_note, 'Sold separately');
    assert.equal(draft.variants.length, 4);
    assert.ok(draft.variants.every(v => v.ram === '' && v.colour === '' && v.image === ''));
    draft.variants[0].storage = 'Unsaved change';
    assert.equal((await actions.productReferenceDraft(id)).data.variants[0].storage, '256 GB');
  }
  for (const id of ['google-pixel-10-pro', 'google-pixel-10-pro-xl']) {
    const result = await actions.productReferenceDraft(id);
    assert.equal(result.ok, true, result.error);
    const draft = result.data;
    core.validatePublication(draft);
    assert.equal(Object.keys(draft.values).length, 86);
    assert.equal(draft.values.spec_007, '');
    assert.equal(draft.values.spec_027, '', 'unconfirmed RAM type stays empty');
    assert.equal(draft.values.spec_081, '', 'phone warranty does not establish battery warranty');
    assert.equal(draft.variants.length, 1, 'India source only corroborates 16/256');
    assert.deepEqual([draft.variants[0].ram, draft.variants[0].storage, draft.variants[0].colour], ['16 GB', '256 GB', '']);
    draft.values.spec_026 = 'Unsaved change';
    assert.equal((await actions.productReferenceDraft(id)).data.values.spec_026, '16 GB');
  }
  for (const id of ['nothing-nothing-phone-3', 'nothing-nothing-phone-3a']) {
    const result = await actions.productReferenceDraft(id);
    assert.equal(result.ok, true, result.error);
    const draft = result.data;
    core.validatePublication(draft);
    assert.equal(Object.keys(draft.values).length, 86);
    assert.equal(draft.values.spec_007, '');
    assert.equal(draft.values.spec_083, '', 'an omitted charger is not a verified No');
    assert.equal(draft.variants.length, 2);
    assert.ok(draft.variants.every(v => v.colour === '' && v.image === ''));
    if (id.endsWith('-3')) {
      assert.match(draft.values.spec_046, /^5500 mAh/);
      assert.equal(draft.values.spec_053, '', '5150mAh global charging test does not verify India time');
    } else {
      assert.equal(draft.values.spec_011, '', 'conflicting weight remains empty');
      assert.equal(draft.values.spec_018, '', 'conflicting resolution remains empty');
      assert.ok(draft.variants.every(v => v.ram === '8 GB'));
    }
    draft.values.spec_026 = 'Unsaved change';
    assert.notEqual((await actions.productReferenceDraft(id)).data.values.spec_026, 'Unsaved change');
  }
  assert.equal(writes, before);
  authenticated = false;
});
test('Draft save/reload/edit is private; publication is sanitized, revision guarded and URL stable', async () => {
  await cms.saveDraft({ ...product(), extraValues: { processor_process: '4 nm', front_autofocus: false, box_charger_power: '67 W', private_price: 'PRIVATE-PRICE-999' } }, '');
  assert.deepEqual(await cms.publicProducts(), []);
  let [saved] = await cms.editorRecords(); assert.equal(saved.values.spec_007, 'PRIVATE-PRICE-456');
  assert.equal(saved.extraValues.box_charger_power, '67 W');
  assert.equal(saved.extraValues.front_autofocus, 'No');
  assert.equal('private_price' in saved.extraValues, false);
  const oldRev = saved.draftRevision;
  await cms.saveDraft({ ...saved, description: 'Edited fixture' }, oldRev);
  await assert.rejects(cms.saveDraft(saved, oldRev), /दूसरे tab/);
  [saved] = await cms.editorRecords();
  assert.equal((await cms.publishProduct(saved.id, saved.draftRevision, '')).backupSaved, true);
  const [publicDoc] = await cms.publicProducts();
  assert.equal(publicDoc.description, 'Edited fixture');
  assert.deepEqual(publicDoc.extraValues, { processor_process: '4 nm', front_autofocus: 'No', box_charger_power: '67 W' });
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

test('Only explicitly released reference guides become public, with no CMS draft or private price leakage', async () => {
  const before = writes;
  const { publicPhoneGuides, phoneGuideLinks } = load('lib/catalog/guides');
  const manifest = load('data/published-phone-guides.json');
  const guides = publicPhoneGuides();
  const { phoneModels } = load('data/catalog');
  assert.equal(guides.length, manifest.modelIds.length);
  assert.equal(new Set(guides.map(p => p.slug)).size, guides.length);
  assert.equal(new Set(guides.map(p => p.id)).size, guides.length);
  assert.ok(guides.length >= 20);
  for (const guide of guides) {
    assert.ok(phoneModels.some(model => model.id === guide.id), 'Every released guide must retain an existing selectable model ID: ' + guide.id);
    assert.equal('sources' in guide, false);
    assert.equal('spec_007' in guide.values, false);
    assert.ok(guide.verified && guide.imageVerified);
    assert.ok(core.visibleSections(guide).flatMap(s => s.fields).every(f => f.value !== '' && f.id !== 7));
    assert.equal(phoneGuideLinks()[guide.id], '/phones/' + guide.slug);
    assert.ok(fs.existsSync(path.join(root, 'public', guide.image)));
  }
  assert.equal(guides.some(p => p.id === 'fixture-phone'), false);
  guides[0].values.spec_026 = 'Unsaved browser edit';
  assert.notEqual(publicPhoneGuides()[0].values.spec_026, 'Unsaved browser edit');
  assert.equal(writes, before);
  assert.deepEqual(await cms.publicProducts(), [], 'editorial guide release never publishes or resurrects CMS records');
});

test('Dependent variant selection cannot create an unlisted RAM, storage or colour combination', () => {
  const variants = [
    { _key: 'one', ram: '8 GB', storage: '128 GB', colour: 'Black', image: '', imageVerified: false },
    { _key: 'two', ram: '8 GB', storage: '256 GB', colour: 'Blue', image: '', imageVerified: false },
    { _key: 'three', ram: '12 GB', storage: '256 GB', colour: 'Black', image: '', imageVerified: false },
  ];
  assert.equal(core.selectProductVariant(variants, variants[0], 'colour', 'Blue'), undefined);
  assert.equal(core.selectProductVariant(variants, variants[0], 'storage', '256 GB'), variants[1]);
  assert.equal(core.selectProductVariant(variants, variants[1], 'ram', '12 GB'), variants[2]);
  assert.equal(core.selectProductVariant(variants, variants[2], 'storage', '128 GB'), undefined);
  assert.equal(core.productDisplayName({ brand: 'Xiaomi', name: 'Xiaomi 17T' }), 'Xiaomi 17T');
  assert.equal(core.productDisplayName({ brand: 'Samsung', name: 'Galaxy A57 5G' }), 'Samsung Galaxy A57 5G');
  assert.equal(core.productDisplayName({ brand: 'Xiaomi Redmi', name: 'REDMI 17 5G' }), 'REDMI 17 5G');
});

test('Independent specifications preserve meaningful No and zero while excluding unknown keys and private prices', () => {
  const draft = core.normalizeProduct({ ...product(), extraValues: { front_autofocus: false, charging_pps: 0, ram_speed: '', spec_007: 'PRIVATE-PRICE-456', private_price: 'PRIVATE-PRICE-999' } });
  const publicDoc = core.publicProduct(draft, '2026-11-24');
  assert.deepEqual(publicDoc.extraValues, { front_autofocus: 'No', charging_pps: '0' });
  const rows = core.visibleSections(publicDoc).flatMap(section => section.fields);
  assert.equal(rows.find(row => row.key === 'front_autofocus').value, 'No');
  assert.equal(rows.find(row => row.key === 'charging_pps').value, '0');
  assert.equal(rows.some(row => row.key === 'ram_speed'), false);
  assert.equal(JSON.stringify(publicDoc).includes('PRIVATE-PRICE'), false);
  assert.throws(() => core.normalizeProduct({ ...product(), extraValues: { processor_process: 'Unknown' } }), /खाली/);
});

test('Xiaomi full guides separate battery, charging, in-box charger, cameras and variant-specific UFS', () => {
  const guides = load('lib/catalog/guides').publicPhoneGuides();
  const pro = guides.find(p => p.slug === 'redmi-note-17-pro-5g');
  const rows = variant => new Map(core.visibleSections(pro, variant).flatMap(s => s.fields).map(f => [f.key, f.value]));
  const small = pro.variants.find(v => v.storage === '128 GB'), large = pro.variants.find(v => v.storage === '256 GB');
  assert.match(rows(small).get('spec_046'), /^9000 mAh/);
  assert.equal(rows(small).get('spec_049'), '67 W');
  assert.equal(rows(small).get('spec_083'), 'Yes');
  assert.equal(rows(small).get('box_charger_power'), '67 W');
  assert.equal(rows(small).get('spec_030'), '2.2');
  assert.equal(rows(large).get('spec_030'), '3.1');
  const mi = guides.find(p => p.slug === 'xiaomi-17');
  const miRows = new Map(core.visibleSections(mi).flatMap(s => s.fields).map(f => [f.key, f.value]));
  assert.equal(miRows.get('spec_034'), '50 MP');
  assert.equal(miRows.get('telephoto_type'), 'Floating telephoto');
  assert.equal(miRows.get('telephoto_aperture'), 'f/2.0');
  assert.equal(miRows.get('processor_process'), '3 nm');
});

test('Model colour preferences and official price references never invent sellable SKU combinations', () => {
  const { productColours, selectedPreference } = load('lib/catalog/preferences');
  const guides = load('lib/catalog/guides').publicPhoneGuides();
  const prices = load('data/phone-reference-prices.json');
  assert.ok(Object.keys(prices).length >= 13);
  for (const [slug, references] of Object.entries(prices)) {
    const guide = guides.find(p => p.slug === slug);
    const before = JSON.stringify(guide.variants);
    for (const price of references) {
      assert.ok(price.amount > 0 && Number.isInteger(price.amount));
      const brandDomains = { Apple: ['www.apple.com'], Google: ['store.google.com'], vivo: ['shop.vivo.com'], OPPO: ['www.oppo.com'], Samsung: ['www.samsung.com'] };
      assert.ok((brandDomains[guide.brand] ?? ['www.mi.com', 'store.mi.com']).includes(new URL(price.source).hostname));
      assert.ok(guide.variants.some(v => v.ram === price.ram && v.storage === price.storage));
      if (price.colour) assert.ok(productColours(guide).includes(price.colour));
      assert.equal(guide.values.spec_007, undefined);
      if (price.colour) assert.match(selectedPreference(guide.variants[0], price.colour), /Colour preference:/);
    }
    assert.equal(JSON.stringify(guide.variants), before);
    assert.ok(guide.variants.every(v => v.colour === ''), 'preferences do not fabricate confirmed colour SKUs');
  }
});

// Family navigation and the existing Home card must survive exact-model replacement.
test('OPPO Reno group resolves to exact India models and F35 retains the Home model ID', () => {
  const { phoneModels, searchPhoneModels, legacyGuideGroups, validModelIds } = load('data/catalog');
  const { phoneGuideLinks } = load('lib/catalog/guides');
  assert.deepEqual(searchPhoneModels('OPPO Reno').map(model => model.name), ['OPPO Reno16 5G', 'OPPO Reno16c 5G']);
  assert.deepEqual(legacyGuideGroups['oppo-oppo-reno-series-2026'], { brand: 'oppo', query: 'OPPO Reno' });
  assert.deepEqual(validModelIds('oppo-oppo-reno-series-2026,oppo-f35-pro-5g'), ['oppo-f35-pro-5g']);
  assert.equal(phoneModels.filter(model => model.id === 'oppo-f35-pro-5g').length, 1);
  assert.equal(phoneGuideLinks()['oppo-f35-pro-5g'], '/phones/oppo-f35-pro-5g');
  assert.equal(phoneModels.some(model => model.id === 'oppo-oppo-f35-pro-5g'), false);
});

test('Every selectable catalogue entry has a full-page destination, with distinct series and verified model routes', () => {
  const { phoneModels, catalogueGuidePath, catalogueGuideReference } = load('data/catalog');
  const links = load('lib/catalog/guides').phoneGuideLinks();
  const destinations = phoneModels.map(model => links[model.id] ?? catalogueGuidePath(model.id));
  assert.equal(new Set(destinations).size, phoneModels.length);
  assert.ok(destinations.every(href => /^\/(phones|products\/guide)\/[a-z0-9-]+$/.test(href)));
  const series = phoneModels.find(p => p.id === 'vivo-vivo-v-series-2026');
  assert.equal(catalogueGuideReference(series).isSeries, true);
  assert.equal(links[series.id], undefined);
  assert.equal(links['vivo-vivo-v80-5g'], '/phones/vivo-v80-5g');
});

test('vivo V80 keeps rated capacity, input power, camera details and the dated India price independent', () => {
  const guide = load('lib/catalog/guides').publicPhoneGuides().find(p => p.slug === 'vivo-v80-5g');
  const rows = new Map(core.visibleSections(guide, guide.variants[0]).flatMap(s => s.fields).map(f => [f.key, f.value]));
  for (const [key, value] of Object.entries({ spec_046: '7200 mAh typical', battery_rated: '7015 mAh', spec_049: 'Up to 90 W', spec_083: 'Yes', spec_034: '50 MP', telephoto_sensor: 'Sony IMX882', telephoto_aperture: 'f/2.65', spec_035: '50 MP', front_autofocus: 'Yes' })) {
    assert.equal(rows.get(key), value);
  }
  assert.equal(rows.has('box_charger_power'), false);
  assert.equal(rows.has('spec_062'), false);
  assert.equal(rows.has('spec_007'), false);
  const [price] = load('data/phone-reference-prices.json')[guide.slug];
  assert.deepEqual([price.amount, price.ram, price.storage, price.colour, price.checkedAt], [62999, '8 GB', '128 GB', 'Sunrise Anthem', '2026-11-25']);
});

test('Published Apple, Pixel, OPPO, Samsung and Nothing guides show independent rows without assuming charging input or accessory ratings', () => {
  const guides = load('lib/catalog/guides').publicPhoneGuides();
  function rows(slug) {
    const guide = guides.find(p => p.slug === slug);
    return Object.fromEntries(core.visibleSections(guide, guide.variants[0]).flatMap(s => s.fields).map(f => [f.key, f.value]));
  }
  const p = rows('pixel-10-pro');
  assert.equal(p.spec_046, '4870 mAh (typical)');
  assert.equal(p.battery_minimum, '4707 mAh');
  assert.equal(p.spec_049, 'Supported');
  assert.equal(p.adapter_recommendation, '30 W or higher');
  assert.equal(p.spec_083, 'No');
  const o = rows('oppo-reno16-5g');
  assert.equal(o.spec_034, '50 MP');
  assert.equal(o.telephoto_aperture, 'f/2.8');
  assert.equal(o.spec_040, 'Up to 3.5×');
  assert.equal(o.spec_049, 'Up to 80 W');
  assert.equal(o.charging_pps, '55 W');
  const apple = rows('iphone-18-pro');
  assert.equal(apple.spec_032, '48 MP');
  assert.equal(apple.rear_4k_main_fps, '100 / 120 fps');
  assert.equal(apple.spec_046, undefined);
  assert.equal(rows('samsung-galaxy-a27-5g').spec_027, 'LPDDR5X');
  assert.equal(rows('nothing-phone-3a').spec_083, undefined);
});

test('Shopping catalogue keeps orderable models separate from family guides and category requests', async () => {
  const c = load('lib/commerce/core');
  const catalogue = await load('lib/commerce/catalogue').shoppingCatalogue();
  const { items } = load('data/content');
  assert.equal(new Set(items.map(item => item.id)).size, items.length);
  assert.equal(catalogue.filter(v => v.kind === 'category').length, items.length);
  const xiaomi = catalogue.find(v => v.id === 'xiaomi-xiaomi-17t');
  assert.equal(xiaomi.kind, 'model');
  assert.equal(xiaomi.href, '/phones/xiaomi-17t');
  assert.equal(catalogue.find(v => v.id === 'vivo-vivo-v-series-2026').kind, 'guide');
  for (const item of catalogue) {
    assert.ok(c.validId(item.id));
    assert.doesNotMatch(JSON.stringify(item), /spec_007|sealedContact|privatePrice/);
  }
  const variant = xiaomi.variants.find(v => v.ram === '12 GB' && v.storage === '256 GB');
  const choice = { productId:xiaomi.id,variant:variant.key,colour:'Violet' };
  assert.equal(c.validChoice(xiaomi,choice),true);
  assert.equal(c.exactPrice(xiaomi,choice).amount,69999);
  assert.equal(c.exactPrice(xiaomi,{...choice,colour:'unlisted'}),undefined);
  assert.equal(c.validChoice(xiaomi,{...choice,variant:'unlisted'}),false);
});

test('Guest basket migrates shortlist and keeps distinct variants, quantities and saved items across reloads', () => {
  const c = load('lib/commerce/core');
  const first = { productId:'mi-model',variant:'12-256',colour:'Blue',quantity:2 };
  const second = {...first,colour:'White',quantity:1};
  let basket = c.basketFrom(null,'mi-model,other-model,mi-model');
  assert.deepEqual(basket.favourites,['mi-model','other-model']);
  basket = c.addLine(c.addLine(basket,'cart',first),'cart',second);
  basket = c.addLine(basket,'cart',{...first,quantity:1});
  assert.deepEqual(basket.cart.map(x => x.quantity),[3,1]);
  const saved = c.moveLine(basket,'cart',first);
  assert.deepEqual(saved.saved,[{...first,quantity:3}]);
  assert.deepEqual(saved.cart,[second]);
  assert.deepEqual(c.basketFrom(JSON.stringify(saved)),saved);
  const full = c.addLine(saved,'cart',{...first,quantity:98});
  assert.throws(() => c.moveLine(full,'saved',first));
  assert.equal(full.saved[0].quantity,3);
  let again = c.moveLine(saved,'saved',first);
  again = c.changeQuantity(again,'cart',first,4);
  const receipt={id:'MW-202611-AAAAAAAAAAAAAAAA',token:'a'.repeat(64)};
  const sent=c.finishRequest(again,[{...first,quantity:3}],receipt);
  assert.equal(sent.cart.find(l => l.colour === 'Blue').quantity,1);
  assert.equal(sent.favourites.length,2);
  assert.deepEqual(c.finishRequest(sent,[{...first,quantity:3}],receipt),sent);
  assert.deepEqual(c.basketFrom('["legacy"]'),c.emptyBasket());
});

test('Cart selection survives reload, preserves unselected quantities and restores saved lines', () => {
  const c = load('lib/commerce/core');
  const blue = { productId:'mi-model', variant:'12-256', colour:'Blue', quantity:2 };
  const white = { ...blue, colour:'White', quantity:3 };
  const old = c.basketFrom(JSON.stringify({ cart:[blue,white] }));
  assert.deepEqual(c.selectedLines(old), [blue,white]);
  const partial = c.selectCartLines(old,false,white);
  assert.deepEqual(c.selectedLines(c.basketFrom(JSON.stringify(partial))), [blue]);
  assert.deepEqual(c.selectedLines(c.selectCartLines(partial,false)), []);
  assert.deepEqual(c.selectedLines(c.selectCartLines(partial,true)), [blue,white]);
  const receipt = { id:'MW-202611-AAAAAAAAAAAAAAAA',token:'a'.repeat(64) };
  const checkedOut = c.finishRequest(partial,c.selectedLines(partial),receipt);
  assert.deepEqual(checkedOut.cart,[white]);
  assert.deepEqual(c.selectedLines(checkedOut),[]);
  const saved = c.moveLine(checkedOut,'cart',white);
  assert.deepEqual(saved.excluded,[]);
  assert.deepEqual(c.selectedLines(c.moveLine(saved,'saved',white)),[white]);
  assert.deepEqual(c.finishRequest(partial,[],receipt).cart,old.cart);
  assert.deepEqual(c.basketFrom(JSON.stringify({cart:[blue],excluded:['stale']})).excluded,[]);
});

test('Direct checkout resolves one public variant independently of a browser cart', async () => {
  const c = load('lib/commerce/core');
  const catalogue = await load('lib/commerce/catalogue').shoppingCatalogue();
  const model = catalogue.find(item => item.id === 'xiaomi-xiaomi-17t');
  const line = { productId:model.id, variant:model.variants[0].key, colour:'Violet', quantity:1 };
  const params = Object.fromEntries(new URL(c.directCheckoutHref(line),'https://example.test').searchParams);
  assert.deepEqual(c.checkoutItem(params,catalogue),line);
  assert.equal(c.checkoutItem({},catalogue),null);
  for (const bad of [{...params,colour:'invented'}, {...params,variant:'unknown'}, {...params,item:['one','two']}, {item:catalogue.find(i => i.kind === 'guide').id}]) {
    assert.equal(c.checkoutItem(bad,catalogue),'invalid');
  }
});

test('Order retries, owner quotes, customer consent and fulfilment operate on private real selections', async () => {
  const { randomUUID }=await import('node:crypto');
  const c=load('lib/commerce/core'), o=load('lib/commerce/orders');
  const catalogue=await load('lib/commerce/catalogue').shoppingCatalogue();
  const m=catalogue.find(v => v.id==='xiaomi-xiaomi-17t');
  const v=m.variants[0], line={productId:m.id,variant:v.key,colour:v.colour,quantity:2};
  const category=catalogue.find(v=>v.kind==='category');
  const lines=[line,{productId:category.id,variant:'',colour:'',quantity:1}];
  const contact={name:'Fixture shopper',phone:'9000000011',fulfilment:'delivery',pin:'121001',address:'Fixture delivery address'};
  const month=o.orderMonth(new Date()), nonce=month+'-'+randomUUID();
  assert.equal(c.cleanContact({...contact,pin:'123'}),null);
  assert.equal(c.cleanContact({...contact,fulfilment:'pickup'}).address,'');
  const [submitted,retried]=await Promise.all([o.placeRequest(nonce,lines,contact,'fixture-network'),o.placeRequest(nonce,lines,contact,'fixture-network')]);
  assert.deepEqual(submitted,retried);
  const {receipt}=submitted;
  assert.equal(submitted.order.status,'received');
  assert.equal(submitted.order.quote,null);
  await assert.rejects(o.placeRequest(nonce,[line],contact,'fixture-network'));
  const record=privateFiles.get('commerce/requests/'+month+'.json');
  assert.equal(Object.keys(record.orders).length,1);
  for (const value of [contact.name, contact.phone, contact.address, receipt.token]) assert.ok(!JSON.stringify(record).includes(value));
  assert.deepEqual(await o.customerOrders([{...receipt,token:'0'.repeat(64)}]),[]);
  assert.equal((await o.customerOrders([receipt]))[0].id,receipt.id);
  assert.doesNotMatch(JSON.stringify(await o.customerOrders([receipt])),/sealedContact|phoneKey|Fixture delivery address|fixture-network/);
  assert.equal((await o.ownerOrders(month))[0].contact.address,contact.address);
  const action=load('app/admin/orders/actions');
  authenticated=false;
  await assert.rejects(action.manageOrder(receipt.id,'received','',new FormData()),/owner login/);
  await assert.rejects(o.setQuote(receipt.id,'received','',[1000,500],99,['','']));
  const quoted=await o.setQuote(receipt.id,'received','',[1000,500],99,['','Fixture exact model']);
  assert.equal(quoted.quote.total,2599);
  assert.equal(quoted.status,'quoted');
  await assert.rejects(o.ownerDecision(receipt.id,'quoted','completed'));
  const revised=await o.setQuote(receipt.id,'quoted',quoted.quote.version,[900,500],70,['','Fixture exact model']);
  await assert.rejects(o.customerDecision(receipt,'accept',quoted.quote.version));
  assert.equal((await o.customerDecision(receipt,'accept',revised.quote.version)).status,'accepted');
  await assert.rejects(o.customerDecision(receipt,'cancel',''));
  assert.equal((await o.ownerDecision(receipt.id,'accepted','ready')).status,'ready');
  assert.equal((await o.ownerDecision(receipt.id,'ready','completed')).status,'completed');
  assert.equal((await o.customerOrders([receipt]))[0].status,'completed');
  const fresh=()=>month+'-'+randomUUID();
  await assert.rejects(o.placeRequest(fresh(),[{...line,quantity:-1}],contact,'fixture-network'));
  await assert.rejects(o.placeRequest(fresh(),[{...line,productId:'vivo-vivo-v-series-2026',variant:'',colour:''}],contact,'fixture-network'));
  await assert.rejects(o.placeRequest(fresh(),[{...line,colour:'unpublished'}],contact,'fixture-network'));
  const cancellable=await o.placeRequest(fresh(),[line],{...contact,fulfilment:'pickup'},'fixture-network');
  await assert.rejects(o.setQuote(cancellable.receipt.id,'received','',[900],50,['']));
  assert.equal((await o.customerDecision(cancellable.receipt,'cancel','')).status,'cancelled');
});
