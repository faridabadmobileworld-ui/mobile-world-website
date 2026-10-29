# Mobile World project instructions

Read `docs/handover/STATUS.md` first, then the complete owner-authorized instructions in `docs/handover/OWNER-HANDOVER-2026-10-28.txt`. Preserve applicable business facts and implementation guidance in `CLAUDE.md`; the owner's newer handover resolves conflicting older instructions.

## Critical source and release gate

On 29 October 2026 the live dashboard/business/category source was recovered and reconciled on `codex/complete-owner-editor-20261029`. Recovery commit `53611ba38e398aa93b7221c14d7d33c1da60607d` is saved on GitHub; its source matches 59 original release payload paths and 45 visible deployment application hashes. The two omitted release helpers only hydrate unchanged assets from the historical base, which are already tracked here. The original pending Product Editor source was not found: its implementation has now been reconstructed from the recovered 86-field Kit and owner contract. Read STATUS for current release/connection evidence. Do not deploy the historical baseline or mistake fixture tests for a real Sanity connection. Preserve rollback and independently verify each release's source, domains and behavior.

Use existing isolated checkouts; do not create a worktree unless the owner asks. Preserve existing changes and customer data. No force pushes, destructive resets, account recreation, secret rotation, duplicate projects/automations or deletion of live data as a shortcut.

## Working style and authorization

Tarun Gupta authorizes routine reversible fixes, branches, commits, PRs, relevant tests and verified releases to the existing project. Take routine technical decisions without repetitive permission requests. Finish independent work while an external prerequisite is blocked. Account login, MFA/OAuth consent and unavailable access must use their legitimate flows. Never request passwords, API keys or recovery codes in chat.

Use Devanagari Hindi with natural English technical terms in user communication. Report scoped evidence-based progress with a fixed documented denominator; production/connections and catalogue completion are separate. Historical claims and locally verified behavior are different. Never claim continuous background maintenance without a configured, enabled and tested scheduler.

## Product and business invariants

- Keep the existing brand, domains, URLs, approved family story and current approved contact data. Mobile World began in 2016; the family business in 1973. No invented prices, inventory, warranty, reviews or offers. EMI calculator remains removed. Hours are 10AM–10PM; closure is the actual last calendar date, not a weekly closing day.
- Sanity is the selected CMS. Discover the existing project/dataset/Studio before changes; no duplicate replacement. Preserve existing catalogue during migration and outage. Owner editing must work without AI credits.
- Exactly 86 independent core phone fields in 11 ordered sections. Preserve Kit keys once recovered. `docs/handover/phone-core-contract.json` records owner field numbers/labels only; it does not invent Kit keys. Unknown is actually empty; verified false, zero and No are meaningful. Hide empty rows/sections. Internal prices and draft/unverified products must not leak through HTML, payloads, schema, sitemap or APIs.
- Brand → Series → Model → RAM → Storage → Colour. Model specs and actual variant/SKU/availability records are separate. No Cartesian-product imaginary stock. Retain existing approved brands/categories; archive URLs deliberately.
- Xiaomi 17T is the first reference product. Confirm the exact India model via official evidence or keep a draft with blank fields. Record source, region, checked date and revision. Never treat old sample data as verified facts. Use correct licensed model/colour images; promotional artwork is not a packshot.
- Preserve approved home sequence, transparent garland treatment, normal menu/search scrolling and 16:9 loop video with sound toggle, deferred load, offscreen pause and same-position resume. Handle reduced motion/accessibility.
- Preserve issued spin codes and existing owner login. Enforce uniqueness/redemption on the server; no paid SMS activation without specific approval. Do not alter customer entitlements with test traffic.
- Call/WhatsApp clicks are not completed calls, enquiries or sales. Only owner-confirmed sale entries count as revenue. Preserve analytics concurrency, date boundaries and readable Hindi labels. Website Google sync and the existing daily-report automation are separate; no duplicate automation. Historical automation ID: `6adebdc837d88191938f78135f1b6de4`; actual schedule is unverified.

## Verification and persistence

Use the current manifest/lockfile/framework documentation. Before Next.js application changes, consult relevant installed `node_modules/next/dist/docs/` guidance. Run meaningful tests, typecheck, lint and production build for application changes, then mobile/tablet/desktop and private/public regression checks. Deployment success additionally requires correct source, production alias/custom domains and live behavior. Record commit, deployment ID, affected routes, rollback and evidence in STATUS. Never commit secrets, customer exports or credential files.
