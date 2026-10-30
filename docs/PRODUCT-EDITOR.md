# Owner Product Editor — 29 October 2026

Story: existing owner login → /admin/products → authenticated server action → existing Sanity project → published product page and sitemap.

## Owner workflow

1. Sign in with the existing owner account at /admin/analytics, then open Product Editor.
2. Connect the existing Sanity project ID, dataset and project-scoped Editor token in the private form. Read and a dry-run write are verified before an encrypted token is saved. Do not paste tokens into chat or commit them. No project/dataset is created automatically.
3. Create a model or start a draft from an existing catalogue entry. The latter copies only its identity/image, with verification disabled. Brand, series, model, the original 86 independent fields in 11 sections, actual variants and approved images can be edited without AI credits.
4. Leave unknown fields empty. Verified No/false and zero are retained. Internal price (spec_007) is private. Enter official sources and the India verification date; verify model/colour images and specifications.
5. Save draft, reload and check it, then publish the saved revision. A published URL cannot be changed while live. Changes to the private draft do not change the live version until publication. Unpublish removes the public version while retaining the draft.
6. Published pages appear at /catalog/{slug}, are linked from /products and included in the sitemap. Existing catalogue entries remain available throughout migration. RAM, storage and colour controls select only entered combinations; they do not imply stock.

## Boundaries and recovery

All six actions independently require owner authorization. No customer account or owner password reset is introduced. Input validation occurs server-side; validation messages are returned explicitly so production error redaction does not hide corrective instructions. Revisions protect draft edits, publish and unpublish; slug reservation prevents another model taking an existing URL.

Public Sanity documents and website data use an explicit allowlist. Internal price and verification source notes are never published. Only verified, published records are returned; empty rows/sections are hidden. Server tokens are encrypted with the existing application secret and never sent back to client code. Uploads accept PNG/JPEG/WebP signatures, up to 4 MB; image URLs are limited to approved local assets and Sanity image CDN.

A private last-good catalogue snapshot provides outage fallback. Before publication changes, the fallback is invalidated; generation checks reject stale concurrent refreshes. A failed refresh therefore cannot resurrect an unpublished model. The existing checked-in catalogue remains intact even if CMS access fails. A snapshot warning requires a connection check and successful republish; no claim of a successful backup is made on failure.

Configuration can also use server-only SANITY_PROJECT_ID, SANITY_DATASET and SANITY_API_TOKEN. Existing production Blob storage and SPIN_WHEEL_SECRET are required for secure saved connections and fallback. No NEXT_PUBLIC credential is used. Environment configuration takes precedence; private-form connection must target the same project/dataset.

## Verified locally

Typecheck, ESLint and production build pass. Eleven isolated catalogue tests cover field contract, privacy, false/zero, variant constraints, unsafe URLs, unauthorized actions, encrypted connection, draft/edit/publish revision flow, slug ownership, outage/unpublish behavior, image validation, production validation errors and shortlist reload. Direct CMS records with missing verification dates, missing alt text or unverified variant images are excluded. Contact links rely on the existing global tracker so each click is counted once. The existing 23 tests cover rewards, analytics, owner account, campaigns, enquiries, archives and daily cron authorization.

These use isolated provider fixtures. They do not prove a real Sanity or Windsor connection. No fixture product, enquiry, sale or reward is written to production.
