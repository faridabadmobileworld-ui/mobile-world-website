import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import Module, { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import crypto from 'node:crypto';
import ts from 'typescript';
import { BlobError, BlobPreconditionFailedError } from '@vercel/blob';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const files = new Map(), cache = new Map(), cookies = new Map();
let writes = 0, storageFailure = false, writeFailure = false;
const blob = {
  BlobError, BlobPreconditionFailedError,
  async get(key, options) { assert.equal(options.access, 'private'); assert.equal(options.useCache, false); if (storageFailure) throw new Error('Provider unavailable'); const v = files.get(key); return v ? {statusCode:200, stream:new Response(v.text).body,blob:{etag:v.etag}} : null; },
  async put(key, text, options) { if(writeFailure) throw new Error('provider-internal-diagnostic-must-stay-private'); assert.equal(options.access,'private'); await new Promise(resolve => setTimeout(resolve,2)); const old = files.get(key); if (old && (!options.allowOverwrite || options.ifMatch !== old.etag)) {throw options.allowOverwrite ? new BlobPreconditionFailedError() : new BlobError('This blob already exists.');} files.set(key,{text,etag:String(++writes)});return {}; },
  async list({prefix}) { return {blobs:[...files.keys()].filter(p=>p.startsWith(prefix)).map(pathname=>({pathname,url:'https://test.invalid/'+pathname})),hasMore:false}; },
  async del(urls) {for (const url of urls) files.delete(url.slice('https://test.invalid/'.length));},
};
function load(filename) {
  filename = path.resolve(root, filename.endsWith('.ts') ? filename : filename+'.ts');
  if (cache.has(filename)) return cache.get(filename).exports;
  const mod = new Module(filename), native = createRequire(filename); mod.filename = filename;cache.set(filename,mod);
  mod.require = id => {
    if (id === 'server-only') return {};
    if (id === '@vercel/blob') return blob;
    if (id === 'next/cache') return {unstable_cache:fn=>fn,updateTag(){},revalidatePath(){}};
    if (id === 'next/server') return {after(){}};
    if (id === 'next/headers') return {headers:async()=>new Headers({'x-forwarded-for':'test-only'}),cookies:async()=>({get:name=>cookies.get(name),set:(name,value)=>cookies.set(name,{value}),delete:name=>cookies.delete(name)})};
    if (id.startsWith('@/')) return load(id.slice(2));
    if (id.startsWith('.')) return load(path.resolve(path.dirname(filename),id));
    return native(id);
  };
  mod._compile(ts.transpileModule(fs.readFileSync(filename,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText,filename);
  return mod.exports;
}
process.env.NODE_ENV='production';process.env.SPIN_WHEEL_SECRET='isolated-analytics-test-secret-not-a-production-credential';process.env.BLOB_READ_WRITE_TOKEN='mock-provider';
const setupKey='isolated-test-setup';process.env.SPIN_ADMIN_SETUP_HASH=crypto.createHash('sha256').update(setupKey).digest('hex');
const core=load('lib/analytics/core'),store=load('lib/analytics/store'),route=load('app/api/analytics/collect/route'),admin=load('app/spin-admin-actions'),actions=load('app/admin/analytics/actions');
const today=core.istDay(), now=Date.now();
const input=(extra={})=>({id:crypto.randomUUID(),visitor:crypto.randomUUID(),session:crypto.randomUUID(),path:'/products',started:now-20000,active:10,depth:30,source:'direct',medium:'none',campaign:'none',device:'mobile',sections:{catalogue:10},counts:{'call|Call store':1},events:[],...extra});
const request=(body,headers={})=>new Request('https://www.mobileworldfaridabad.com/api/analytics/collect',{method:'POST',headers:{origin:'https://www.mobileworldfaridabad.com','user-agent':'MW-Integration-Tests','content-type':'application/json',...headers},body:typeof body==='string'?body:JSON.stringify(body)});

test('Reject private routes and malformed IDs; scrub searches and contact details',()=>{
 assert.equal(core.normalizeVisit(input({path:'/admin/analytics'})),null);
 assert.equal(core.normalizeVisit(input({id:'bad'})),null);
 const v=core.normalizeVisit(input({path:'/products?q=private',source:'someone@example.com',counts:{'search|Ravi 9999900000 iphone 18 pro':2},active:99999,depth:999}));
 assert.equal(v.path,'/products');assert.equal(v.source.includes('example.com'),false);assert.deepEqual(v.counts,{'search|iphone 18 pro':2});assert.ok(v.active<=22);assert.equal(v.depth,100);
 assert.throws(()=>core.rangeDays('2026-02-30',today));assert.throws(()=>core.rangeDays(today,'2099-01-01'));
});
test('Concurrent snapshots persist once and identifiers/IP remain hashed',async()=>{
 const raw=input(),visit=core.normalizeVisit(raw);
 await Promise.all([store.saveVisit(visit,'203.0.113.7'),store.saveVisit({...visit,active:18,counts:{'call|Call store':2}},'203.0.113.7'),store.saveVisit(visit,'203.0.113.7')]);
 const report=await store.report(today,today);assert.equal(report.pageViews,1);assert.equal(report.sessions,1);assert.equal(report.active,18);assert.equal(report.totals.call,2);
 const serialized=[...files.values()].map(v=>v.text).join('');for(const secret of [raw.id,raw.visitor,raw.session,'203.0.113.7']) assert.equal(serialized.includes(secret),false);
});
test('Collector enforces origin, privacy signals, body limits and reports persistence failures',async()=>{
 assert.equal((await route.POST(request(input(),{origin:'https://untrusted.example'}))).status,403);
 const before=writes;assert.equal((await route.POST(request(input(),{dnt:'1'}))).status,204);assert.equal(writes,before);
 assert.equal((await route.POST(request('x'.repeat(33000)))).status,413);assert.equal((await route.POST(request('bad-json'))).status,400);
 assert.equal((await route.POST(request(input()))).status,204);
 storageFailure=true;assert.equal((await route.POST(request(input()))).status,503);storageFailure=false;
});
test('Anonymous users cannot read reports or edit campaigns',async()=>{
 await assert.rejects(actions.analyticsReport(today,today),/owner login/);
 await assert.rejects(load('app/admin/campaigns/actions').saveCampaigns({},0),/owner login/);
});
test('Owner login unlocks reports; campaign expiry is enforced without invalidating issued codes',async()=>{
 assert.equal((await admin.setupAdmin(setupKey,'test-password-for-owner-only')).ok,true);
 const report=await actions.analyticsReport(today,today);assert.equal(report.pageViews,2);
 const camp=load('lib/campaigns/core');let config=camp.defaultCampaigns();config.items.spin.enabled=false;
 config=await load('app/admin/campaigns/actions').saveCampaigns(config.items,0);assert.equal(config.revision,1);
 await assert.rejects(load('app/admin/campaigns/actions').saveCampaigns(config.items,0),/दूसरे tab/);
 assert.equal((await load('app/spin-actions').playSpin('9999900000',true)).ok,false);
 const coupon=load('app/spin-core').createSpinCoupon('9999900000',process.env.SPIN_WHEEL_SECRET);
 assert.equal((await load('app/spin-actions').verifySpin(coupon.code,'9999900000')).ok,true);
 assert.equal(camp.campaignIsLive({enabled:true,start:'2026-10-24',end:'2026-10-24',note:''},Date.parse('2026-10-24T23:59:59.999+05:30')),true);
 assert.equal(camp.campaignIsLive({enabled:true,start:'2026-10-24',end:'2026-10-24',note:''},Date.parse('2026-10-25T00:00:00+05:30')),false);
 await admin.adminLogout();await assert.rejects(actions.analyticsReport(today,today));
});
test('Retention cleanup deletes only expired analytics files',async()=>{
 const expired='analytics/v1/2020-01-01/0.json';files.set(expired,{text:'{}',etag:'x'});files.set('spin/preserved.json',{text:'{}',etag:'y'});
 await store.pruneAnalytics();assert.equal(files.has(expired),false);assert.equal(files.has('spin/preserved.json'),true);assert.ok((await store.report(today,today)).pageViews>0);
});

test('Marked release checks do not inflate business metrics',()=>{
 const check=core.normalizeVisit(input({source:'internal-verification'}));
 const report=core.summarize([check],[today]);assert.equal(report.sessions,0);assert.equal(report.pageViews,0);assert.equal(report.active,0);
});

test('Hindi labels and search topics retain vowel marks without retaining private details',()=>{
 const label='आपको क्या चाहिए?';
 assert.equal(core.safeLabel(label),'आपको क्या चाहिए');
 assert.equal(core.searchTopic('रवि मोबाइल फ़ोन लैपटॉप 9999900000'),'मोबाइल फ़ोन लैपटॉप');
 const visit=core.normalizeVisit(input({sections:{'आपको क्या चाहिए':4,'आपक कय चहए':3,'empty-section':0},counts:{'search|रवि मोबाइल 9999900000':1}}));
 assert.deepEqual(visit.counts,{'search|मोबाइल':1});
 const report=core.summarize([visit],[today]);
 assert.deepEqual(report.sections,[{label:'/products · Product categories',active:4,views:1}]);
 const legacy=core.normalizeVisit(input({counts:{'click|ढढए':2,'whatsapp|इस model क बर म पछए':1}}));
 const oldReport=core.summarize([legacy],[today]);
 assert.deepEqual(oldReport.topics,[{type:'click',label:'ढूँढ़िए',count:2},{type:'whatsapp',label:'इस model के बारे में पूछिए',count:1}]);
});

test('Daily archive contains totals but no individual journey identifiers; failed archive preserves raw visits',async()=>{
 const archive=load('lib/analytics/archive');
 await archive.archiveDay(today,[core.normalizeVisit(input())]);
 const stored=JSON.parse(files.get(`analytics/archive/v1/${today}.json`).text);
 assert.equal(stored.pageViews,1);assert.equal('journeys' in stored,false);assert.equal('events' in stored,false);
 const expired='analytics/v1/2020-02-01/0.json';files.set(expired,{text:JSON.stringify(core.emptyDay()),etag:'test'});
 storageFailure=true;await assert.rejects(store.pruneAnalytics());storageFailure=false;assert.equal(files.has(expired),true);
 await store.pruneAnalytics();assert.equal(files.has(expired),false);assert.equal(files.has('analytics/archive/v1/2020-02-01.json'),true);
 const past='2020-03-01';await archive.archiveDay(past,[core.normalizeVisit(input())],true);
 const before=files.get(`analytics/archive/v1/${past}.json`).text;await archive.archiveDay(past,[],true);
 assert.equal(files.get(`analytics/archive/v1/${past}.json`).text,before);
});
test('Business actions require owner; register validates PII, amounts and stale edits',async()=>{
 const business=businessActions(), bc=load('lib/business/core');
 await assert.rejects(business.businessReport(),/owner login/);
 await assert.rejects(business.updateEnquiry(crypto.randomUUID(),{},0),/owner login/);
 await assert.rejects(business.configureWindsor('not-a-real-credential'),/owner login/);
 const entry={day:today,source:'Website',topic:'Samsung phone exchange',stage:'Sold',amount:'199.99'};
 assert.equal(bc.normalizeEnquiry(entry,today).amount,199.99);
 assert.throws(()=>bc.normalizeEnquiry({...entry,topic:'Call 9999900000'},today));
 assert.throws(()=>bc.normalizeEnquiry({...entry,stage:'Quoted'},today));
 assert.throws(()=>bc.normalizeEnquiry({...entry,day:'2026-02-30'},today));
 assert.throws(()=>bc.normalizeEnquiry({...entry,amount:'-1'},today));
 assert.equal((await admin.adminLogin('test-password-for-owner-only')).ok,true);
 const id=crypto.randomUUID();const saved=await business.updateEnquiry(id,entry,0);assert.equal(saved.revision,1);
 await assert.rejects(business.updateEnquiry(id,{...entry,stage:'Lost',amount:null},0),/दूसरे tab/);
 const edited=await business.updateEnquiry(id,{...entry,stage:'Lost',amount:null},1);assert.equal(edited.amount,null);assert.equal(edited.revision,2);
 assert.equal((await business.businessReport()).entries.length,1);
 await admin.adminLogout();
});
test('Google report validation preserves last good report and never mixes source dimensions',async()=>{
 const bs=load('lib/business/store');
 const report={version:1,from:today,to:today,fetchedAt:Date.now(),search:[{date:today,clicks:3,impressions:40,position:8}],pages:[{page:'https://www.mobileworldfaridabad.com/',clicks:3,impressions:40,position:8}],queries:[],business:[{date:today,impressions:50,call_clicks:4,website_clicks:2,direction_requests:5}]};
 await bs.saveGoogle(report);
 await assert.rejects(bs.saveGoogle({...report,search:[]}));
 await assert.rejects(bs.saveGoogle({...report,business:[{...report.business[0],call_clicks:null}]}));
 assert.deepEqual(await bs.googleReport(),report);
});
test('Daily maintenance requires a strong cron credential and never returns private business data',async()=>{
 const daily=load('app/api/business/daily/route');delete process.env.CRON_SECRET;
 assert.equal((await daily.GET(new Request('https://test.invalid/api/business/daily'))).status,401);
 process.env.CRON_SECRET='mock-cron-secret-for-tests-only-123456';
 assert.equal((await daily.GET(new Request('https://test.invalid/api/business/daily',{headers:{authorization:'Bearer wrong'}}))).status,401);
 const response=await daily.GET(new Request('https://test.invalid/api/business/daily',{headers:{authorization:'Bearer '+process.env.CRON_SECRET}}));
 assert.equal(response.status,200);assert.deepEqual(await response.json(),{archived:true,google:{synced:false,reason:'key-required'}});
 delete process.env.CRON_SECRET;
});

test('Enquiry archive and restore preserve content, reject stale edits and keep tests out of revenue',async()=>{
 const business=businessActions(),bc=load('lib/business/core');
 const id=crypto.randomUUID();
 await assert.rejects(business.archiveEnquiry(id,0,true),/owner login/);
 await admin.adminLogin('test-password-for-owner-only');
 const input={day:today,source:'Other',topic:'Release verification TEST',stage:'Enquiry',amount:null,isTest:true};
 let row=await business.updateEnquiry(id,input,0);
 for(const stage of ['Quoted','Visited','Sold']) row=await business.updateEnquiry(id,{...input,stage,amount:stage==='Sold'?'1.00':null},row.revision);
 assert.equal(bc.selectEnquiries([row],today,today).length,0);
 assert.equal(bc.selectEnquiries([row],today,today,'tests').length,1);
 await assert.rejects(business.updateEnquiry(id,{...input,isTest:false},row.revision),/Test status/);
 const original={...row};
 row=await business.archiveEnquiry(id,row.revision,true);
 assert.ok(row.archivedAt);assert.equal(row.amount,original.amount);assert.equal(row.stage,'Sold');
 await assert.rejects(business.updateEnquiry(id,input,row.revision),/Restore/);
 await assert.rejects(business.archiveEnquiry(id,original.revision,false),/दूसरे tab/);
 row=await business.archiveEnquiry(id,row.revision,false);
 assert.equal(row.archivedAt,null);assert.equal(row.topic,original.topic);assert.equal(row.createdAt,original.createdAt);assert.equal(row.isTest,true);
 assert.equal(bc.selectEnquiries([row],today,today).length,0);
 const outcomes=await Promise.allSettled([business.archiveEnquiry(id,row.revision,true),business.updateEnquiry(id,{...input,stage:'Lost'},row.revision)]);
 assert.equal(outcomes.filter(r=>r.status==='fulfilled').length,1);
 assert.equal(outcomes.filter(r=>r.status==='rejected').length,1);
 await assert.rejects(business.archiveEnquiry(id,-1,true),/reference/);
 await assert.rejects(business.archiveEnquiry(id,row.revision,'true'),/action/);
 const legacy={...original,id:crypto.randomUUID()};delete legacy.isTest;
 const real=await business.updateEnquiry(legacy.id,{...input,isTest:false,stage:'Sold',amount:'20.00'},0);
 assert.equal(bc.selectEnquiries([real],today,today).length,1);
 const archived=await business.archiveEnquiry(real.id,real.revision,true);
 assert.equal(bc.selectEnquiries([archived],today,today).length,0);
 assert.equal(bc.selectEnquiries([archived],today,today,'archived').length,1);
 const restored=await business.archiveEnquiry(real.id,archived.revision,false);
 assert.equal(bc.selectEnquiries([restored],today,today)[0].amount,20);
 await admin.adminLogout();
});

function businessActions() {
 const actions=load('app/admin/business/actions'), {businessResult}=load('lib/business/result');
 return {...actions,...Object.fromEntries(['updateEnquiry','archiveEnquiry','downloadArchiveBackup','previewArchiveRestore','restoreDailyArchive'].map(name=>[name,async(...args)=>businessResult(await actions[name](...args))]))};
}
const archiveRow=day=>({version:1,day,savedAt:now,pageViews:3,sessions:2,visitors:1,active:12.5,engagedSessions:1,totals:{call:1,whatsapp:2},pages:[{label:'/products',views:3,active:12.5}]});
const backupText=rows=>JSON.stringify({version:1,kind:'mobile-world-daily-archive',site:'www.mobileworldfaridabad.com',exportedAt:now,rows});
test('Archive recovery requires owner and validates the entire backup before writing',async()=>{
 const business=businessActions();
 const text=backupText([archiveRow('2026-01-20')]);
 await assert.rejects(business.downloadArchiveBackup('2026-01-20','2026-01-20'),/owner login/);
 await assert.rejects(business.previewArchiveRestore(text),/owner login/);
 await assert.rejects(business.restoreDailyArchive(text),/owner login/);
 await admin.adminLogin('test-password-for-owner-only');
 const before=writes;
 for(const bad of ['bad json','x'.repeat(900001),text.replace('www.mobileworldfaridabad.com','other.example'),backupText([archiveRow(today)]),backupText([archiveRow('2026-01-20'),archiveRow('2026-01-20')]),backupText([{...archiveRow('2026-01-20'),visitor:'private-id'}]),backupText([{...archiveRow('2026-01-20'),pageViews:-1}]),backupText([{...archiveRow('2026-01-20'),totals:{password:1}}]),backupText([archiveRow('2026-01-20'),{...archiveRow('2026-01-21'),pages:[{label:'/admin/analytics',views:1,active:1}]}])]) {
  await assert.rejects(business.restoreDailyArchive(bad));
 }
 assert.equal(writes,before);
 assert.deepEqual(await business.previewArchiveRestore(text),{days:1,from:'2026-01-20',to:'2026-01-20',existing:0,missing:1});
 assert.equal(writes,before);
 await admin.adminLogout();
});
test('Archive recovery is private, concurrent-safe and retryable without overwriting existing days',async()=>{
 const business=businessActions();
 await admin.adminLogin('test-password-for-owner-only');
 const row=archiveRow('2026-01-20'),text=backupText([row]);
 const result=await Promise.all([business.restoreDailyArchive(text),business.restoreDailyArchive(text)]);
 assert.equal(result.reduce((n,r)=>n+r.restored,0),1);assert.equal(result.reduce((n,r)=>n+r.skipped,0),1);
 const key='analytics/archive/v1/2026-01-20.json',saved=files.get(key).text;
 assert.equal(JSON.parse(saved).finalized,true);
 const changed=backupText([{...row,pageViews:999}]);
 assert.deepEqual(await business.restoreDailyArchive(changed),{restored:0,skipped:1,failed:0});
 assert.equal(files.get(key).text,saved);
 await load('lib/analytics/archive').archiveDay(row.day,[],true);
 assert.equal(files.get(key).text,saved);
 const exported=await business.downloadArchiveBackup(row.day,row.day);
 assert.equal(JSON.parse(exported).rows.length,1);assert.equal(JSON.parse(exported).rows[0].pageViews,3);
 for(const privateField of ['visitor','sessionId','journeys','encryptedKey']) assert.equal(exported.includes('"'+privateField+'"'),false);
 const next=backupText([archiveRow('2026-01-21')]);
 storageFailure=true;const failed=await load('lib/analytics/backup').restoreArchiveBackup(next);storageFailure=false;assert.deepEqual(failed,{restored:0,skipped:0,failed:1});
 assert.deepEqual(await business.restoreDailyArchive(next),{restored:1,skipped:0,failed:0});
 assert.deepEqual(await business.restoreDailyArchive(next),{restored:0,skipped:1,failed:0});
 await admin.adminLogout();
});

test('Recovery validation reaches the client without leaking provider failures',async()=>{
 const business=load('app/admin/business/actions');
 await admin.adminLogin('test-password-for-owner-only');
 const invalid=await business.previewArchiveRestore('invalid-json');
 assert.equal(invalid.ok,false);assert.match(invalid.error,/Original JSON/);
 const row={day:today,source:'Other',topic:'Release test',stage:'Enquiry',amount:null};
 const result=await business.updateEnquiry(crypto.randomUUID(),{...row,day:'2026-99-99'},0);
 assert.equal(result.ok,false);assert.match(result.error,/तारीख़/);
 const backup=await business.downloadArchiveBackup('2026-99-99',today);
 assert.equal(backup.ok,false);assert.match(backup.error,/अवधि/);
 writeFailure=true;const unavailable=await business.updateEnquiry(crypto.randomUUID(),row,0);writeFailure=false;
 assert.equal(unavailable.ok,false);assert.match(unavailable.error,/retry/);assert.equal(unavailable.error.includes('provider-internal'),false);
 await admin.adminLogout();
});
