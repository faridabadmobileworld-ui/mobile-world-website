# Local source-recovery inventory — 28 October 2026

This inventory responds to the handover that production is newer than the available website checkout. It is a read-only recovery inspection of the local filesystem and Git metadata. This inventory agent performed no app/source/configuration changes, checkout/reset, deployment, fetch, push, network request, or deletion. The parent subsequently fetched remote heads and created preservation archives; this report includes a read-only follow-up inspection of those newly available refs and paths.

## Result

The newer production source has **not been recovered locally**. `/workspace` contains two real Git checkouts and one extracted Android source copy. No separate website checkout, linked worktree, pre-existing website source archive, patch, backup or local-only Git object was found in the initial scan. Parent-created preservation bundles and an archive now exist under `/workspace/recovery`; they preserve the inspected older source, rather than supply a newer production candidate. The present website is a usable older source candidate, **not an established source of truth for production**.

## Post-fetch follow-up: all fetched remote branches inspected

The parent fetched remote heads after the initial inventory. This agent inspected each fetched tree and its ancestry without checking it out. No fetched branch contains the requested newer admin/category/Sanity/product-editor source. Historical object-path scans across **all newly fetched refs** also found none of those modules; the only admin/product route files remain `app/admin/spin/*` and `app/products/page.tsx`. A fresh `git fsck --full --no-reflogs --unreachable` remained clean, and the working tree remained unchanged.

| Fetched remote branch | Tip SHA | Relative to existing HEAD | Tip date | Files | Required newer modules |
| --- | --- | --- | --- | --- | --- |
| `main` | `2f5b6a98cf0f6b0cf5c9c5640b71aaaccf8d69f0` | Same | 16 Oct 2026 | 332 | None |
| `release-festival-dashboard` | `afd134c72bb1be0b7aa2e936ff6ee5b81c70d4a8` | Ancestor, 106 commits behind | 9 Oct 2026 | 235 | None |
| `codex/source-recovery-baseline-20261028` | `2f5b6a98cf0f6b0cf5c9c5640b71aaaccf8d69f0` | Same; parent-created preservation branch | 16 Oct 2026 | 332 | None |
| `codex/premium-store-experience` | `3f2d37a7c42a8ab81ff63f16a9ea1a5dbb250379` | Ancestor, 151 commits behind | 28 Sep 2026 | 192 | None |
| `codex/customer-first-storefront` | `742f76a691553fbe2a65811980415467d3e5849f` | Ancestor, 165 commits behind | 28 Sep 2026 | 187 | None |
| `codex-diwali-20261004` | `b8b23ce49d2fcdbc6ca0a91c57af7262906de7f1` | Ancestor, 132 commits behind | 4 Oct 2026 | 206 | None |
| `claude/website-depth-audit-7irl2d` | `470c5a2b8a83522124be1211500a7d04d5794dfb` | Ancestor, 202 commits behind | 7 Sep 2026 | 169 | None |
| `claude/nextjs-shop-setup-75vj56` | `01aab34beab22686936ad3ba53c15d8755b58959` | Diverged: 12 branch-only, 282 existing-HEAD-only commits | 23 Aug 2026 | 76 | None |

`release-festival-dashboard` is therefore an older ancestor despite its promising name; it is not the missing newer production source.

New parent-created preservation files observed (filenames inspected; verification belongs to parent):

- `/workspace/recovery/mobile-world-website-20261028/repository.bundle`
- `/workspace/recovery/mobile-world-website-20261028/all-remote-branches.bundle`
- `/workspace/recovery/mobile-world-website-20261028/source-2f5b6a9.tar.gz`
- `/workspace/recovery/mobile-world-website-20261028/manifest.json`
- `/workspace/recovery/mobile-world-website-20261028/SHA256SUMS`

## Initial traversal coverage and limits

- Traversed all ordinary directories beneath `/workspace` by filesystem metadata, including hidden directories, Git objects, `node_modules`, `.next`, npm cache, Gradle cache and Android SDK. This avoids mistaking a pruned cache for an unchecked project location.
- Enumeration reported **zero traversal errors**. Approximately 40,197 file entries existed at the time of traversal (counts may change as other agents write audit reports).
- Deliberately did not enter `/workspace/.aws`, `/workspace/.codex`, or `/workspace/.agents`. These are managed credential/instruction locations, not assumed recovery sources. No credential or environment-file values were read. Filenames alone were allowed in inventory.
- Did not follow symlinks while traversing. All 23 discovered symlinks were dependency command links under `mobile-world-website/node_modules`, resolving inside that dependency tree. No project-root symlink escaped `/workspace`.
- `/workspace/.git` is an empty, managed, read-only mount; it is not an additional valid project repository.
- Inspected `/tmp` top-level names only. It contains platform-managed mounts/logs, JVM perfdata and Node compilation cache; no task-related source archive or project checkout was visible there. Platform daemon directories/logs were not opened. This does not establish that inaccessible platform internals have no data.
- No remote repository, Vercel deployment, developer machine, uploaded-file service, external backup, Sanity project, or other chat workspace was inspected by this inventory. Parent audit handles remote access separately.

## Candidate inventory

| Location | Candidate | Recovery assessment |
| --- | --- | --- |
| `/workspace/mobile-world-website` | Existing Next.js source checkout | Clean working tree; old website source with `/admin/spin` and flat `/products`; newer requested modules absent. |
| `/workspace/mobile-world-stock-android` | Android repository | Clean working tree containing README and Android source ZIP; not a website recovery source. |
| `/workspace/.cloud-setup/android/mobile-world-stock` | Extracted Android source | All seven original archive files match the ZIP byte-for-byte by SHA-256. Build outputs exist; no newer website modules. |
| `/workspace/mobile-world-website/.next` | Generated production build | Route manifests match the older source: `/admin/spin`, `/products`, dynamic `/posts/[slug]`; no newer admin/category routes. Build artifact, not independent newer source. |
| `/workspace/mobile-world-website/preview` | Static preview assets/scripts | Tracked older preview material; not a separate Git checkout or recovered admin/CMS source. |
| `/workspace/.cloud-setup` | Setup tools, audit scripts/results, screenshots, response captures, Android toolchain | Onboarding/audit material; no independent newer website source. Preserve all files. |
| `/workspace/shared/downloads`, `/workspace/library-files`, `/workspace/scratch` | Additional allowed project/storage locations | No files at inventory time. |
| `/workspace/.cache` | Package cache | Dependency/cache material, not a project checkout. |

## Initial local Git evidence (before parent fetched remote heads)

### Website

- Root: `/workspace/mobile-world-website`
- HEAD: `2f5b6a98cf0f6b0cf5c9c5640b71aaaccf8d69f0`
- HEAD commit timestamp: `2026-10-16T15:18:48+05:30`
- Current local branch: `work`
- Stored local remote-tracking ref `refs/remotes/origin/main` points to the same hash. This is **not evidence of the current remote tip**, because no fetch/network operation was performed here.
- `git rev-parse --is-shallow-repository`: `false`
- Reachable commit count across local refs: `285`
- Local divergence against stored `origin/main`: 0 commits ahead, 0 behind.
- Local refs found: `refs/heads/work`, `refs/remotes/origin/main` only; no tags/stashes/other branches returned by `git show-ref`.
- All enumerated reflog entries point to the same initial HEAD; no alternate prior local tip to recover.
- `git fsck --full --no-reflogs --unreachable` completed successfully with no output: no reported unreachable objects or corruption. No `--lost-found` mutation was used.
- Working tree and untracked status: clean. Ignored root entries comprise `.next`, `node_modules`, `next-env.d.ts`, `tsconfig.tsbuildinfo`.
- Historical object-path enumeration across all local refs found only these admin/product paths:
  - `app/admin/spin/page.tsx`
  - `app/admin/spin/SpinAdmin.tsx`
  - `app/admin/spin/admin.css`
  - `app/products/page.tsx`
- No historical path matching Sanity, product editor, admin analytics/business/campaigns, or `app/products/[category]` appeared. Path-limited history searches likewise returned no commits for those candidate modules.

### Android

- Root: `/workspace/mobile-world-stock-android`
- HEAD: `6a00f0b1d47d630b9d5fc04341376ee7e0078d66`
- Non-shallow; current branch `work`; no additional local refs returned by `git show-ref`.
- All reflog entries point to current HEAD.
- `git fsck --full --no-reflogs --unreachable` completed with no output.
- No tracked/untracked user edits detected.

## Archives and backups at initial scan (before parent preservation archives)

Complete matching archive/backup/patch/bundle filename enumeration found:

1. `/workspace/mobile-world-stock-android/Mobile-World-Stock-Android-Source.zip` — seven Android project files; no website source.
2. `/workspace/.cloud-setup/downloads/cmdline.zip` — Android toolchain distribution.
3. `/workspace/.cloud-setup/downloads/cmdline12.zip` — Android toolchain distribution.
4. `/workspace/.cloud-setup/downloads/gradle-8.9-bin.zip` — Gradle distribution.
5. `/workspace/.cloud-setup/tools/android-sdk/platforms/android-35/data/annotations.zip` — Android platform annotations.

At the initial scan, no website `.zip`, `.tar`, `.tgz`, `.tar.gz`, `.bundle`, `.patch`, `.bak`, `.backup`, or filename containing `backup` was found. This filename scan cannot detect an arbitrarily named opaque backup without an identifying suffix; no separate suspicious project location appeared in full traversal.

## Exact source paths absent from current website

These handover-requested route/module directories do not exist:

- `/workspace/mobile-world-website/app/admin/analytics`
- `/workspace/mobile-world-website/app/admin/business`
- `/workspace/mobile-world-website/app/admin/campaigns`
- `/workspace/mobile-world-website/app/products/[category]`

Additional conventional CMS/editor candidates checked and absent:

- `/workspace/mobile-world-website/sanity`
- `/workspace/mobile-world-website/sanity.config.ts`
- `/workspace/mobile-world-website/sanity.cli.ts`
- `/workspace/mobile-world-website/app/admin/products`
- `/workspace/mobile-world-website/app/studio`

The product editor's true source path is not established; these conventional candidate paths are **not claimed as the exact missing production layout**. Filename searches across `/workspace` and source-text filename searches in website `app`, `components`, `data`, `lib`, `docs`, `scripts`, manifest/config and project documentation found no Sanity/product-editor/new-admin references. Secret files were excluded.

## Safe next recovery step

Obtain the production deployment's exact originating repository and commit or an authorized original-source export/backup. Compare that candidate against the production routes and handover before applying the earlier local audit fixes. Preserve this older checkout, all setup/audit material and Android outputs until recovery is independently verified. No deployment should be based on this inventory's older source merely because it builds locally.
