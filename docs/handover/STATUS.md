# Mobile World execution status

Checkpoint: 28 October 2026, Asia/Kolkata. Read the complete owner handover in `OWNER-HANDOVER-2026-10-28.txt`. This status is source-recovery evidence, not a claim that the new release is live.

## Current source and release gate

- Repository: `faridabadmobileworld-ui/mobile-world-website`.
- Remote main freshly verified at `2f5b6a98cf0f6b0cf5c9c5640b71aaaccf8d69f0`.
- Current work: `codex/source-recovery-handover-20261028`, descended from that main. Only instructions, evidence and recovery tooling are being added. No app release/deployment is authorized from this incomplete baseline until complete newer source is recovered and verified.
- Verified remote preservation branch: `codex/source-recovery-baseline-20261028`, same historical application HEAD. Actual git push succeeded; prior connector 403 is not the current native Git-write state. GitHub API remains separately network-blocked.
- Original-source candidates: eight fetched remote refs, workspace files, history/reflogs and unreachable objects inspected. No requested newer analytics/business/campaign/category/Sanity/Product Editor source found. `release-festival-dashboard` is an ancestor, 106 commits behind main.
- Vercel project `prj_dplwsmDwQWMjfoePft2dDLIA3QDI`, team slug `faridabadmobileworld-2892`, historical deployment `dpl_aaGzHrJnxrvidMDZAhrJpGsAJhMd` are owner-provided checkpoints; current production target and domain assignment remain unverified.
- Latest pending Product Editor release and its reported 25-test suite have not been located. The old local app's 11 passing tests are not that release's tests.

## Progress definition

Current release/connections verification has **12 equal acceptance milestones**. This is checkpoint coverage, not a percentage of engineering hours or features already built. No blocked milestone leaves the denominator. Round `completed / 12 * 100` to the nearest integer. Historical 93/100 is not reused.

| # | Acceptance milestone | State/evidence |
|---|---|---|
| 1 | Current Git read/write and verified backup of available source | Complete: actual branch push; Git bundle verification; SHA-256 manifest |
| 2 | Current production provenance, domains and available rollback identified | Blocked: Vercel/live-domain network and authenticated access |
| 3 | Complete newer editable source recovered and comparison reviewed | Blocked: no complete candidate found |
| 4 | Newer source reconciled and synced to GitHub | Pending #3; pushing old baseline does not satisfy this |
| 5 | Pending Product Editor release tested, deployed and live-verified | Pending #2–4 |
| 6 | Existing Sanity draft/save/reload/edit/validate/publish/public flow verified | Unknown existing project/dataset/access; never create a duplicate by default |
| 7 | Correct Google property/location website sync and next scheduled run verified | Windsor/API integration unavailable in this session |
| 8 | Existing daily-report task schedule and execution verified | Task `6adebdc837d88191938f78135f1b6de4` unavailable; do not duplicate |
| 9 | Analytics, enquiries, archive/restore and owner-private flows verified | Newer source/live authorized access required |
| 10 | Campaign/reward persistence, abuse/authorization and old-code preservation verified on current source | Old mocked tests only; current-source checks pending |
| 11 | Final public/private mobile/tablet/desktop production regression and SEO checked | Local old-source audit only; live blocked |
| 12 | Owner handover, permanent instructions, field contract and evidence committed/pushed for continuation | Complete when this branch's commit/push is confirmed in delivery; otherwise pending |

Before persistence push: 1/12 = 8/100. After confirmed handover branch push: 2/12 = 17/100. Do not increase for fixture tests, repeated tool calls or documentation restatements.

Catalogue phase is separate: **0 newly manufacturer-verified models / 59 entries in the available older catalogue**. Complete production catalogue denominator is unknown until recovery. Fifty older entries have generic specs/source-link gaps; 86-field unresolved counts and missing image counts cannot be honestly calculated before Kit/schema/source import. The owner-supplied 86 names/numbers are checked into `phone-core-contract.json` as an acceptance contract, with no invented Kit stable keys.

## Tests and evidence

- Earlier restored-instance audit: local old-source build/typecheck passed; 11 website tests passed; lint had one warning. Browser checks covered five routes at mobile/desktop, basic search/compare, and reproduced shortlist 9→8 after reload. These do not validate the described newer live release.
- Current recovery tooling: run `python -m unittest discover -s tools/source-recovery -p 'test_*.py' -v`. Tests use synthetic fixtures and do not count toward application regression totals.
- Source inventory: `SOURCE-RECOVERY-INVENTORY.md`.
- Retained local backup directory: `/workspace/recovery/mobile-world-website-20261028/`; full Git bundles, historical source tar and `manifest.json` with hashes. This snapshot backup contains available Git source only; it is not a durable customer-data backup or Vercel production rollback.
- Baseline preservation SHA: `2f5b6a98cf0f6b0cf5c9c5640b71aaaccf8d69f0`. To recover files, inspect/clone the bundle into a separate authorized recovery directory; never reset a user's live checkout or deploy the baseline automatically.

## Access and missing inputs

- Cloud policy currently permits package-manager hosts and Google Fonts. Read attempts to apex/www, Vercel API, GitHub API and ChatGPT Library returned proxy CONNECT 403. This is not evidence of remote websites being down or of invalid account credentials.
- Draft saved with existing font hosts preserved and added: `www.mobileworldfaridabad.com`, `mobileworldfaridabad.com`, `api.github.com`, `api.vercel.com`, `vercel.com`, `api.sanity.io`, `chatgpt.com`. User review/save and publication are required by the configuration workflow; saving a draft does not apply runtime access. Recheck after a meaningful runtime change.
- No configured Vercel/Sanity/Windsor secret bindings or outbound identities were present. No Vercel/Sanity CLI auth configuration found. `VERCEL_TOKEN` requirement saved for `api.vercel.com`; supply securely in environment settings or connect an available authenticated integration. Never put its value in chat/source/logs.
- No Vercel, Sanity, Windsor, Library or automation connector tools are callable in this session. Task-list dynamic tool was unavailable; do not fabricate other-chat status.
- Full handover attachment is now local and preserved verbatim here. Library Kit `libfile_2cc3b812796c8191a788d550fff1644d` and original brief `libfile_e72604f92dc48191b664a4b6494f2016` remain missing. Only request these actual files or a complete source archive if the owner has it; do not assume Library IDs are downloadable Sediment IDs.

## Exact next action

After network/access is applied, execute `tools/source-recovery/inspect_vercel.py` with a new report path. Inspect the current production origin/commit and authorized original-source files/backups; compiled artifacts alone do not satisfy recovery. Obtain the missing complete original source (including the pending Product Editor) and Kit. Use `compare_source.py` before merging, verify source-to-deployment mapping and retain rollback. Then follow the owner's order: pending release → working Sanity → Google sync/automation → owner flows/archives → verified catalogue → final regressions. No password reset, secret rotation, customer test spin, paid service, duplicate automation or production deployment has been performed at this checkpoint.
